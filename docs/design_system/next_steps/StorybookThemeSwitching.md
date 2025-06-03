# Adding Theme Switching Capability to Storybook

This document outlines the process for integrating a theme switching mechanism directly into Storybook. This allows developers and designers to easily preview components in both light and dark themes without leaving the Storybook environment, ensuring visual consistency and adherence to design guidelines.

## Objectives

-   Enable a global theme toggle within Storybook.
-   Ensure all components render correctly when the theme is switched.
-   Provide a seamless preview experience for both light and dark modes.
-   Document the setup for future maintenance.

## Implementation Steps

### 1. Configure Tailwind CSS for Dark Mode

Ensure your `tailwind.config.js` is set up to use the `class` strategy for dark mode. This is typically already done if the application supports dark mode.

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // This line is crucial
  // ...
}
```

### 2. Create a Theme Provider/Decorator for Storybook

You'll need a Storybook decorator that wraps your components and applies the `dark` class to the `html` element when the dark theme is selected.

*   **Create `/.storybook/withTheme.js` (or `.ts`):**

    ```javascript
    // .storybook/withTheme.js
    import React, { useEffect } from 'react';
    import { useGlobals } from '@storybook/manager-api'; // Or '@storybook/addons' depending on Storybook version

    export const withTheme = (Story, context) => {
      const [{ theme }] = useGlobals();

      useEffect(() => {
        const htmlClasses = document.documentElement.classList;
        if (theme === 'dark') {
          htmlClasses.add('dark');
        } else {
          htmlClasses.remove('dark');
        }
      }, [theme]);

      return <Story />;
    };
    ```

### 3. Register the Theme Decorator and Add a Global Toolbar Item

Modify your `.storybook/preview.js` (or `.ts`) to register the decorator and add a global toolbar item for theme selection.

*   **Update `/.storybook/preview.js` (or `.ts`):**

    ```javascript
    // .storybook/preview.js
    import { withTheme } from './withTheme'; // Import your theme decorator

    export const decorators = [withTheme];

    export const globalTypes = {
      theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: 'light',
        toolbar: {
          icon: 'circlehollow', // Or 'sun', 'moon'
          items: [
            { value: 'light', icon: 'sun', title: 'Light' },
            { value: 'dark', icon: 'moon', title: 'Dark' },
          ],
          showName: true,
        },
      },
    };

    // Other Storybook configurations (parameters, etc.)
    export const parameters = {
      // ...
    };
    ```

### 4. Ensure Global Styles are Loaded

Make sure your main CSS file (e.g., `globals.css` or `index.css`) that includes Tailwind's base styles is imported into Storybook's preview.

*   **Update `/.storybook/preview.js` (or `.ts`):**

    ```javascript
    // .storybook/preview.js
    import '../src/styles/globals.css'; // Adjust path as necessary
    // ... other imports and exports
    ```

## Testing

*   **Storybook UI**: Open Storybook and verify that the theme toggle appears in the toolbar.
*   **Component Preview**: Switch between light and dark themes and observe if all components correctly apply their respective styles.
*   **Edge Cases**: Test components with complex styling, nested elements, and interactive states in both themes.

## Implementation Notes

-   The `useGlobals` hook is part of Storybook's manager API. Ensure your Storybook version supports it.
-   The `useEffect` hook ensures that the `dark` class is applied to the `html` element whenever the global `theme` changes in Storybook.
-   The `toolbar` configuration in `globalTypes` creates the dropdown selector in Storybook's top bar.

## Future Considerations

-   Integrate a "system preference" option into the Storybook theme switcher.
-   Automate visual regression tests for both light and dark themes within Storybook.
-   Create a custom Storybook theme that matches the application's branding.
