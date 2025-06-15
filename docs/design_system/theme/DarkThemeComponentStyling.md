# Dark Theme Component Styling Guidelines

This document outlines guidelines for styling individual components in the dark theme for the SkillSwap application. The goal is to ensure all components are visually appealing, readable, and functional in dark mode, adhering to the defined dark theme color palette.

## Principles

-   **Semantic Colors**: Use color tokens (e.g., `neutral-900`, `primary-500`) rather than hardcoded hex values.
-   **Contrast**: Maintain sufficient contrast for text and interactive elements as per WCAG 2.1 AA guidelines.
-   **Subtle Depth**: Use subtle shadows and borders to create depth without introducing harshness.
-   **Reduced Luminance**: Overall luminance should be lower than the light theme to reduce eye strain.
-   **Consistency**: Apply dark theme styles consistently across all instances of a component.

## General Styling Approaches

### 1. Backgrounds

*   Use darker neutral shades for backgrounds (`neutral-900`, `neutral-800`, `neutral-700`).
*   Elevated surfaces (cards, modals) should be slightly lighter than the main background to create a sense of depth.

**Tailwind CSS Example:**

```html
<div class="bg-neutral-900 text-neutral-100">Main content area</div>
<div class="bg-neutral-800 shadow-md">Card background</div>
```

### 2. Text Colors

*   Use lighter neutral shades for text (`neutral-100`, `neutral-200`, `neutral-300`).
*   Ensure sufficient contrast with the background.
*   Primary and secondary text should use `neutral-100` or `neutral-200`.
*   Helper text or less important information can use `neutral-400` or `neutral-500`.

**Tailwind CSS Example:**

```html
<p class="text-neutral-100">Main text</p>
<span class="text-neutral-400">Helper text</span>
```

### 3. Borders and Dividers

*   Use darker, subtle neutral shades for borders and dividers (`neutral-700`, `neutral-600`).
*   Avoid harsh white or very light borders.

**Tailwind CSS Example:**

```html
<div class="border border-neutral-700">Bordered element</div>
<hr class="border-neutral-600">
```

### 4. Icons

*   Icons should generally follow text color guidelines (lighter shades of neutral).
*   Interactive icons should have clear hover/focus states with sufficient contrast.

**Tailwind CSS Example:**

```html
<svg class="text-neutral-200 hover:text-primary-400">...</svg>
```

### 5. Interactive Elements (Buttons, Inputs, Links)

*   **Buttons**:
    *   Primary buttons: Use a lighter primary color for background (`primary-500` or `primary-400`) with dark text (`neutral-900`) or a contrasting light text (`neutral-100`).
    *   Outline buttons: Use lighter primary/secondary colors for borders and text.
    *   Hover/Focus states: Ensure clear visual feedback with sufficient contrast.
*   **Inputs**:
    *   Background: Darker neutral shades (`neutral-800` or `neutral-700`).
    *   Text: Lighter neutral shades (`neutral-100`).
    *   Borders: Subtle neutral shades (`neutral-600` or `neutral-500`).
    *   Placeholder text: `neutral-500` or `neutral-600`.
*   **Links**: Use primary or secondary colors that stand out against dark backgrounds. Ensure hover/focus states are distinct.

**Tailwind CSS Example:**

```html
<button class="bg-primary-500 text-white hover:bg-primary-600">Primary Button</button>
<input class="bg-neutral-800 text-neutral-100 border-neutral-600 placeholder-neutral-500">
<a class="text-primary-400 hover:text-primary-300">Link</a>
```

## Implementation Notes

-   **Tailwind `dark:` prefix**: Use Tailwind's `dark:` prefix for dark mode specific styles. This allows for easy toggling.
    ```html
    <div class="bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">...</div>
    ```
-   **CSS Variables**: For more complex theming or dynamic color changes, define CSS variables for colors and switch them based on a `data-theme` attribute or `prefers-color-scheme`.
-   **Testing**: Thoroughly test all components in dark mode, paying close attention to contrast, readability, and visual consistency.

## Future Considerations

-   Develop a comprehensive dark mode Storybook theme to preview all components.
-   Automate visual regression testing for dark mode.
-   Implement a user-facing theme switcher.
