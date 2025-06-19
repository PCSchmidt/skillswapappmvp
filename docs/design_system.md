# SkillSwap MVP Design System

This document outlines the core principles, guidelines, and components of the SkillSwap MVP Design System. It is based on the findings from the UI audit and aims to provide a single source of truth for building consistent and maintainable user interfaces.

## Core Principles

-   **Consistency:** Ensure a unified look and feel across the entire application.
-   **Reusability:** Promote the use of standardized components and patterns to reduce code duplication.
-   **Maintainability:** Make it easier to update and manage the UI codebase.
-   **Accessibility:** Design and build components with accessibility in mind.
-   **Efficiency:** Streamline the development process by providing ready-to-use components and clear guidelines.

## Foundations

The design system is built upon the existing Tailwind CSS configuration. Key foundational elements include:

### Color Palette

Based on `src/styles/design-tokens.js`:

-   **Primary (Teal):** Competence, reliability, trust
    -   50: `#f0fdfa`
    -   100: `#ccfbf1`
    -   200: `#99f6e4`
    -   300: `#5eead4`
    -   400: `#2dd4bf`
    -   500: `#14b8a6`
    -   600: `#0d9488`
    -   700: `#0f766e`
    -   800: `#115e59`
    -   900: `#134e4a`
    -   950: `#042f2e`
-   **Secondary (Coral):** Creativity, energy, passion
    -   50: `#fff1f2`
    -   100: `#ffe4e6`
    -   200: `#fecdd3`
    -   300: `#fda4af`
    -   400: `#fb7185`
    -   500: `#f43f5e`
    -   600: `#e11d48`
    -   700: `#be123c`
    -   800: `#9f1239`
    -   900: `#881337`
    -   950: `#4c0519`
-   **Tertiary (Sage):** Growth, learning
    -   50: `#f0f9f0`
    -   100: `#dceedc`
    -   200: `#c0d8c0`
    -   300: `#9cbc9c`
    -   400: `#75a175`
    -   500: `#5e8b5e`
    -   600: `#4a704a`
    -   700: `#3b5a3b`
    -   800: `#2e452e`
    -   900: `#243024`
    -   950: `#121b12`
-   **Neutral (Warm Sand):** Accessibility, space
    -   50: `#f8f8f8`
    -   100: `#f0f0f0`
    -   200: `#e4e4e4`
    -   300: `#d1d1d1`
    -   400: `#b4b4b4`
    -   500: `#9a9a9a`
    -   600: `#818181`
    -   700: `#6a6a6a`
    -   800: `#5a5a5a`
    -   900: `#4e4e4e`
    -   950: `#282828`
-   **Accent Yellow:** Highlights, important actions
    -   50: `#fffbeb`
    -   100: `#fef3c7`
    -   200: `#fde68a`
    -   300: `#fcd34d`
    -   400: `#fbbf24`
    -   500: `#f59e0b`
    -   600: `#d97706`
    -   700: `#b45309`
    -   800: `#92400e`
    -   900: `#78350f`
    -   950: `#451a03`
-   **Accent Lavender:** Uniqueness, creativity
    -   50: '#f5f3ff'
    -   100: '#ede9fe'
    -   200: '#ddd6fe'
    -   300: '#c4b5fd'
    -   400: '#a78bfa'
    -   500: '#8b5cf6'
    -   600: '#7c3aed'
    -   700: '#6d28d9'
    -   800: '#5b21b6'
    -   900: '#4c1d95'
    -   950: '#2e1065'
-   **Semantic Colors:**
    -   Success: `#10b981` (Green)
    -   Warning: `#f59e0b` (Amber)
    -   Error: `#ef4444` (Red)
    -   Info: `#3b82f6` (Blue)

### Typography

Based on `src/styles/design-tokens.js`:

-   **Font Family:**
    -   Heading: `Montserrat`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
    -   Body: `Open Sans`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
    -   Accent: `Poppins`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
-   **Font Size:**
    -   xs: `0.75rem` (12px)
    -   sm: `0.875rem` (14px)
    -   base: `1rem` (16px)
    -   lg: `1.125rem` (18px)
    -   xl: `1.25rem` (20px)
    -   2xl: `1.5rem` (24px)
    -   3xl: `1.875rem` (30px)
    -   4xl: `2.25rem` (36px)
    -   5xl: `3rem` (48px)
    -   6xl: `3.75rem` (60px)
    -   7xl: `4.5rem` (72px)
