"""
Seed demo data for SkillSwap MVP.
Creates 3 demo users with 15 realistic skills, then generates
embeddings via the AI backend so skill matching works.

Usage:
  python scripts/seed_demo_data.py
"""

import os
import sys
import json
import uuid
import requests
from pathlib import Path

# Load .env.local
env_path = Path(__file__).resolve().parent.parent / ".env.local"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            os.environ.setdefault(key.strip(), value.strip())

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
AI_BACKEND = os.environ.get(
    "NEXT_PUBLIC_AI_BACKEND_URL",
    "https://skillswapappmvp-production.up.railway.app",
)

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

# --- Demo Users ---
USERS = [
    {
        "id": str(uuid.uuid4()),
        "email": "alex.demo@skillswap.test",
        "full_name": "Alex Rivera",
        "bio": "Full-stack developer by day, woodworker by weekend. Always looking to learn new creative skills.",
        "location_city": "Austin",
        "location_state": "TX",
        "location_country": "US",
        "is_verified": True,
        "account_status": "active",
    },
    {
        "id": str(uuid.uuid4()),
        "email": "jordan.demo@skillswap.test",
        "full_name": "Jordan Patel",
        "bio": "Graphic designer and amateur chef. I believe everyone has something valuable to teach.",
        "location_city": "Austin",
        "location_state": "TX",
        "location_country": "US",
        "is_verified": True,
        "account_status": "active",
    },
    {
        "id": str(uuid.uuid4()),
        "email": "sam.demo@skillswap.test",
        "full_name": "Sam Chen",
        "bio": "Music teacher and yoga instructor. Passionate about mindfulness and creative expression.",
        "location_city": "Austin",
        "location_state": "TX",
        "location_country": "US",
        "is_verified": True,
        "account_status": "active",
    },
]

