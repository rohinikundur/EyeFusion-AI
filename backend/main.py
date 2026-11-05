"""EyeFusion-AI FastAPI Application.

Provides RESTful endpoints for retinal fundus disease classification:
- GET  /             : API root and meta
- GET  /health       : Health and model status
- GET  /model-info   : Architecture details & evaluation metrics
- POST /predict      : Multi-class prediction on uploaded fundus image
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import (
    ALLOWED_EXTENSIONS,
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE_BYTES,
    CORS_ORIGINS,
    CORS_ORIGIN_REGEX,
    MEDICAL_DISCLAIMER,
)
from schemas import (
    RootResponse,
    HealthResponse,
    ModelInfoResponse,
    PredictionResponse,
    ErrorResponse,
)
from model_service import model_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads the model once during application startup."""
    print("Initializing EyeFusion-AI backend service...")
    try:
        model_service.load()
        print("EyeFusion-AI model loaded and ready for inference.")
    except Exception as e:
        print(f"CRITICAL: Model failed to load during startup: {e}")
    yield
    print("Shutting down EyeFusion-AI backend service.")

app = FastAPI(
    title="EyeFusion-AI: Retinal Disease Classification API",
    description=(
        "Deep Learning Multi-Class Retinal Disease Classification API based on "
        "EfficientNetB1 + InceptionV3 + Adaptive Class-Aware Feature Fusion (ACAF)."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration supporting local development and deployed frontend origins
cors_kwargs = {
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

if CORS_ORIGINS == ["*"]:
    cors_kwargs["allow_origins"] = ["*"]
    cors_kwargs["allow_credentials"] = False
else:
    cors_kwargs["allow_origins"] = CORS_ORIGINS
    cors_kwargs["allow_credentials"] = True
    if CORS_ORIGIN_REGEX:
        cors_kwargs["allow_origin_regex"] = CORS_ORIGIN_REGEX

app.add_middleware(CORSMiddleware, **cors_kwargs)


@app.get(
    "/",
    response_model=RootResponse,
    tags=["General"],
    summary="Root service status",
)
async def root():
    """Returns general project information and available endpoints."""
    return {
        "title": "EyeFusion-AI API",
        "version": "1.0.0",
        "status": "online",
        "description": (
            "AI-Based Multi-Class Eye Disease Classification (Cataract, Diabetic Retinopathy, "
            "Glaucoma, Normal) using EfficientNetB1 + InceptionV3 + ACAF."
        ),
        "endpoints": {
            "root": "/",
            "health": "/health",
            "model_info": "/model-info",
            "predict": "/predict",
            "documentation": "/docs",
        },
    }


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Diagnostics"],
    summary="Health check and model load status",
)
async def health():
    """Returns service health and verification that the model is loaded."""
    if not model_service.is_loaded:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "model_loaded": False,
                "model_name": None,
                "input_shape": None,
                "output_shape": None,
            },
        )

    info = model_service.get_info()
    return {
        "status": "healthy",
        "model_loaded": True,
        "model_name": info["model_name"],
        "input_shape": info["input_shape"],
        "output_shape": info["output_shape"],
    }


@app.get(
    "/model-info",
    response_model=ModelInfoResponse,
    tags=["Model Information"],
    summary="Detailed model architecture and evaluation metrics",
)
async def model_info():
    """Returns architecture specs, evaluation metrics, and clinical disclaimers."""
    if not model_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="EyeFusion-AI model is currently not loaded.",
        )
    return model_service.get_info()


@app.post(
    "/predict",
    response_model=PredictionResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid or corrupted image"},
        413: {"model": ErrorResponse, "description": "File size exceeds limit"},
        415: {"model": ErrorResponse, "description": "Unsupported media format"},
        500: {"model": ErrorResponse, "description": "Inference computation error"},
        503: {"model": ErrorResponse, "description": "Model not loaded"},
    },
    tags=["Inference"],
    summary="Predict retinal disease from an uploaded fundus image",
)
async def predict(file: UploadFile = File(...)):
    """Accepts an uploaded retinal fundus image (JPEG/PNG) and performs multi-class prediction."""
    if not model_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not ready for inference.",
        )

    filename = file.filename or "uploaded_image"
    ext = Path(filename).suffix.lower()

    # 1. File extension check
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Unsupported file extension '{ext}'. Only JPEG, JPG, and PNG images are supported."
            ),
        )

    # 2. Content-type check
    if file.content_type and file.content_type.lower() not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                f"Unsupported media type '{file.content_type}'. Must be image/jpeg or image/png."
            ),
        )

    # 3. Read bytes & check size
    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes).",
        )

    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                f"File size exceeds the {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB limit."
            ),
        )

    # 4. Predict
    try:
        result = model_service.predict(image_bytes=image_bytes, filename=filename)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {e}",
        )
