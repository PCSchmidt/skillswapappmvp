"""Fixtures for SkillSwap AI backend tests."""

import pytest
from unittest.mock import MagicMock, patch
from fastapi.testclient import TestClient


@pytest.fixture(autouse=True)
def _patch_model_and_db():
    """Patch the global model and supabase client for all tests."""
    import backend.main as mod

    from sentence_transformers import SentenceTransformer

    real_model = SentenceTransformer("all-MiniLM-L6-v2")
    mod.model = real_model
    mod.supabase = MagicMock()
    yield
    mod.model = None
    mod.supabase = None


@pytest.fixture
def client():
    """FastAPI test client with model loaded and DB mocked."""
    from backend.main import app

    with TestClient(app, raise_server_exceptions=False) as c:
        yield c


@pytest.fixture
def sample_skills():
    """Sample skill rows as they would come from Supabase."""
    return [
        {
            "id": "skill-1",
            "user_id": "user-a",
            "title": "Python Programming",
            "description": "Expert in Python, data science, and ML pipelines",
            "category": "Technology",
            "subcategory": "Programming",
            "experience_level": "Advanced",
            "is_offering": True,
            "is_active": True,
            "embedding": None,
            "users": {"id": "user-a", "full_name": "Alice"},
        },
        {
            "id": "skill-2",
            "user_id": "user-b",
            "title": "Machine Learning",
            "description": "Deep learning, NLP, and model deployment",
            "category": "Technology",
            "subcategory": "AI/ML",
            "experience_level": "Advanced",
            "is_offering": False,
            "is_active": True,
            "embedding": None,
            "users": {"id": "user-b", "full_name": "Bob"},
        },
        {
            "id": "skill-3",
            "user_id": "user-c",
            "title": "Guitar Lessons",
            "description": "Acoustic and electric guitar for beginners",
            "category": "Music",
            "subcategory": "Instruments",
            "experience_level": "Intermediate",
            "is_offering": True,
            "is_active": True,
            "embedding": None,
            "users": {"id": "user-c", "full_name": "Carol"},
        },
    ]