# --- Demo Skills (user_index, skill_data) ---
SKILLS = [
    # Alex's skills (offering)
    (0, {
        "title": "JavaScript & React Development",
        "description": "I can teach modern JavaScript, React hooks, state management with Redux or Zustand, and building full-stack apps with Next.js. 5+ years of professional experience.",
        "category": "Technology",
        "subcategory": "Web Development",
        "experience_level": "expert",
        "is_offering": True,
        "is_remote_friendly": True,
        "availability": json.dumps(["Monday", "Wednesday", "Saturday"]),
    }),
    (0, {
        "title": "Python for Data Analysis",
        "description": "Pandas, NumPy, matplotlib, and Jupyter notebooks. I'll help you go from raw data to insights with clean, reproducible Python code.",
        "category": "Technology",
        "subcategory": "Data Science",
        "experience_level": "intermediate",
        "is_offering": True,
        "is_remote_friendly": True,
        "availability": json.dumps(["Tuesday", "Thursday"]),
    }),
    (0, {
        "title": "Custom Furniture Building",
        "description": "Hand-built tables, shelves, and small furniture from reclaimed wood. I can teach basic joinery, finishing techniques, and tool safety.",
        "category": "Arts & Crafts",
        "subcategory": "Woodworking",
        "experience_level": "intermediate",
        "is_offering": True,
        "is_remote_friendly": False,
        "availability": json.dumps(["Saturday", "Sunday"]),
    }),
    # Alex seeking
    (0, {
        "title": "Watercolor Painting",
        "description": "Looking for someone to teach me watercolor basics — color mixing, washes, and simple landscape techniques.",
        "category": "Arts & Crafts",
        "subcategory": "Painting",
        "experience_level": "beginner",
        "is_offering": False,
        "is_remote_friendly": False,
        "availability": json.dumps(["Sunday"]),
    }),
    (0, {
        "title": "Spanish Conversation Practice",
        "description": "I know basic Spanish from school but need conversational practice. Looking for a native speaker or fluent partner.",
        "category": "Languages",
        "subcategory": "Spanish",
        "experience_level": "beginner",
        "is_offering": False,
        "is_remote_friendly": True,
        "availability": json.dumps(["Monday", "Wednesday", "Friday"]),
    }),
    # Jordan's skills (offering)
    (1, {
        "title": "Brand Identity & Logo Design",
        "description": "Professional logo design, brand guidelines, and visual identity systems. I use Figma, Illustrator, and have designed for 20+ small businesses.",
        "category": "Technology",
        "subcategory": "UI/UX Design",
        "experience_level": "expert",
        "is_offering": True,
        "is_remote_friendly": True,
        "availability": json.dumps(["Monday", "Tuesday", "Thursday"]),
    }),
    (1, {
        "title": "Sourdough Bread Baking",
        "description": "From maintaining a starter to shaping a perfect boule. I'll teach you the science and art of artisan sourdough, including troubleshooting common issues.",
        "category": "Culinary",
        "subcategory": "Baking",
        "experience_level": "expert",
        "is_offering": True,
        "is_remote_friendly": False,
        "availability": json.dumps(["Saturday", "Sunday"]),
    }),
    (1, {
        "title": "Watercolor & Gouache Illustration",
        "description": "Botanical illustration, portraits, and abstract art with watercolor and gouache. All experience levels welcome.",
        "category": "Arts & Crafts",
        "subcategory": "Painting",
        "experience_level": "intermediate",
        "is_offering": True,
        "is_remote_friendly": False,
        "availability": json.dumps(["Wednesday", "Friday"]),
    }),
    # Jordan seeking
    (1, {
        "title": "Basic Web Development",
        "description": "I want to build a portfolio website for my design work. Need help with HTML, CSS, and maybe a static site generator.",
        "category": "Technology",
        "subcategory": "Web Development",
        "experience_level": "beginner",
        "is_offering": False,
        "is_remote_friendly": True,
        "availability": json.dumps(["Tuesday", "Thursday"]),
    }),
    (1, {
        "title": "Indoor Herb Gardening",
        "description": "Want to grow fresh herbs year-round in my apartment. Looking for someone who knows about grow lights, soil, and common mistakes.",
        "category": "Home Improvement",
        "subcategory": "Gardening",
        "experience_level": "beginner",
        "is_offering": False,
        "is_remote_friendly": True,
        "availability": json.dumps(["Saturday"]),
    }),
    # Sam's skills (offering)
    (2, {
        "title": "Guitar Lessons (Acoustic & Electric)",
        "description": "15 years of playing, 5 years teaching. Covers fingerpicking, chord progressions, music theory basics, and song writing. Beginner to intermediate students.",
        "category": "Music",
        "subcategory": "Guitar",
        "experience_level": "expert",
        "is_offering": True,
        "is_remote_friendly": True,
        "availability": json.dumps(["Monday", "Wednesday", "Friday"]),
    }),
    (2, {
        "title": "Yoga & Meditation Fundamentals",
        "description": "Hatha and Vinyasa flow, breathwork, and guided meditation. Certified RYT-200 instructor. Great for stress relief and flexibility.",
        "category": "Fitness & Wellness",
        "subcategory": "Yoga",
        "experience_level": "expert",
        "is_offering": True,
        "is_remote_friendly": True,
        "availability": json.dumps(["Tuesday", "Thursday", "Saturday"]),
    }),
    (2, {
        "title": "Conversational Spanish",
        "description": "Native heritage speaker. I can help with everyday conversation, slang, pronunciation, and cultural context. Relaxed, immersive style.",
        "category": "Languages",
        "subcategory": "Spanish",
        "experience_level": "expert",
        "is_offering": True,
        "is_remote_friendly": True,
        "availability": json.dumps(["Monday", "Wednesday"]),
    }),
    # Sam seeking
    (2, {
        "title": "Home Fermentation & Preserving",
        "description": "Want to learn kimchi, sauerkraut, pickles, and kombucha. Interested in the science behind fermentation.",
        "category": "Culinary",
        "subcategory": "Fermentation",
        "experience_level": "beginner",
        "is_offering": False,
        "is_remote_friendly": False,
        "availability": json.dumps(["Sunday"]),
    }),
    (2, {
        "title": "Photography Basics",
        "description": "I have a DSLR but only shoot on auto. Want to understand aperture, shutter speed, composition, and basic editing.",
        "category": "Arts & Crafts",
        "subcategory": "Drawing",
        "experience_level": "beginner",
        "is_offering": False,
        "is_remote_friendly": True,
        "availability": json.dumps(["Saturday", "Sunday"]),
    }),
]


