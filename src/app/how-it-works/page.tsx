import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'How It Works | SkillSwap',
  description: 'Learn how SkillSwap connects people to exchange skills and knowledge in our collaborative community.',
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="lg" className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How SkillSwap Works
            </h1>
            <p className="text-xl text-gray-600">
              Learn how our platform makes skill exchange simple and effective
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  1
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Create Your Profile
                </h2>
                <p className="text-gray-600 mb-4">
                  Sign up and create your profile. Tell us about the skills you can share and the ones you want to learn. 
                  Be specific about your experience level and what you're looking for.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Add skills you can teach or help others with</li>
                  <li>List skills you want to learn</li>
                  <li>Set your availability and preferences</li>
                  <li>Add a profile photo and description</li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  2
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Browse & Connect
                </h2>
                <p className="text-gray-600 mb-4">
                  Explore our community to find members with complementary skills. Use our search and filtering tools 
                  to find exactly what you're looking for.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Search by skill category or keyword</li>
                  <li>Filter by location, availability, and experience level</li>
                  <li>View detailed profiles and skill descriptions</li>
                  <li>Send connection requests and messages</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Exchange Skills
                </h2>
                <p className="text-gray-600 mb-4">
                  Coordinate with your skill exchange partner to schedule sessions. Share knowledge, learn new skills, 
                  and build meaningful connections in our community.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Schedule in-person or virtual sessions</li>
                  <li>Set session duration and learning goals</li>
                  <li>Use our messaging system to coordinate</li>
                  <li>Rate and review your experience</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-16 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Why Choose SkillSwap?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">No Money Required</h3>
                    <p className="text-gray-600 text-sm">Exchange skills without financial transactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Learn from Experts</h3>
                    <p className="text-gray-600 text-sm">Connect with experienced practitioners</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Build Community</h3>
                    <p className="text-gray-600 text-sm">Form lasting connections with like-minded people</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Flexible Learning</h3>
                    <p className="text-gray-600 text-sm">Learn at your own pace and schedule</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-600 mb-6">
              Join our community and start exchanging skills today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Join SkillSwap
              </a>
              <a
                href="/search"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Browse Skills
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
