"""Configuration settings for EyeFusion-AI FastAPI backend."""

import os
from pathlib import Path
from typing import List

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = Path(
    os.environ.get(
        "MODEL_PATH",
        str(BASE_DIR / "models" / "eyefusion_b1_inceptionv3_acaf.keras"),
    )
)

# Image Preprocessing Settings
IMAGE_SIZE = (224, 224)
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/jpg"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

# Class Mapping (alphabetical, zero-indexed)
CLASSES = [
    "cataract",
    "diabetic_retinopathy",
    "glaucoma",
    "normal",
]

CLASS_DISPLAY_NAMES = {
    "cataract": "Cataract",
    "diabetic_retinopathy": "Diabetic Retinopathy",
    "glaucoma": "Glaucoma",
    "normal": "Normal",
}

# Verified Experimental Evaluation Metrics (from project specification)
MODEL_METRICS = {
    "test_accuracy": 0.9431,
    "macro_precision": 0.9428,
    "macro_recall": 0.9422,
    "macro_f1_score": 0.9428,
    "mean_auroc": 0.9913,
    "mcc": 0.9242,
    "mean_iou": 0.8927,
}

# Academic & Clinical Disclaimer
MEDICAL_DISCLAIMER = (
    "EyeFusion-AI is an academic research and engineering prototype developed for educational "
    "and demonstration purposes only. It is NOT a medical device and must NOT be used for "
    "clinical diagnosis, treatment planning, or medical decision-making. Always consult a qualified "
    "ophthalmologist or healthcare provider for medical advice."
)

# CORS Configuration
DEFAULT_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]

env_cors = os.environ.get("CORS_ORIGINS")
if env_cors:
    if env_cors.strip() == "*":
        CORS_ORIGINS = ["*"]
    else:
        CORS_ORIGINS = [origin.strip() for origin in env_cors.split(",") if origin.strip()]
else:
    CORS_ORIGINS = DEFAULT_CORS_ORIGINS

# Optional regex pattern allowing Vercel preview deployment URLs (e.g. https://eyefusion-ai-*.vercel.app)
CORS_ORIGIN_REGEX = os.environ.get("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app")
