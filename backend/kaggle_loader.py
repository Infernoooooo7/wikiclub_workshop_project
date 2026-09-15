"""Download the local Wikipedia knowledge base from Kaggle when needed."""

from __future__ import annotations

import os
import importlib
from pathlib import Path
from typing import Optional

DEFAULT_DATASET = "wikimedia-foundation/wikipedia"
DEFAULT_FILENAME = "wikipedia_data.csv"


def ensure_wikipedia_dataset(file_path: str = DEFAULT_FILENAME, dataset: Optional[str] = None) -> Path:
    """Return the dataset path, downloading and extracting it if absent."""
    target = Path(file_path).expanduser()
    if target.exists():
        return target

    target.parent.mkdir(parents=True, exist_ok=True)
    dataset_name = dataset or os.getenv("KAGGLE_DATASET", DEFAULT_DATASET)
    try:
        kaggle_api = importlib.import_module("kaggle.api.kaggle_api_extended")
        api = kaggle_api.KaggleApi()
        api.authenticate()
        api.dataset_download_files(dataset_name, path=str(target.parent), unzip=True, quiet=False)
    except Exception as exc:
        raise RuntimeError(
            "Could not download the Wikipedia dataset from Kaggle. "
            "Check KAGGLE_USERNAME, KAGGLE_KEY, and KAGGLE_DATASET."
        ) from exc

    if not target.exists():
        raise FileNotFoundError(f"Kaggle download completed, but {target} was not found.")
    return target


if __name__ == "__main__":
    print(ensure_wikipedia_dataset())