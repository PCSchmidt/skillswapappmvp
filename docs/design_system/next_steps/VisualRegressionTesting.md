# Setting Up Visual Regression Testing

This document outlines the process for setting up visual regression testing for the SkillSwap design system. Visual regression testing is crucial for automatically detecting unintended visual changes to components and pages, ensuring design consistency across development cycles.

## Objectives

-   Automate the detection of visual discrepancies in UI components.
-   Prevent unintended style changes from being deployed.
-   Integrate visual testing into the CI/CD pipeline for continuous quality assurance.
-   Provide a clear workflow for reviewing and approving visual changes.

## Recommended Tools

### 1. Storybook with Storybook Test Runner and Chromatic (Recommended)

*   **Storybook Test Runner**: A lightweight utility that runs all Storybook stories in a headless browser, making it easy to generate screenshots.
*   **Chromatic**: A cloud-based visual testing platform by Storybook maintainers. It captures screenshots, compares them against baselines, highlights differences, and provides a collaborative review workflow.
    *   **Pros**: Seamless integration with Storybook, cloud-based (no local infrastructure needed), collaborative review UI, handles responsive breakpoints and themes.
    *   **Cons**: Commercial product (free tier available).

### 2. Playwright/Cypress with Image Comparison Plugin

*   **Playwright/Cypress**: Powerful end-to-end testing frameworks that can also take screenshots.
*   **`cypress-image-snapshot` / `jest-image-snapshot` (for Playwright)**: Plugins that integrate image comparison capabilities.
    *   **Pros**: Full control over local setup, can be integrated with existing E2E tests.
    *   **Cons**: Requires managing local screenshot baselines, setting up diffing tools, and potentially more complex CI/CD integration.

## Setup Process (Using Storybook Test Runner + Chromatic)

### 1. Install Dependencies

```bash
npm install --save-dev @storybook/test-runner chromatic
```

### 2. Configure Storybook Test Runner

Add a script to your `package.json` to run the test runner.

```json
// package.json
{
  "scripts": {
    "test-storybook": "test-storybook",
    "chromatic": "npx chromatic --project-token=<your-project-token>"
  }
}
```

### 3. Set up Chromatic Project

*   Go to [chromatic.com](https://www.chromatic.com/) and create a new project.
*   Connect your GitHub repository.
*   You will receive a `project-token`. Add this to your CI/CD environment variables or directly in the `chromatic` script (though environment variables are recommended for security).

### 4. Integrate into CI/CD (e.g., GitHub Actions)

Create a GitHub Actions workflow (e.g., `.github/workflows/chromatic.yml`) to run Chromatic on pull requests.

```yaml
# .github/workflows/chromatic.yml
name: 'Chromatic'

on: pull_request

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0 # Required to retrieve git history for Chromatic
      - name: Install dependencies
        run: npm install
      - name: Publish to Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }} # Set this in GitHub Secrets
          exitZeroOnChanges: true # Optional: allow PR to pass even with visual changes, requiring manual review
          exitZeroOnChanges: false # Recommended: fail PR if visual changes are detected, requiring explicit approval
```

### 5. Define Stories for Visual Testing

Ensure your Storybook stories cover all critical visual states of your components, including:

*   Default states
*   All variants (primary, secondary, outline, etc.)
*   Hover, focus, active, and disabled states
*   Responsive breakpoints (using Storybook's `parameters.viewport`)
*   Light and dark themes (using Storybook's `globalTypes` for theme switching)
*   Different content lengths (e.g., long text, empty states)
*   Error states

## Workflow for Visual Changes

1.  **Develop**: Make changes to components.
2.  **Run Storybook Locally**: Verify changes manually.
3.  **Commit & Push**: Push changes to a feature branch.
4.  **Chromatic Build**: Chromatic automatically runs on the PR, captures new screenshots, and compares them to the baseline.
5.  **Review**: Review visual changes in the Chromatic UI.
    *   If changes are intentional, "Accept" them to update the baseline.
    *   If changes are unintentional, fix them in code and push a new commit.
6.  **Merge**: Once all visual changes are approved (or fixed), merge the PR.

## Implementation Notes

-   **Baseline Management**: Chromatic manages baselines automatically. For local setups, you'd typically commit baseline images to your repository.
-   **Flakiness**: Visual tests can sometimes be flaky due to rendering differences. Use `threshold` options in image comparison tools or Chromatic's smart diffing to manage this.
-   **Performance**: Optimize Storybook build times to keep CI/CD fast.

## Future Considerations

-   Integrate visual testing for entire pages (beyond isolated components).
-   Explore integrating accessibility visual testing (e.g., highlighting contrast issues directly on screenshots).
