"""Custom ACAF (Adaptive Class-Aware Feature Fusion) layer implementations.

These layers reconstruct the exact architecture used to train EyeFusion-AI:
1. AdaptiveGatedFusion: Gated combination of EfficientNetB1 and InceptionV3 feature projections.
2. ClassPrototypeContext: Class-aware prototype matrix multiplied by preliminary class probabilities.
3. ResidualClassAwareRefinement: Residual combination of fused features with prototype context.

Registered under the 'EyeFusionACAF' package for Keras 3 serialization compatibility.
"""

import os
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")
import tensorflow as tf
import keras
from keras import layers

# Handle deserialization compatibility: older Keras 3 versions reject 'quantization_config=None' in Dense
_orig_dense_from_config = keras.layers.Dense.from_config

@classmethod
def _patched_dense_from_config(cls, config):
    cfg = dict(config)
    cfg.pop("quantization_config", None)
    return _orig_dense_from_config(cfg)

keras.layers.Dense.from_config = _patched_dense_from_config


@keras.saving.register_keras_serializable(package="EyeFusionACAF", name="AdaptiveGatedFusion")
class AdaptiveGatedFusion(layers.Layer):
    """Combines EfficientNetB1 and InceptionV3 projections via an adaptive gating vector."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def build(self, input_shape):
        super().build(input_shape)

    def call(self, inputs):
        """inputs: [e_projected, i_projected, gate]"""
        e_projected, i_projected, gate = inputs
        return gate * e_projected + (1.0 - gate) * i_projected

    def compute_output_shape(self, input_shape):
        return input_shape[0]

    def get_config(self):
        return super().get_config()


@keras.saving.register_keras_serializable(package="EyeFusionACAF", name="ClassPrototypeContext")
class ClassPrototypeContext(layers.Layer):
    """Maintains learnable class prototypes and projects preliminary probabilities to context."""

    def __init__(self, num_classes=4, feature_dim=1280, **kwargs):
        super().__init__(**kwargs)
        self.num_classes = int(num_classes)
        self.feature_dim = int(feature_dim)

    def build(self, input_shape):
        self.prototypes = self.add_weight(
            name="prototypes",
            shape=(self.num_classes, self.feature_dim),
            initializer="glorot_uniform",
            trainable=True,
            dtype=self.dtype,
        )
        super().build(input_shape)

    def call(self, preliminary_probs):
        return tf.matmul(preliminary_probs, self.prototypes)

    def compute_output_shape(self, input_shape):
        return (input_shape[0], self.feature_dim)

    def get_config(self):
        config = super().get_config()
        config.update({
            "num_classes": self.num_classes,
            "feature_dim": self.feature_dim,
        })
        return config


@keras.saving.register_keras_serializable(package="EyeFusionACAF", name="ResidualClassAwareRefinement")
class ResidualClassAwareRefinement(layers.Layer):
    """Applies residual class-aware context refinement using a learnable scalar alpha."""

    def __init__(self, alpha_init=0.1, **kwargs):
        super().__init__(**kwargs)
        self.alpha_init = float(alpha_init)

    def build(self, input_shape):
        self.alpha = self.add_weight(
            name="alpha",
            shape=(),
            initializer=keras.initializers.Constant(self.alpha_init),
            trainable=True,
            dtype=self.dtype,
        )
        super().build(input_shape)

    def call(self, inputs):
        f_adaptive, p_context = inputs
        return f_adaptive + self.alpha * p_context

    def compute_output_shape(self, input_shape):
        return input_shape[0]

    def get_config(self):
        config = super().get_config()
        config.update({
            "alpha_init": self.alpha_init,
        })
        return config


CUSTOM_OBJECTS = {
    "AdaptiveGatedFusion": AdaptiveGatedFusion,
    "ClassPrototypeContext": ClassPrototypeContext,
    "ResidualClassAwareRefinement": ResidualClassAwareRefinement,
    "EyeFusionACAF>AdaptiveGatedFusion": AdaptiveGatedFusion,
    "EyeFusionACAF>ClassPrototypeContext": ClassPrototypeContext,
    "EyeFusionACAF>ResidualClassAwareRefinement": ResidualClassAwareRefinement,
}