-   **Font Weight:**
    -   thin: 100
    -   extralight: 200
    -   light: 300
    -   normal: 400
    -   medium: 500
    -   semibold: 600
    -   bold: 700
    -   extrabold: 800
    -   black: 900
-   **Line Height:**
    -   none: 1
    -   tight: 1.25
    -   snug: 1.375
    -   normal: 1.5
    -   relaxed: 1.625
    -   loose: 2
-   **Letter Spacing:**
    -   tighter: `-0.05em`
    -   tight: `-0.025em`
    -   normal: `0em`
    -   wide: `0.025em`
    -   wider: `0.05em`
    -   widest: `0.1em`

### Spacing

Based on `src/styles/design-tokens.js`:

-   A consistent scale based on `rem` values:
    -   px: `1px`
    -   0.5: `0.125rem` (2px)
    -   1: `0.25rem` (4px)
    -   1.5: `0.375rem` (6px)
    -   2: `0.5rem` (8px)
    -   2.5: `0.625rem` (10px)
    -   3: `0.75rem` (12px)
    -   3.5: `0.875rem` (14px)
    -   4: `1rem` (16px)
    -   5: `1.25rem` (20px)
    -   6: `1.5rem` (24px)
    -   7: `1.75rem` (28px)
    -   8: `2rem` (32px)
    -   9: `2.25rem` (36px)
    -   10: `2.5rem` (40px)
    -   11: `2.75rem` (44px)
    -   12: `3rem` (48px)
    -   14: `3.5rem` (56px)
    -   16: `4rem` (64px)
    -   20: `5rem` (80px)
    -   24: `6rem` (96px)
    -   28: `7rem` (112px)
    -   32: `8rem` (128px)
    -   36: `9rem` (144px)
    -   40: `10rem` (160px)
    -   48: `12rem` (192px)
    -   56: `14rem` (224px)
    -   64: `16rem` (256px)
    -   72: `18rem` (288px)
    -   80: `20rem` (320px)
    -   96: `24rem` (384px)

### Breakpoints

Based on Tailwind CSS defaults (defined in `tailwind.config.js` implicitly or explicitly):

-   **sm:** 640px
-   **md:** 768px
-   **lg:** 1024px
-   **xl:** 1280px
-   **2xl:** 1536px

### Borders

Based on `src/styles/design-tokens.js`:

-   **Border Width:**
    -   default: `1px`
    -   0: `0px`
    -   2: `2px`
    -   4: `4px`
    -   8: `8px`
-   **Border Radius:**
    -   none: `0`
    -   sm: `0.125rem` (2px)
    -   default: `0.25rem` (4px)
    -   md: `0.375rem` (6px)
    -   lg: `0.5rem` (8px)
    -   xl: `0.75rem` (12px)
    -   2xl: `1rem` (16px)
    -   3xl: `1.5rem` (24px)
    -   full: `9999px`

### Shadows

Based on `src/styles/design-tokens.js`:

-   sm: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
-   default: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
-   md: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
-   lg: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
-   xl: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
-   2xl: `0 25px 50px -12px rgba(0, 0, 0, 0.25)`
-   inner: `inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)`
-   none: `none`

### Transitions

Based on `src/styles/design-tokens.js`:

-   **Duration:**
    -   75: `75ms`
    -   100: `100ms`
    -   150: `150ms`
    -   200: `200ms`
    -   300: `300ms`
    -   500: `500ms`
    -   700: `700ms`
    -   1000: `1000ms`
-   **Timing Function:**
    -   easeIn: `cubic-bezier(0.4, 0, 1, 1)`
    -   easeOut: `cubic-bezier(0, 0, 0.2, 1)`
    -   easeInOut: `cubic-bezier(0.4, 0, 0.2, 1)`

### Z-index

Based on `src/styles/design-tokens.js`:

-   0: 0
-   10: 10
-   20: 20
-   30: 30
-   40: 40
-   50: 50
-   auto: `auto`

## Components

