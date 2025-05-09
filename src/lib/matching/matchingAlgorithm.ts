/**
 * Skill Matching Algorithm
 * 
 * This algorithm is responsible for finding optimal skill matches between users
 * based on complementary skills, experience levels, preferences, and additional factors.
 * 
 * The matching process works as follows:
 * 1. Find users who are seeking skills that other users are offering
 * 2. Score potential matches based on multiple factors
 * 3. Apply filters based on user preferences
 * 4. Return sorted matches with match scores and explanations
 */

// import { Database } from '../../types/supabase';
import { calculateGeoDistance } from '../utils';

// Define the types for the matching algorithm
export type User = {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  location?: {
    latitude: number;
    longitude: number;
    description: string;
  };
  preferences: UserPreferences;
  rating?: number;
  offered_skills: Skill[];
  wanted_skills: Skill[];
};

export type Skill = {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  is_offering: boolean;
};

export type UserPreferences = {
  max_distance?: number; // in km
  remote_only?: boolean;
  experience_level_preference?: 'any' | 'similar' | 'higher' | 'lower';
  matching_threshold?: number; // minimum match score to consider (0-100)
};

export type MatchResult = {
  user: User;
  score: number;
  breakdown: {
    skillComplementScore: number;
    locationScore: number; 
    experienceLevelScore: number;
    ratingScore: number;
  };
  matchReasons: string[];
  matchedSkills: {
    offered: Skill[];
    wanted: Skill[];
  };
};

// Experience level numeric values for comparison
const EXPERIENCE_LEVELS = {
  'beginner': 1,
  'intermediate': 2,
  'advanced': 3,
  'expert': 4
};

// Match scoring weights (must sum to 1)
const SCORE_WEIGHTS = {
  skillComplement: 0.5,
  location: 0.2,
  experienceLevel: 0.2,
  userRating: 0.1
};

/**
 * Find optimal skill matches for a user
 * 
 * @param currentUser - The user to find matches for
 * @param potentialMatches - Pool of users to match against
 * @param limit - Maximum number of matches to return
 * @returns Array of match results sorted by score
 */
export function findMatches(
  currentUser: User,
  potentialMatches: User[],
  limit: number = 20
): MatchResult[] {
  // Filter out the current user from potential matches
  const otherUsers = potentialMatches.filter(user => user.id !== currentUser.id);
  
  // Calculate match scores for all potential users
  const matches = otherUsers.map(user => calculateMatchScore(currentUser, user))
    // Filter out matches below the threshold
    .filter(match => {
      const threshold = currentUser.preferences.matching_threshold || 50;
      return match.score >= threshold;
    })
    // Sort by descending score
    .sort((a, b) => b.score - a.score)
    // Limit results
    .slice(0, limit);
  
  return matches;
}

/**
 * Calculate match score between two users
 * 
 * @param user1 - First user
 * @param user2 - Second user 
 * @returns Match result with score and explanation
 */
export function calculateMatchScore(user1: User, user2: User): MatchResult {
  // Find complementary skills
  const matchedSkills = findComplementarySkills(user1, user2);
  
  // Calculate individual score components
  const skillComplementScore = calculateSkillComplementScore(matchedSkills);
  const locationScore = calculateLocationScore(user1, user2);
  const experienceLevelScore = calculateExperienceLevelScore(user1, user2, matchedSkills);
  const ratingScore = calculateRatingScore(user2);
  
  // Calculate weighted total score
  const totalScore = Math.round(
    (skillComplementScore * SCORE_WEIGHTS.skillComplement) +
    (locationScore * SCORE_WEIGHTS.location) +
    (experienceLevelScore * SCORE_WEIGHTS.experienceLevel) +
    (ratingScore * SCORE_WEIGHTS.userRating)
  );
  
  // Generate explanations for the match
  const matchReasons = generateMatchReasons(
    user1, 
    user2, 
    matchedSkills,
    { skillComplementScore, locationScore, experienceLevelScore, ratingScore }
  );
  
  return {
    user: user2,
    score: totalScore,
    breakdown: {
      skillComplementScore,
      locationScore,
      experienceLevelScore,
      ratingScore
    },
    matchReasons,
    matchedSkills
  };
}

/**
 * Find complementary skills between two users
 * (skills that one user is offering that the other user wants, and vice versa)
 * 
 * @param user1 - First user
 * @param user2 - Second user
 * @returns Object containing matched offered and wanted skills for both users
 */
export function findComplementarySkills(user1: User, user2: User): {
  offered: Skill[];
  wanted: Skill[];
} {
  // Skills user1 offers that user2 wants
  const user1OffersUser2Wants = user1.offered_skills.filter(offered => 
    user2.wanted_skills.some(wanted => 
      isSimilarSkill(offered, wanted)
    )
  );
  
  // Skills user2 offers that user1 wants
  const user2OffersUser1Wants = user2.offered_skills.filter(offered => 
    user1.wanted_skills.some(wanted => 
      isSimilarSkill(offered, wanted)
    )
  );
  
  return {
    offered: user1OffersUser2Wants.concat(user2OffersUser1Wants),
    wanted: user2.wanted_skills.filter(wanted => 
      user1OffersUser2Wants.some(offered => isSimilarSkill(offered, wanted))
    ).concat(
      user1.wanted_skills.filter(wanted => 
        user2OffersUser1Wants.some(offered => isSimilarSkill(offered, wanted))
      )
    )
  };
}

