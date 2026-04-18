"""Tests for internal helper functions."""

from backend.main import _skill_text, _explain_match


def test_skill_text_combines_fields():
    skill = {
        "title": "Python",
        "description": "Programming language",
        "category": "Technology",
        "subcategory": "Languages",
        "experience_level": "Advanced",
    }
    text = _skill_text(skill)
    assert "Python" in text
    assert "Programming language" in text
    assert "Technology" in text
    assert "Languages" in text
    assert "Advanced" in text


def test_skill_text_handles_missing_fields():
    skill = {"title": "Guitar"}
    text = _skill_text(skill)
    assert text == "Guitar"


def test_explain_match_same_category():
    q = {"category": "Technology", "is_offering": True}
    c = {"category": "Technology", "is_offering": False}
    explanation = _explain_match(q, c, 0.85)
    assert "Same category" in explanation
    assert "85%" in explanation
    assert "seeking" in explanation or "offering" in explanation


def test_explain_match_cross_category():
    q = {"category": "Technology", "is_offering": True}
    c = {"category": "Music", "is_offering": True}
    explanation = _explain_match(q, c, 0.45)
    assert "Cross-category" in explanation