This section defines the standardized UI components. Existing components in `src/components/ui/` will be refined and documented here. New components will be added as needed.

### Button

-   **Purpose:** Interactive element to trigger actions.
-   **Variants:** Primary, Secondary, Danger, Outline, Ghost, Link.
-   **Sizes:** Small, Medium, Large.
-   **States:** Default, Hover, Active, Disabled, Loading.
-   **Implementation:** Use the standardized `Button.tsx` component. Avoid using raw `<button>` elements with direct styling for common button patterns.
-   **Props:** Define standard props for text, onClick, disabled, isLoading, variant, size, etc.

#### Examples

```jsx
import Button from '@/components/ui/Button';

// Default Primary Button
<Button>Click Me</Button>

// Secondary Button
<Button variant="secondary">Cancel</Button>

// Outline Button
<Button variant="outline">Learn More</Button>

// Danger Button
<Button variant="danger">Delete</Button>

// Ghost Button
<Button variant="ghost">Dismiss</Button>

// Small Button
<Button size="sm">Small Button</Button>

// Large Button
<Button size="lg">Large Button</Button>

// Button with Icon
<Button icon={<svg>...</svg>}>With Icon</Button>

// Loading Button
<Button isLoading loadingText="Saving...">Saving</Button>

// Disabled Button
<Button disabled>Disabled Button</Button>
```

### Input

-   **Purpose:** Allows users to enter text or select values.
-   **Types:** Text, Email, Password, Number, Select, Textarea, Checkbox, Radio.
-   **States:** Default, Focus, Disabled, Error.
-   **Implementation:** Use the standardized `Input.tsx` component (or related components for Select, Textarea, etc.). Avoid using raw form elements with direct styling.
-   **Props:** Define standard props for label, name, value, onChange, placeholder, type, error, etc.
-   **Sizes:** sm, md, lg.

#### Examples

```jsx
import Input from '@/components/ui/Input';
import { Mail, Lock } from 'lucide-react';

// Default Input
<Input placeholder="Enter your name" />

// Input with Label
<Input label="Email Address" placeholder="Enter your email" type="email" />

// Input with Helper Text
<Input label="Username" helperText="Must be unique" placeholder="Choose a username" />

// Input with Error
<Input label="Password" error="Password must be at least 8 characters" type="password" />

// Input with Start Icon
<Input placeholder="Search..." startIcon={<Mail size={18} />} />

// Input with End Icon
<Input placeholder="Enter password" type="password" endIcon={<Lock size={18} />} />

// Small Input
<Input size="sm" placeholder="Small input" />

// Large Input
<Input size="lg" placeholder="Large input" />

// Filled Variant
<Input variant="filled" placeholder="Filled input" />

// Outlined Variant
<Input variant="outlined" placeholder="Outlined input" />

// Disabled Input
<Input disabled placeholder="Disabled input" />
```

### Card

-   **Purpose:** Container for grouping related content.
-   **Variants:** Default, Outlined, Elevated.
-   **Structure:** Define standard sections (Header, Body, Footer).
-   **Implementation:** Use the standardized `Card.tsx` component. Compose content within the Card structure.
-   **Props:** Define standard props for variant, padding, radius, bordered, fullWidth. The `bordered` prop can be used in addition to variants.

#### Examples

```jsx
import Card from '@/components/ui/Card';

// Basic Card
<Card>
  <Card.Body>
    <p>This is a basic card.</p>
  </Card.Body>
</Card>

// Card with Header and Footer
<Card>
  <Card.Header title="Card Title" subtitle="Card Subtitle" />
  <Card.Body>
    <p>Card content goes here.</p>
  </Card.Body>
  <Card.Footer>
    <Button size="sm">Action</Button>
  </Card.Footer>
</Card>

// Outlined Card
<Card variant="outlined">
  <Card.Body>
    <p>This is an outlined card.</p>
  </Card.Body>
</Card>

// Elevated Card
<Card variant="elevated">
  <Card.Body>
    <p>This is an elevated card.</p>
  </Card.Body>
</Card>

// Card with different padding and radius
<Card padding="lg" radius="lg">
  <Card.Body>
    <p>Card with large padding and radius.</p>
  </Card.Body>
</Card>
```

### Error Message

