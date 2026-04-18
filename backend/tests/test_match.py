"""Tests for the /api/skills/match endpoint."""

from unittest.mock import MagicMock


def _mock_supabase_for_match(supabase_mock, query_skill, candidates):
    """Wire up the chained Supabase query mock for a match request."""
    query_table = MagicMock()
    cand_table = MagicMock()

    # Query skill: .table().select("*").eq("id", X).single().execute()
    query_table.select.return_value.eq.return_value.single.return_value.execute.return_value = (
        MagicMock(data=query_skill)
    )

    # Candidates: .table().select(...).eq("is_active", True).neq("id", X)[.neq("user_id", Y)].execute()
    neq_mock = MagicMock()
    neq_mock.execute.return_value = MagicMock(data=candidates)
    neq_mock.neq.return_value = neq_mock  # extra .neq() chains back to itself
    cand_table.select.return_value.eq.return_value.neq.return_value = neq_mock

    call_count = {"n": 0}

    def table_side_effect(name):
        call_count["n"] += 1
        if call_count["n"] == 1:
            return query_table
        return cand_table

    supabase_mock.table = table_side_effect


def test_match_returns_ranked_results(client, sample_skills):
    import backend.main as mod

    query_skill = sample_skills[0]  # Python Programming
    candidates = sample_skills[1:]  # ML + Guitar

    _mock_supabase_for_match(mod.supabase, query_skill, candidates)

    resp = client.post(
        "/api/skills/match",
        json={"skill_id": "skill-1", "user_id": "user-a", "top_k": 5},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["query_skill"] == "Python Programming"
    assert len(data["matches"]) >= 1

    # ML should rank higher than Guitar for a Python query
    titles = [m["title"] for m in data["matches"]]
    if "Machine Learning" in titles and "Guitar Lessons" in titles:
        ml_idx = titles.index("Machine Learning")
        guitar_idx = titles.index("Guitar Lessons")
        assert ml_idx < guitar_idx, "ML should rank higher than Guitar for a Python skill"


def test_match_scores_are_valid(client, sample_skills):
    import backend.main as mod

    _mock_supabase_for_match(mod.supabase, sample_skills[0], sample_skills[1:])

    resp = client.post(
        "/api/skills/match",
        json={"skill_id": "skill-1", "top_k": 5},
    )
    data = resp.json()
    for match in data["matches"]:
        assert 0.0 <= match["score"] <= 1.0, f"Score out of range: {match['score']}"
        assert len(match["explanation"]) > 0


def test_match_respects_top_k(client, sample_skills):
    import backend.main as mod

    _mock_supabase_for_match(mod.supabase, sample_skills[0], sample_skills[1:])

    resp = client.post(
        "/api/skills/match",
        json={"skill_id": "skill-1", "top_k": 1},
    )
    data = resp.json()
    assert len(data["matches"]) <= 1


def test_match_skill_not_found(client):
    import backend.main as mod

    _mock_supabase_for_match(mod.supabase, None, [])

    resp = client.post(
        "/api/skills/match",
        json={"skill_id": "nonexistent"},
    )
    assert resp.status_code == 404


def test_match_no_candidates(client, sample_skills):
    import backend.main as mod

    _mock_supabase_for_match(mod.supabase, sample_skills[0], [])

    resp = client.post(
        "/api/skills/match",
        json={"skill_id": "skill-1"},
    )
    data = resp.json()
    assert data["matches"] == []


def test_match_includes_explanation(client, sample_skills):
    import backend.main as mod

    _mock_supabase_for_match(mod.supabase, sample_skills[0], sample_skills[1:])

    resp = client.post(
        "/api/skills/match",
        json={"skill_id": "skill-1", "top_k": 5},
    )
    data = resp.json()
    for match in data["matches"]:
        assert "similarity" in match["explanation"].lower() or "category" in match["explanation"].lower()