/**
 * Determines if two skills are similar enough to be considered a match
 * 
 * @param skill1 - First skill
 * @param skill2 - Second skill 
 * @returns True if skills are similar
 */
export function isSimilarSkill(skill1: Skill, skill2: Skill): boolean {
  // Exact match by name
  if (skill1.name.toLowerCase() === skill2.name.toLowerCase()) {
    return true;
  }
  
  // Match by category and subcategory
  if (skill1.category === skill2.category) {
    // If both have subcategories and they match
    if (skill1.subcategory && skill2.subcategory && 
        skill1.subcategory === skill2.subcategory) {
      return true;
    }
    
    // Future enhancement: use NLP to detect similar skills
    // This would require integrating a text similarity algorithm
  }
  
  return false;
}

/**
 * Calculate score based on number and quality of complementary skills
 * 
 * @param matchedSkills - Object containing matched skills
 * @returns Score from 0-100
 */
export function calculateSkillComplementScore(matchedSkills: {
  offered: Skill[];
  wanted: Skill[];
}): number {
  if (matchedSkills.offered.length === 0) {
    return 0;
  }
  
  // Base score based on number of matched skills (up to 5 skills)
  const baseScore = Math.min(matchedSkills.offered.length, 5) * 15;
  
  // Bonus for multi-directional skill exchange (both users offering something)
  const bidirectionalBonus = 
    new Set(matchedSkills.offered.map(s => s.is_offering)).size > 1 ? 25 : 0;
  
  // Calculate score, capped at 100
  return Math.min(baseScore + bidirectionalBonus, 100);
}

/**
 * Calculate score based on location compatibility
 * 
 * @param user1 - First user
 * @param user2 - Second user
 * @returns Score from 0-100
 */
export function calculateLocationScore(user1: User, user2: User): number {
  // If either user prefers remote only
  if (user1.preferences.remote_only || user2.preferences.remote_only) {
    return 100; // Perfect match for remote
  }
  
  // If either user doesn't have location data
  if (!user1.location || !user2.location) {
    return 50; // Neutral score
  }
  
  // Calculate distance between users
  const distance = calculateGeoDistance(
    user1.location.latitude,
    user1.location.longitude,
    user2.location.latitude,
    user2.location.longitude
  );
  
  // Get maximum acceptable distance (default 50km)
  const maxDistance = user1.preferences.max_distance || 50;
  
  // Score decreases linearly with distance
  return Math.max(0, Math.round(100 - (distance / maxDistance) * 100));
}

/**
 * Calculate score based on experience level compatibility
 * 
 * @param user1 - First user
 * @param user2 - Second user
 * @param matchedSkills - Object containing matched skills
 * @returns Score from 0-100
 */
export function calculateExperienceLevelScore(
  user1: User, 
  user2: User,
  matchedSkills: {
    offered: Skill[];
    wanted: Skill[];
  }
): number {
  // No matched skills means no basis for experience comparison
  if (matchedSkills.offered.length === 0) {
    return 50; // Neutral score
  }
  
  const preference = user1.preferences.experience_level_preference || 'any';
  
  // If user doesn't care about experience level
  if (preference === 'any') {
    return 90; // High score but not perfect
  }
  
  // Calculate average experience level for matched skills
  const user1Skills = matchedSkills.offered.filter(s => !s.is_offering); // Skills offered by user1
  const user2Skills = matchedSkills.offered.filter(s => s.is_offering); // Skills offered by user2
  
  if (user1Skills.length === 0 || user2Skills.length === 0) {
    return 60; // Only one-way matching, moderately good
  }
  
  const user1Level = getAverageExperienceLevel(user1Skills);
  const user2Level = getAverageExperienceLevel(user2Skills);
  
  // Score based on preference
  switch (preference) {
    case 'similar':
      // Higher score for closer experience levels
      return 100 - Math.abs(user1Level - user2Level) * 25;
    case 'higher':
      // Higher score if user2 has higher experience
      return user2Level > user1Level 
        ? 100 - Math.max(0, 4 - (user2Level - user1Level)) * 20 
        : 50;
    case 'lower':
      // Higher score if user2 has lower experience
      return user2Level < user1Level 
        ? 100 - Math.max(0, 4 - (user1Level - user2Level)) * 20 
        : 50;
    default:
      return 70;
  }
}

/**
 * Calculate average experience level for a set of skills
 * 
 * @param skills - Array of skills
 * @returns Average experience level as a number
 */
function getAverageExperienceLevel(skills: Skill[]): number {
  if (skills.length === 0) return 0;
  
  const sum = skills.reduce((total, skill) => {
    return total + EXPERIENCE_LEVELS[skill.proficiency_level];
  }, 0);
  
  return sum / skills.length;
}

