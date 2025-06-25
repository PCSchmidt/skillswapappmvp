import React from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-600 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are stored on your computer or mobile device when you visit a website. They allow the website to recognize your device and store some information about your preferences or past actions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
                <p className="text-gray-700 mb-4">
                  SkillSwap uses cookies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Improve the performance and functionality of our service</li>
                  <li>Analyze how our service is used</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">Essential Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are necessary for the website to function properly. They enable basic functions like page navigation, access to secure areas, and authentication. The website cannot function properly without these cookies.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Performance Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies collect information about how visitors use our website, such as which pages are visited most often and if they get error messages. This information helps us improve how our website works.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Functional Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, more personal features.
                </p>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Targeting/Advertising Cookies</h3>
                <p className="text-gray-700 mb-4">
                  These cookies are used to deliver advertisements that are more relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and measure the effectiveness of advertising campaigns.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We may use third-party services that place cookies on your device, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Google Analytics:</strong> To analyze website traffic and usage patterns</li>
                  <li><strong>Authentication providers:</strong> To enable social login features</li>
                  <li><strong>Payment processors:</strong> To handle secure payments</li>
                  <li><strong>Customer support tools:</strong> To provide chat and help functionality</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Duration</h2>
                <p className="text-gray-700 mb-4">
                  Cookies can be either session cookies (which are deleted when you close your browser) or persistent cookies (which remain on your device for a longer period). We use both types:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Session cookies:</strong> Typically used for authentication and navigation</li>
                  <li><strong>Persistent cookies:</strong> Used to remember your preferences and improve your experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Managing Cookies</h2>
                <p className="text-gray-700 mb-4">
                  You have several options for managing cookies:
                </p>
                
                <h3 className="text-xl font-medium text-gray-900 mb-3">Browser Settings</h3>
                <p className="text-gray-700 mb-4">
                  Most browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Block all cookies</li>
                  <li>Block third-party cookies</li>
                  <li>Delete cookies after each session</li>
                  <li>Set up notifications when cookies are being sent</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 mb-3">Cookie Preferences</h3>
                <p className="text-gray-700 mb-4">
                  You can manage your cookie preferences through our cookie consent banner when you first visit our website, or by accessing your account settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Impact of Disabling Cookies</h2>
                <p className="text-gray-700 mb-4">
                  If you choose to disable cookies, some features of our website may not function properly. This may include:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Difficulty staying logged in</li>
                  <li>Loss of personalized settings</li>
                  <li>Reduced website functionality</li>
                  <li>Less relevant content recommendations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
                </p>
                <ul className="list-none text-gray-700 mb-4">
                  <li>Email: privacy@skillswap.com</li>
                </ul>
              </section>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
