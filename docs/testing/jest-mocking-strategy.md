# Jest Mocking Strategy for `matchingAlgorithm.ts`

This document outlines the challenges encountered when testing `matchingAlgorithm.ts` and the robust solution implemented using dependency injection.

## Problem Statement

The `matchingAlgorithm.ts` module exports a default object containing several functions, including `calculateMatchScore` and `findMatches`. The `findMatches` function internally calls `calculateMatchScore`.

Initial attempts to mock `calculateMatchScore` for isolated testing of `findMatches` using standard Jest mocking techniques (`jest.spyOn` and `jest.mock`) led to persistent issues:

*   **`jest.spyOn`:** Repeated calls to `jest.spyOn` on `matchingAlgorithm.calculateMatchScore` resulted in `TypeError: Cannot redefine property: calculateMatchScore`. This occurred because `calculateMatchScore` is a property of the `default` exported object, and when imported as a namespace (`import * as matchingAlgorithm from ...`), its properties become read-only, preventing redefinition.
*   **`jest.mock` with `jest.requireActual`:** Attempts to use `jest.mock` to mock the entire module and then selectively mock `calculateMatchScore` within the mock factory led to TypeScript errors like "Spread types may only be created from object types" and issues with `unknown` types. This was due to the complex nature of `matchingAlgorithm.ts`'s exports (default export of an object containing functions) and how `jest.requireActual` interacts with it in certain TypeScript configurations.

The core challenge was to find a way to mock `calculateMatchScore` for `findMatches` tests while allowing `calculateMatchScore`'s own tests to use the real implementation, all while maintaining type safety and avoiding redefinition errors.

## Solution: Dependency Injection

The most robust and clean solution implemented is **dependency injection**. This pattern involves modifying the `findMatches` function (the consumer of `calculateMatchScore`) to accept `calculateMatchScore` as an optional parameter. This allows us to inject a mock function during testing without directly altering the original module's properties or relying on complex Jest internal mechanisms.

### Changes to `src/lib/matching/matchingAlgorithm.ts`

The `findMatches` function signature was updated to include an optional `calculateMatchScoreFn` parameter:

```typescript
export function findMatches(
  currentUser: User,
  potentialMatches: User[],
  limit: number = 20,
  // New optional parameter for dependency injection
  calculateMatchScoreFn?: (user1: User, user2: User) => MatchResult
): MatchResult[] {
  // ...
  // Calculate match scores for all potential users, using the injected function if available
  const matches = otherUsers.map(user => (calculateMatchScoreFn || calculateMatchScore)(currentUser, user))
  // ...
}
```

This change allows `findMatches` to use the injected `calculateMatchScoreFn` if provided, otherwise it defaults to the original `calculateMatchScore` from the same module.

### Changes to `tests/lib/matching/matchingAlgorithm.test.ts`

All previous complex mocking setups (`jest.mock`, `jest.spyOn`, `beforeEach`, `afterEach` blocks related to `calculateMatchScore` mocking) were removed from the `describe('findMatches', ...)` block.

For each test case within `describe('findMatches', ...)`, the following pattern is now used:

```typescript
test('should find and sort potential matches for a user', () => {
  const currentUser = mockUsers[0]; // Alice
  const potentialMatches = [mockUsers[1], mockUsers[2]]; // Bob and Charlie
  
  // Create an explicitly typed mock for calculateMatchScore
  const mockCalculateMatchScore = jest.fn<typeof matchingAlgorithm.calculateMatchScore>();

  // Mock calculateMatchScore for this specific test
  mockCalculateMatchScore.mockImplementation((user1, user2) => {
    // Provide specific mock return values based on user IDs for sorting
    if (user1.id === 'user1' && user2.id === 'user3') { // Alice vs Charlie
      return { user: user2, score: 80, breakdown: { skillComplementScore: 0, locationScore: 0, experienceLevelScore: 0, ratingScore: 0 }, matchReasons: [], matchedSkills: { user1OffersUser2Wants: [], user2OffersUser1Wants: [] } };
    }
    if (user1.id === 'user1' && user2.id === 'user2') { // Alice vs Bob
      return { user: user2, score: 60, breakdown: { skillComplementScore: 0, locationScore: 0, experienceLevelScore: 0, ratingScore: 0 }, matchReasons: [], matchedSkills: { user1OffersUser2Wants: [], user2OffersUser1Wants: [] } } ;
    }
    return { user: user2, score: 0, breakdown: { skillComplementScore: 0, locationScore: 0, experienceLevelScore: 0, ratingScore: 0 }, matchReasons: [], matchedSkills: { user1OffersUser2Wants: [], user2OffersUser1Wants: [] } };
  });

  // Pass the mock function as the fourth argument to findMatches
  const matches = findMatches(currentUser, potentialMatches, 20, mockCalculateMatchScore);
  
  expect(matches).toHaveLength(2);
  expect(matches[0].score).toBeGreaterThan(matches[1].score); // Sorted by score
  expect(matches[0].user.id).toBe('user3'); // Charlie should be highest match based on new logic
  expect(mockCalculateMatchScore).toHaveBeenCalledTimes(2); // Verify mock was called
});
```

This approach ensures:
*   **Isolation:** Each test has its own isolated mock of `calculateMatchScore`.
*   **Type Safety:** Explicitly typing `jest.fn<typeof matchingAlgorithm.calculateMatchScore>()` ensures correct type inference and validation.
*   **No Redefinition Errors:** The original `calculateMatchScore` function is never directly modified or spied upon in a way that causes redefinition issues.
*   **Testability:** The `findMatches` function is now easily testable in isolation from its internal dependencies.

This solution has successfully resolved all previous TypeScript and runtime errors related to mocking in `matchingAlgorithm.test.ts`.
