# Screen Reader Testing Guidelines

This document outlines guidelines for conducting screen reader testing across the SkillSwap application. Screen reader testing is crucial to ensure that our web content is perceivable, operable, and understandable for users who are blind or have low vision.

## Principles

-   **Empathy**: Understand the user experience from a screen reader user's perspective.
-   **Comprehensive Coverage**: Test all interactive elements, content, and dynamic updates.
-   **Regular Practice**: Integrate screen reader testing into the regular development and QA workflow.
-   **Tool Familiarity**: Be proficient with at least one major screen reader.

## Recommended Screen Readers

It's important to test with a combination of screen readers and browsers, as their interpretations of ARIA and HTML can vary.

*   **NVDA (NonVisual Desktop Access)**:
    *   **Platform**: Windows
    *   **Cost**: Free and open source
    *   **Browser Compatibility**: Firefox, Chrome, Edge
    *   **Recommendation**: Primary screen reader for Windows testing.
*   **JAWS (Job Access With Speech)**:
    *   **Platform**: Windows
    *   **Cost**: Commercial (paid)
    *   **Browser Compatibility**: Chrome, Firefox, Edge, Internet Explorer
    *   **Recommendation**: Widely used in enterprise environments; good to test if target audience includes corporate users.
*   **VoiceOver**:
    *   **Platform**: macOS, iOS
    *   **Cost**: Built-in (free)
    *   **Browser Compatibility**: Safari (primary), Chrome
    *   **Recommendation**: Primary screen reader for macOS and iOS testing.
*   **TalkBack**:
    *   **Platform**: Android
    *   **Cost**: Built-in (free)
    *   **Browser Compatibility**: Chrome
    *   **Recommendation**: Primary screen reader for Android testing.

## Testing Scenarios

When conducting screen reader testing, focus on the following scenarios:

### 1. Basic Navigation

*   **Linear Reading**: Navigate through the entire page using arrow keys (reading line by line) and ensure content is read in a logical order.
*   **Tab Navigation**: Use the `Tab` key to navigate through all interactive elements. Verify that focus moves logically and that all interactive elements are reachable.
*   **Headings Navigation**: Use heading shortcuts (e.g., `H` in NVDA/JAWS, `Cmd + Shift + H` in VoiceOver) to jump between headings. Ensure headings are semantically correct and provide a clear outline of the page.
*   **Links Navigation**: Use link shortcuts (e.g., `K` in NVDA/JAWS, `Cmd + Shift + L` in VoiceOver) to jump between links. Ensure link text is descriptive and makes sense out of context.

### 2. Interactive Elements

*   **Buttons**: Ensure buttons are announced as "button" and their accessible name is clear. Verify they are operable with `Enter` and `Spacebar`.
*   **Form Fields**:
    *   Ensure labels are correctly associated with inputs.
    *   Verify input type (e.g., "text field", "checkbox", "radio button") is announced.
    *   Test error messages and helper text are announced when relevant.
    *   Verify required fields are indicated.
*   **Dropdowns/Selects**: Ensure they are announced correctly and that options can be navigated and selected.
*   **Modals/Dialogs**:
    *   Verify focus moves into the modal when opened and is trapped within.
    *   Ensure the modal's purpose is announced (e.g., "dialog", "alert dialog").
    *   Test that focus returns to the triggering element when the modal is closed.
*   **Tabs**: Ensure tabs are announced as "tab" and their selected state is indicated. Verify navigation between tabs and their associated panels.

### 3. Dynamic Content Updates

*   **Live Regions (`aria-live`)**: Test that dynamic content updates (e.g., form submission feedback, search results, notifications) are announced by the screen reader.
*   **Loading States**: Ensure loading indicators are announced and that content changes are communicated when loading is complete.

### 4. Images and Multimedia

*   **Images**: Verify that `alt` text is descriptive for meaningful images and that decorative images are hidden from screen readers (`aria-hidden="true"`).
*   **Videos/Audio**: Ensure controls are accessible and transcripts/captions are available.

## Implementation Notes

-   **Don't Rely on Visuals**: Close your eyes or turn off your monitor to simulate a blind user's experience.
-   **Use a Headset**: Listen carefully to how content is announced.
-   **Slow Down Speech Rate**: Initially, slow down the screen reader's speech rate to catch subtle issues.
-   **Document Findings**: Record any issues found, including the screen reader and browser used, and the exact steps to reproduce.

## Future Considerations

-   Integrate automated accessibility testing tools (e.g., Axe-core, Lighthouse) into the CI/CD pipeline to catch common screen reader issues.
-   Conduct user testing with actual screen reader users for comprehensive feedback.
