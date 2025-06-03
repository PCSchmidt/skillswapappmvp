# Color Contrast Guidelines: Interactive States

This document outlines guidelines for ensuring sufficient color contrast for interactive states (e.g., hover, focus, active) across the SkillSwap application. Maintaining contrast in these states is critical for users with visual impairments to perceive when an element is interactive or has been activated.

## Principles

-   **Perceivability**: Users must be able to perceive changes in interactive states.
-   **WCAG Compliance**: Interactive elements must meet WCAG 2.1 AA contrast ratios for both their default and interactive states.
-   **Consistency**: Apply contrast standards consistently across all interactive elements.

## WCAG 2.1 AA Contrast Ratios for Interactive Elements

The WCAG 2.1 Level AA specifies the following minimum contrast ratios for interactive elements:

*   **Non-text Contrast**: A contrast ratio of at least **3:1** for user interface components and graphical objects. This applies to:
    *   Visual information required to identify user interface components (e.g., input borders, checkboxes, radio buttons).
    *   Parts of graphics required to understand the content (e.g., charts, diagrams).

This means that the visual distinction between an interactive element's default state and its hover/focus/active state must meet at least a 3:1 contrast ratio.

## Interactive States to Consider

*   **Hover**: When a pointer (mouse) is over an interactive element.
*   **Focus**: When an interactive element receives keyboard focus (e.g., via `Tab` key). This is critical for keyboard navigation.
*   **Active/Pressed**: When an interactive element is being activated (e.g., a button being clicked, a link being pressed).
*   **Selected/Checked**: For elements like radio buttons, checkboxes, or selected tabs/menu items.
*   **Disabled**: While disabled elements often have reduced contrast, they should still be perceivable as disabled. WCAG does not specify a minimum contrast for disabled states, but it's good practice to ensure they are not completely invisible.

## Tools for Checking Contrast

The same tools used for text on colored backgrounds can be used here:

*   **WebAIM Contrast Checker**: For checking color pairings.
*   **Chrome DevTools**: Inspect elements in different states (hover, focus) and check their contrast.
*   **Design Tool Plugins**: Use plugins like Stark or Contrast to check contrast during design.

## Guidelines for Interactive States

### 1. Focus Indicators

*   **Always Visible**: Ensure focus indicators are always visible and have sufficient contrast (at least 3:1 against the background and the component itself).
*   **Distinct**: Focus indicators should be distinct from hover states and default states.
*   **Thickness**: A thicker outline (e.g., 2px or more) is generally better than a thin one.

**Tailwind CSS Example (for focus ring):**

```html
<button class="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
  Button
</button>
```

### 2. Hover States

*   **Visual Change**: Provide a clear visual change on hover (e.g., background color change, text color change, subtle shadow).
*   **Contrast**: Ensure the hover state's colors maintain at least 3:1 contrast with the surrounding elements and the text within the element.

**Tailwind CSS Example:**

```html
<button class="bg-primary-500 text-white hover:bg-primary-600">
  Button
</button>
```

### 3. Selected/Active States

*   **Clear Indication**: Clearly indicate when an item is selected or active (e.g., a selected tab, a checked checkbox).
*   **Contrast**: The selected state's visual indicator (e.g., background, border) should have at least 3:1 contrast with its unselected state and surrounding elements.

**Tailwind CSS Example (for selected tab):**

```html
<button class="text-gray-700 border-b-2 border-transparent hover:border-primary-500 aria-selected:border-primary-500 aria-selected:text-primary-600">
  Tab
</button>
```

## Implementation Notes

-   **CSS Transitions**: Use CSS transitions for smooth visual feedback on interactive states.
-   **Test with Keyboard**: Always test interactive states using only the keyboard to ensure focus management and visual feedback are clear.
-   **Dark Mode**: Verify interactive states in both light and dark themes.

## Future Considerations

-   Automate visual regression testing to ensure interactive state consistency.
-   Develop a Storybook addon or component that visually demonstrates interactive state contrast.
