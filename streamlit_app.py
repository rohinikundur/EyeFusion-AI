"""EyeFusion-AI: AI-Based Multi-Class Eye Disease Classification Streamlit Application.

Architecture:
- Dual-Backbone: EfficientNetB1 + InceptionV3
- Fusion: Adaptive Class-Aware Feature Fusion (ACAF)
- Target Classes: Cataract, Diabetic Retinopathy, Glaucoma, Normal

Model Storage:
- Local: models/eyefusion_b1_inceptionv3_acaf.keras
- Hugging Face Hub: rrohiniii/eyefusion-ai-model
"""

import os
import sys
from pathlib import Path
import numpy as np
from PIL import Image
import streamlit as st

# Ensure repository root is on sys.path for backend imports
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Suppress verbose TensorFlow warnings
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

# Import custom layers and compatibility patch from backend
try:
    from backend.custom_layers import (
        CUSTOM_OBJECTS,
        AdaptiveGatedFusion,
        ClassPrototypeContext,
        ResidualClassAwareRefinement,
    )
except ImportError as err:
    st.error(f"Failed to import custom ACAF layers from backend: {err}")
    st.stop()

import keras
from huggingface_hub import hf_hub_download

# ==============================================================================
# Page Configuration & Visual Theme
# ==============================================================================
st.set_page_config(
    page_title="EyeFusion-AI — Retinal Disease Classification",
    page_icon="👁️",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Styling (Theme: Midnight Teal, Rich Teal, Sage, Pale Mint, Ivory, Gold)
st.markdown(
    """
    <style>
    /* Global Page Styling */
    .stApp {
        background-color: #F8F6EF;
        color: #102E32;
        font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    }
    
    /* Headers & Brand Text */
    h1, h2, h3, h4 {
        color: #102E32 !important;
        font-weight: 700 !important;
    }
    
    /* Top Hero Banner */
    .hero-container {
        background: linear-gradient(135deg, #102E32 0%, #194B50 100%);
        border: 1px solid rgba(184, 217, 206, 0.3);
        border-radius: 20px;
        padding: 2.2rem 2.5rem;
        color: #F8F6EF;
        margin-bottom: 2rem;
        box-shadow: 0 10px 25px -5px rgba(16, 46, 50, 0.2);
    }
    .hero-badge {
        display: inline-block;
        background-color: rgba(25, 75, 80, 0.8);
        border: 1px solid #B8D9CE;
        color: #D5A86B;
        font-size: 0.75rem;
        font-weight: 700;
        padding: 0.35rem 0.85rem;
        border-radius: 9999px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.75rem;
    }
    .hero-title {
        font-size: 2.4rem;
        font-weight: 800;
        line-height: 1.2;
        color: #F8F6EF !important;
        margin-bottom: 0.6rem;
    }
    .hero-subtitle {
        font-size: 1.05rem;
        color: #B8D9CE;
        max-width: 850px;
        line-height: 1.5;
        margin: 0;
    }
    
    /* Result Verdict Card */
    .verdict-card {
        background-color: #FFFFFF;
        border: 1px solid #B8D9CE;
        border-radius: 16px;
        padding: 1.75rem;
        box-shadow: 0 4px 15px rgba(16, 46, 50, 0.05);
        margin-bottom: 1.5rem;
    }
    .verdict-badge {
        display: inline-block;
        padding: 0.3rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
    }
    .badge-glaucoma {
        background-color: rgba(213, 168, 107, 0.2);
        color: #8C5D1E;
        border: 1px solid #D5A86B;
    }
    .badge-dr {
        background-color: #FEE2E2;
        color: #991B1B;
        border: 1px solid #FCA5A5;
    }
    .badge-cataract {
        background-color: #EAF1E9;
        color: #102E32;
        border: 1px solid #B8D9CE;
    }
    .badge-normal {
        background-color: #DCFCE7;
        color: #166534;
        border: 1px solid #86EFAC;
    }
    
    .verdict-title {
        font-size: 2rem;
        font-weight: 800;
        color: #102E32;
        margin: 0.2rem 0;
    }
    .confidence-box {
        background-color: #F8F6EF;
        border: 1px solid #B8D9CE;
        border-radius: 14px;
        padding: 1.25rem;
        text-align: center;
    }
    
    /* Academic Disclaimer Card */
    .disclaimer-card {
        background-color: #102E32;
        border: 1px solid #D5A86B;
        border-radius: 16px;
        padding: 1.25rem 1.75rem;
        color: #B8D9CE;
        font-size: 0.85rem;
        line-height: 1.6;
        margin-top: 2rem;
    }
    .disclaimer-title {
        color: #D5A86B;
        font-weight: 700;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.4rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    /* Sidebar styling */
    section[data-testid="stSidebar"] {
        background-color: #102E32 !important;
        border-right: 1px solid #194B50;
    }
    section[data-testid="stSidebar"] * {
        color: #F8F6EF !important;
    }
    section[data-testid="stSidebar"] h2, section[data-testid="stSidebar"] h3 {
        color: #D5A86B !important;
    }
    
    /* Metric Card Component */
    .stat-pill {
        background: rgba(25, 75, 80, 0.4);
        border: 1px solid rgba(184, 217, 206, 0.3);
        border-radius: 10px;
        padding: 0.6rem 0.8rem;
        margin-bottom: 0.5rem;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# ==============================================================================
# Model Constants & Class Definitions
# ==============================================================================
HF_REPO_ID = "rrohiniii/eyefusion-ai-model"
MODEL_FILENAME = "eyefusion_b1_inceptionv3_acaf.keras"
LOCAL_MODEL_PATH = BASE_DIR / "models" / MODEL_FILENAME

CLASSES = [
    "cataract",
    "diabetic_retinopathy",
    "glaucoma",
    "normal",
]

CLASS_DISPLAY = {
    "cataract": {
        "name": "Cataract",
        "badge_class": "badge-cataract",
        "color": "#8C9A8E",
        "description": "Characterized by crystalline lens opacification and optical scattering, leading to hazy visual media and diffuse reduction of retinal vessel contrast.",
    },
    "diabetic_retinopathy": {
        "name": "Diabetic Retinopathy",
        "badge_class": "badge-dr",
        "color": "#DC2626",
        "description": "Retinal microvascular pathology exhibiting microaneurysms, blot hemorrhages, hard lipid exudates, and capillary ischemia secondary to diabetes.",
    },
    "glaucoma": {
        "name": "Glaucoma",
        "badge_class": "badge-glaucoma",
        "color": "#D5A86B",
        "description": "Progressive optic neuropathy manifesting as vertical cup-to-disc ratio (CDR) enlargement, neuroretinal rim thinning, and retinal nerve fiber layer loss.",
    },
    "normal": {
        "name": "Normal Retina",
        "badge_class": "badge-normal",
        "color": "#16A34A",
        "description": "Healthy physiological fundus with intact neuroretinal rim, healthy physiological cup, sharp disc margins, and clear vascular arcades without lesions.",
    },
}

# ==============================================================================
# Model Loading Service (Cached Resource)
# ==============================================================================
@st.cache_resource(show_spinner=False)
def load_eyefusion_model():
    """Retrieves model weights from local storage or Hugging Face, then loads with Keras."""
    # 1. Locate model binary
    if LOCAL_MODEL_PATH.exists():
        model_path = str(LOCAL_MODEL_PATH)
    else:
        try:
            with st.spinner("Downloading EyeFusion-AI model weights from Hugging Face Hub (rrohiniii/eyefusion-ai-model)..."):
                model_path = hf_hub_download(
                    repo_id=HF_REPO_ID,
                    filename=MODEL_FILENAME,
                )
        except Exception as e:
            raise RuntimeError(
                f"Failed to download model weights from Hugging Face ({HF_REPO_ID}): {e}\n"
                "Please verify internet connectivity or ensure the model binary is present in models/."
            ) from e

    # 2. Deserialization with registered custom ACAF layers
    try:
        with keras.saving.custom_object_scope(CUSTOM_OBJECTS):
            model = keras.models.load_model(model_path, compile=False)
        return model
    except Exception as e:
        raise RuntimeError(f"Error initializing Keras model from {model_path}: {e}") from e


# ==============================================================================
# Preprocessing Pipeline (Strictly Raw [0, 255] RGB float32)
# ==============================================================================
def preprocess_fundus_image(uploaded_file):
    """Preprocesses user-uploaded fundus image according to the model specification.
    
    Requirements:
    - RGB color space
    - Resized to 224x224 via bilinear resampling
    - Stored as float32 in raw [0.0, 255.0] range
    - Shape (1, 224, 224, 3)
    - No Python-side division by 255 (model graph performs internal scaling)
    """
    try:
        img = Image.open(uploaded_file)
        # Verify image integrity
        img.verify()
        # Re-open after verify
        img = Image.open(uploaded_file)
    except Exception as e:
        raise ValueError(f"Uploaded file is corrupted or not a valid image: {e}") from e

    # Convert color mode
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Bilinear resize to 224x224
    img_resized = img.resize((224, 224), Image.Resampling.BILINEAR)

    # Convert to float32 numpy array preserving raw 0-255 scale
    img_array = np.array(img_resized, dtype=np.float32)

    # Add batch dimension: (1, 224, 224, 3)
    batch_tensor = np.expand_dims(img_array, axis=0)

    return img, batch_tensor


# ==============================================================================
# Main Streamlit Application Layout
# ==============================================================================
def main():
    # Hero Banner
    st.markdown(
        """
        <div class="hero-container">
            <div class="hero-badge">Dual-Backbone AI System</div>
            <div class="hero-title">EyeFusion-AI</div>
            <p class="hero-subtitle">
                AI-Based Multi-Class Eye Disease Classification & Prediction using EfficientNetB1, 
                InceptionV3, and Adaptive Class-Aware Feature Fusion (ACAF).
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Sidebar: Model Specs & Benchmarks
    with st.sidebar:
        st.markdown("### 👁️ EyeFusion-AI Engine")
        st.markdown(
            "An academic deep learning system for automated ocular pathology identification from retinal fundus photographs."
        )

        st.markdown("---")
        st.markdown("#### 🔬 Model Architecture")
        st.markdown(
            """
            - **Branch 1:** EfficientNetB1 (Compound Scaling)
            - **Branch 2:** InceptionV3 (Multi-Scale Context)
            - **Fusion:** Adaptive Gated Fusion
            - **Refinement:** Class Prototype Context (ACAF)
            - **Input Scale:** 224 × 224 × 3 (RGB raw [0, 255])
            """
        )

        st.markdown("---")
        st.markdown("#### 📊 Test Set Benchmarks")
        st.markdown(
            """
            <div class="stat-pill">
                <strong>Test Accuracy:</strong> 94.31%
            </div>
            <div class="stat-pill">
                <strong>Mean AUROC:</strong> 0.9913
            </div>
            <div class="stat-pill">
                <strong>Macro F1-Score:</strong> 94.28%
            </div>
            <div class="stat-pill">
                <strong>Matthews Corr (MCC):</strong> 0.9242
            </div>
            <div class="stat-pill">
                <strong>Mean IoU:</strong> 0.8927
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown("---")
        st.markdown(
            f"**Model Weights:** [`{HF_REPO_ID}`](https://huggingface.co/{HF_REPO_ID})"
        )

    # Load Model
    try:
        model = load_eyefusion_model()
    except Exception as e:
        st.error(f"⚠️ Model Initialization Error: {e}")
        st.info("Ensure internet access is enabled to download model weights from Hugging Face on the first run.")
        return

    # Diagnostic Workspace Grid
    col_upload, col_result = st.columns([1, 1], gap="large")

    with col_upload:
        st.markdown("### 📤 Upload Retinal Fundus Image")
        st.markdown(
            "Select an ocular fundus photograph (JPEG, JPG, or PNG) to classify Cataract, Diabetic Retinopathy, Glaucoma, or Normal eyes."
        )

        uploaded_file = st.file_uploader(
            label="Upload Fundus Photography",
            type=["jpg", "jpeg", "png"],
            help="High-resolution centered retinal photograph",
            label_visibility="collapsed",
        )

        if uploaded_file is not None:
            try:
                display_img, input_tensor = preprocess_fundus_image(uploaded_file)
                st.image(
                    display_img,
                    caption=f"Uploaded: {uploaded_file.name} (Resized to 224×224 for ACAF input)",
                    use_container_width=True,
                )
            except ValueError as val_err:
                st.error(str(val_err))
                input_tensor = None
        else:
            input_tensor = None
            st.info("Awaiting fundus photography upload to begin classification.")

    with col_result:
        st.markdown("### 📋 Diagnostic Prediction Analysis")

        if uploaded_file is not None and input_tensor is not None:
            with st.spinner("Executing dual-backbone feature extraction & ACAF fusion..."):
                try:
                    # Run inference: model(input_tensor, training=False)
                    raw_predictions = model(input_tensor, training=False).numpy()[0]
                except Exception as inf_err:
                    st.error(f"Inference computation error: {inf_err}")
                    return

                # Validate probabilities
                if not np.all(np.isfinite(raw_predictions)):
                    st.error("Model returned non-finite probability values.")
                    return

                prob_sum = float(np.sum(raw_predictions))
                normalized_probs = [float(p) / prob_sum for p in raw_predictions]

                top_idx = int(np.argmax(normalized_probs))
                predicted_class = CLASSES[top_idx]
                predicted_meta = CLASS_DISPLAY[predicted_class]
                confidence_pct = normalized_probs[top_idx] * 100.0

            # Verdict Card
            st.markdown(
                f"""
                <div class="verdict-card">
                    <span class="verdict-badge {predicted_meta['badge_class']}">
                        Classification Target Identified
                    </span>
                    <div class="verdict-title">{predicted_meta['name']}</div>
                    <p style="color: #194B50; font-size: 0.95rem; line-height: 1.5; margin-top: 0.5rem;">
                        {predicted_meta['description']}
                    </p>
                    <div style="margin-top: 1.25rem;">
                        <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: #194B50;">
                            Prediction Confidence:
                        </span>
                        <span style="font-size: 1.6rem; font-weight: 800; color: #102E32; margin-left: 0.5rem;">
                            {confidence_pct:.2f}%
                        </span>
                    </div>
                </div>
                """,
                unsafe_allow_html=True,
            )

            # Class Probability Distribution
            st.markdown("#### Probability Distribution Across Classes")
            for idx, cls_key in enumerate(CLASSES):
                cls_info = CLASS_DISPLAY[cls_key]
                p_val = normalized_probs[idx]
                p_pct = p_val * 100.0

                col_label, col_bar = st.columns([1.5, 3])
                with col_label:
                    is_top = (idx == top_idx)
                    label_style = "font-weight: 800; color: #102E32;" if is_top else "color: #194B50;"
                    star = "⭐ " if is_top else ""
                    st.markdown(f"<span style='{label_style}'>{star}{cls_info['name']}</span>", unsafe_allow_html=True)
                    st.caption(f"p = {p_val:.5f} ({p_pct:.2f}%)")

                with col_bar:
                    st.progress(float(min(max(p_val, 0.0), 1.0)))

        else:
            st.markdown(
                """
                <div style="background-color: #FFFFFF; border: 2px dashed #B8D9CE; border-radius: 16px; padding: 3rem 2rem; text-align: center; color: #194B50;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👁️</div>
                    <div style="font-size: 1.1rem; font-weight: 700; color: #102E32;">Awaiting Fundus Photography Scan</div>
                    <p style="font-size: 0.85rem; color: #194B50; margin-top: 0.5rem;">
                        Upload a retinal photograph to begin AI-powered feature extraction and view the four-class probability distribution.
                    </p>
                </div>
                """,
                unsafe_allow_html=True,
            )

    # Prominent Academic / Clinical Disclaimer
    st.markdown(
        """
        <div class="disclaimer-card">
            <div class="disclaimer-title">
                🛡️ Academic Research Prototype Notice
            </div>
            EyeFusion-AI is an AI-based research and engineering prototype developed for educational, research, 
            and demonstration purposes. The application is strictly not certified as a medical diagnostic device under medical device 
            regulations and is not intended for clinical diagnosis, patient management, or treatment decision-making. 
            All classification outputs are intended for research and technical evaluation only. Always seek the advice of a board-certified 
            ophthalmologist or licensed healthcare professional regarding eye health concerns.
        </div>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