-   **Purpose:** Display feedback for errors.
-   **Variants:** Block.
-   **Implementation:** Use the standardized `ErrorMessage.tsx` component for displaying validation or system errors. Ensure consistent styling and placement.

#### Examples

```jsx
import ErrorMessage from '@/components/ui/ErrorMessage';

// Default Error Message
<ErrorMessage message="An unexpected error occurred." />

// Warning Message
<ErrorMessage message="Please review the form fields." severity="warning" />

// Info Message
<ErrorMessage message="Your profile has been updated." severity="info" />

// Critical Error Message
<ErrorMessage message="Server is unreachable." severity="critical" />

// Error Message with Retry
<ErrorMessage 
  message="Failed to load data." 
  onRetry={() => console.log('Retrying...')} 
/>

// Error Message with Dismiss
<ErrorMessage 
  message="Operation cancelled." 
  onDismiss={() => console.log('Dismissed.')} 
  showRetry={false}
/>

// Error Message with Retry and Dismiss
<ErrorMessage 
  message="Data sync failed." 
  onRetry={() => console.log('Retrying sync...')} 
  onDismiss={() => console.log('Dismissing error.')} 
/>
```

### Spinner

-   **Purpose:** Indicate loading or processing states.
-   **Sizes:** xs, sm, md, lg, xl.
-   **Implementation:** Use the standardized `Spinner.tsx` component. Integrate it into components that have loading states (e.g., Buttons, data lists).

#### Examples

```jsx
import Spinner from '@/components/ui/Spinner';

// Default Spinner (md size, primary color)
<Spinner />

// Small Gray Spinner
<Spinner size="sm" color="gray" />

// Large White Spinner
<Spinner size="lg" color="white" />

// Spinner with Label
<Spinner label="Loading data..." />
```

### Modal

-   **Purpose:** Displays content in a dialog box that overlays the current page. Used for critical information, user tasks, or confirmations.
-   **Props:**
    -   `isOpen`: Boolean to control the visibility of the modal.
    -   `onClose`: Function to call when the modal should be closed (e.g., clicking the overlay or close button).
    -   `title`: Optional title for the modal header.
    -   `children`: The content to display within the modal body.
    -   `className`: Optional additional CSS classes for the modal panel.
    -   `size`: Controls the maximum width of the modal ('sm', 'md', 'lg', 'xl').
-   **Implementation:** Uses `@headlessui/react` for accessibility and transition management. Structure includes an overlay, a modal panel, and optional header (via `title`) and content area (`children`).

#### Examples

```jsx
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useState } from 'react';

function ExampleModal() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <Button onClick={openModal}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={closeModal} title="Example Modal Title">
        <p>This is the content of the modal.</p>
        <div className="mt-4">
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </div>
      </Modal>
    </>
  );
}

// Modal with different size
function LargeModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <Button onClick={openModal}>Open Large Modal</Button>
      <Modal isOpen={isOpen} onClose={closeModal} title="Large Modal" size="lg">
        <p>This is a larger modal.</p>
        <div className="mt-4">
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </div>
      </Modal>
    </>
  );
}
```

### Notification Badge

-   **Purpose:** Displays a small badge with a count or a dot to indicate notifications or unread items.
-   **Props:**
    -   `count`: The number to display in the badge.
    -   `max`: Maximum number to display before showing "99+" (default: 99).
    -   `size`: Badge size ('sm', 'md', 'lg') (default: 'md').
    -   `variant`: Badge color variant ('primary', 'secondary', 'danger', 'warning', 'success', 'info') (default: 'primary').
    -   `hideZero`: Whether to hide the badge when count is 0 (default: true).
    -   `className`: Optional additional CSS classes.
    -   `pulse`: Whether to pulse the badge for emphasis (default: false).
    -   `dot`: Whether to show as a dot instead of a count (default: false).
-   **Implementation:** Renders a `<span>` element with rounded corners and appropriate background/text colors based on the variant. Uses `classNames` for conditional styling.

#### Examples

```jsx
import NotificationBadge from '@/components/notifications/NotificationBadge';

// Default badge
<NotificationBadge count={5} />

// Large danger badge
<NotificationBadge count={10} size="lg" variant="danger" />

// Badge with max count
<NotificationBadge count={150} max={99} variant="warning" />

// Badge as a dot
<NotificationBadge count={1} dot variant="info" />

// Pulsing badge
<NotificationBadge count={3} pulse variant="primary" />
```

