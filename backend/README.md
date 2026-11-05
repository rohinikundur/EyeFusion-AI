# EyeFusion-AI: FastAPI Backend

High-performance REST API backend for the **EyeFusion-AI** multi-class retinal disease classification system (Cataract, Diabetic Retinopathy, Glaucoma, and Normal).

Powered by a dual-backbone neural network architecture:
$$\text{EfficientNetB1} + \text{InceptionV3} + \text{ACAF (Adaptive Class-Aware Feature Fusion)}$$

---

## 1. Directory Structure

```text
backend/
├── config.py           # Application settings, class mappings, metrics, and CORS
├── custom_layers.py    # Custom ACAF layers (AdaptiveGatedFusion, ClassPrototypeContext, etc.)
├── main.py             # FastAPI endpoints, CORS, lifespan, and error handling
├── model_service.py    # Model loader singleton and Pillow preprocessing pipeline
├── requirements.txt    # Exact verified dependency requirements
├── schemas.py          # Pydantic request/response schemas
├── verify_model.py     # Standalone model verification & test forward-pass script
└── tests/
    └── test_api.py     # Comprehensive API test suite
```

---

## 2. Prerequisites & Setup

- **Python**: Python 3.10 recommended (64-bit)
- **Trained Model**: Ensure `models/eyefusion_b1_inceptionv3_acaf.keras` exists in the repository root.

### Installation

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
pip install -r requirements.txt
```

---

## 3. Running the Server

Start the Uvicorn development server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Or run directly using Python:

```bash
py -3.10 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will be available at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **ReDoc Docs**: `http://localhost:8000/redoc`

---

## 4. API Endpoints

### `GET /`
Returns service status and available endpoints.

### `GET /health`
Returns service health and verifies that the model is loaded in memory.

### `GET /model-info`
Returns model architecture specifications, input/output tensor shapes, class order, and experimental evaluation metrics:
- Test Accuracy: 94.31%
- Macro Precision: 94.28%
- Macro Recall: 94.22%
- Macro F1-Score: 94.28%
- Mean AUROC: 0.9913
- MCC: 0.9242
- Mean IoU: 0.8927

### `POST /predict`
Uploads a single retinal fundus image (`.jpg`, `.jpeg`, `.png`) as `multipart/form-data` under the `file` field.

**Response Schema:**
```json
{
  "status": "success",
  "filename": "fundus_sample.jpg",
  "predicted_class": "glaucoma",
  "predicted_display_name": "Glaucoma",
  "confidence_percentage": 76.39,
  "probabilities": {
    "cataract": 0.221907,
    "diabetic_retinopathy": 0.014198,
    "glaucoma": 0.763879,
    "normal": 0.000016
  },
  "detailed_probabilities": [
    {
      "label": "cataract",
      "display_name": "Cataract",
      "probability": 0.221907,
      "percentage": 22.19
    },
    ...
  ],
  "disclaimer": "EyeFusion-AI is an academic research and engineering prototype..."
}
```

---

## 5. Running Tests

Run the automated test suite using pytest:

```bash
py -3.10 -m pytest tests/test_api.py -v
```

---

## 6. Disclaimer

EyeFusion-AI is an academic research and engineering prototype developed for educational and demonstration purposes. It is **not** a certified medical diagnostic device.
