# Dark Theme Color Palette

This document defines the dark theme color palette for the SkillSwap application. The dark theme aims to provide a comfortable viewing experience in low-light environments while maintaining brand consistency and accessibility.

## Principles

-   **Readability**: Ensure text and interactive elements remain highly readable against dark backgrounds.
-   **Reduced Eye Strain**: Use darker, desaturated colors to minimize glare and eye strain.
-   **Brand Consistency**: Maintain the core brand identity through appropriate use of primary and secondary colors.
-   **Accessibility**: Adhere to WCAG 2.1 AA contrast ratios for all text and interactive elements.

## Color Categories

### 1. Primary Colors

Used for primary actions, branding, and key interactive elements. These should be lighter shades of the primary brand color to stand out against dark backgrounds.

*   **`primary-50`**: `#E0F2F7` (Lightest primary for accents)
*   **`primary-100`**: `#B3E0ED`
*   **`primary-200`**: `#80CCDF`
*   **`primary-300`**: `#4DB8D1`
*   **`primary-400`**: `#1A9EC3`
*   **`primary-500`**: `#008BB5` (Main primary for dark theme)
*   **`primary-600`**: `#007A9E`
*   **`primary-700`**: `#006987`
*   **`primary-800`**: `#005870`
*   **`primary-900`**: `#004759`

### 2. Secondary Colors

Used for secondary actions, complementary elements, and to provide visual variety.

*   **`secondary-50`**: `#F7F2E0`
*   **`secondary-100`**: `#EDE0B3`
*   **`secondary-200`**: `#DFCC80`
*   **`secondary-300`**: `#D1B84D`
*   **`secondary-400`**: `#C39E1A`
*   **`secondary-500`**: `#B58B00` (Main secondary for dark theme)
*   **`secondary-600`**: `#9E7A00`
*   **`secondary-700`**: `#876900`
*   **`secondary-800`**: `#705800`
*   **`secondary-900`**: `#594700`

### 3. Neutral Shades (Grayscale)

Used for backgrounds, text, borders, and dividers. These are crucial for establishing the overall dark aesthetic.

*   **`neutral-50`**: `#1A1A1A` (Darkest background)
*   **`neutral-100`**: `#262626`
*   **`neutral-200`**: `#333333`
*   **`neutral-300`**: `#404040`
*   **`neutral-400`**: `#525252`
*   **`neutral-500`**: `#737373`
*   **`neutral-600`**: `#A3A3A3`
*   **`neutral-700`**: `#D4D4D4`
*   **`neutral-800`**: `#E5E5E5`
*   **`neutral-900`**: `#F5F5F5` (Lightest neutral for text/icons)

### 4. Alert/Feedback Colors

Used for conveying status messages (success, warning, error, info). These should maintain their semantic meaning while ensuring contrast against dark backgrounds.

*   **Success**: `success-400` (`#4CAF50`) on `neutral-800` background
*   **Warning**: `warning-400` (`#FFC107`) on `neutral-800` background
*   **Error**: `error-400` (`#EF5350`) on `neutral-800` background
*   **Info**: `info-400` (`#2196F3`) on `neutral-800` background

## Implementation Notes

-   **Tailwind Configuration**: These colors should be extended in `tailwind.config.js` under the `darkMode` section or as custom properties.
-   **CSS Variables**: Consider using CSS variables for easier theme switching and dynamic color adjustments.
-   **Contrast Testing**: Always verify contrast ratios using tools like WebAIM Contrast Checker for all text and interactive elements.
-   **Semantic Use**: Use colors semantically (e.g., `primary` for main actions, `error` for errors) rather than by their literal shade.

## Future Considerations

-   Automate dark theme color contrast checks in CI/CD.
-   Develop a theme switcher component that dynamically applies dark mode classes or variables.
-   Refine specific component color pairings for optimal dark mode appearance.
