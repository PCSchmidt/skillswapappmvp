import { jest } from '@jest/globals';
import { calculateMatchScore, findMatches, User, Skill, MatchResult } from '@/lib/matching/matchingAlgorithm';

// Mock data for testing
const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'alice',
    display_name: 'Alice',
    avatar_url: 'avatar1.jpg',
    location: { 
      latitude: 40.7128, 
      longitude: -74.0060,
      description: 'New York, NY'
    }, // NYC
    offered_skills: [
      { id: 'skill1', name: 'JavaScript Programming', category: 'Technology', proficiency_level: 'expert', is_offering: true },
      { id: 'skill2', name: 'React Development', category: 'Technology', proficiency_level: 'intermediate', is_offering: true }
    ],
    wanted_skills: [
      { id: 'skill3', name: 'Spanish Language', category: 'Languages', proficiency_level: 'beginner', is_offering: false },
      { id: 'skill4', name: 'Piano Lessons', category: 'Music', proficiency_level: 'beginner', is_offering: false }
    ],
    preferences: {
      max_distance: 50,
      remote_only: false,
      experience_level_preference: 'any'
    },
    rating: 4.8
  },
  {
    id: 'user2',
    username: 'bob',
    display_name: 'Bob',
    avatar_url: 'avatar2.jpg',
    location: { 
      latitude: 40.7306, 
      longitude: -73.9352,
      description: 'Brooklyn, NY'
    }, // Brooklyn, ~5mi from NYC
    offered_skills: [
      { id: 'skill3', name: 'Spanish Language', category: 'Languages', proficiency_level: 'expert', is_offering: true },
      { id: 'skill5', name: 'Photography', category: 'Arts', proficiency_level: 'intermediate', is_offering: true }
    ],
    wanted_skills: [
      { id: 'skill1', name: 'JavaScript Programming', category: 'Technology', proficiency_level: 'beginner', is_offering: false },
      { id: 'skill6', name: 'Digital Marketing', category: 'Business', proficiency_level: 'intermediate', is_offering: false }
    ],
    preferences: {
      max_distance: 30,
      remote_only: false,
      experience_level_preference: 'similar'
    },
    rating: 4.5
  },
  {
    id: 'user3',
    username: 'charlie',
    display_name: 'Charlie',
    avatar_url: 'avatar3.jpg',
    location: { 
      latitude: 34.0522, 
      longitude: -118.2437,
      description: 'Los Angeles, CA'
    }, // Los Angeles, far from NYC
    offered_skills: [
      { id: 'skill4', name: 'Piano Lessons', category: 'Music', proficiency_level: 'expert', is_offering: true },
      { id: 'skill6', name: 'Digital Marketing', category: 'Business', proficiency_level: 'expert', is_offering: true }
    ],
    wanted_skills: [
      { id: 'skill2', name: 'React Development', category: 'Technology', proficiency_level: 'intermediate', is_offering: false },
      { id: 'skill5', name: 'Photography', category: 'Arts', proficiency_level: 'beginner', is_offering: false }
    ],
    preferences: {
      max_distance: 100,
      remote_only: true, // Willing to do remote
      experience_level_preference: 'higher'
    },
    rating: 4.9
  }
];

