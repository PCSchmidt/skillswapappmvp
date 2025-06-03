# Adding A11y Testing Addon to Storybook

This document outlines the process for integrating the Storybook A11y addon. This addon uses `axe-core` to automatically test the accessibility of components in Storybook, providing real-time feedback and helping developers catch common accessibility issues early in the development cycle.

## Objectives

-   Automate accessibility checks for Storybook components.
-   Provide immediate visual feedback on accessibility violations.
-   Educate developers on common accessibility issues and best practices.
-   Integrate accessibility testing into the component development workflow.

## Setup Process

### 1. Install Dependencies

```bash
npm install --save-dev @storybook/addon-a11y
```

### 2. Register the Addon

Add the `addon-a11y` to your Storybook configuration file.

*   **Update `/.storybook/main.js` (or `.ts`):**

    ```javascript
    // .storybook/main.js
    module.exports = {
      addons: [
        // ... other addons
        '@storybook/addon-a11y',
      ],
      // ...
    };
    ```

### 3. Configure the Addon (Optional but Recommended)

You can configure `axe-core` rules and parameters in your `/.storybook/preview.js` (or `.ts`) file. This allows you to customize which rules are run, exclude specific elements, or set impact levels.

*   **Update `/.storybook/preview.js` (or `.ts`):**

    ```javascript
    // .storybook/preview.js
    export const parameters = {
      a11y: {
        // Optional: configure axe-core
        config: {
          rules: [
            // Example: Disable a specific rule
            { id: 'color-contrast', enabled: false },
          ],
        },
        // Optional: exclude elements from being checked
        // exclude: ['#skip-link'],
        // Optional: set the element to be used for the a11y panel
        // element: '#root',
      },
      // ... other parameters
    };
    ```

## Usage

Once the addon is installed and configured, when you run Storybook:

1.  **Open Storybook**: `npm run storybook`
2.  **Navigate to a Component Story**: Select any component story in the sidebar.
3.  **Open A11y Tab**: In the Storybook addons panel (usually at the bottom), you will see an "Accessibility" or "A11y" tab.
4.  **Review Results**: This tab will display a list of accessibility violations, their impact level (critical, serious, moderate, minor), and suggestions for how to fix them. It also highlights the problematic elements directly in the component preview.

## Implementation Notes

-   **Real-time Feedback**: The A11y addon provides immediate feedback, allowing developers to fix issues as they build components.
-   **Not a Replacement for Manual Testing**: While powerful, automated tools like `axe-core` can only detect a subset of accessibility issues. Manual testing with screen readers and keyboard navigation is still essential.
-   **Custom Rules**: If your design system has specific accessibility requirements not covered by default `axe-core` rules, you can extend or customize them.

## Future Considerations

-   Integrate `axe-core` into unit or end-to-end tests for automated accessibility checks in CI/CD.
-   Develop custom Storybook stories specifically designed to test complex accessibility scenarios (e.g., focus management in modals).
-   Provide training to developers on interpreting and resolving accessibility issues reported by the addon.
