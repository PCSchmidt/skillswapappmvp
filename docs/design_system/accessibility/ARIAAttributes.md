# ARIA Attributes Guidelines

This document outlines guidelines for using Accessible Rich Internet Applications (ARIA) attributes across the SkillSwap application. ARIA attributes enhance the accessibility of dynamic web content and user interface components, especially for users of assistive technologies like screen readers.

## Principles

-   **Use Semantic HTML First**: Always prioritize native HTML elements and attributes over ARIA when a suitable HTML element exists. ARIA should only be used when HTML is insufficient.
    *   **Rule of Thumb**: If you can use a native HTML element or attribute with the semantics and behavior you require, use it instead of re-purposing an element and adding ARIA.
-   **Don't Change Native Semantics**: Do not change the native semantics of an element unless you absolutely must.
    *   **Example**: Do not give `role="button"` to a `div` if a `<button>` element would suffice.
-   **All Interactive ARIA Elements Must Be Keyboard Accessible**: If you use ARIA to make a non-interactive element interactive, you must also ensure it is keyboard navigable and operable.
-   **Don't Use `role="presentation"` or `aria-hidden="true"` on Visible, Focusable Elements**: This will hide the element from assistive technologies, making it inaccessible.

## Key ARIA Concepts

### Roles

ARIA `role` attributes define the type or purpose of a UI element.

*   **`role="button"`**: For elements that behave like buttons but are not native `<button>` elements.
*   **`role="dialog"`**: For modal dialogs.
*   **`role="alert"`**: For important, time-sensitive information that should immediately grab user attention.
*   **`role="navigation"`**: For a collection of navigation links.
*   **`role="img"`**: For images that convey meaning and are not decorative (often used with `aria-label` or `aria-labelledby`).

### States and Properties

ARIA states (`aria-checked`, `aria-expanded`) and properties (`aria-label`, `aria-describedby`, `aria-controls`) describe the current condition or characteristics of an element.

*   **`aria-label`**: Provides an accessible name for an element when no visible text label is available (e.g., icon buttons).
    ```html
    <button aria-label="Close"><svg>...</svg></button>
    ```
*   **`aria-labelledby`**: References an element that serves as the label for the current element. Useful when the label is visible elsewhere on the page.
    ```html
    <h2 id="dialog-title">Confirm Action</h2>
    <div role="dialog" aria-labelledby="dialog-title">...</div>
    ```
*   **`aria-describedby`**: References an element that provides a description for the current element. Useful for providing additional context or instructions.
    ```html
    <input type="text" aria-describedby="email-hint">
    <p id="email-hint">Your email will not be shared.</p>
    ```
*   **`aria-expanded`**: Indicates whether a collapsible element (like a dropdown or accordion header) is currently expanded or collapsed.
    ```html
    <button aria-expanded="true" aria-controls="menu-content">Menu</button>
    <div id="menu-content">...</div>
    ```
*   **`aria-hidden="true"`**: Hides an element and its descendants from the accessibility tree. Use for purely decorative content or content that is visually hidden and should not be announced by screen readers.
    ```html
    <span aria-hidden="true">*</span> <!-- Hides decorative asterisk -->
    ```
*   **`aria-live`**: Indicates that an element's content may change and assistive technologies should announce the changes.
    *   **`polite`**: Announce changes when the user is idle.
    *   **`assertive`**: Announce changes immediately.
    ```html
    <div aria-live="polite">Item added to cart.</div>
    ```

## Common Use Cases

### Icon Buttons

Always provide an `aria-label` for icon-only buttons.

```html
<button aria-label="Search">
  <svg>...</svg>
</button>
```

### Modals/Dialogs

*   Set `role="dialog"` or `role="alertdialog"`.
*   Use `aria-modal="true"` to indicate that content outside the dialog is inert.
*   Provide an accessible name using `aria-labelledby` (referencing a visible title) or `aria-label`.
*   Manage focus (as per `TabOrderOptimization.md`).

### Tabs

*   Use `role="tablist"` for the container, `role="tab"` for each tab, and `role="tabpanel"` for each tab panel.
*   Link tabs to their panels using `aria-controls` and `id`.
*   Indicate selected tab with `aria-selected="true"`.

### Form Elements

*   Ensure all form inputs have an associated `label` element.
*   Use `aria-describedby` for helper text or error messages.
*   Use `aria-invalid="true"` for invalid inputs.

## Implementation Notes

-   Test components with screen readers (e.g., NVDA, VoiceOver, JAWS) to verify ARIA implementation.
-   Use browser accessibility trees (e.g., Chrome DevTools > Elements > Accessibility tab) to inspect how elements are exposed to assistive technologies.
-   Avoid overusing ARIA. Sometimes, less is more.

## Future Considerations

-   Integrate automated accessibility testing tools (e.g., Axe-core, Lighthouse) into the CI/CD pipeline to validate ARIA usage.
-   Develop a comprehensive ARIA pattern library within Storybook.