/**
 * Calculate score based on user rating
 * 
 * @param user - User to evaluate
 * @returns Score from 0-100
 */
export function calculateRatingScore(user: User): number {
  // If user has no rating yet
  if (!user.rating) {
    return 70; // Default score for no rating
  }
  
  // Convert 5-star rating to 0-100 scale
  return Math.round((user.rating / 5) * 100);
}

/**
 * Generate human-readable explanations for a match
 * 
 * @param user1 - First user
 * @param user2 - Second user
 * @param matchedSkills - Object containing matched skills
 * @param scores - Component scores
 * @returns Array of reason strings
 */
export function generateMatchReasons(
  user1: User,
  user2: User,
  matchedSkills: {
    offered: Skill[];
    wanted: Skill[];
  },
  scores: {
    skillComplementScore: number;
    locationScore: number;
    experienceLevelScore: number;
    ratingScore: number;
  }
): string[] {
  const reasons: string[] = [];
  
  // Skill complementarity reasons
  if (matchedSkills.offered.length > 0) {
    const user2OffersCount = matchedSkills.offered.filter(s => s.is_offering).length;
    const user1OffersCount = matchedSkills.offered.filter(s => !s.is_offering).length;
    
    if (user2OffersCount > 0 && user1OffersCount > 0) {
      reasons.push(`You have ${user1OffersCount} skills they want and they have ${user2OffersCount} skills you want`);
    } else if (user2OffersCount > 0) {
      reasons.push(`They have ${user2OffersCount} skills you're looking for`);
    } else {
      reasons.push(`You have ${user1OffersCount} skills they're looking for`);
    }
    
    // Add specific skill names if not too many
    if (matchedSkills.offered.length <= 3) {
      const skillNames = matchedSkills.offered.map(s => s.name).join(', ');
      reasons.push(`Matching skills include: ${skillNames}`);
    }
  }
  
  // Location compatibility
  if (scores.locationScore >= 80) {
    if (user1.preferences.remote_only || user2.preferences.remote_only) {
      reasons.push('Both users are open to remote skill exchanges');
    } else if (user1.location && user2.location) {
      const distance = calculateGeoDistance(
        user1.location.latitude,
        user1.location.longitude,
        user2.location.latitude,
        user2.location.longitude
      );
      reasons.push(`Located only ${Math.round(distance)}km away from you`);
    }
  }
  
  // Experience level compatibility
  if (scores.experienceLevelScore >= 80) {
    const preference = user1.preferences.experience_level_preference;
    
    switch(preference) {
      case 'similar':
        reasons.push('Has a similar experience level to you');
        break;
      case 'higher':
        reasons.push('Has more experience in the skills you want to learn');
        break;
      case 'lower':
        reasons.push('Is looking to learn at your expertise level');
        break;
      default:
        if (scores.experienceLevelScore > 85) {
          reasons.push('Experience levels are highly compatible');
        }
    }
  }
  
  // User rating
  if (user2.rating && user2.rating >= 4.5) {
    reasons.push(`Highly rated user (${user2.rating}/5 stars)`);
  } else if (user2.rating && user2.rating >= 4.0) {
    reasons.push(`Well-rated user (${user2.rating}/5 stars)`);
  }
  
  return reasons;
}

/**
 * Filter matches based on user preferences
 * 
 * @param matches - Array of match results
 * @param preferences - User preferences
 * @returns Filtered array of match results
 */
export function filterMatchesByPreferences(
  matches: MatchResult[],
  preferences: UserPreferences
): MatchResult[] {
  return matches.filter(match => {
    // Apply minimum match score threshold
    if (preferences.matching_threshold && match.score < preferences.matching_threshold) {
      return false;
    }
    
    // Filter by max distance if applicable
    if (!preferences.remote_only && 
        preferences.max_distance && 
        match.breakdown.locationScore < 50) {
      return false;
    }
    
    return true;
  });
}

/**
 * Sort matches by specified criteria
 * 
 * @param matches - Array of match results
 * @param sortBy - Sorting criteria
 * @returns Sorted array of match results
 */
export function sortMatches(
  matches: MatchResult[],
  sortBy: 'score' | 'skillComplement' | 'location' | 'rating' = 'score'
): MatchResult[] {
  switch(sortBy) {
    case 'skillComplement':
      return [...matches].sort((a, b) => 
        b.breakdown.skillComplementScore - a.breakdown.skillComplementScore
      );
    case 'location':
      return [...matches].sort((a, b) => 
        b.breakdown.locationScore - a.breakdown.locationScore
      );
    case 'rating':
      return [...matches].sort((a, b) => 
        (b.user.rating || 0) - (a.user.rating || 0)
      );
    case 'score':
    default:
      return [...matches].sort((a, b) => b.score - a.score);
  }
}

const matchingAlgorithm = {
  findMatches,
  calculateMatchScore,
  findComplementarySkills,
  calculateSkillComplementScore,
  calculateLocationScore,
  calculateExperienceLevelScore,
  calculateRatingScore,
  generateMatchReasons,
  filterMatchesByPreferences,
  sortMatches
};

export default matchingAlgorithm;
