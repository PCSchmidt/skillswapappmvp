// tests/lib/matching/matchingAlgorithm.test.ts
import {
  locationScore,
  skillMatchScore,
  findMatches,
  calculateGeoDistance,
  UserProfile,
  Skill,
  MatchCandidate
} from '@/lib/matching/matchingAlgorithm';

// Mock calculateGeoDistance if its actual implementation is complex or external
// For this example, we test its exported version directly for locationScore,
// and for findMatches, we rely on its actual behavior as defined in matchingAlgorithm.ts

describe('MatchingAlgorithm', () => {
  describe('locationScore', () => {
    // Based on the formula: Math.max(0.1, 1.0 - ( (distanceKm - 5) / (MAX_DISTANCE_KM - 5) ) * 0.9 )
    // MAX_DISTANCE_KM = 50
    // Denominator = 45
    // Multiplier = 0.9 / 45 = 0.02
    // Formula for > 5km: Math.max(0.1, 1.0 - (distanceKm - 5) * 0.02)

    it('should return 1.0 for very close distances (<= 5km)', () => {
      expect(locationScore(0)).toBe(1.0);
      expect(locationScore(5)).toBe(1.0);
    });

    it('should return 0.8 for nearby distances (15km)', () => {
      // 1.0 - (15 - 5) * 0.02 = 1.0 - 10 * 0.02 = 1.0 - 0.2 = 0.8
      expect(locationScore(15)).toBeCloseTo(0.8);
    });

    it('should correctly calculate score for 10km (which falls under the <=15km rule)', () => {
        // Implementation: if (distanceKm <= 15) return 0.8;
        expect(locationScore(10)).toBeCloseTo(0.8);
    });


    it('should return a decaying score for distances between 15km and MAX_DISTANCE_KM (50km)', () => {
      // Formula for > 15km: Math.max(0.1, 1.0 - ( (distanceKm - 5) / (MAX_DISTANCE_KM - 5) ) * 0.9 )
      // Example for 25km: 1.0 - ((25-5)/(50-5)) * 0.9 = 1.0 - (20/45)*0.9 = 1.0 - (4/9)*0.9 = 1.0 - 0.4 = 0.6
      expect(locationScore(25)).toBeCloseTo(0.6);
      // Example for 50km: 1.0 - ((50-5)/(50-5)) * 0.9 = 1.0 - 0.9 = 0.1
      expect(locationScore(50)).toBeCloseTo(0.1);
    });

    it('should return 0.1 for far distances (> MAX_DISTANCE_KM)', () => {
      expect(locationScore(50.1)).toBe(0.1); // due to Math.max(0.1, ...)
      expect(locationScore(100)).toBe(0.1);
    });

    it('should return 0.3 (neutral) if distance is null or undefined', () => {
      expect(locationScore(null)).toBe(0.3);
      expect(locationScore(undefined)).toBe(0.3);
    });
     it('should return 0 if distance is negative (guard clause)', () => {
      expect(locationScore(-10)).toBe(0);
    });
  });

  describe('skillMatchScore', () => {
    const skillCooking: Skill = { id: 's1', user_id: 'u', name: 'Cooking', category: 'Culinary', is_offering: true };
    const skillBaking: Skill = { id: 's2', user_id: 'u', name: 'Baking', category: 'Culinary', is_offering: true };
    const skillKnitting: Skill = { id: 's3', user_id: 'u', name: 'Knitting', category: 'Crafts', is_offering: true };

    it('should return 1.0 if all sought skills are offered', () => {
      const sought = [skillCooking, skillBaking];
      const offered = [skillCooking, skillBaking, skillKnitting];
      expect(skillMatchScore(sought, offered)).toBe(1.0);
    });

    it('should return 0.5 if half of sought skills are offered', () => {
      const sought = [skillCooking, skillBaking];
      const offered = [skillCooking, skillKnitting];
      expect(skillMatchScore(sought, offered)).toBe(0.5);
    });

    it('should return 0 if no sought skills are offered', () => {
      const sought = [skillCooking, skillBaking];
      const offered = [skillKnitting];
      expect(skillMatchScore(sought, offered)).toBe(0);
    });

    it('should be case-insensitive', () => {
      const sought = [{ ...skillCooking, name: 'cooking' }];
      const offered = [{ ...skillCooking, name: 'Cooking' }];
      expect(skillMatchScore(sought, offered)).toBe(1.0);
    });

    it('should return 0 if sought skills list is empty', () => {
      expect(skillMatchScore([], [skillCooking])).toBe(0);
    });

    it('should return 0 if offered skills list is empty and sought skills exist', () => {
      expect(skillMatchScore([skillCooking], [])).toBe(0);
    });
     it('should return 0 if both lists are empty', () => {
      expect(skillMatchScore([], [])).toBe(0);
    });
  });

  describe('findMatches', () => {
    const currentUser: UserProfile = { id: 'user0', latitude: 0, longitude: 0, availability: 'weekends' };
    const skillSoughtGardening: Skill = { id: 's1', user_id: 'user0', name: 'Gardening', category: 'Outdoors', is_offering: false };
    const skillSoughtJS: Skill = { id: 's2', user_id: 'user0', name: 'JavaScript', category: 'Tech', is_offering: false };

    // Using mocked distances from calculateGeoDistance in matchingAlgorithm.ts
    // (0,0) to (1,1) -> 100km. locScore(100) = 0.1
    const candidateUser1: UserProfile = { id: 'user1', latitude: 1, longitude: 1 };
    // (0,0) to (10,10.1) -> 50km (default mock for other distances). locScore(50) = 0.1 (using updated formula)
    // Let's use the specific mock: (0,0) to (10.1, 10.1) would be 50.
    // Let's use the specific mock: (10,10) to (10.1,10.1) is 15km. If currentUser is at (10,10)
    // For this test, currentUser is at (0,0).
    // (0,0) to (10,10) -> 50km (default from calculateGeoDistance). locScore(50) = 0.1
    const candidateUser2: UserProfile = { id: 'user2', latitude: 10, longitude: 10 };
    // (0,0) to (0,0) -> 0km. locScore(0) = 1.0
    const candidateUser3: UserProfile = { id: 'user3', latitude: 0, longitude: 0 };


    const skillOfferedGardening: Skill = { id: 's3', user_id: 'user1', name: 'Gardening', category: 'Outdoors', is_offering: true };
    const skillOfferedJS: Skill = { id: 's4', user_id: 'user2', name: 'JavaScript', category: 'Tech', is_offering: true };
    const skillOfferedOther: Skill = { id: 's5', user_id: 'user3', name: 'Yoga', category: 'Wellness', is_offering: true };

    const candidates: MatchCandidate[] = [
      { user: candidateUser1, skillsOffered: [skillOfferedGardening, skillOfferedOther], skillsSought: [], score: 0 },
      { user: candidateUser2, skillsOffered: [skillOfferedJS], skillsSought: [], score: 0 },
      { user: candidateUser3, skillsOffered: [skillOfferedGardening, skillOfferedJS], skillsSought: [], score: 0 },
      { user: currentUser, skillsOffered: [], skillsSought: [], score: 0 },
    ];

    it('should return empty array if current user seeks no skills', () => {
      const matches = findMatches(currentUser, [], candidates);
      expect(matches).toEqual([]);
    });

    it('should exclude the current user from matches', () => {
      const matches = findMatches(currentUser, [skillSoughtGardening], candidates);
      expect(matches.find(m => m.user.id === currentUser.id)).toBeUndefined();
    });

    it('should score and sort candidates correctly based on skill and location', () => {
      // currentUser (0,0) seeks Gardening & JavaScript
      // Candidate 1 (user1 at 1,1): Offers Gardening. Dist 100km -> locScore(100) = 0.1. Skill score (1/2) = 0.5.
      //   Score = (0.5 * 0.6) + (0.1 * 0.4) = 0.3 + 0.04 = 0.34
      // Candidate 2 (user2 at 10,10): Offers JavaScript. Dist 50km (default) -> locScore(50) = 0.1. Skill score (1/2) = 0.5.
      //   Score = (0.5 * 0.6) + (0.1 * 0.4) = 0.3 + 0.04 = 0.34
      // Candidate 3 (user3 at 0,0): Offers Gardening & JavaScript. Dist 0km -> locScore(0) = 1.0. Skill score (2/2) = 1.0.
      //   Score = (1.0 * 0.6) + (1.0 * 0.4) = 0.6 + 0.4 = 1.0

      const matches = findMatches(currentUser, [skillSoughtGardening, skillSoughtJS], candidates);

      expect(matches.length).toBe(3);
      expect(matches[0].user.id).toBe('user3');
      expect(matches[0].score).toBeCloseTo(1.0);
      // Candidate 1 (user1) and Candidate 2 (user2) have tied scores.
      // Their order might vary, so check their scores individually.
      expect(matches[1].score).toBeCloseTo(0.34);
      expect(matches[2].score).toBeCloseTo(0.34);
      const otherUserIds = [matches[1].user.id, matches[2].user.id];
      expect(otherUserIds.sort()).toEqual(['user1', 'user2'].sort());

    });

    it('should handle candidates with no location data (neutral location score)', () => {
      const userNoLocation: UserProfile = { id: 'userNoLoc' };
      const candidatesWithNoLoc: MatchCandidate[] = [
        { user: userNoLocation, skillsOffered: [skillOfferedGardening, skillOfferedJS], skillsSought: [], score: 0 },
      ];
      // locScore for no location is 0.3. Skill score is 1.0.
      // Score = (1.0 * 0.6) + (0.3 * 0.4) = 0.6 + 0.12 = 0.72

      const matches = findMatches(currentUser, [skillSoughtGardening, skillSoughtJS], candidatesWithNoLoc);
      expect(matches.length).toBe(1);
      expect(matches[0].user.id).toBe('userNoLoc');
      expect(matches[0].score).toBeCloseTo(0.72);
    });
  });

  describe('calculateGeoDistance (using mocked values from matchingAlgorithm.ts)', () => {
    it('should return 0 for same points', () => {
      expect(calculateGeoDistance(0,0,0,0)).toBe(0);
    });
    it('should return 100 for specific test points', () => {
      expect(calculateGeoDistance(1,1,2,2)).toBe(100);
    });
     it('should return 15 for other specific test points', () => {
      expect(calculateGeoDistance(10,10,10.1,10.1)).toBe(15);
    });
     it('should return 50 for default case', () => {
      expect(calculateGeoDistance(5,5,10,10)).toBe(50); // Any other combo not specified
    });
  });
});
