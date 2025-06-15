# SkillSwap Layout System

This document provides an overview of the core layout components created for the SkillSwap application. These components form the foundation of the responsive layout system used throughout the application.

## Components Overview

### Container

The `Container` component provides a flexible container with various sizing options and consistent padding. It handles responsive behavior and allows customization of the HTML element rendered.

```tsx
<Container size="lg" padding="md" center={true}>
  Content goes here
</Container>
```

**Key Features:**
- Multiple size variants (sm, md, lg, xl, 2xl, full, custom)
- Configurable padding (none, sm, md, lg, xl)
- Horizontal centering option
- Element type control (div, section, article, etc.)
- Debug mode for visual development

### Grid

The `Grid` component creates responsive grid layouts using CSS Grid. It provides flexible column configuration with responsive breakpoints.

```tsx
<Grid columns={{ default: 1, sm: 2, md: 3, lg: 4 }} gap="md">
  <Column>Item 1</Column>
  <Column>Item 2</Column>
  <Column>Item 3</Column>
</Grid>
```

**Key Features:**
- Responsive column configuration
- Customizable gap spacing between items
- Auto-fill/auto-fit options for dynamic grid layouts
- Support for list elements (ul/ol) when appropriate
- Debug mode for visual development

### Column

The `Column` component represents a grid item within a `Grid` and allows control over column spans, start positions, and ordering.

```tsx
<Column span={{ default: 12, md: 6, lg: 4 }} order="first">
  Content goes here
</Column>
```

**Key Features:**
- Responsive column spans (different widths at different breakpoints)
- Column start position control
- Ordering control for changing visual order
- Auto-sizing option
- Element type control (div, li, article, section)
- Debug mode for visual development

### Section

The existing `Section` component provides semantic page sections with configurable styling:

```tsx
<Section variant="primary" spacingY="lg" container="lg">
  Content goes here
</Section>
```

**Key Features:**
- Background color variants
- Vertical spacing control
- Container width options
- Divider options for top and bottom
- Element type control

## Usage Patterns

### Basic Page Structure

```tsx
<Section variant="default" spacingY="lg">
  <Container size="lg">
    <h2>Section Title</h2>
    <p>Section description text goes here...</p>
    
    <Grid columns={{ default: 1, md: 3 }} gap="lg">
      <Column>Card 1</Column>
      <Column>Card 2</Column>
      <Column>Card 3</Column>
    </Grid>
  </Container>
</Section>
```

### Complex Layouts

```tsx
<Section variant="primary" spacingY="xl">
  <Container size="xl">
    <Grid columns={{ default: 1, lg: 12 }} gap="lg">
      <Column span={{ default: 1, lg: 8 }}>
        <h2>Main Content</h2>
        <p>Primary content area...</p>
      </Column>
      
      <Column span={{ default: 1, lg: 4 }}>
        <h3>Sidebar</h3>
        <p>Secondary content...</p>
      </Column>
    </Grid>
  </Container>
</Section>
```

### Responsive Design Considerations

- All components are designed with mobile-first approach
- Use responsive props to adjust layout at different breakpoints
- Test all layouts across various screen sizes
- Consider content hierarchy for smaller screens

## Best Practices

1. **Consistent Container Usage**
   - Use Container components for consistent page margins
   - Avoid arbitrary padding/margin values

2. **Grid System**
   - Use the Grid/Column system for multi-column layouts
   - Avoid custom float or flex layouts when Grid can be used

3. **Semantic HTML**
   - Use appropriate HTML elements via the `as` prop
   - Consider SEO and accessibility implications

4. **Debugging**
   - Use the debug props during development to visualize layout structures
   - Remove debug props before production

5. **Nested Components**
   - Follow the pattern: Section > Container > Grid > Column
   - Avoid deeply nested layouts when possible

## Implementation Notes

- All layout components use Tailwind CSS for styling
- Grid component leverages CSS Grid rather than flexbox for more complex layouts
- Container widths align with Tailwind's default breakpoints
- All components are fully typed with TypeScript
