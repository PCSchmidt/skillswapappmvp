import React from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to Accessibility</h2>
                <p className="text-gray-700 mb-4">
                  SkillSwap is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Standards and Guidelines</h2>
                <p className="text-gray-700 mb-4">
                  We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
                <p className="text-gray-700 mb-4">
                  Our website includes the following accessibility features:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Keyboard navigation support</li>
                  <li>Screen reader compatibility</li>
                  <li>Alternative text for images</li>
                  <li>High contrast color schemes</li>
                  <li>Descriptive link text</li>
                  <li>Logical heading structure</li>
                  <li>Form labels and instructions</li>
                  <li>Focus indicators for interactive elements</li>
                  <li>Readable fonts and adequate font sizes</li>
                  <li>Sufficient color contrast ratios</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Efforts</h2>
                <p className="text-gray-700 mb-4">
                  We are continuously working to improve accessibility through:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Regular accessibility audits and testing</li>
                  <li>User testing with people with disabilities</li>
                  <li>Staff training on accessibility best practices</li>
                  <li>Integration of accessibility considerations in our design and development process</li>
                  <li>Monitoring and updating our accessibility features</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Content</h2>
                <p className="text-gray-700 mb-4">
                  While we strive to ensure accessibility across our platform, some third-party content and services integrated into our website may not be fully accessible. We work with our third-party providers to improve accessibility where possible.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assistive Technologies</h2>
                <p className="text-gray-700 mb-4">
                  Our website is designed to be compatible with the following assistive technologies:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
                  <li>Voice recognition software</li>
                  <li>Keyboard-only navigation</li>
                  <li>Switch devices</li>
                  <li>Magnification software</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Browser and Platform Support</h2>
                <p className="text-gray-700 mb-4">
                  Our website is designed to work with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Modern web browsers (Chrome, Firefox, Safari, Edge)</li>
                  <li>Mobile browsers on iOS and Android</li>
                  <li>Various operating systems (Windows, macOS, iOS, Android)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Known Issues</h2>
                <p className="text-gray-700 mb-4">
                  We are actively working to address the following known accessibility issues:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Some complex interactive elements may need enhanced keyboard navigation</li>
                  <li>Certain dynamic content updates may not be immediately announced to screen readers</li>
                  <li>Some third-party embedded content may have limited accessibility features</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback and Support</h2>
                <p className="text-gray-700 mb-4">
                  We welcome your feedback on the accessibility of SkillSwap. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
                </p>
                <ul className="list-none text-gray-700 mb-4">
                  <li><strong>Email:</strong> accessibility@skillswap.com</li>
                  <li><strong>Subject Line:</strong> Accessibility Feedback</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  When reporting accessibility issues, please include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>The specific page or feature where you encountered the issue</li>
                  <li>A description of the problem</li>
                  <li>The assistive technology you were using (if applicable)</li>
                  <li>Your browser and operating system information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alternative Access</h2>
                <p className="text-gray-700 mb-4">
                  If you are unable to access any content or functionality on our website, please contact us and we will work to provide you with alternative access to the information or functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Statement</h2>
                <p className="text-gray-700 mb-4">
                  This accessibility statement will be updated as we make improvements to our website and as new accessibility standards and guidelines become available.
                </p>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