describe('MatchingAlgorithm', () => {
  describe('calculateMatchScore', () => {
    test('should return high score for perfect skill matches', () => {
      const currentUser = mockUsers[0]; // Alice
      const potentialMatch = mockUsers[1]; // Bob
      
      const score = calculateMatchScore(currentUser, potentialMatch);
      
      // Alice offers JavaScript (skill1) which Bob wants, and Bob offers Spanish (skill3) which Alice wants
      expect(score.score).toBeGreaterThan(70); // Expect a high score (>70%)
      expect(score.breakdown.skillComplementScore).toBeGreaterThan(80); // Perfect skill match
      expect(score.breakdown.locationScore).toBeGreaterThan(90); // They're in nearby locations
    });
    
    test('should return low score for users with no skill matches', () => {
      // Create users with no matching skills
      const userA: User = {
        ...mockUsers[0],
        offered_skills: [{ id: 'unique1', name: 'Unique Skill A', category: 'Other', proficiency_level: 'intermediate', is_offering: true }],
        wanted_skills: [{ id: 'unique2', name: 'Unique Skill B', category: 'Other', proficiency_level: 'intermediate', is_offering: false }]
      };
      
      const userB: User = {
        ...mockUsers[1],
        offered_skills: [{ id: 'unique3', name: 'Unique Skill C', category: 'Other', proficiency_level: 'intermediate', is_offering: true }],
        wanted_skills: [{ id: 'unique4', name: 'Unique Skill D', category: 'Other', proficiency_level: 'intermediate', is_offering: false }]
      };
      
      const score = calculateMatchScore(userA, userB);
      
      expect(score.score).toBeLessThan(50); // Expect a low score (<50%)
      expect(score.breakdown.skillComplementScore).toBe(0); // No skill matches
    });
    
    test('should account for distance preferences correctly', () => {
      const localUser = mockUsers[0]; // Alice in NYC
      const remoteUser = mockUsers[2]; // Charlie in LA
      
      // First test - users too far apart with local preferences
      const localScore = calculateMatchScore(localUser, remoteUser);
      expect(localScore.breakdown.locationScore).toBeLessThan(30); // Low distance score due to geographic distance
      
      // Second test - with remote preference
      const remotePreferenceUser = {
        ...localUser,
        preferences: { ...localUser.preferences, remote_only: true }
      };
      
      const remoteScore = calculateMatchScore(remotePreferenceUser, remoteUser);
      expect(remoteScore.breakdown.locationScore).toBeGreaterThan(70); // Higher distance score with remote preference
    });

    test('should factor in experience level preferences', () => {
      const expertUser: User = {
        ...mockUsers[0],
        preferences: { ...mockUsers[0].preferences, experience_level_preference: 'higher' }
      };
      
      const beginnerUser: User = {
        ...mockUsers[1],
        offered_skills: mockUsers[1].offered_skills.map(skill => ({ ...skill, proficiency_level: 'beginner' }))
      };
      
      const score = calculateMatchScore(expertUser, beginnerUser);
      expect(score.breakdown.experienceLevelScore).toBeLessThan(50); // Low score due to experience level mismatch
    });

    test('should include ratings in the match score calculation', () => {
      const highRatedUser: User = {
        ...mockUsers[0],
        rating: 5.0
      };
      
      const lowRatedUser: User = {
        ...mockUsers[1],
        rating: 2.5
      };
      
      const score = calculateMatchScore(highRatedUser, mockUsers[1]);
      const lowRatingScore = calculateMatchScore(highRatedUser, lowRatedUser);
      
      // Higher score with better rated user
      expect(score.breakdown.ratingScore).toBeGreaterThan(lowRatingScore.breakdown.ratingScore);
    });
  });
  
  describe('findMatches', () => {
    test('should find and sort potential matches for a user', () => {
      const currentUser = mockUsers[0]; // Alice
      const potentialMatches = [mockUsers[1], mockUsers[2]]; // Bob and Charlie
      
      const matches = findMatches(currentUser, potentialMatches);
      
      expect(matches).toHaveLength(2);
      expect(matches[0].score).toBeGreaterThan(matches[1].score); // Sorted by score
      expect(matches[0].user.id).toBe('user2'); // Bob should be highest match
    });
    
    test('should return empty array when no potential matches exist', () => {
      const currentUser = mockUsers[0];
      const emptyMatches = findMatches(currentUser, []);
      
      expect(emptyMatches).toHaveLength(0);
      expect(emptyMatches).toEqual([]);
    });
    
    test('should not include users with zero match score', () => {
      // Create a user with completely incompatible skills and preferences
      const incompatibleUser: User = {
        id: 'incompatible',
        username: 'incompatible',
        display_name: 'Incompatible User',
        avatar_url: '',
        location: { 
          latitude: 90, 
          longitude: 0,
          description: 'North Pole' 
        }, // North Pole
        offered_skills: [{ id: 'irrelevant', name: 'Irrelevant Skill', category: 'Other', proficiency_level: 'beginner', is_offering: true }],
        wanted_skills: [{ id: 'unknown', name: 'Unknown Skill', category: 'Other', proficiency_level: 'beginner', is_offering: false }],
        preferences: {
          max_distance: 1, // Very small radius
          remote_only: false,
          experience_level_preference: 'higher'
        },
        rating: 1.0
      };
      
      // Mock the matchingAlgorithm module's calculateMatchScore function
      jest.spyOn(require('@/lib/matching/matchingAlgorithm'), 'calculateMatchScore').mockImplementation(() => ({
        score: 0,
        breakdown: {
          skillComplementScore: 0,
          locationScore: 0,
          experienceLevelScore: 0,
          ratingScore: 0
        },
        matchReasons: [],
        matchedSkills: {
          offered: [],
          wanted: []
        }
      }));
      
      const matches = findMatches(mockUsers[0], [incompatibleUser]);
      expect(matches).toHaveLength(0);
      
      // Restore original implementation
      jest.restoreAllMocks();
    });
  });
});
