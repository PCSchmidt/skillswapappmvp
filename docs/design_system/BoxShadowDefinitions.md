# Box Shadow Definitions

This document outlines the standard box shadow definitions to be used across the SkillSwap application. Consistent shadows enhance depth, visual hierarchy, and provide a sense of elevation for UI elements.

## Principles

-   **Subtlety**: Shadows should be subtle and natural, mimicking real-world light.
-   **Hierarchy**: Use different shadow strengths to indicate hierarchy and interactivity.
-   **Consistency**: Apply shadows consistently to similar UI elements (e.g., cards, modals, elevated buttons).
-   **Accessibility**: Ensure shadows do not hinder readability or create visual clutter.

## Standard Box Shadows

We define box shadows using Tailwind CSS utility classes, which are configured in `tailwind.config.js`. These correspond to a predefined scale of elevation.

### Default Shadows

These are the most commonly used shadows for general UI elements.

*   **`shadow-sm`**: Small, subtle shadow for minor elevation.
    *   `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
*   **`shadow`**: Default shadow for cards and containers.
    *   `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
*   **`shadow-md`**: Medium shadow for more pronounced elevation.
    *   `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
*   **`shadow-lg`**: Large shadow for significant elevation (e.g., modals, dropdowns).
    *   `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
*   **`shadow-xl`**: Extra large shadow for highest elevation.
    *   `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
*   **`shadow-2xl`**: Largest shadow for extreme elevation.
    *   `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

**Tailwind CSS Example:**

```html
<div class="shadow-md p-4 bg-white rounded-lg">
  An elevated card with a medium shadow.
</div>
```

### Interactive Shadows (Hover/Focus)

For interactive elements, shadows can change on hover or focus to provide visual feedback.

*   **Example**: Transition from `shadow-sm` to `shadow-md` on hover.

**Tailwind CSS Example:**

```html
<button class="shadow-sm hover:shadow-md transition-shadow duration-200">
  Hover me
</button>
```

### Inner Shadow

Used for inset effects, typically for input fields or containers that appear recessed.

*   **`shadow-inner`**: Inset shadow.
    *   `inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)`

**Tailwind CSS Example:**

```html
<input type="text" class="shadow-inner">
```

## Implementation Notes

-   Always prefer using the predefined Tailwind CSS `shadow-*` classes.
-   Ensure shadows are subtle and do not create a "floating" or disconnected feel.
-   Test shadows in both light and dark themes to ensure they remain visually appealing and functional.

## Future Considerations

-   Define specific rules for when to use each shadow variant based on component type and interaction state.
-   Automate visual regression testing to ensure shadow consistency.
