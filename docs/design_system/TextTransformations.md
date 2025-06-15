# Text Transformation Guidelines

This document outlines the standard text transformation (e.g., uppercase, lowercase, capitalize) guidelines to be used across the SkillSwap application. Consistent text transformations contribute to a cohesive and professional user interface.

## Principles

-   **Readability**: Prioritize readability. Excessive use of uppercase can hinder readability, especially for longer text blocks.
-   **Consistency**: Apply transformations consistently to similar UI elements (e.g., all button labels, all section titles).
-   **Purposeful Use**: Use transformations to convey hierarchy, emphasize information, or align with brand guidelines.

## Standard Text Transformations

We define text transformations using Tailwind CSS utility classes.

### Uppercase

Used sparingly for emphasis, short labels, or specific UI elements where a strong visual impact is desired.

*   **Tailwind CSS Class**: `uppercase`

**Example Use Cases:**
-   Button labels (e.g., "SUBMIT", "LEARN MORE")
-   Short headings or titles in specific contexts (e.g., section headers in a dashboard)
-   Tags or badges

**Tailwind CSS Example:**

```html
<button class="uppercase">Submit</button>
<span class="uppercase text-xs font-bold">New</span>
```

### Lowercase

Used for text that should appear entirely in lowercase, typically for stylistic reasons or specific data inputs.

*   **Tailwind CSS Class**: `lowercase`

**Example Use Cases:**
-   Email addresses (though often handled by input type)
-   Specific brand elements or slogans

**Tailwind CSS Example:**

```html
<p class="lowercase">this text is all lowercase.</p>
```

### Capitalize

Used to capitalize the first letter of each word, commonly for titles or names.

*   **Tailwind CSS Class**: `capitalize`

**Example Use Cases:**
-   User names
-   Titles of articles, skills, or profiles
-   Labels for form fields (where not handled by specific component styling)

**Tailwind CSS Example:**

```html
<h2 class="capitalize">skill exchange request</h2>
```

### Normal Case (No Transformation)

This is the default and most common text transformation, where text appears as it is written, respecting standard capitalization rules.

*   **Tailwind CSS Class**: `normal-case` (explicitly removes any inherited transformations)

**Example Use Cases:**
-   Body text
-   Descriptions
-   Any text that does not require a specific visual transformation.

**Tailwind CSS Example:**

```html
<p class="normal-case">This is normal case text.</p>
```

## Implementation Notes

-   Always apply text transformation classes directly to the text element or its immediate container.
-   Be mindful of how transformations affect different languages and character sets.
-   Avoid applying transformations that might make text difficult to read for users with cognitive disabilities.

## Future Considerations

-   Define specific rules for when to use each transformation based on component type and context.
-   Automate checks for consistent application of text transformations in code reviews.