### Alert

-   **Purpose:** Displays important messages, notifications, or feedback to users.
-   **Props:**
    -   `children`: The content of the alert.
    -   `type`: The type of alert ('info', 'success', 'warning', 'error') (default: 'info').
    -   `title`: Optional title for the alert.
    -   `icon`: Optional custom icon for the alert.
    -   `dismissible`: Whether the alert can be dismissed (default: false).
    -   `onDismiss`: Function to call when the alert is dismissed.
    -   `className`: Optional additional CSS classes.
-   **Implementation:** Renders a `div` with styling based on the `type` prop. Includes an optional icon, title, and dismiss button. Uses `classNames` for conditional styling.

#### Examples

```jsx
import Alert from '@/components/ui/Alert';

// Info Alert
<Alert type="info">This is an informational message.</Alert>

// Success Alert with Title
<Alert type="success" title="Success!">Your operation was successful.</Alert>

// Warning Alert
<Alert type="warning">Please review the potential issues.</Alert>

// Error Alert
<Alert type="error">An error occurred while processing your request.</Alert>

// Dismissible Alert
<Alert type="info" dismissible onDismiss={() => console.log('Alert dismissed')}>
  You can dismiss this message.
</Alert>
```

### Avatar

-   **Purpose:** Displays a user's profile picture or initials.
-   **Props:**
    -   `src`: The URL of the avatar image.
    -   `alt`: Alt text for the image (required for accessibility).
    -   `size`: Avatar size ('xs', 'sm', 'md', 'lg', 'xl') (default: 'md').
    -   `shape`: Avatar shape ('circle', 'square') (default: 'circle').
    -   `className`: Optional additional CSS classes.
-   **Implementation:** Renders a `div` with background color and text for initials fallback, or an `<img>` tag if `src` is provided. Uses `classNames` for conditional styling based on size and shape. Includes basic fallback logic to display initials if the image fails to load or `src` is not provided.

#### Examples

```jsx
import Avatar from '@/components/ui/Avatar';

// Default Avatar (md size, circle shape) with image
<Avatar src="/path/to/avatar.jpg" alt="John Doe" />

// Small Square Avatar with image
<Avatar src="/path/to/avatar.jpg" alt="Jane Smith" size="sm" shape="square" />

// Large Circular Avatar with initials fallback
<Avatar alt="Alice Wonderland" size="lg" />

// Extra Large Avatar with initials fallback
<Avatar alt="Bob The Builder" size="xl" />

// Small Avatar with initials fallback
<Avatar alt="Charlie Brown" size="sm" />
```

### Tabs

-   **Purpose:** Provides a tabbed interface for organizing and switching between different content views.
-   **Props:**
    -   `children`: `Tab` components to render as tabs.
    -   `activeTab`: The ID of the currently active tab.
    -   `onChange`: Function to call when a tab is clicked (`(tabId: string) => void`).
    -   `className`: Optional additional CSS classes for the main container.
    -   `tabListClassName`: Optional additional CSS classes for the tab navigation list.
    -   `tabClassName`: Optional additional CSS classes for individual tab buttons (inactive state).
    -   `activeTabClassName`: Optional additional CSS classes for the active tab button.
    -   `contentClassName`: Optional additional CSS classes for the active tab content container.
-   **Tab Sub-component Props (`<Tab>`):**
    -   `id`: Unique identifier for the tab.
    -   `label`: The text label for the tab button.
    -   `children`: The content to display when this tab is active.
    -   `className`: Optional additional CSS classes for the tab content container.
-   **Implementation:** Uses a flex container for the tab navigation and renders `Button` components for each tab label. The active tab's content is displayed below the navigation. Styling uses design tokens for borders, colors, and spacing.

#### Examples

```jsx
import Tabs, { Tab } from '@/components/ui/Tabs';
import { useState } from 'react';

function ExampleTabs() {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <Tabs activeTab={activeTab} onChange={setActiveTab}>
      <Tab id="tab1" label="Tab 1">
        <div>Content for Tab 1</div>
      </Tab>
      <Tab id="tab2" label="Tab 2">
        <div>Content for Tab 2</div>
      </Tab>
      <Tab id="tab3" label="Tab 3">
        <div>Content for Tab 3</div>
      </Tab>
    </Tabs>
  );
}
```

