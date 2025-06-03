/**
 * MatchingAlgorithm.ts
 * Core logic for matching users based on complementary skills
 */

import { SkillLevel, UserProfile, Skill } from '@/types';

// Extended types for matching

export interface MatchScore {
  score: number;
  complementaryScore: number;
  skillLevelCompatibility: number;
  categoryOverlap: number;
  reasons: string[];
}

export interface SkillMatch {
  offeredSkill: Skill;
  requestedSkill: Skill;
  user: UserProfile;
  matchScore: MatchScore;
}

/**
 * Calculate match score between a user's requested skill and another user's offered skill
 * 
 * @param requestedSkill The skill a user is looking for
 * @param offeredSkill The skill another user is offering
 * @returns A match score object with detailed scoring components
 */
export function calculateMatchScore(
  requestedSkill: Skill,
  offeredSkill: Skill
): MatchScore {
  // Initialize score components
  let complementaryScore = 0;
  let skillLevelCompatibility = 0;
  let categoryOverlap = 0;
  const reasons: string[] = [];

  // Complementary match (seeking vs offering)
  if (requestedSkill.type === 'seeking' && offeredSkill.type === 'offering') {
    complementaryScore = 1.0;
    reasons.push('Direct match between requested and offered skills');
  }

  // Category match
  if (requestedSkill.category === offeredSkill.category) {
    categoryOverlap = 1.0;
    reasons.push('Skills are in the same category');
  } else if (isRelatedCategory(requestedSkill.category, offeredSkill.category)) {
    categoryOverlap = 0.5;
    reasons.push('Skills are in related categories');
  }

  // Skill level compatibility
  const levelDifference = calculateLevelDifference(requestedSkill.level, offeredSkill.level);
  skillLevelCompatibility = 1.0 - (levelDifference / 3);
  if (levelDifference === 0) {
    reasons.push('Perfect skill level match');
  } else if (levelDifference <= 1) {
    reasons.push('Closely matched skill levels');
  } else {
    reasons.push('Significant skill level difference');
  }

  // Calculate final score as weighted average
  const finalScore = (
    (complementaryScore * 0.4) +
    (categoryOverlap * 0.4) +
    (skillLevelCompatibility * 0.2)
  );

  return {
    score: finalScore,
    complementaryScore,
    skillLevelCompatibility,
    categoryOverlap,
    reasons
  };
}

/**
 * Check if two categories are related
 */
function isRelatedCategory(category1: string, category2: string): boolean {
  const relatedCategories: Record<string, string[]> = {
    'programming': ['web-development', 'mobile-development', 'data-science'],
    'design': ['graphic-design', 'ui-design', 'ux-design'],
    'language': ['translation', 'writing', 'editing'],
    'music': ['production', 'instruments', 'vocals'],
    // Add more related category mappings
  };

  const related1 = relatedCategories[category1] || [];
  const related2 = relatedCategories[category2] || [];

  return related1.includes(category2) || related2.includes(category1);
}

/**
 * Calculate difference between skill levels
 */
function calculateLevelDifference(level1: SkillLevel, level2: SkillLevel): number {
  const levels: Record<SkillLevel, number> = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4
  };

  return Math.abs(levels[level1] - levels[level2]);
}

/**
 * Find the best matches for a user's requested skills
 * 
 * @param userRequestedSkills Skills the user is seeking
 * @param availableOfferedSkills Skills other users are offering
 * @param limit Maximum number of matches to return
 * @returns Sorted array of skill matches with scores
 */
export function findBestMatches(
  userRequestedSkills: Skill[],
  availableOfferedSkills: Skill[],
  limit: number = 10
): SkillMatch[] {
  const matches: SkillMatch[] = [];

  // For each skill the user is requesting
  for (const requestedSkill of userRequestedSkills) {
    // Find potential matches from other users' offered skills
    for (const offeredSkill of availableOfferedSkills) {
  // Skip skills offered by the same user
  if (requestedSkill.user_id === offeredSkill.user_id) continue;

      // Calculate match score
      const matchScore = calculateMatchScore(requestedSkill, offeredSkill);

      // Only include matches above a minimum threshold
      if (matchScore.score >= 0.4) {
        // Get user information (would normally come from a user store or prop)
        const user = { id: offeredSkill.user_id } as UserProfile; // Placeholder

        matches.push({
          requestedSkill,
          offeredSkill,
          user,
          matchScore
        });
      }
    }
  }

  // Sort matches by score (highest first)
  matches.sort((a, b) => b.matchScore.score - a.matchScore.score);

  // Return top N matches
  return matches.slice(0, limit);
}

/**
 * Find similar skills based on category, subcategory, and keywords
 * 
 * @param skill The skill to find similarities for
 * @param allSkills Pool of all available skills to search from
 * @param limit Maximum number of similar skills to return
 * @returns Array of similar skills with similarity scores
 */
export function findSimilarSkills(
  skill: Skill,
  allSkills: Skill[],
  limit: number = 5
): { skill: Skill; similarityScore: number }[] {
  const similarSkills: { skill: Skill; similarityScore: number }[] = [];
  
  // For each potential similar skill
  for (const potentialSimilar of allSkills) {
    // Skip the same skill
    if (potentialSimilar.id === skill.id) continue;
    
    let similarityScore = 0;
    
    // Same category
    if (potentialSimilar.category === skill.category) {
      similarityScore += 0.4;
    }
    
    // Same subcategory if available
    if (skill.subcategory && 
        potentialSimilar.subcategory && 
        potentialSimilar.subcategory === skill.subcategory) {
      similarityScore += 0.3;
    }
    
    // Keyword similarity in title and description
    const keywordSimilarity = calculateKeywordSimilarity(
      skill.title + " " + skill.description,
      potentialSimilar.title + " " + potentialSimilar.description
    );
    similarityScore += keywordSimilarity * 0.3;
    
    // Only include reasonably similar skills
    if (similarityScore >= 0.3) {
      similarSkills.push({
        skill: potentialSimilar,
        similarityScore
      });
    }
  }
  
  // Sort by similarity score (highest first)
  similarSkills.sort((a, b) => b.similarityScore - a.similarityScore);
  
  // Return top N similar skills
  return similarSkills.slice(0, limit);
}

/**
 * Calculate keyword similarity between two text strings
 * Uses a simplified bag-of-words approach
 */
function calculateKeywordSimilarity(text1: string, text2: string): number {
  // Normalize and split into words
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  // Count matching words
  const wordSet1 = new Set(words1);
  const wordSet2 = new Set(words2);
  
  let matchCount = 0;
  for (const word of wordSet1) {
    if (wordSet2.has(word)) {
      matchCount++;
    }
  }
  
  // Calculate similarity coefficient
  const totalUniqueWords = new Set([...wordSet1, ...wordSet2]).size;
  return totalUniqueWords > 0 ? matchCount / totalUniqueWords : 0;
}
