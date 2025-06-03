# Adding Missing Variants to Core Components

This document outlines the process for identifying and implementing missing variants for existing core components within the SkillSwap design system. Ensuring a comprehensive set of variants is crucial for component reusability and flexibility across the application.

## Objectives

-   Identify any missing visual or functional variations for core components (e.g., Button, Input, Card, Modal).
-   Implement new variants following established design system principles and coding standards.
-   Update component documentation and Storybook stories to reflect the new variants.
-   Ensure new variants maintain accessibility standards.

## Process

### 1. Identification of Missing Variants

*   **Design Review**: Collaborate with UX/UI designers to review the design specifications and identify any component variations that are not yet implemented.
*   **Component Audit**: Conduct a thorough audit of existing components in Storybook and the live application to spot inconsistencies or missing options compared to design mockups.
*   **Developer Feedback**: Gather feedback from developers on common use cases or limitations encountered with existing components that might suggest a need for new variants.
*   **UI Audit Findings**: Refer to the `docs/ui_audit_findings.md` document for previously identified gaps.

### 2. Design and Specification

*   For each identified missing variant, clearly define its:
    *   **Purpose**: When and why this variant should be used.
    *   **Visuals**: How it looks (colors, sizing, typography, spacing, borders, shadows).
    *   **Behavior**: How it interacts (hover, focus, active states, disabled states).
    *   **Props**: What new props are needed to control this variant.
    *   **Accessibility**: Any specific ARIA attributes or keyboard interactions required.

### 3. Implementation

*   **Branching**: Create a new feature branch for the variant implementation.
*   **Component Modification**:
    *   Open the relevant core component file (e.g., `src/components/ui/Button.tsx`).
    *   Update the component's interface (`Props`) to include the new variant-controlling props.
    *   Implement the new styling and logic using Tailwind CSS classes and `cn` utility.
    *   Ensure existing variants are not negatively impacted.
*   **Testing**:
    *   Write unit tests for any new logic introduced by the variant.
    *   Manually test the new variant in Storybook and the application to ensure it functions as expected.

### 4. Documentation and Storybook Updates

*   **Storybook Stories**:
    *   Open the component's Storybook file (e.g., `src/components/ui/Button.stories.tsx`).
    *   Add new stories for each new variant, demonstrating its usage clearly.
    *   Update `argTypes` to include controls for the new props.
*   **Component Documentation**:
    *   Update the component's JSDoc comments to describe the new variant and its props.
    *   If a separate markdown document exists for the component, update it accordingly.
*   **Design System Progress**: Mark the task as complete in `docs/design_system_implementation_progress.md`.

## Example: Adding a "Ghost" Button Variant

If a "ghost" button (transparent background, colored text/border) is missing:

1.  **Identify**: Designers need a button that is less prominent than `outline` but still interactive.
2.  **Design**: Define `variant="ghost"` with specific Tailwind classes for background, text, border, and hover states.
3.  **Implement**: Add `ghost` to `ButtonProps['variant']` type, and add corresponding Tailwind classes in `Button.tsx`.
4.  **Document**: Add a "Ghost" story to `Button.stories.tsx` and update `Button.tsx` JSDoc.

## Tools

*   **Storybook**: For isolated component development and preview.
*   **Tailwind CSS**: For utility-first styling.
*   **TypeScript**: For strong typing and prop validation.
*   **Browser Developer Tools**: For inspecting styles and behavior.

## Future Considerations

-   Automate detection of unused or redundant variants.
-   Establish a clear versioning strategy for component variants.
