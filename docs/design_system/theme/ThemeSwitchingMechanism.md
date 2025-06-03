# Theme Switching Mechanism Guidelines

This document outlines guidelines for implementing a theme switching mechanism (e.g., light/dark mode toggle) across the SkillSwap application. A robust theme switcher enhances user experience by allowing personalization and adapting to user preferences and environmental conditions.

## Principles

-   **User Preference**: Prioritize user choice, allowing them to manually select their preferred theme.
-   **System Preference**: Respect the user's operating system theme preference (`prefers-color-scheme`).
-   **Persistence**: The selected theme should persist across sessions.
-   **Performance**: Theme switching should be fast and seamless, avoiding flashes of unstyled content.

## Implementation Approaches

### 1. Tailwind CSS `dark:` Modifier (Recommended for Simplicity)

This approach leverages Tailwind CSS's built-in `dark:` variant, which applies styles only when dark mode is active.

*   **Mechanism**: A `dark` class is added to the `html` element (or a parent element) to activate dark mode styles.
*   **Toggle**: JavaScript is used to add/remove the `dark` class.
*   **Persistence**: Store the user's preference in `localStorage`.
*   **System Preference**: Use a media query (`prefers-color-scheme`) to set the initial theme.

**Example `tailwind.config.js` setup:**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable dark mode based on a class
  // ...
}
```

**Example JavaScript for toggling and persistence:**

```javascript
// In a script that runs before React hydration (e.g., _document.js or a script tag in _app.js)
(function() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
})();

// In a React component for a toggle button
import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <button onClick={toggleTheme}>
      Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
    </button>
  );
};
```

### 2. CSS Variables (More Advanced Theming)

For more complex theming systems or when needing to dynamically change colors beyond what Tailwind's `dark:` modifier offers.

*   **Mechanism**: Define colors as CSS custom properties (variables) and update these variables based on the active theme.
*   **Toggle**: JavaScript changes a `data-theme` attribute on the `html` element or updates CSS variables directly.
*   **Persistence**: Store preference in `localStorage`.

**Example CSS:**

```css
:root {
  --color-primary: #007bff;
  --color-background: #ffffff;
}

html.dark {
  --color-primary: #66b3ff;
  --color-background: #1a1a1a;
}
```

**Example Tailwind `tailwind.config.js` (if using CSS variables with Tailwind):**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--color-background)',
      },
    },
  },
  // ...
}
```

## Guidelines for Implementation

-   **Initial Load**: Ensure the correct theme is applied as early as possible during page load to prevent "flash of unstyled content" (FOUC). The JavaScript snippet for `localStorage` check should run before the page renders.
-   **User Interface**: Provide a clear and accessible UI element (e.g., a toggle switch, a menu item) for theme switching.
-   **Accessibility**: Ensure the theme switcher itself is accessible (keyboard navigable, screen reader friendly).
-   **Testing**: Test theme switching thoroughly, including:
    *   Manual toggling.
    *   Persistence across page reloads and sessions.
    *   Behavior with system `prefers-color-scheme` settings.
    *   Visual consistency of all components in both themes.

## Future Considerations

-   Implement multiple themes (e.g., high contrast, sepia).
-   Integrate theme switching with user profile settings.
-   Automate visual regression testing for both light and dark themes.
