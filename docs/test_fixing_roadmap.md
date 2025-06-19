# Roadmap for Resolving Test Failures and TypeScript Errors

## 1. Overview of Current Issues

The primary goal is to stabilize the test suite, particularly addressing issues in `tests/lib/supabase/database.test.ts` which interacts with a complex mock of the Supabase client defined in `__mocks__/supabaseMock.ts`.

**Key Problems:**

*   **TypeScript Errors in `tests/lib/supabase/database.test.ts`**:
    *   Persistent errors like `Expected X arguments, but got Y` on lines using Jest's `toHaveBeenCalledWith` matcher. This indicates issues with TypeScript's type inference for chained mock functions.
*   **ESLint Warnings in `__mocks__/supabaseMock.ts`**:
    *   Warnings about unused variables (parameters in mock function implementations).
    *   Warnings about the use of `any` type.

## 2. Root Cause Analysis: TypeScript Errors in `database.test.ts`

The core of the "Expected X arguments, but got Y" errors lies in how TypeScript infers the type signatures of `jest.fn()` instances, especially when these mock functions are part of a chained API (like `supabaseMock.from(...).select(...).eq(...)`).

*   **Mock Definitions**: In `__mocks__/supabaseMock.ts`, methods like `select`, `eq`, `insert`, etc., are defined as `jest.fn()`.
*   **Type Inference**: If these `jest.fn()` definitions don't have explicit and sufficiently detailed type annotations for their parameters, TypeScript may incorrectly infer their signature (e.g., as a function taking zero arguments).
*   **Assertion Mismatch**: When `toHaveBeenCalledWith(...)` is used in the test file, TypeScript compares the provided arguments with its (potentially incorrect) inferred signature of the mock function. If it believes the mock function expects 0 arguments, but the assertion checks if it was called with 1 or 2 arguments, a type error occurs.
*   **Casting (`as jest.Mock`)**: While `as jest.Mock` is used in `database.test.ts`, it might not be aggressive enough to override a strong (but incorrect) inference derived from the mock's implementation signature, especially with complex chaining.

## 3. Strategy for Resolving TypeScript Errors

The strategy involves ensuring type consistency between the mock definitions and their usage in tests.

### Step 3.1: Stabilize `__mocks__/supabaseMock.ts` (The Mock Definition File)

**Objective**: Make mock function signatures robust and clear for TypeScript, and address ESLint warnings.

*   **Action A: Correct `jest.Mock` Generic Usage in Interfaces**
    *   **Status**: This was identified as an issue where `jest.Mock<ReturnType, ArgTupleType>` was used, which is incompatible with the project's Jest type version.
    *   **Correction**: All `jest.Mock` typings in interfaces should use the single-argument generic form, specifying the full function signature: `jest.Mock<(...args: ArgTupleType) => ReturnType>`.
        *   Example: `eq: jest.Mock<(_column: string, _value: unknown) => SupabaseQueryBuilderMock>;`
    *   **Tool**: This will require a `write_to_file` or careful `replace_in_file` for `__mocks__/supabaseMock.ts`.

*   **Action B: Consistent and Explicit Parameter Typing in Implementations**
    *   The `jest.fn(...)` implementations must include parameters that match their interface definitions.
    *   Example (Interface): `select: jest.Mock<(columns?: string) => FinalQueryMock>;`
    *   Example (Implementation): `select: jest.fn((_columns?: string) => createFinalQueryMock()),`
    *   Use `unknown` instead of `any` for better type safety where specific types are not practical.
    *   **Tool**: This will be part of the `write_to_file` or `replace_in_file` for `__mocks__/supabaseMock.ts`.

*   **Action C: Handle Unused Parameters in Mock Implementations (ESLint)**
    *   For parameters in mock function implementations that are intentionally unused (common in mocks that `return this;` or create another mock), use an underscore prefix (e.g., `_column`).
    *   To prevent ESLint `no-unused-vars` errors:
        1.  **Preferred**: Configure ESLint globally (in `.eslintrc.js` or similar) for the `no-unused-vars` or `@typescript-eslint/no-unused-vars` rule: `argsIgnorePattern: "^_"`.
        2.  **Alternative**: If global configuration is not immediately done, add `// eslint-disable-next-line @typescript-eslint/no-unused-vars` on the line *preceding* the function signature or parameter that is unused.
    *   **Tool**: This will be part of the `write_to_file` or `replace_in_file` for `__mocks__/supabaseMock.ts`.

