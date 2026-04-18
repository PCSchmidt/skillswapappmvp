"""Tests for the /api/skills/embed endpoint."""

import numpy as np


def test_embed_single_text(client):
    resp = client.post("/api/skills/embed", json={"texts": ["Python programming"]})
    assert resp.status_code == 200
    data = resp.json()
    assert data["dimensions"] == 384
    assert len(data["embeddings"]) == 1
    assert len(data["embeddings"][0]) == 384


def test_embed_multiple_texts(client):
    texts = ["Machine learning", "Guitar lessons", "Cooking"]
    resp = client.post("/api/skills/embed", json={"texts": texts})
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["embeddings"]) == 3


def test_embed_returns_normalized_vectors(client):
    resp = client.post("/api/skills/embed", json={"texts": ["test"]})
    vec = np.array(resp.json()["embeddings"][0])
    norm = np.linalg.norm(vec)
    assert abs(norm - 1.0) < 0.01, f"Expected unit vector, got norm={norm}"


def test_embed_empty_list_returns_400(client):
    resp = client.post("/api/skills/embed", json={"texts": []})
    assert resp.status_code == 400


def test_embed_too_many_returns_400(client):
    resp = client.post("/api/skills/embed", json={"texts": ["x"] * 101})
    assert resp.status_code == 400
