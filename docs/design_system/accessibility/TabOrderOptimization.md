# Tab Order Optimization

This document outlines guidelines for optimizing tab order (keyboard navigation sequence) across the SkillSwap application to ensure a logical and intuitive experience for users who rely on keyboard navigation.

## Principles

-   **Logical Flow**: The tab order should follow a logical and predictable sequence that matches the visual layout and the user's mental model of the page.
-   **Focus Management**: Ensure that interactive elements receive focus in a meaningful order.
-   **Avoid Traps**: Prevent keyboard traps where focus gets stuck in a specific area of the page.
-   **Semantic HTML**: Leverage semantic HTML elements as much as possible, as they often have built-in correct tab order.

## Guidelines

### 1. Natural Tab Order

By default, interactive HTML elements (like `a`, `button`, `input`, `select`, `textarea`) receive focus in the order they appear in the DOM. This is the preferred method.

*   **Best Practice**: Structure your HTML content in a logical order that naturally reflects the visual flow of the page.

```html
<!-- ✅ Correct: Natural tab order -->
<button>Previous</button>
<button>Next</button>

<!-- ❌ Incorrect: Visual order doesn't match DOM order -->
<div style="display: flex; flex-direction: row-reverse;">
  <button>Next</button>
  <button>Previous</button>
</div>
```

### 2. Using `tabindex`

Use `tabindex` attribute only when absolutely necessary and with caution.

*   **`tabindex="0"`**: Makes an element focusable in the natural tab order. Use this for non-interactive elements that *need* to be focusable (e.g., custom controls, content that becomes interactive via JavaScript).

    ```html
    <div tabindex="0" role="button">Custom Button</div>
    ```

*   **`tabindex="-1"`**: Makes an element programmatically focusable (via JavaScript) but removes it from the natural tab order. Useful for managing focus in complex widgets (e.g., modals, dropdowns) or for skip links.

    ```html
    <div id="modal" tabindex="-1">...</div>
    ```

*   **Avoid `tabindex` values greater than `0`**: Using `tabindex="1"`, `tabindex="2"`, etc., creates an explicit tab order that overrides the natural DOM order. This is highly discouraged as it can lead to confusing navigation, is difficult to maintain, and can break if new elements are added.

    ```html
    <!-- ❌ Avoid: Creates an explicit, hard-to-maintain tab order -->
    <button tabindex="2">Second</button>
    <button tabindex="1">First</button>
    ```

### 3. Managing Focus in Dynamic Content

When content appears or disappears (e.g., modals, dialogs, alerts):

*   **Shift Focus**: When a new interactive element appears (like a modal), move keyboard focus to the first interactive element within that new content.
*   **Trap Focus**: For modal dialogs, ensure focus is "trapped" within the modal until it is closed, preventing users from tabbing to content behind the modal.
*   **Restore Focus**: When the dynamic content is closed, return focus to the element that triggered its opening.

### 4. Skip Links

For pages with repetitive navigation or large content blocks, provide "skip links" at the top of the page. These allow keyboard users to quickly jump to the main content area.

```html
<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>
<main id="main-content">...</main>
```

## Implementation Notes

-   Regularly test keyboard navigation using the `Tab` key, `Shift + Tab`, `Enter`, and `Spacebar`.
-   Use browser developer tools (e.g., Chrome's "Audits" or "Lighthouse" for accessibility checks) to identify tab order issues.
-   Collaborate with UX designers to ensure the visual flow aligns with the intended tab order.

## Future Considerations

-   Integrate automated accessibility testing tools (e.g., Axe-core, Cypress-axe) into the CI/CD pipeline to catch tab order and focus management issues early.
-   Develop custom hooks or utilities for common focus management patterns (e.g., `useFocusTrap`).
