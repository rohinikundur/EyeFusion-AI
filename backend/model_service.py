"""Model service for loading and running inference on EyeFusion-AI."""

import io
import logging
from typing import Optional, Tuple, Dict, Any
import numpy as np
from PIL import Image, UnidentifiedImageError
import keras

from config import (
    MODEL_PATH,
    IMAGE_SIZE,
    CLASSES,
    CLASS_DISPLAY_NAMES,
    MODEL_METRICS,
    MEDICAL_DISCLAIMER,
)
from custom_layers import CUSTOM_OBJECTS

logger = logging.getLogger("eyefusion.model_service")

class ModelService:
    """Singleton service to load and execute the EyeFusion-AI neural network."""

    _instance: Optional["ModelService"] = None
    _model: Optional[Any] = None

    def __new__(cls) -> "ModelService":
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls)
        return cls._instance

    @property
    def is_loaded(self) -> bool:
        return self._model is not None

    @property
    def model(self) -> Any:
        return self._model

    def load(self) -> None:
        """Loads the trained model once into memory."""
        if self._model is not None:
            logger.info("EyeFusion model is already loaded in memory.")
            return

        if not MODEL_PATH.exists():
            try:
                from download_model import ensure_model_available
                ensure_model_available()
            except Exception as e:
                logger.error(f"Model file missing and could not be downloaded: {e}")
                raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}") from e

        logger.info(f"Loading EyeFusion model from {MODEL_PATH}...")
        try:
            with keras.saving.custom_object_scope(CUSTOM_OBJECTS):
                self._model = keras.models.load_model(str(MODEL_PATH), compile=False)
            logger.info("EyeFusion model loaded successfully into memory.")
        except Exception as e:
            logger.error(f"Failed to load EyeFusion model: {e}", exc_info=True)
            raise RuntimeError(f"Error initializing model: {e}") from e

    def get_info(self) -> Dict[str, Any]:
        """Returns architecture and metric metadata."""
        if not self.is_loaded:
            raise RuntimeError("Model is not loaded.")

        return {
            "model_name": self._model.name,
            "architecture": "EfficientNetB1 + InceptionV3 + ACAF",
            "input_shape": list(self._model.input_shape),
            "output_shape": list(self._model.output_shape),
            "num_classes": len(CLASSES),
            "class_order": CLASSES,
            "class_mapping": {idx: cls for idx, cls in enumerate(CLASSES)},
            "evaluation_metrics": MODEL_METRICS,
            "disclaimer": MEDICAL_DISCLAIMER,
        }

    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """Validates and prepares image tensor for model input.
        
        Requirements:
        - Image converted to RGB
        - Resized to 224 x 224
        - Stored as float32 in raw [0, 255] range
        - Shape (1, 224, 224, 3)
        - No extra normalization applied
        """
        try:
            pil_image = Image.open(io.BytesIO(image_bytes))
            pil_image.verify()
            # Reopen after verify() since verify() can mutate internal state
            pil_image = Image.open(io.BytesIO(image_bytes))
        except (UnidentifiedImageError, OSError, ValueError) as e:
            raise ValueError(f"Corrupted or invalid image file: {e}") from e

        # Ensure RGB mode
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")

        # Resize to 224x224 using bilinear/bicubic resampling
        resized_img = pil_image.resize(IMAGE_SIZE, Image.Resampling.BILINEAR)

        # Convert to numpy float32 preserving raw [0.0, 255.0] values
        img_array = np.array(resized_img, dtype=np.float32)

        # Add batch dimension: (1, 224, 224, 3)
        batch_tensor = np.expand_dims(img_array, axis=0)
        return batch_tensor

    def predict(self, image_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Runs end-to-end forward pass on raw image bytes."""
        if not self.is_loaded:
            raise RuntimeError("Model is not loaded. Cannot run prediction.")

        # 1. Preprocess
        tensor = self.preprocess_image(image_bytes)

        # 2. Forward pass
        try:
            predictions = self._model(tensor, training=False).numpy()
        except Exception as e:
            logger.error(f"Inference error during model execution: {e}", exc_info=True)
            raise RuntimeError(f"Model prediction failed: {e}") from e

        probs = predictions[0]

        # 3. Validation on probabilities
        if not np.all(np.isfinite(probs)):
            raise ValueError("Model output contains non-finite values (NaN or Inf).")

        # Ensure sum to 1.0
        prob_sum = float(np.sum(probs))
        if prob_sum <= 0:
            raise ValueError("Invalid prediction output: sum of probabilities is zero or negative.")

        normalized_probs = [float(p) / prob_sum for p in probs]

        # 4. Extract results
        top_idx = int(np.argmax(normalized_probs))
        predicted_class = CLASSES[top_idx]
        predicted_display = CLASS_DISPLAY_NAMES[predicted_class]
        confidence_pct = round(normalized_probs[top_idx] * 100.0, 2)

        probabilities_dict = {
            cls_name: round(prob, 6)
            for cls_name, prob in zip(CLASSES, normalized_probs)
        }

        detailed = [
            {
                "label": cls_name,
                "display_name": CLASS_DISPLAY_NAMES[cls_name],
                "probability": round(prob, 6),
                "percentage": round(prob * 100.0, 2),
            }
            for cls_name, prob in zip(CLASSES, normalized_probs)
        ]

        return {
            "status": "success",
            "filename": filename,
            "predicted_class": predicted_class,
            "predicted_display_name": predicted_display,
            "confidence_percentage": confidence_pct,
            "probabilities": probabilities_dict,
            "detailed_probabilities": detailed,
            "disclaimer": MEDICAL_DISCLAIMER,
        }

# Global singleton accessor
model_service = ModelService()