### Switch

-   **Purpose:** A toggle switch control for boolean settings.
-   **Props:**
    -   `checked`: Boolean indicating if the switch is on.
    -   `onChange`: Function to call when the switch is toggled.
    -   `disabled`: Whether the switch is disabled.
    -   `label`: Optional label for the switch.
    -   `size`: Switch size ('sm', 'md', 'lg') (default: 'md').
    -   `className`: Optional additional CSS classes.
    -   `ariaLabel`: Optional ARIA label for accessibility.
-   **Implementation:** Renders a `div` containing an optional label and a `button` element with `role="switch"`. Styling uses design tokens for colors and sizing. Includes transition for the toggle animation.

#### Examples

```jsx
import Switch from '@/components/ui/Switch';
import { useState } from 'react';

function ExampleSwitch() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <Switch
      checked={isEnabled}
      onChange={() => setIsEnabled(!isEnabled)}
      label="Enable Feature"
    />
  );
}

// Small Switch
<Switch checked={true} onChange={() => {}} size="sm" label="Small Toggle" />

// Large Disabled Switch
<Switch checked={false} onChange={() => {}} size="lg" disabled label="Large Disabled Toggle" />
```

### Tooltip

-   **Purpose:** Displays a small informational tooltip on hover or focus.
-   **Props:**
    -   `content`: The content to display inside the tooltip.
    -   `children`: The element that triggers the tooltip.
    -   `position`: The position of the tooltip relative to the trigger element ('top', 'bottom', 'left', 'right') (default: 'top').
    -   `className`: Optional additional CSS classes for the tooltip content.
-   **Implementation:** Renders the trigger element and, when visible, an absolutely positioned `div` for the tooltip content. Uses CSS for positioning and styling. Styling uses design tokens for background color, text color, border radius, and shadow.

#### Examples

```jsx
import Tooltip from '@/components/ui/Tooltip';
import Button from '@/components/ui/Button';

// Tooltip on a Button
<Tooltip content="This is a helpful tip">
  <Button>Hover Me</Button>
</Tooltip>

// Tooltip on text
<Tooltip content="More info here">
  <span>Hover over this text</span>
</Tooltip>

// Tooltip positioned to the right
<Tooltip content="Tooltip on the right" position="right">
  <Button>Hover Me (Right)</Button>
</Tooltip>
```

### Badge

-   **Purpose:** Displays a small, colored label or indicator.
-   **Props:**
    -   `children`: The content to display inside the badge.
    -   `variant`: The color variant of the badge ('neutral', 'primary', 'secondary', 'success', 'warning', 'error', 'info') (default: 'neutral').
    -   `className`: Optional additional CSS classes for the badge.
-   **Implementation:** Renders a `<span>` element with rounded corners, padding, and appropriate background/text colors based on the variant. Uses `classNames` for conditional styling.

#### Examples

```jsx
import Badge from '@/components/ui/Badge';

// Default Neutral Badge
<Badge>New</Badge>

// Primary Badge
<Badge variant="primary">Featured</Badge>

// Success Badge
<Badge variant="success">Available</Badge>

// Warning Badge
<Badge variant="warning">Pending</Badge>

// Error Badge
<Badge variant="error">Urgent</Badge>

// Info Badge
<Badge variant="info">Info</Badge>
```

### Other Components

(Add specifications for other common components as the design system evolves, e.g., Tooltips, Badges, etc.)

## Usage Guidelines

-   Always import and use components from the design system (`@/components/ui/`) when building new features or refactoring existing ones.
-   Refer to this document for component specifications and usage examples.
-   Contribute to the design system by proposing new components or improvements via pull requests.

## Future Work

-   Define detailed specifications for Color Palette, Typography, Spacing, and Breakpoints based on `tailwind.config.js`.
-   Create examples and code snippets for each component.
-   Implement a component storybook (e.g., Storybook) for visual documentation and testing.
-   Refactor existing components in `src/components/` to utilize the standardized design system components.
