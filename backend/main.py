"""
SkillSwap AI Backend
FastAPI service for embedding-based skill matching.
"""

import os
import logging
from contextlib import asynccontextmanager
from typing import Optional

import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client

load_dotenv()

logger = logging.getLogger("skillswap")
logging.basicConfig(level=logging.INFO)

# --- Globals ---
model: Optional[SentenceTransformer] = None
supabase: Optional[Client] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the embedding model and Supabase client on startup."""
    global model, supabase

    logger.info("Loading sentence-transformers model…")
    model = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("Model loaded.")

    url = os.environ.get("SUPABASE_URL", "")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
    if url and key:
        supabase = create_client(url, key)
        logger.info("Supabase client initialised.")
    else:
        logger.warning("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — running without database.")

    yield

    model = None
    supabase = None


app = FastAPI(
    title="SkillSwap AI",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow the Next.js frontend
allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://skillswapappmvp.vercel.app",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Schemas ---


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    database_connected: bool


class EmbedRequest(BaseModel):
    texts: list[str]


class EmbedResponse(BaseModel):
    embeddings: list[list[float]]
    dimensions: int


class MatchRequest(BaseModel):
    skill_id: str
    user_id: Optional[str] = None
    top_k: int = 5


class MatchResult(BaseModel):
    skill_id: str
    title: str
    category: str
    user_name: Optional[str]
    user_id: str
    score: float
    explanation: str


class MatchResponse(BaseModel):
    matches: list[MatchResult]
    query_skill: str


# --- Helpers ---


def _embed(texts: list[str]) -> np.ndarray:
    """Generate embeddings for a list of texts."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return model.encode(texts, normalize_embeddings=True)


def _skill_text(skill: dict) -> str:
    """Build a single text representation of a skill for embedding."""
    parts = [skill.get("title", "")]
    if skill.get("description"):
        parts.append(skill["description"])
    if skill.get("category"):
        parts.append(f"Category: {skill['category']}")
    if skill.get("subcategory"):
        parts.append(f"Subcategory: {skill['subcategory']}")
    if skill.get("experience_level"):
        parts.append(f"Level: {skill['experience_level']}")
    return " | ".join(parts)


def _explain_match(query_skill: dict, candidate: dict, score: float) -> str:
    """Generate a human-readable explanation for why a match was suggested."""
    reasons = []

    if query_skill.get("category") == candidate.get("category"):
        reasons.append(f"Same category ({candidate['category']})")
    else:
        reasons.append(f"Cross-category match ({query_skill.get('category')} ↔ {candidate.get('category')})")

    pct = int(score * 100)
    if pct >= 90:
        reasons.append(f"{pct}% semantic similarity — highly complementary skills")
    elif pct >= 70:
        reasons.append(f"{pct}% semantic similarity — strong relevance")
    else:
        reasons.append(f"{pct}% semantic similarity")

    if candidate.get("is_offering") and not query_skill.get("is_offering"):
        reasons.append("They're offering what you're seeking")
    elif not candidate.get("is_offering") and query_skill.get("is_offering"):
        reasons.append("They're seeking what you're offering")

    return ". ".join(reasons) + "."


# --- Routes ---


@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="ok",
        model_loaded=model is not None,
        database_connected=supabase is not None,
    )


@app.post("/api/skills/embed", response_model=EmbedResponse)
async def embed_skills(req: EmbedRequest):
    """Generate embeddings for a list of text strings."""
    if not req.texts:
        raise HTTPException(status_code=400, detail="texts must not be empty")
    if len(req.texts) > 100:
        raise HTTPException(status_code=400, detail="Maximum 100 texts per request")

    vectors = _embed(req.texts)
    return EmbedResponse(
        embeddings=vectors.tolist(),
        dimensions=vectors.shape[1],
    )


@app.post("/api/skills/match", response_model=MatchResponse)
async def match_skills(req: MatchRequest):
    """Find the top-K most similar skills to a given skill."""
    if supabase is None:
        raise HTTPException(status_code=503, detail="Database not connected")

    # Fetch the query skill
    result = supabase.table("skills").select("*").eq("id", req.skill_id).single().execute()
    query_skill = result.data
    if not query_skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    # Fetch candidate skills (active, excluding same user)
    query = (
        supabase.table("skills")
        .select("*, users:user_id(id, full_name)")
        .eq("is_active", True)
        .neq("id", req.skill_id)
    )
    if req.user_id:
        query = query.neq("user_id", req.user_id)

    candidates_result = query.execute()
    candidates = candidates_result.data or []

    if not candidates:
        return MatchResponse(matches=[], query_skill=query_skill["title"])

    # Check for pre-computed embeddings first
    query_embedding = query_skill.get("embedding")
    candidate_embeddings = []
    needs_compute = False

    if query_embedding is None:
        needs_compute = True
    else:
        for c in candidates:
            if c.get("embedding") is None:
                needs_compute = True
                break
            candidate_embeddings.append(c["embedding"])

    # Compute embeddings on-the-fly if not stored
    if needs_compute:
        all_texts = [_skill_text(query_skill)] + [_skill_text(c) for c in candidates]
        all_vectors = _embed(all_texts)
        query_vector = all_vectors[0]
        candidate_vectors = all_vectors[1:]
    else:
        query_vector = np.array(query_embedding)
        candidate_vectors = np.array(candidate_embeddings)

    # Cosine similarity (vectors are already L2-normalised)
    scores = candidate_vectors @ query_vector

    # Rank and take top-K
    top_indices = np.argsort(scores)[::-1][: req.top_k]

    matches = []
    for idx in top_indices:
        c = candidates[idx]
        score = float(scores[idx])
        if score < 0.1:
            continue  # skip very low relevance

        user_info = c.get("users") or {}
        matches.append(
            MatchResult(
                skill_id=c["id"],
                title=c["title"],
                category=c["category"],
                user_name=user_info.get("full_name"),
                user_id=c["user_id"],
                score=round(score, 4),
                explanation=_explain_match(query_skill, c, score),
            )
        )

    return MatchResponse(matches=matches, query_skill=query_skill["title"])
