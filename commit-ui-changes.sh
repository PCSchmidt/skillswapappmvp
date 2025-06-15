#!/bin/bash

echo "======================================"
echo "Committing UI Enhancement Changes"
echo "======================================"

echo "Adding changed files..."
git add src/styles/design-tokens.js
git add tailwind.config.js
git add src/app/globals.css
git add src/app/layout.tsx
git add src/app/page.tsx
git add src/components/navigation/Navbar.tsx
git add docs/dev_journal.md
git add docs/landing_page_implementation_tracker.md
git add docs/ui_enhancement_summary.md

echo "Creating commit..."
git commit -m "Implement UI enhancements and design system

- Created comprehensive design tokens with color palette, typography, and spacing
- Updated Tailwind configuration to use design tokens
- Enhanced global CSS with component styles and dark mode support
- Redesigned landing page with improved layout and new sections
- Updated navbar with better styling and interactions
- Added documentation for UI enhancements
- Updated implementation tracker and dev journal"

echo "Pushing to remote repository..."
git push origin dev

echo "======================================"
echo "UI Enhancement Changes Committed!"
echo "======================================"
