# Drop Shadow Definitions

This document outlines the standard drop shadow definitions to be used across the SkillSwap application. Drop shadows are a specific type of shadow applied to SVG elements or images, distinct from box shadows which apply to HTML box elements.

## Principles

-   **Visual Depth**: Drop shadows enhance the perception of depth and separation for non-rectangular elements.
-   **Consistency**: Apply drop shadows consistently to similar visual elements (e.g., icons, illustrations, custom shapes).
-   **Subtlety**: Like box shadows, drop shadows should be subtle and natural.

## Standard Drop Shadows

Drop shadows are typically applied using SVG filters or CSS `filter: drop-shadow()` property. Tailwind CSS does not directly provide `drop-shadow` utilities in the same way as `box-shadow`. Therefore, these will often be custom CSS or inline SVG filters.

### Common Drop Shadow Values (CSS `filter: drop-shadow()`)

These values are illustrative and should be defined in your CSS or `tailwind.config.js` if extending.

*   **Small Drop Shadow**: `drop-shadow(0 1px 1px rgba(0,0,0,0.05))`
*   **Medium Drop Shadow**: `drop-shadow(0 4px 3px rgba(0,0,0,0.07)) drop-shadow(0 2px 2px rgba(0,0,0,0.06))`
*   **Large Drop Shadow**: `drop-shadow(0 10px 8px rgba(0,0,0,0.04)) drop-shadow(0 4px 3px rgba(0,0,0,0.1))`

**CSS Example:**

```css
.icon-shadow {
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
}
```

**Tailwind CSS (Extended) Example:**

If extending `tailwind.config.js` with custom `drop-shadow` utilities:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      dropShadow: {
        'sm': '0 1px 1px rgba(0,0,0,0.05)',
        'md': ['0 4px 3px rgba(0,0,0,0.07)', '0 2px 2px rgba(0,0,0,0.06)'],
        'lg': ['0 10px 8px rgba(0,0,0,0.04)', '0 4px 3px rgba(0,0,0,0.1)'],
      }
    }
  }
}
```

```html
<img src="icon.svg" class="drop-shadow-md">
```

### SVG Filter Example

For more complex or precise control over SVG element shadows.

```xml
<svg width="100" height="100">
  <defs>
    <filter id="drop-shadow-filter">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.4)"/>
    </filter>
  </defs>
  <circle cx="50" cy="50" r="40" fill="blue" filter="url(#drop-shadow-filter)"/>
</svg>
```

## Implementation Notes

-   Prefer using CSS `filter: drop-shadow()` for HTML elements (like `img`) if possible, as it's simpler than SVG filters.
-   For SVG elements, use SVG filters for native shadow application.
-   Ensure drop shadows are subtle and do not create a "halo" effect or visual noise.
-   Test shadows in both light and dark themes to ensure they remain visually appealing and functional.

## Future Considerations

-   Define specific rules for when to use drop shadows versus box shadows.
-   Automate visual regression testing for elements with drop shadows.
