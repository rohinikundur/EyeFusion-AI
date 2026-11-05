"""Model download utility for production environments (e.g., Render, Docker).

If the model file does not exist locally (for example, if models/*.keras is excluded
from Git due to GitHub's 100MB file limit), this script downloads it from an external
direct URL (such as a GitHub Release asset, Hugging Face repository, or S3 bucket)
specified by the MODEL_DOWNLOAD_URL environment variable.
"""

import os
import sys
import urllib.request
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("eyefusion.download_model")

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = Path(
    os.environ.get(
        "MODEL_PATH",
        str(BASE_DIR / "models" / "eyefusion_b1_inceptionv3_acaf.keras"),
    )
)
MODEL_DOWNLOAD_URL = os.environ.get("MODEL_DOWNLOAD_URL")


def ensure_model_available() -> Path:
    """Ensures the trained model file exists locally, downloading if necessary."""
    if MODEL_PATH.exists():
        size_mb = MODEL_PATH.stat().st_size / (1024 * 1024)
        logger.info(f"Model already present locally at {MODEL_PATH} ({size_mb:.2f} MB).")
        return MODEL_PATH

    if not MODEL_DOWNLOAD_URL:
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH} and MODEL_DOWNLOAD_URL is not set.\n"
            "Either place eyefusion_b1_inceptionv3_acaf.keras in models/ or "
            "set the MODEL_DOWNLOAD_URL environment variable."
        )

    logger.info(f"Model not found locally. Initiating download from: {MODEL_DOWNLOAD_URL}")
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    temp_path = MODEL_PATH.with_suffix(".keras.tmp")

    def report_progress(block_num, block_size, total_size):
        if total_size > 0:
            percent = (block_num * block_size / total_size) * 100
            if block_num % 1000 == 0:
                logger.info(f"Downloading model: {percent:.1f}% ({block_num * block_size / (1024 * 1024):.1f} MB)")

    try:
        urllib.request.urlretrieve(MODEL_DOWNLOAD_URL, str(temp_path), reporthook=report_progress)
        temp_path.rename(MODEL_PATH)
        size_mb = MODEL_PATH.stat().st_size / (1024 * 1024)
        logger.info(f"Model successfully downloaded to {MODEL_PATH} ({size_mb:.2f} MB).")
        return MODEL_PATH
    except Exception as e:
        if temp_path.exists():
            temp_path.unlink()
        logger.error(f"Failed to download model from {MODEL_DOWNLOAD_URL}: {e}")
        raise RuntimeError(f"Model download failure: {e}") from e


if __name__ == "__main__":
    try:
        ensure_model_available()
    except Exception as err:
        logger.error(str(err))
        sys.exit(1)
