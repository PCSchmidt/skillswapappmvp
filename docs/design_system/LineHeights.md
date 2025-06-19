# Line Height Definitions

This document outlines the standard line height (leading) definitions to be used across the SkillSwap application. Consistent line heights improve readability and visual rhythm.

## Principles

-   **Readability**: Line heights should optimize text readability, especially for longer blocks of text.
-   **Vertical Rhythm**: Contribute to a consistent vertical rhythm across the UI.
-   **Proportionality**: Line heights are often proportional to font size, but can be adjusted for specific typographic needs.

## Standard Line Heights

We define line heights using Tailwind CSS utility classes. These correspond to a base line height scale.

### Default Line Heights

These are the most commonly used line heights, typically applied to body text and headings.

*   **`leading-none`**: `1` (no extra space)
*   **`leading-tight`**: `1.25`
*   **`leading-snug`**: `1.375`
*   **`leading-normal`**: `1.5` (default for most body text)
*   **`leading-relaxed`**: `1.625`
*   **`leading-loose`**: `2`

**Tailwind CSS Example:**

```html
<p class="text-base leading-normal">This is a paragraph with normal line height.</p>
<h1 class="text-3xl leading-tight">Heading with tight line height</h1>
```

### Contextual Adjustments

In some cases, line heights may be adjusted for specific contexts:

*   **Small Text**: For very small text (e.g., captions, legal text), a slightly tighter line height might be appropriate to save vertical space while maintaining readability.
*   **Large Headings**: For very large headings, a tighter line height can improve visual balance.

## Implementation Notes

-   Always prefer using the predefined Tailwind CSS `leading-*` classes.
-   Avoid custom pixel or unit-based line heights unless absolutely necessary for a unique design element.
-   Test line heights across different font sizes and content lengths to ensure optimal readability.

## Future Considerations

-   Integrate line height definitions directly into a typography scale if a more complex system is adopted.
-   Automate line height checks as part of visual regression testing.
