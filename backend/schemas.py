"""Pydantic request and response schemas for EyeFusion-AI API."""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class RootResponse(BaseModel):
    title: str = "EyeFusion-AI API"
    version: str = "1.0.0"
    status: str = "online"
    description: str
    endpoints: Dict[str, str]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: Optional[str] = None
    input_shape: Optional[List[Optional[int]]] = None
    output_shape: Optional[List[Optional[int]]] = None

class ModelInfoResponse(BaseModel):
    model_name: str
    architecture: str
    input_shape: List[Optional[int]]
    output_shape: List[Optional[int]]
    num_classes: int
    class_order: List[str]
    class_mapping: Dict[int, str]
    evaluation_metrics: Dict[str, float]
    disclaimer: str

class ClassProbability(BaseModel):
    label: str
    display_name: str
    probability: float = Field(..., ge=0.0, le=1.0)
    percentage: float = Field(..., ge=0.0, le=100.0)

class PredictionResponse(BaseModel):
    status: str = "success"
    filename: str
    predicted_class: str
    predicted_display_name: str
    confidence_percentage: float
    probabilities: Dict[str, float]
    detailed_probabilities: List[ClassProbability]
    disclaimer: str

class ErrorResponse(BaseModel):
    status: str = "error"
    detail: str
