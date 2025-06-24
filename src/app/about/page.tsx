import { Metadata } from 'next';
import { Container } from '@/components/layout/Container';

export const metadata: Metadata = {
  title: 'About Us | SkillSwap',
  description: 'Learn about SkillSwap\'s mission to connect people through skill sharing and community building.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container size="lg" className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About SkillSwap
            </h1>
            <p className="text-xl text-gray-600">
              Building connections through knowledge sharing
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              SkillSwap exists to democratize learning by connecting people who want to share their knowledge 
              with those eager to learn. We believe that everyone has valuable skills to offer and that learning 
              should be accessible, collaborative, and community-driven.
            </p>
          </div>

          {/* Story */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p className="mb-4">
                SkillSwap was born from a simple observation: in every community, there are people with amazing 
                skills who would love to share their knowledge, and others who are eager to learn those very skills. 
                Traditional education and training can be expensive and formal, but real learning happens best through 
                human connection and practical experience.
              </p>
              <p className="mb-4">
                We envisioned a platform where a web developer could teach coding in exchange for guitar lessons, 
                where a chef could share cooking techniques while learning photography, or where a yoga instructor 
                could trade classes for language tutoring. This vision of reciprocal learning and community building 
                is at the heart of everything we do.
              </p>
              <p>
                Today, SkillSwap is growing into a vibrant community where knowledge flows freely, connections are 
                formed, and everyone has the opportunity to both teach and learn.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community First</h3>
                <p className="text-gray-600">
                  We prioritize building genuine connections and fostering a supportive learning environment 
                  where everyone feels welcome.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust & Safety</h3>
                <p className="text-gray-600">
                  We maintain a safe, respectful platform through community guidelines, user verification, 
                  and transparent feedback systems.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessible Learning</h3>
                <p className="text-gray-600">
                  We believe learning should be accessible to everyone, regardless of economic circumstances 
                  or formal education background.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mutual Benefit</h3>
                <p className="text-gray-600">
                  Every interaction should benefit both parties, creating win-win exchanges that strengthen 
                  our entire community.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Join Our Growing Community
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <div className="text-3xl font-bold text-primary-600 mb-2">1,000+</div>
                    <div className="text-gray-600">Active Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
                    <div className="text-gray-600">Skills Available</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary-600 mb-2">2,500+</div>
                    <div className="text-gray-600">Successful Exchanges</div>
                  </div>
                </div>
                <p className="text-gray-600 text-lg mb-6">
                  We're building something special together. Every day, our community grows stronger as more people 
                  discover the joy of sharing knowledge and learning from each other.
                </p>
                <a
                  href="/signup"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Join Our Community
                </a>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-6">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@skillswap.com"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
              >
                Learn How It Works
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
