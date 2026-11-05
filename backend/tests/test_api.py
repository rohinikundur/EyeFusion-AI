"""API test suite for EyeFusion-AI FastAPI backend.

Tests:
1. Root endpoint (GET /)
2. Health check endpoint (GET /health)
3. Model information endpoint (GET /model-info)
4. Successful prediction with valid JPEG image (POST /predict)
5. Successful prediction with valid PNG image (POST /predict)
6. Error handling: invalid file extension (POST /predict with .txt)
7. Error handling: corrupted image payload (POST /predict with invalid bytes)
8. Error handling: empty image file (POST /predict with 0 bytes)
"""

import sys
import io
from pathlib import Path
import pytest
from PIL import Image
from fastapi.testclient import TestClient

# Ensure backend directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from main import app
from model_service import model_service

@pytest.fixture(scope="session")
def client():
    """Test client managing application lifespan (loads model once for all tests)."""
    with TestClient(app) as c:
        yield c

def create_test_image_bytes(format="JPEG", size=(250, 250), color=(100, 150, 200)) -> bytes:
    """Generates an in-memory valid image encoded in the requested format."""
    img = Image.new("RGB", size, color=color)
    buffer = io.BytesIO()
    img.save(buffer, format=format)
    buffer.seek(0)
    return buffer.getvalue()

# Test 1: Root Endpoint
def test_root_endpoint(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "EyeFusion-AI" in data["title"]
    assert "endpoints" in data
    assert data["endpoints"]["predict"] == "/predict"

# Test 2: Health Endpoint
def test_health_endpoint(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["input_shape"] == [None, 224, 224, 3]
    assert data["output_shape"] == [None, 4]

# Test 3: Model Info Endpoint
def test_model_info_endpoint(client: TestClient):
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()
    assert data["architecture"] == "EfficientNetB1 + InceptionV3 + ACAF"
    assert data["num_classes"] == 4
    assert data["class_order"] == ["cataract", "diabetic_retinopathy", "glaucoma", "normal"]
    
    # Check evaluation metrics
    metrics = data["evaluation_metrics"]
    assert metrics["test_accuracy"] == 0.9431
    assert metrics["macro_precision"] == 0.9428
    assert metrics["macro_recall"] == 0.9422
    assert metrics["macro_f1_score"] == 0.9428
    assert metrics["mean_auroc"] == 0.9913
    assert metrics["mcc"] == 0.9242
    assert metrics["mean_iou"] == 0.8927
    
    # Check disclaimer
    assert "NOT a medical device" in data["disclaimer"]

# Test 4: Prediction with Valid JPEG Image
def test_predict_valid_jpeg(client: TestClient):
    jpeg_bytes = create_test_image_bytes(format="JPEG")
    files = {"file": ("test_retina.jpg", jpeg_bytes, "image/jpeg")}
    response = client.post("/predict", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["filename"] == "test_retina.jpg"
    assert data["predicted_class"] in ["cataract", "diabetic_retinopathy", "glaucoma", "normal"]
    assert 0.0 <= data["confidence_percentage"] <= 100.0
    
    # Probabilities verification
    probs = data["probabilities"]
    assert len(probs) == 4
    total_prob = sum(probs.values())
    assert abs(total_prob - 1.0) < 1e-4

    # Detailed probabilities check
    detailed = data["detailed_probabilities"]
    assert len(detailed) == 4
    assert all("percentage" in item and "display_name" in item for item in detailed)

# Test 5: Prediction with Valid PNG Image
def test_predict_valid_png(client: TestClient):
    png_bytes = create_test_image_bytes(format="PNG")
    files = {"file": ("fundus_scan.png", png_bytes, "image/png")}
    response = client.post("/predict", files=files)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["filename"] == "fundus_scan.png"
    assert data["predicted_class"] in ["cataract", "diabetic_retinopathy", "glaucoma", "normal"]
    assert 0.0 <= data["confidence_percentage"] <= 100.0

# Test 6: Invalid File Extension (.txt)
def test_predict_invalid_extension(client: TestClient):
    fake_txt_bytes = b"This is a text document, not a retinal image."
    files = {"file": ("report.txt", fake_txt_bytes, "text/plain")}
    response = client.post("/predict", files=files)
    
    assert response.status_code == 400
    data = response.json()
    assert "Unsupported file extension" in data["detail"]

# Test 7: Corrupted Image Upload
def test_predict_corrupted_image(client: TestClient):
    corrupted_bytes = b"\xFF\xD8\xFF\xE0\x00\x10JFIF\x00corrupted_truncated_bytes"
    files = {"file": ("corrupted.jpg", corrupted_bytes, "image/jpeg")}
    response = client.post("/predict", files=files)
    
    assert response.status_code == 400
    data = response.json()
    assert "Corrupted or invalid image" in data["detail"]

# Test 8: Empty File (0 bytes)
def test_predict_empty_file(client: TestClient):
    empty_bytes = b""
    files = {"file": ("empty.jpg", empty_bytes, "image/jpeg")}
    response = client.post("/predict", files=files)
    
    assert response.status_code == 400
    data = response.json()
    assert "empty" in data["detail"].lower()
