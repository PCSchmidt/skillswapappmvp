'use client';

import React from 'react';
import { 
  PaymentMock, 
  VideoCallMock, 
  SMSNotificationMock, 
  TrustSafetyMock, 
  AnalyticsMock,
  ComingSoonFeature,
  DemoModeBanner
} from '../demo/MockFeatures';
import { 
  Smartphone, 
  Globe, 
  Users, 
  MessageCircle,
  Calendar,
  Star,
  TrendingUp,
  Shield
} from 'lucide-react';

const DemoShowcasePage = () => {
  const handleMockPayment = () => {
    alert('Demo: Payment processed successfully! In production, this would charge the user and transfer funds.');
  };

  const handleScheduleCall = () => {
    alert('Demo: Video call scheduled! In production, this would create a calendar event and send invitations.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoModeBanner />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SkillSwap Feature Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the complete SkillSwap experience! This demo showcases both current functionality 
            and planned premium features that will be added as the platform grows.
          </p>
        </div>

        {/* Current Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">✅ Available Now (Free)</h2>
          <p className="text-gray-600 mb-8">These features are fully functional in the current version</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-semibold">User Profiles</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Complete user registration, profile creation, and skill management system.
              </p>
              <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                ✅ Fully functional with Supabase
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-semibold">Messaging</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Real-time messaging between users for skill exchange coordination.
              </p>
              <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                ✅ Real-time with Supabase Realtime
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-semibold">Skill Discovery</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Search and filter skills by category, location, and experience level.
              </p>
              <div className="text-sm text-green-700 bg-green-50 p-2 rounded">
                ✅ Advanced search with filters
              </div>
            </div>
          </div>
        </section>

        {/* Demo Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🎭 Demo Features (Planned)</h2>
          <p className="text-gray-600 mb-8">
            These features demonstrate the intended functionality and user experience for premium features
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PaymentMock 
              amount={35} 
              onMockPayment={handleMockPayment}
            />
            
            <VideoCallMock 
              onScheduleCall={handleScheduleCall}
            />
            
            <SMSNotificationMock 
              message="Your Python tutoring session with Sarah starts in 15 minutes!"
              phoneNumber="+1 (555) 123-4567"
            />
            
            <TrustSafetyMock 
              userRating={4.9}
              isVerified={false}
            />
            
            <AnalyticsMock />
            
            <ComingSoonFeature
              title="Mobile App"
              description="Native iOS and Android apps for on-the-go skill sharing"
              icon={Smartphone}
            />
          </div>
        </section>

        {/* Roadmap Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🗓️ Development Roadmap</h2>
          
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            
            <div className="space-y-8">
              {/* Q3 2025 */}
              <div className="relative flex items-start">
                <div className="absolute left-2.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></div>
                <div className="ml-10">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Q3 2025 - Core Platform</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Payment processing with Stripe</li>
                      <li>• Video call integration</li>
                      <li>• Trust & safety verification</li>
                      <li>• Advanced matching algorithm</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Q4 2025 */}
              <div className="relative flex items-start">
                <div className="absolute left-2.5 w-3 h-3 bg-purple-600 rounded-full border-2 border-white"></div>
                <div className="ml-10">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-purple-600 mb-2">Q4 2025 - Enhanced Experience</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• SMS notifications</li>
                      <li>• Advanced analytics</li>
                      <li>• Multi-language support</li>
                      <li>• Community features</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Q1 2026 */}
              <div className="relative flex items-start">
                <div className="absolute left-2.5 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></div>
                <div className="ml-10">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-green-600 mb-2">Q1 2026 - Mobile & Scale</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Native mobile apps</li>
                      <li>• Advanced integrations</li>
                      <li>• Corporate partnerships</li>
                      <li>• Global expansion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Demo Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">🔍 How This Demo Works</h2>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Real Features</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✅</span>
                    User authentication and profiles
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✅</span>
                    Real-time messaging system
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✅</span>
                    Skill search and filtering
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✅</span>
                    Data persistence in database
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-orange-600">Mock Features</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🎭</span>
                    Payment forms (no actual charging)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🎭</span>
                    Video call scheduling (demo only)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🎭</span>
                    SMS notifications (shown, not sent)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">🎭</span>
                    ID verification (simulated process)
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <p className="text-blue-800">
                <strong>For Testers:</strong> Please interact with all features, including the mock ones! 
                Your feedback on the overall user experience will help prioritize which premium features 
                to implement first.
              </p>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">💬 We Need Your Feedback!</h2>
          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Help Shape SkillSwap's Future</h3>
              <p className="text-lg mb-6 opacity-90">
                Your testing and feedback will directly influence which features we build next!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Test Everything</h4>
                  <p className="text-sm opacity-90">Try both real and mock features</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Share Feedback</h4>
                  <p className="text-sm opacity-90">Tell us what works and what doesn't</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Invite Others</h4>
                  <p className="text-sm opacity-90">More testers = better product</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DemoShowcasePage;