*   **Action D: Address Unused `resolvedValue` in `createChainedMutationMock`**
    *   The `resolvedValue` in `createChainedMutationMock` is set by `mockResolvedValue` but not directly used by `eq` or `select`. This is a minor flaw in the mock if `ChainedMutationMock` instances (e.g., `update().eq()`) are expected to be directly `await`-able and resolve to this value.
    *   **Short-term (ESLint)**: To silence the "unused variable" linter error, a line like `const _ = resolvedValue; // eslint-disable-line @typescript-eslint/no-unused-vars` can be added within `mockResolvedValue` and `mockRejectedValue` if the variable is truly not used otherwise by the mock's logic.
    *   **Long-term**: Consider if `ChainedMutationMock` should be thenable. This is outside the scope of fixing current TS errors but good for future mock robustness.
    *   **Tool**: This will be part of the `write_to_file` or `replace_in_file` for `__mocks__/supabaseMock.ts`.

### Step 3.2: Finalize Assertions in `tests/lib/supabase/database.test.ts`

**Objective**: Ensure `toHaveBeenCalledWith` assertions are correctly typed and pass.

*   **Action A: Maintain `as jest.Mock` Casts (Initially)**
    *   The `as jest.Mock` casts on assertions like `expect(supabaseMock.from('skills').select as jest.Mock).toHaveBeenCalledWith('*');` are intended to help TypeScript.
    *   Once `__mocks__/supabaseMock.ts` has fully correct and explicit type signatures (from Step 3.1), these casts in the test file *should* work, or potentially become unnecessary if TypeScript can infer correctly.

*   **Action B: Contingency - More Specific Generic Casts**
    *   If "Expected X arguments, but got Y" errors *still* persist after `__mocks__/supabaseMock.ts` is fixed, use more specific generic casts for `jest.Mock`:
        `expect(mockFunction as jest.Mock<ReturnType, ArgTupleType>)`
        becomes (using the compatible form):
        `expect(mockFunction as jest.Mock<(...args: ArgTupleType) => ReturnType>)`
    *   Example:
        `expect(supabaseMock.from('skills').select as jest.Mock<(_columns?: string) => FinalQueryMock>).toHaveBeenCalledWith('*');`
    *   **Tool**: Targeted `replace_in_file` for `tests/lib/supabase/database.test.ts`.

*   **Action C: Contingency - `ts-expect-error` (Last Resort)**
    *   If type errors remain exceptionally stubborn and are confirmed to be type system quirks rather than actual bugs, `// @ts-expect-error` (with an explanatory comment) can be used on the line above the problematic assertion. This is a temporary measure to unblock tests and should be revisited.
    *   **Tool**: Targeted `replace_in_file`.

## 4. Workflow and Verification

1.  **Modify `__mocks__/supabaseMock.ts`**:
    *   Use `write_to_file` to apply all corrections from Step 3.1 (correct `jest.Mock` generic syntax, consistent parameter typing, handling unused variables, addressing `any`).
2.  **Check `__mocks__/supabaseMock.ts`**:
    *   Ensure there are no TypeScript errors in this file.
    *   Address any remaining ESLint errors (primarily "no-unused-vars" if not handled by underscore convention and linter config).
3.  **Check `tests/lib/supabase/database.test.ts`**:
    *   Observe TypeScript errors. The "Expected X arguments, but got Y" errors should ideally be resolved due to the improved mock definitions.
4.  **Refine `tests/lib/supabase/database.test.ts` (If Necessary)**:
    *   If errors persist, apply Action 3.2.B (more specific casts) or 3.2.C (`ts-expect-error`) using `replace_in_file`.
5.  **Run Tests**:
    *   Execute `npm test tests/lib/supabase/database.test.ts` (or the project's test command) to confirm runtime correctness and that all tests pass.
6.  **Address Other Failing Tests**:
    *   Once `database.test.ts` is stable, apply similar principles to other failing test files (e.g., `MessageComposer.test.tsx` if it uses the same Supabase mock).

## 5. General Best Practices for Mocks and Tests

*   **Explicit Mock Typing**: Always explicitly type the parameters and return values of `jest.fn()` in your mock implementation files. This provides clear contracts for TypeScript.
*   **ESLint Configuration for Mocks**: Configure `no-unused-vars` (and `@typescript-eslint/no-unused-vars`) with `argsIgnorePattern: "^_"` to allow underscore-prefixed unused parameters in mock implementations.
*   **Incremental Changes**: When debugging complex type issues, make small, verifiable changes and observe the impact.
*   **Simplify Mocks**: If a mock becomes overly complex, consider if it can be simplified or broken down.
*   **Test Mock Behavior**: Sometimes, it's useful to write simple tests *for the mock itself* to ensure it behaves as expected regarding return types and method availability.

This roadmap provides a structured approach to systematically resolve the outstanding issues.
