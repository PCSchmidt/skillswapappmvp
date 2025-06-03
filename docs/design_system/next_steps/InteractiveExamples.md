# Adding Interactive Examples Demonstrating Component Usage

This document outlines the process for adding interactive code examples to the SkillSwap design system documentation. Interactive examples allow developers to directly manipulate component props and see the changes reflected in real-time, significantly enhancing the learning and development experience.

## Objectives

-   Provide a dynamic way for developers to experiment with component props and variants.
-   Improve understanding of component behavior and customization options.
-   Reduce the friction of trying out components by offering live editable code.
-   Enhance the overall quality and utility of the design system documentation.

## Recommended Tools

### 1. Storybook with `addon-controls` and `addon-docs`

*   **`@storybook/addon-controls`**: Provides auto-generated UI controls for component props, allowing real-time manipulation.
*   **`@storybook/addon-docs`**: Enables MDX for rich documentation, including embedding live code examples.

### 2. Code Sandbox / StackBlitz Integration (for more complex scenarios)

*   For patterns or components that require a full development environment (e.g., API calls, routing), integrating with online IDEs like Code Sandbox or StackBlitz can provide a more isolated and shareable interactive experience.

## Process

### 1. Ensure `addon-controls` and `addon-docs` are Configured

Verify that these addons are correctly installed and registered in your Storybook configuration.

*   **`/.storybook/main.js` (or `.ts`):**

    ```javascript
    // .storybook/main.js
    module.exports = {
      addons: [
        // ... other addons
        '@storybook/addon-controls',
        '@storybook/addon-docs',
      ],
      // ...
    };
    ```

### 2. Define `argTypes` for Interactive Controls

For each component, ensure that `argTypes` are comprehensively defined in its `*.stories.tsx` file. This is what `addon-controls` uses to generate the interactive UI.

*   **Example (`Button.stories.tsx`):**

    ```typescript
    // src/components/ui/Button.stories.tsx
    import type { Meta, StoryObj } from '@storybook/react';
    import Button from './Button';

    const meta: Meta<typeof Button> = {
      // ...
      argTypes: {
        children: { control: 'text', description: 'Button content' },
        variant: {
          control: 'select',
          options: ['primary', 'secondary', 'outline'],
          description: 'Visual style of the button',
        },
        onClick: { action: 'clicked', description: 'Click handler' },
        disabled: { control: 'boolean', description: 'Whether the button is disabled' },
      },
      // ...
    };
    ```

### 3. Embed Live Code Examples in MDX (Optional, for Richer Docs)

For more detailed documentation, you can use MDX files to combine markdown with live Storybook components and code editors.

*   **Create `ComponentName.stories.mdx`:**

    ```mdx
    // src/components/ui/Button.stories.mdx
    import { Meta, Story, Controls, Primary } from '@storybook/blocks';
    import * as ButtonStories from './Button.stories';

    <Meta of={ButtonStories} />

    # Button

    The Button component is used for user actions.

    <Primary />

    <h2>Props</h2>
    <Controls />

    <h2>Live Example</h2>
    <Story of={ButtonStories.Default} />

    ```jsx
    // This code block will be rendered as a live editable example
    <Button variant="primary" onClick={() => alert('Hello!')}>
      Click Me
    </Button>
    ```
    ```

### 4. Test Interactive Examples

*   **Storybook UI**: Open Storybook and navigate to component stories.
*   **Controls Panel**: Verify that the "Controls" addon panel is visible and allows manipulation of props.
*   **Real-time Updates**: Ensure changes made via controls are immediately reflected in the component preview.
*   **Code Snippets**: If using MDX, verify that the code snippets are accurate and reflect the component's usage.

## Implementation Notes

-   **`argTypes` are Key**: The quality of interactive examples heavily depends on well-defined `argTypes`.
-   **Simplicity**: Keep interactive examples focused on demonstrating one or two key aspects of the component.
-   **Performance**: Be mindful of performance when embedding many interactive examples on a single page.

## Future Considerations

-   Integrate a "copy code" button for live examples.
-   Explore more advanced interactive playgrounds (e.g., using `react-live` or similar libraries) for complex components or patterns.
-   Automate the generation of interactive examples from component definitions.
