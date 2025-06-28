import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help & FAQ | SkillSwap',
  description: 'Find answers to common questions about SkillSwap. Learn how to get started, manage your profile, and make the most of skill sharing.',
};

export default function HelpPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button in the top right corner. Fill out the registration form with your email, password, and basic profile information. You'll receive a confirmation email to verify your account."
        },
        {
          question: "How do I set up my profile?",
          answer: "After signing up, go to your Profile page. Add a profile picture, write a bio, and list your skills. The more complete your profile, the better matches you'll get!"
        },
        {
          question: "What types of skills can I share?",
          answer: "Any skill! From professional abilities like coding and design to personal skills like cooking and music. If you can teach it or want to learn it, it belongs on SkillSwap."
        }
      ]
    },
    {
      category: "Managing Skills",
      questions: [
        {
          question: "How do I add a new skill?",
          answer: "Go to 'My Skills' in your dashboard and click 'Add New Skill'. Provide a title, description, your experience level, and whether you're offering or seeking this skill."
        },
        {
          question: "Can I offer and seek the same skill?",
          answer: "Absolutely! You might be intermediate in a skill and want to both teach beginners and learn from experts. Create separate listings for offering and seeking."
        },
        {
          question: "How do I edit or delete my skills?",
          answer: "Go to 'My Skills' and click the edit or delete buttons on any skill you've created. You can update information or remove skills at any time."
        }
      ]
    },
    {
      category: "Finding Matches",
      questions: [
        {
          question: "How does skill matching work?",
          answer: "Our algorithm matches you with people based on complementary skills, location preferences, availability, and experience levels. Check your 'Matches' page for suggestions."
        },
        {
          question: "How do I search for specific skills?",
          answer: "Use the search bar on the Browse Skills page. You can filter by category, experience level, location, and whether it's remote-friendly."
        },
        {
          question: "What if I don't find what I'm looking for?",
          answer: "Create a 'seeking' skill post! Other users will be able to find you when they browse. You can also check back regularly as new users join daily."
        }
      ]
    },
    {
      category: "Communication",
      questions: [
        {
          question: "How do I contact someone about their skill?",
          answer: "Click 'Contact' on any skill card. This opens our secure messaging system where you can introduce yourself and discuss the skill exchange."
        },
        {
          question: "Is my personal information safe?",
          answer: "Yes! We never share your email or phone number. All communication happens through our platform until you choose to share contact details."
        },
        {
          question: "What should I include in my first message?",
          answer: "Introduce yourself, mention the skill you're interested in, your experience level, and what you can offer in return. Be friendly and specific!"
        }
      ]
    },
    {
      category: "Skill Exchanges",
      questions: [
        {
          question: "How do skill exchanges work?",
          answer: "After connecting with someone, you'll arrange sessions through our platform. You can trade skills directly (I teach you X, you teach me Y) or participate in group learning."
        },
        {
          question: "Can exchanges be done remotely?",
          answer: "Many skills can be taught online! When creating a skill listing, specify if you're open to remote sessions. Video calls work great for many types of learning."
        },
        {
          question: "What if a skill exchange doesn't work out?",
          answer: "That's okay! Not every match is perfect. You can end exchanges amicably and leave honest feedback to help improve the community."
        }
      ]
    },
    {
      category: "Safety & Community",
      questions: [
        {
          question: "How do you ensure user safety?",
          answer: "We have community guidelines, user reporting systems, and profile verification. Always meet in public places for in-person exchanges and trust your instincts."
        },
        {
          question: "Can I report inappropriate behavior?",
          answer: "Yes! Use the report button on any profile or message. We take community safety seriously and will investigate all reports promptly."
        },
        {
          question: "What are the community guidelines?",
          answer: "Be respectful, honest about your skill level, show up when you commit, and treat others as you'd like to be treated. No harassment, spam, or inappropriate content."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help & Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to know about using SkillSwap
            </p>
            
            {/* Search Box */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <a
              href="/contact"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-600">Get personalized help from our team</p>
            </a>

            <a
              href="/how-it-works"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How It Works</h3>
              <p className="text-gray-600">Learn the basics of skill sharing</p>
            </a>

            <a
              href="/about"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About SkillSwap</h3>
              <p className="text-gray-600">Learn about our mission and values</p>
            </a>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {section.category}
                </h2>
                
                <div className="space-y-6">
                  {section.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="bg-blue-50 rounded-lg p-8 mt-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Contact Support
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
