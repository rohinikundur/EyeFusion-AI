"""Verification script for EyeFusion-AI model loading and inference pipeline.

Validates:
1. Python, TensorFlow, Keras, NumPy, h5py, and Pillow environment.
2. Custom ACAF layer registration and model deserialization.
3. Model input/output shapes and restored weights.
4. End-to-end forward pass using raw [0, 255] RGB pixel tensor.
"""

import sys
import os
from pathlib import Path
import numpy as np
from PIL import Image

# Add backend directory to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR / "backend"))

# Environment info
import tensorflow as tf
import keras
import h5py
import PIL

from custom_layers import CUSTOM_OBJECTS

CLASSES = [
    "Cataract",
    "Diabetic Retinopathy",
    "Glaucoma",
    "Normal",
]

def main():
    print("=" * 60)
    print(" EyeFusion-AI: Model Loading & Environment Verification")
    print("=" * 60)
    
    # 1. Environment Check
    print("\n[1/5] Environment Versions:")
    print(f"  - Python:     {sys.version.split()[0]}")
    print(f"  - TensorFlow: {tf.__version__}")
    print(f"  - Keras:      {keras.__version__}")
    print(f"  - NumPy:      {np.__version__}")
    print(f"  - h5py:       {h5py.__version__}")
    print(f"  - Pillow:     {PIL.__version__}")

    # 2. Check Model File
    model_path = BASE_DIR / "models" / "eyefusion_b1_inceptionv3_acaf.keras"
    print(f"\n[2/5] Model File Check: {model_path}")
    if not model_path.exists():
        print(f"ERROR: Model file not found at {model_path}")
        sys.exit(1)
    size_mb = model_path.stat().st_size / (1024 * 1024)
    print(f"  - Model file found ({size_mb:.2f} MB)")

    # 3. Load Model with Custom Objects
    print("\n[3/5] Loading Keras Model with Custom ACAF Layers...")
    try:
        with keras.saving.custom_object_scope(CUSTOM_OBJECTS):
            model = keras.models.load_model(str(model_path), compile=False)
        print("  - Successfully loaded model into memory!")
    except Exception as e:
        print(f"ERROR: Failed to load model: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

    # 4. Verify Architecture and Weights
    print("\n[4/5] Verifying Model Architecture & Restored Weights:")
    input_shape = model.input_shape
    output_shape = model.output_shape
    print(f"  - Model Name:    {model.name}")
    print(f"  - Input Shape:   {input_shape}")
    print(f"  - Output Shape:  {output_shape}")
    print(f"  - Total Layers:  {len(model.layers)}")

    assert input_shape == (None, 224, 224, 3), f"Unexpected input shape: {input_shape}"
    assert output_shape == (None, 4), f"Unexpected output shape: {output_shape}"

    # Verify custom layer weights
    proto_layer = model.get_layer("class_prototype_context")
    prototypes = proto_layer.prototypes.numpy()
    print(f"  - ClassPrototypeContext weight shape: {prototypes.shape}")
    print(f"    Prototype 0 (first 3 values): {prototypes[0, :3]}")
    assert prototypes.shape == (4, 1280), "Prototypes shape mismatch!"

    refine_layer = model.get_layer("residual_class_aware_refinement")
    alpha_val = float(refine_layer.alpha.numpy())
    print(f"  - ResidualClassAwareRefinement alpha: {alpha_val:.8f}")
    assert abs(alpha_val - 0.0855554) < 1e-4, f"Alpha value differs from trained weight: {alpha_val}"

    # 5. Forward-pass Test with Sample Image
    print("\n[5/5] Running Forward-Pass Inference Test:")
    # Create sample 224x224 RGB test image
    sample_img = Image.new("RGB", (224, 224), color=(128, 64, 32))
    
    # Preprocessing: resize to 224x224, convert to RGB, pass raw float32 in [0, 255] range
    img_resized = sample_img.resize((224, 224)).convert("RGB")
    img_array = np.array(img_resized, dtype=np.float32)
    batch_tensor = np.expand_dims(img_array, axis=0)

    print(f"  - Input tensor shape: {batch_tensor.shape}, dtype: {batch_tensor.dtype}")
    print(f"  - Pixel range: min={batch_tensor.min():.1f}, max={batch_tensor.max():.1f} (expected: 0-255)")

    predictions = model(batch_tensor, training=False).numpy()
    probs = predictions[0]

    print("\n  Inference Results:")
    print(f"  - Raw Probabilities Tensor: {probs}")
    print(f"  - Sum of Probabilities:     {float(np.sum(probs)):.6f}")

    # Assertions
    assert np.all(np.isfinite(probs)), "Predictions contain NaN or Inf values!"
    assert np.isclose(np.sum(probs), 1.0, atol=1e-4), "Probabilities do not sum to 1.0!"

    for idx, (cls_name, p) in enumerate(zip(CLASSES, probs)):
        print(f"    [{idx}] {cls_name:<22}: {p * 100:6.2f}%")

    top_idx = int(np.argmax(probs))
    print(f"\n  Top Prediction: {CLASSES[top_idx]} ({probs[top_idx] * 100:.2f}%)")
    print("\n" + "=" * 60)
    print(" ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    main()