def supabase_post(table: str, data: dict) -> dict:
    """Insert a row via Supabase REST API (service role bypasses RLS)."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    resp = requests.post(url, headers=HEADERS, json=data)
    if resp.status_code not in (200, 201):
        print(f"  ERROR inserting into {table}: {resp.status_code} {resp.text}")
        sys.exit(1)
    return resp.json()[0]


def supabase_patch(table: str, row_id: str, data: dict) -> None:
    """Update a row via Supabase REST API."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{row_id}"
    resp = requests.patch(url, headers=HEADERS, json=data)
    if resp.status_code not in (200, 204):
        print(f"  ERROR updating {table}/{row_id}: {resp.status_code} {resp.text}")


def create_auth_user(email: str, password: str = "DemoPass123!") -> str:
    """Create a user via Supabase Auth Admin API. Returns the user ID."""
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    resp = requests.post(url, headers=HEADERS, json={
        "email": email,
        "password": password,
        "email_confirm": True,
    })
    if resp.status_code not in (200, 201):
        print(f"  ERROR creating auth user {email}: {resp.status_code} {resp.text}")
        sys.exit(1)
    return resp.json()["id"]


def main():
    print("=== SkillSwap Demo Data Seeder ===\n")

    # 1. Create auth users (triggers public.users creation automatically)
    print("1. Creating demo users via Auth Admin API...")
    user_ids = []
    for u in USERS:
        uid = create_auth_user(u["email"])
        user_ids.append(uid)
        print(f"   + Auth user created: {u['full_name']} ({uid[:8]}...)")

    # 2. Insert public.users profiles (auth.users was created, now create public profile)
    print("\n2. Creating user profiles...")
    for i, u in enumerate(USERS):
        profile = {k: v for k, v in u.items() if k != "id"}
        profile["id"] = user_ids[i]
        row = supabase_post("users", profile)
        print(f"   + Created profile for {u['full_name']}")

    # 3. Insert skills
    print("\n3. Creating demo skills...")
    skill_rows = []
    for user_idx, skill_data in SKILLS:
        skill_data["user_id"] = user_ids[user_idx]
        row = supabase_post("skills", skill_data)
        skill_rows.append(row)
        tag = "OFFER" if row["is_offering"] else "SEEK"
        print(f"   + [{tag}] {row['title']}")

    # 4. Generate embeddings via AI backend
    print(f"\n4. Generating embeddings via {AI_BACKEND}...")
    texts = []
    for s in skill_rows:
        parts = [s["title"]]
        if s.get("description"):
            parts.append(s["description"])
        if s.get("category"):
            parts.append(f"Category: {s['category']}")
        if s.get("subcategory"):
            parts.append(f"Subcategory: {s['subcategory']}")
        if s.get("experience_level"):
            parts.append(f"Level: {s['experience_level']}")
        texts.append(" | ".join(parts))

    resp = requests.post(
        f"{AI_BACKEND}/api/skills/embed",
        json={"texts": texts},
        timeout=60,
    )
    if resp.status_code != 200:
        print(f"   WARNING: Embedding failed ({resp.status_code}). Skills created without vectors.")
        print(f"   {resp.text[:200]}")
    else:
        embeddings = resp.json()["embeddings"]
        print(f"   Got {len(embeddings)} embeddings ({resp.json()['dimensions']}d)")

        # 5. Store embeddings back into skills table
        print("\n5. Storing embeddings...")
        for i, skill in enumerate(skill_rows):
            vec_str = "[" + ",".join(str(v) for v in embeddings[i]) + "]"
            supabase_patch("skills", skill["id"], {"embedding": vec_str})
        print(f"   Updated {len(skill_rows)} skills with embeddings.")

    print("\n=== Done! ===")
    print(f"   {len(user_ids)} users, {len(skill_rows)} skills seeded.")
    print(f"   Browse at: https://skillswapappmvp.vercel.app/skills/browse")


if __name__ == "__main__":
    main()
