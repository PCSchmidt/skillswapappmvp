# Future Work Plan: SkillSwap MVP Testing and Review

**Overall Goal:** Improve test coverage, resolve outstanding issues, and gain clarity on missing project components and documentation.

## I. Pending User/Team Actions (Input Needed)

These items require input or action from the development team before further progress can be made on them by Jules (AI Developer). Please provide updates when available.

1.  **Manual Debugging of `notificationService.test.ts` Failure:**
    *   **Task:** A developer to interactively debug the failing test: `NotificationService › getNotifications › should filter for unread notifications when specified`.
    *   **Goal:** Identify the root cause of the `TypeError: query.eq is not a function` and implement a fix.
    *   **Information Needed by AI (Jules):** The cause of the error and any code changes made.

2.  **Clarification on Missing Components:**
    *   **Task:** Investigate and clarify the status of:
        *   `tests/lib/supabase/database.test.ts` (and its likely source `src/lib/supabase/database.ts`).
        *   `tests/lib/matching/matchingAlgorithm.test.ts` (and its likely source `src/lib/matching/matchingAlgorithm.ts`, particularly regarding `locationScore`).
    *   **Goal:** Determine if these components are expected, deprecated, moved, or were never completed.
    *   **Information Needed by AI (Jules):** Confirmation of their status, location if they exist, and intended functionality.

3.  **Clarification on Missing Documentation:**
    *   **Task:** Locate or clarify the status of testing-related documentation mentioned in `README.md` (e.g., `docs/testing_setup.md`, `docs/eslint_dependency_fix.md` details, `docs/cypress_testing_guide.md`, `docs/test_output_management.md`).
    *   **Goal:** Provide more context on the project's intended testing strategies.
    *   **Information Needed by AI (Jules):** Access to these documents if found, or confirmation if they are unavailable/outdated.

## II. Next Development Tasks (Actionable by AI - Jules)

This is the sequence of tasks proposed for Jules to work on:

1.  **Implement Unit Tests for `src/lib/supabase/cachedClient.ts`:**
    *   **Task:** Based on the test case outlines already proposed (for `getProfileCached`, `invalidateUserCaches`, `createSkillWithCache`, `searchSkillsCached`, etc.), implement a comprehensive Jest unit test suite for `cachedClient.ts`.
    *   **Details:**
        *   Mock functions from `src/lib/supabase/client.ts` as dependencies.
        *   Verify interactions with `queryCacheService.ts` (e.g., correct cache keys, expiry times, invalidation calls).
        *   Ensure all logical paths within the `cachedClient.ts` functions are covered.
    *   **Goal:** Achieve high test coverage for this critical data access and caching layer.

2.  **Implement Unit Tests for `src/lib/supabase/client.ts` (Selected Functions):**
    *   **Task:** Write unit tests for the more complex functions in `client.ts`, particularly those with conditional logic for query building, such as `searchSkills` and `getUserSkills`. Consider also testing one or two simpler CRUD wrappers (e.g., `getProfile`, `createSkill`) to establish a pattern.
    *   **Details:**
        *   Use the shared Supabase mock (`src/__mocks__/@supabase/supabase-js.ts`).
        *   Verify that the Supabase client methods (`from`, `select`, `eq`, `or`, `ilike`, etc.) are called with the correct parameters based on the input to the `client.ts` functions.
    *   **Goal:** Ensure the Supabase query construction in `client.ts` is correct and provide a testing pattern for these direct wrapper functions.

3.  **Review and Potentially Test Other Utilities in `src/lib/utils/`:**
    *   **Task:**
        *   Read `src/lib/utils/loadDynamicComponent.tsx`.
        *   Read `src/lib/utils/registerServiceWorker.ts`.
        *   Assess if any parts of these files are suitable for unit testing with Jest (without a full browser/React DOM environment). If so, propose and implement basic tests for core logic.
    *   **Goal:** Ensure any non-UI, non-browser-dependent logic within these utilities is sound.

4.  **Integrate Findings from User/Team (Ongoing):**
    *   **Task:** As information becomes available regarding items in **Section I** (manual debugging results, status of missing files/docs), incorporate these findings.
    *   **Details:**
        *   If the `notificationService.test.ts` fix is provided, integrate it.
        *   If missing components/docs are found, review them and adjust the plan (e.g., if `database.ts` is found, it becomes a candidate for testing).
    *   **Goal:** Adapt to new information and ensure efforts are aligned with the actual state and priorities of the project.
