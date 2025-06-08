# Border Styles

This document outlines the standard border styles to be used across the SkillSwap application. Consistent borders contribute to visual clarity, separation, and a polished aesthetic.

## Principles

-   **Clarity**: Borders should clearly delineate elements without adding unnecessary visual clutter.
-   **Consistency**: Apply border styles consistently to similar UI elements (e.g., input fields, cards, dividers).
-   **Subtlety**: Most borders should be subtle, serving as functional separators rather than dominant design elements.

## Standard Border Styles

We define border styles using Tailwind CSS utility classes, leveraging our defined color palette and border width values.

### Border Widths (from `BorderRadius.md` - assuming this is where widths are defined)

Our standard border widths are:

*   **`border`**: `1px`
*   **`border-2`**: `2px`
*   **`border-4`**: `4px`
*   **`border-8`**: `8px`

### Border Colors

Borders should primarily use colors from the neutral palette to maintain a clean interface.

*   **Default**: `neutral-200` (light mode), `neutral-700` (dark mode)
*   **Interactive/Focus**: `primary-500`
*   **Error**: `error-500`
*   **Success**: `success-500`

### Examples

#### Default Border

Used for general separation, input fields, and card outlines.

```html
<div class="border border-neutral-200 dark:border-neutral-700 p-4">
  Content with a default border.
</div>
```

#### Focused Input Border

Applied to interactive elements when they are in a focused state.

```html
<input type="text" class="border focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
```

#### Divider

Used for horizontal or vertical separation between content blocks.

```html
<hr class="border-t border-neutral-200 dark:border-neutral-700 my-4">
```

#### Bordered Card

Used for cards that require a clear outline.

```html
<div class="border border-neutral-300 dark:border-neutral-600 rounded-md p-4">
  A card with a border.
</div>
```

## Implementation Notes

-   Always prefer using Tailwind's `border`, `border-t`, `border-b`, etc., utilities combined with color classes.
-   Ensure border colors provide sufficient contrast against the background, especially for interactive elements.
-   For complex components, consider defining custom CSS variables for borders if dynamic styling is required.

## Future Considerations

-   Explore defining custom border styles (e.g., dashed, dotted) if needed.
-   Automate checks for consistent border application in code reviews.
