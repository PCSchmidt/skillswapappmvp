# Color Contrast Guidelines: Text on Colored Backgrounds

This document outlines guidelines for ensuring sufficient color contrast for text placed on colored backgrounds across the SkillSwap application. Adhering to these guidelines is crucial for readability and accessibility, especially for users with visual impairments.

## Principles

-   **WCAG Compliance**: All text and essential images of text must meet WCAG 2.1 AA contrast ratios.
-   **Readability**: Ensure text is easily distinguishable from its background.
-   **Consistency**: Apply contrast standards consistently across all color combinations.

## WCAG 2.1 AA Contrast Ratios

The Web Content Accessibility Guidelines (WCAG) 2.1 Level AA specifies the following minimum contrast ratios:

*   **Normal Text**: A contrast ratio of at least **4.5:1** for text and images of text.
*   **Large Text**: A contrast ratio of at least **3:1** for large-scale text and images of large-scale text.
    *   Large-scale text is defined as 18pt (24px) or larger, or 14pt (18.66px) bold or larger.
*   **Incidental/Decorative**: Text that is part of an inactive user interface component, is pure decoration, is not visible to anyone, or is part of a picture that contains significant other visual content, has no contrast requirement.
*   **Logotypes**: Text that is part of a logo or brand name has no contrast requirement.

## Tools for Checking Contrast

Use the following tools to verify contrast ratios during design and development:

*   **WebAIM Contrast Checker**: Online tool for checking foreground and background color contrast.
*   **Chrome DevTools**: The Lighthouse audit and the "Color Picker" in the Elements panel can show contrast ratios.
*   **Figma/Sketch/Adobe XD Plugins**: Many design tools have plugins (e.g., Stark, Contrast) that check contrast directly within the design environment.
*   **Color Contrast Analyzer (Desktop App)**: A standalone application for checking contrast anywhere on your screen.

## Guidelines for Colored Backgrounds

When placing text on any colored background (including primary, secondary, neutral, alert, and gradient colors), ensure the text color provides sufficient contrast.

### Examples of Good Contrast

*   **Primary Background (`primary-500`) with White Text (`text-white`)**:
    *   Ensure `primary-500` is dark enough to provide at least 4.5:1 contrast with white.
    *   Example: `bg-primary-500 text-white`
*   **Dark Neutral Background (`neutral-800`) with Light Text (`text-neutral-100`)**:
    *   Ensure `neutral-800` provides sufficient contrast with `neutral-100`.
    *   Example: `bg-neutral-800 text-neutral-100`
*   **Light Neutral Background (`neutral-100`) with Dark Text (`text-neutral-800`)**:
    *   Ensure `neutral-100` provides sufficient contrast with `neutral-800`.
    *   Example: `bg-neutral-100 text-neutral-800`
*   **Alert Backgrounds (e.g., `bg-error-500`) with White Text (`text-white`)**:
    *   Ensure alert colors are designed to meet contrast requirements with white or black text.
    *   Example: `bg-error-500 text-white`

### Examples of Poor Contrast (to Avoid)

*   Light text on a light background.
*   Dark text on a dark background.
*   Text on a busy or complex background image without a sufficient overlay.
*   Text on a gradient where one part of the gradient has insufficient contrast.

## Implementation Notes

-   **Design System Palette**: Ensure all colors in the design system's palette are pre-vetted for contrast compliance when used with their intended foreground/background pairings.
-   **Dynamic Content**: Pay special attention to user-generated content or dynamic data where background colors might vary.
-   **Dark Mode**: Verify contrast ratios for both light and dark themes.

## Future Considerations

-   Integrate automated contrast checking into the CI/CD pipeline.
-   Develop a Storybook addon or component that visually demonstrates contrast ratios for different color pairings.
-   Provide a clear mapping of approved text/background color combinations within the design system documentation.
