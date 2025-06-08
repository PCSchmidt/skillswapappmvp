# Creating Pattern Examples for Component Combinations

This document outlines the process for creating pattern examples that showcase how different components within the SkillSwap design system can be combined to build common UI sections or features. These examples are crucial for demonstrating best practices, promoting consistency, and accelerating development.

## Objectives

-   Illustrate effective ways to combine core, layout, and feature components.
-   Provide ready-to-use code snippets for common UI patterns.
-   Ensure patterns adhere to design system principles and accessibility standards.
-   Reduce development time by offering pre-vetted solutions for recurring UI needs.

## Process

### 1. Identification of Common UI Patterns

*   **Application Audit**: Review existing application pages and identify recurring UI patterns (e.g., a form section, a user profile header, a list of items with filters).
*   **Design Review**: Collaborate with UX/UI designers to identify key patterns from design mockups that should be documented.
*   **Developer Feedback**: Gather input from developers on frequently built UI sections that could benefit from a documented pattern.

### 2. Design and Specification of Patterns

For each identified pattern, define:

*   **Name**: A clear, descriptive name for the pattern (e.g., "Profile Header with Stats", "Search Results Layout").
*   **Purpose**: When and why this pattern should be used.
*   **Components Used**: List all SkillSwap components involved in the pattern.
*   **Structure**: How components are nested and arranged (e.g., `Section` containing `Container`, which contains `Grid` of `Card`s).
*   **Styling**: Key styling considerations (spacing, alignment, responsiveness).
*   **Behavior**: Any interactive aspects of the pattern.
*   **Accessibility**: Specific accessibility notes for the combined pattern.

### 3. Implementation of Pattern Examples

*   **Dedicated Storybook Files**: Create new Storybook files (e.g., `src/patterns/ProfileHeader.stories.tsx` or `src/patterns/SearchLayout.stories.tsx`) to host these pattern examples. Consider a new top-level Storybook category like "Patterns" or "Compositions".
*   **Code Implementation**: Write clean, well-commented code that combines the individual components to form the pattern.
*   **Data Mocking**: Use mock data to populate the pattern, similar to individual component stories.

### 4. Documentation and Storybook Integration

*   **Storybook Stories**:
    *   Each pattern should have at least one Storybook story demonstrating its default usage.
    *   Include variations if the pattern has different states (e.g., "Empty State Search Results").
*   **MDX Documentation**: For each pattern, create an MDX file or a dedicated section within a relevant Storybook file that includes:
    *   The pattern's name and purpose.
    *   A visual preview (from Storybook).
    *   A copy-pastable code example.
    *   Explanation of how components are combined.
    *   Best practices and accessibility notes for the pattern.
*   **Design System Progress**: Mark the task as complete in `docs/design_system_implementation_progress.md`.

## Example: "User Profile Header" Pattern

This pattern combines `Avatar`, `ProfileCard`, `Button`, and `Stack` components.

**Purpose**: Displays a user's avatar, name, bio, and key statistics, with an action button.

**Components Used**: `Avatar`, `ProfileCard`, `Button`, `Stack`, `Container`.

**Code Snippet (simplified):**

```jsx
<Section spacingY="lg">
  <Container>
    <Stack direction="vertical" spacing="md" align="center">
      <ProfileCard
        avatarUrl="/path/to/avatar.jpg"
        fullName="Jane Doe"
        bio="Frontend Developer | React Enthusiast"
        skillCount={15}
        exchangeCount={7}
        onViewProfile={() => console.log('View Profile')}
      />
      <Button variant="secondary">Edit Profile</Button>
    </Stack>
  </Container>
</Section>
```

## Tools

*   **Storybook**: Primary platform for showcasing patterns.
*   **Existing Components**: Leverage the already built and documented components.
*   **Design Tools**: For understanding the visual composition of patterns.

## Future Considerations

-   Develop a "Pattern Library" section in Storybook with interactive code examples.
-   Automate visual regression testing for complex patterns.
-   Create a "Pattern Generator" tool that allows designers/developers to assemble patterns visually.
