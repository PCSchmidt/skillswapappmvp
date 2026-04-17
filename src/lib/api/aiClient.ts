/**
 * AI Backend API Client
 * 
 * Client for calling the FastAPI skill matching service.
 * Reads the backend URL from NEXT_PUBLIC_AI_BACKEND_URL env var.
 */

const getBackendUrl = (): string => {
  return process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:8000';
};

export interface MatchResult {
  skill_id: string;
  title: string;
  category: string;
  user_name: string | null;
  user_id: string;
  score: number;
  explanation: string;
}

export interface MatchResponse {
  matches: MatchResult[];
  query_skill: string;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  database_connected: boolean;
}

/**
 * Find top-K similar skills to a given skill.
 */
export async function getSkillMatches(
  skillId: string,
  userId?: string,
  topK: number = 5
): Promise<MatchResponse> {
  const res = await fetch(`${getBackendUrl()}/api/skills/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      skill_id: skillId,
      user_id: userId,
      top_k: topK,
    }),
  });

  if (!res.ok) {
    throw new Error(`Match request failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Check AI backend health status.
 */
export async function getBackendHealth(): Promise<HealthResponse> {
  const res = await fetch(`${getBackendUrl()}/health`);

  if (!res.ok) {
    throw new Error(`Health check failed: ${res.status}`);
  }

  return res.json();
}
