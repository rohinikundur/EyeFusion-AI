# EyeFusion-AI

### AI-Based Multi-Class Eye Disease Classification and Prediction using Deep Learning

[![FastAPI](https://img.shields.io/badge/FastAPI-0.162.0-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Keras 3](https://img.shields.io/badge/Keras-3.12-D00000.svg?logo=keras)](https://keras.io)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21-FF6F00.svg?logo=tensorflow)](https://tensorflow.org)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4.svg?logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?logo=vite)](https://vite.dev)

A complete, full-stack clinical intelligence web application for multi-class retinal disease classification from ocular fundus photography.

---

## 1. Project Overview

EyeFusion-AI classifies retinal fundus images into four categories:

1. **Cataract**
2. **Diabetic Retinopathy**
3. **Glaucoma**
4. **Normal**

### Dual-Backbone Architecture:
$$\text{EfficientNetB1} + \text{InceptionV3} + \text{ACAF (Adaptive Class-Aware Feature Fusion)}$$

- **EfficientNetB1**: Captures compound-scaled, depthwise multi-scale feature hierarchies.
- **InceptionV3**: Extracts multi-frequency spatial context through asymmetric factorization.
- **ACAF Module**:
  - `AdaptiveGatedFusion`: Dynamic channel-wise gating vector ($1280\text{-d}$).
  - `ClassPrototypeContext`: Learnable class prototype dictionary matrix ($4 \times 1280$).
  - `ResidualClassAwareRefinement`: Residual modulation via learned scalar weight ($\alpha = 0.08555$).

---

## 2. Verified Empirical Evaluation Metrics

These experimental results were measured on the held-out test evaluation set:

| Evaluation Metric | Score | Clinical Relevance |
| :--- | :---: | :--- |
| **Test Accuracy** | **94.31%** | Overall top-1 multi-class classification accuracy |
| **Macro Precision** | **94.28%** | Equal-weight average precision per disease category |
| **Macro Recall (Sensitivity)** | **94.22%** | True positive detection rate across pathologies |
| **Macro F1-Score** | **94.28%** | Harmonized balance between precision and recall |
| **Mean AUROC** | **0.9913** | Multi-class area under the ROC curve |
| **Matthews Correlation (MCC)** | **0.9242** | Balanced performance under class distribution variations |
| **Mean IoU** | **0.8927** | Saliency feature overlap consistency |

---

## 3. Directory Layout

```text
EyeFusion-AI/
├── backend/
│   ├── config.py           # App settings, class mappings, metrics, CORS
│   ├── custom_layers.py    # Custom ACAF layers (AdaptiveGatedFusion, ClassPrototypeContext, etc.)
│   ├── main.py             # FastAPI REST application & endpoint handlers
│   ├── model_service.py    # Singleton model loader and Pillow image pipeline
│   ├── requirements.txt    # Pinned, tested Python dependencies
│   ├── schemas.py          # Pydantic schemas
│   ├── verify_model.py     # Standalone model verification & test forward-pass script
│   ├── README.md           # Backend documentation
│   └── tests/
│       └── test_api.py     # Comprehensive automated test suite
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios API client connecting to backend
│   │   ├── components/     # Navbar, Footer, PredictionCard, ScanVisualizer, MetricsBadge
│   │   ├── pages/          # Diagnostics, Architecture, Encyclopedia, About
│   │   ├── utils/          # 1-click synthetic test fundus image generator
│   │   ├── App.jsx         # React Router navigation
│   │   └── index.css       # Tailwind v4 theme & clinical scan animations
│   ├── package.json        # Frontend dependencies (React 19, Recharts, Lucide, Tailwind)
│   └── vite.config.js      # Vite build & backend proxy setup
├── models/
│   └── eyefusion_b1_inceptionv3_acaf.keras   # Trained dual-backbone Keras model (142.28 MB)
└── documentation/          # Project documentation
```

---

## 4. Setup and Quickstart

### Step 1: Backend Setup & Launch

```bash
# 1. Open a terminal in the project root
cd backend

# 2. Install dependencies (Python 3.10 recommended)
py -3.10 -m pip install -r requirements.txt

# 3. (Optional) Run verification script
py -3.10 verify_model.py

# 4. Start the FastAPI server
py -3.10 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend will be live at:
- API Base: `http://127.0.0.1:8000`
- Swagger Interactive Documentation: `http://127.0.0.1:8000/docs`

### Step 2: Frontend Setup & Launch

```bash
# 1. Open a second terminal and navigate to the frontend directory
cd frontend

# 2. Install dependencies (Node.js >= 18)
npm install

# 3. Start the Vite development server
npm run dev
```

The frontend will be live at:
- Web Application: `http://localhost:5173`

---

## 5. Automated Backend Tests

Run the complete test suite:

```bash
py -3.10 -m pytest backend/tests/test_api.py -v
```

---

## 6. Academic Disclaimer

EyeFusion-AI is an AI-based research and engineering prototype developed for educational, research and demonstration purposes. It is **not** a certified medical diagnostic device under medical device regulations. It is not intended for clinical diagnosis, patient management, or treatment prescription. Always consult a licensed ophthalmologist or healthcare professional for medical advice.
