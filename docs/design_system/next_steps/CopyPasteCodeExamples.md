# Including Copy/Paste Code Examples for Developers

This document outlines the process for providing readily available copy/paste code examples within the SkillSwap design system documentation. This feature significantly streamlines the development workflow by allowing developers to quickly integrate components and patterns into their projects.

## Objectives

-   Accelerate component integration by providing immediate, functional code.
-   Ensure consistency in component usage across the application.
-   Reduce the likelihood of manual errors during implementation.
-   Enhance developer experience and productivity.

## Principles

-   **Simplicity**: Code examples should be as simple and focused as possible, demonstrating the core usage of the component or pattern.
-   **Accuracy**: Examples must be accurate and reflect the latest version of the component API.
-   **Completeness**: Provide all necessary imports and basic setup for the example to work out-of-the-box.
-   **Readability**: Code should be well-formatted and easy to understand.

## Process

### 1. Identify Code Snippets for Copy/Paste

Review all component and pattern documentation (especially those created in `ComponentUsageGuidelines.md` and `PatternExamplesComponentCombinations.md`) and identify key code snippets that developers would frequently copy.

*   **Component Default Usage**: The most basic way to render a component.
*   **Variant Usage**: Examples for each major variant (e.g., primary button, outline button).
*   **Prop Demonstrations**: Snippets showing how to use specific props (e.g., `onClick`, `className`, `disabled`).
*   **Pattern Combinations**: Code for common UI patterns (e.g., a form layout, a card with specific content).

### 2. Implement Code Blocks in Storybook/MDX

Leverage Storybook's `addon-docs` capabilities to render code blocks that are easily copyable.

*   **Using Markdown Code Blocks**: For simple, static code examples, standard Markdown code blocks are sufficient. Storybook's `addon-docs` will render these beautifully.

    ```markdown
    ```jsx
    <Button variant="primary" onClick={() => console.log('Hello')}>
      Primary Button
    </Button>
    ```
    ```

*   **Using Storybook's `Source` Block (Recommended for Stories)**: For code examples directly tied to a Storybook story, use the `Source` block from `@storybook/blocks`. This automatically extracts the code from the story's `render` function or `args`.

    ```mdx
    // In your Component.stories.mdx file
    import { Primary, Controls, Source } from '@storybook/blocks';
    import * as ComponentStories from './Component.stories';

    <Primary />
    <Controls />

    <h2>Code Example</h2>
    <Source of={ComponentStories.Default} />
    ```

    *   **Note**: Ensure your `*.stories.tsx` files are correctly configured for `addon-docs` to extract the source code.

### 3. Ensure Code is Ready for Copy/Paste

*   **Imports**: Include all necessary `import` statements at the top of the code snippet.
*   **Dependencies**: Assume the developer has the design system installed. Do not include installation instructions within the snippet itself.
*   **Context**: If a component requires a specific context provider (e.g., `SupabaseContext`), provide a note or a wrapper example.
*   **Clarity**: Avoid overly complex logic within the copy/paste examples. If complex logic is needed, explain it in accompanying text.

### 4. Review and Validate

*   **Manual Copy/Paste Test**: Literally copy the code from the documentation and paste it into a new project or a sandbox environment to ensure it works as expected.
*   **Code Review**: Have other developers review the examples for accuracy, clarity, and adherence to best practices.
*   **Design Review**: Ensure the visual output of the code examples matches the design intent.

## Implementation Notes

-   **Storybook's `Source` block** is the most efficient way to provide copyable code for stories, as it stays in sync with the actual component implementation.
-   For patterns or complex examples, you might need to manually write the code block.
-   Consider adding a "Copy to Clipboard" button for each code example for enhanced usability.

## Future Considerations

-   Integrate a live code editor (e.g., CodeMirror, Monaco Editor) directly into the documentation for more advanced interactive examples.
-   Automate the generation of code examples from component definitions or Storybook stories.
-   Track usage of code examples to identify most popular snippets.
