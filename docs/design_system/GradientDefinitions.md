# Gradient Definitions

This document outlines the standard gradient definitions to be used across the SkillSwap application. Gradients add depth and visual interest to UI elements.

## Principles

-   **Subtlety**: Gradients should enhance, not distract. They should be subtle and complement the overall color palette.
-   **Purposeful Use**: Use gradients to highlight key elements, indicate progress, or create visual separation. Avoid overuse.
-   **Accessibility**: Ensure sufficient contrast for any text or interactive elements placed on top of gradients.

## Standard Gradients

We define gradients using Tailwind CSS custom properties or direct class names where appropriate.

### Primary Gradient

Used for primary call-to-actions, prominent backgrounds, or brand elements.

*   **Direction**: To right (from left to right)
*   **Colors**: From `primary-500` to `primary-700`

**Tailwind CSS Example:**

```html
<div class="bg-gradient-to-r from-primary-500 to-primary-700"></div>
```

### Secondary Gradient

Used for secondary actions, complementary backgrounds, or decorative elements.

*   **Direction**: To right (from left to right)
*   **Colors**: From `secondary-500` to `secondary-700`

**Tailwind CSS Example:**

```html
<div class="bg-gradient-to-r from-secondary-500 to-secondary-700"></div>
```

### Accent Gradient (e.g., for Skill Categories)

A more vibrant gradient for specific elements like skill category tags or badges.

*   **Direction**: To bottom right
*   **Colors**: From `accent-400` to `accent-600`

**Tailwind CSS Example:**

```html
<div class="bg-gradient-to-br from-accent-400 to-accent-600"></div>
```

## Implementation Notes

-   For dynamic gradients or more complex scenarios, consider defining custom CSS variables or extending Tailwind's configuration.
-   Always test gradients across different browsers and devices to ensure consistent rendering.
-   When applying text over gradients, ensure the text color provides sufficient contrast against both the start and end colors of the gradient.

## Future Considerations

-   Explore defining gradients as reusable Tailwind CSS components or plugins.
-   Investigate accessibility tools specifically for gradients to ensure compliance.
