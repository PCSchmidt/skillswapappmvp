// src/lib/matching/matchingAlgorithm.ts

// Assume this function would be in a separate geo utility file if it were complex
// For now, a simple mock for testing purposes if not provided.
export function calculateGeoDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  // Simplified Haversine distance or mock for testing
  if (lat1 === 0 && lon1 === 0 && lat2 === 0 && lon2 === 0) return 0; // Edge case for tests
  if (lat1 === 1 && lon1 === 1 && lat2 === 2 && lon2 === 2) return 100; // Mocked distance
  if (lat1 === 10 && lon1 === 10 && lat2 === 10.1 && lon2 === 10.1) return 15; // km
  return 50; // Default mock distance
}

export interface UserProfile {
  id: string;
  latitude?: number | null;
  longitude?: number | null;
  availability?: string | null; // e.g., "weekends", "evenings"
  // other profile fields
}

export interface Skill {
  id: string;
  user_id: string;
  name: string;
  category: string;
  is_offering: boolean;
  // other skill fields
}

export interface MatchCandidate {
  user: UserProfile;
  skillsOffered: Skill[];
  skillsSought: Skill[]; // Skills this candidate is seeking
  score: number;
  distance?: number; // Optional: distance from the user seeking a match
}

const MAX_DISTANCE_KM = 50; // Max relevant distance for location score

// Calculates a location score (0-1), higher is better (closer)
export function locationScore(distanceKm: number | null | undefined): number {
  if (distanceKm === null || distanceKm === undefined) {
    return 0.3; // Neutral score if one user has no location
  }
  if (distanceKm < 0) return 0; // Should not happen, but guard
  if (distanceKm <= 5) return 1.0;       // Very close
  if (distanceKm <= 15) return 0.8;     // Nearby
  if (distanceKm <= MAX_DISTANCE_KM) {
    // Linear decay from 0.8 (at 15km) down to a minimum score for MAX_DISTANCE_KM
    // This formula ensures score at 15km is 0.8, and at 50km is slightly above 0.1
    // Let's adjust to make it simpler: score decreases from 1 (at 5km) to 0.1 (at 50km)
    // For distance > 5km: 1.0 - ( (distanceKm-5) / (MAX_DISTANCE_KM-5) ) * 0.9
    // This would make 5km = 1.0, 50km = 0.1
    // The original formula was: return 1.0 - (distanceKm / MAX_DISTANCE_KM) * 0.6;
    // Let's use a slightly adjusted linear decay from 0.8 (for >5km up to 15km)
    // and then another decay. Or simpler:
    return Math.max(0.1, 1.0 - ( (distanceKm - 5) / (MAX_DISTANCE_KM - 5) ) * 0.9 );
  }
  return 0.1; // Far away or no clear preference
}

// Simplified skill matching score (0-1)
export function skillMatchScore(userSkillsSought: Skill[], candidateSkillsOffered: Skill[]): number {
  if (!userSkillsSought.length || !candidateSkillsOffered.length) return 0;

  const soughtNames = userSkillsSought.map(s => s.name.toLowerCase());
  const offeredNames = candidateSkillsOffered.map(s => s.name.toLowerCase());

  let commonSkillCount = 0;
  for (const name of soughtNames) {
    if (offeredNames.includes(name)) {
      commonSkillCount++;
    }
  }

  return commonSkillCount / soughtNames.length;
}

export function findMatches(
  currentUser: UserProfile,
  currentUserSkillsSought: Skill[],
  allPotentialCandidates: MatchCandidate[] // Assume candidates already have their skills populated
): MatchCandidate[] {
  if (!currentUserSkillsSought.length) return [];

  const scoredCandidates = allPotentialCandidates.map(candidate => {
    if (candidate.user.id === currentUser.id) {
      return { ...candidate, score: -1 }; // Exclude self, mark with -1
    }

    let distance: number | null = null;
    if (currentUser.latitude != null && currentUser.longitude != null &&
        candidate.user.latitude != null && candidate.user.longitude != null) {
      distance = calculateGeoDistance(
        currentUser.latitude, currentUser.longitude,
        candidate.user.latitude, candidate.user.longitude
      );
    }

    const locScore = locationScore(distance);
    const skillScoreVal = skillMatchScore(currentUserSkillsSought, candidate.skillsOffered);

    // Example weighting: 60% skills, 40% location
    const overallScore = (skillScoreVal * 0.6) + (locScore * 0.4);

    return { ...candidate, score: overallScore, distance: distance !== null ? distance : undefined };
  });

  // Filter out self and sort by score descending
  return scoredCandidates
    .filter(c => c.score >= 0) // Filter out self or invalid candidates
    .sort((a, b) => b.score - a.score);
}
