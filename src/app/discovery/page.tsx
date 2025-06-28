/**
 * Enhanced Skill Discovery Page
 * 
 * Combines interactive discovery with demo data to create an engaging
 * experience for trial users, showcasing the full potential of the platform.
 */

'use client';

import React, { useState } from 'react';

import DemoDataProvider, { DemoSkill } from '@/components/demo/DemoDataProvider';
import InteractiveSkillDiscovery from '@/components/discovery/InteractiveSkillDiscovery';
import SuccessToast from '@/components/feedback/SuccessToast';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import EnhancedSkillSwapProposal, { SkillSwapProposal } from '@/components/trades/EnhancedSkillSwapProposal';

export default function EnhancedDiscoveryPage() {
  const [selectedSkill, setSelectedSkill] = useState<DemoSkill | null>(null);
  const [showProposal, setShowProposal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSkillSelect = (skill: DemoSkill) => {
    setSelectedSkill(skill);
    setShowProposal(true);
  };

  const handleProposalSubmit = (proposal: SkillSwapProposal) => {
    // Show success toast instead of alert
    setShowSuccessToast(true);
    setShowProposal(false);
    
    // In real app, this would make an API call to create the proposal
    console.log('Proposal submitted:', proposal);
  };

  const handleCloseProposal = () => {
    setShowProposal(false);
    setSelectedSkill(null);
  };

  return (
    <DemoDataProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <Section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
          <Container>
            <div className="text-center py-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Discover Amazing Skills
              </h1>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                Connect with talented people in your community and start learning something new today.
                Trade your skills for theirs in a fair, friendly exchange.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-primary-100 text-sm">Active Skills</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">1,200+</div>
                  <div className="text-primary-100 text-sm">Community Members</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">3,000+</div>
                  <div className="text-primary-100 text-sm">Successful Swaps</div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Demo Banner */}
        <Section className="bg-yellow-50 border-b border-yellow-200">
          <Container>
            <div className="py-4">
              <div className="flex items-center justify-center space-x-2 text-yellow-800">
                <span className="text-2xl">🎯</span>
                <div className="text-center">
                  <p className="font-medium">
                    You're viewing a demo with sample skills and users
                  </p>
                  <p className="text-sm text-yellow-700">
                    Create an account to see real skills from your community and start swapping!
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Main Discovery Content */}
        <Section>
          <Container>
            <div className="py-12">
              <InteractiveSkillDiscovery 
                onSkillSelect={handleSkillSelect}
                className="max-w-7xl mx-auto"
              />
            </div>
          </Container>
        </Section>

        {/* Features Preview */}
        <Section className="bg-white">
          <Container>
            <div className="py-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Coming Soon: Premium Features
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We're building advanced features to make skill swapping even better.
                  Join our waitlist to get early access!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI-Powered Matching
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get personalized skill recommendations based on your interests, location, and learning goals.
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="text-4xl mb-4">🗓️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Smart Scheduling
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Automatically sync calendars and find perfect meeting times that work for everyone.
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Skill Certifications
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Earn verified certificates for completed skill exchanges and build your learning portfolio.
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Group Learning
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Join group sessions where one expert teaches multiple learners, maximizing everyone's time.
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200">
                  <div className="text-4xl mb-4">💎</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Premium Support
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get priority support, dispute resolution, and access to exclusive community events.
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Mobile App
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Take SkillSwap on the go with our upcoming iOS and Android apps with offline features.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Start Your Skill Journey?
                  </h3>
                  <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                    Join thousands of learners who are already trading skills and building amazing connections.
                    Sign up today and get matched with your first skill swap!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Create Free Account
                    </button>
                    <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors">
                      Join Waitlist for Premium
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Enhanced Skill Swap Proposal Modal */}
        {selectedSkill && (
          <EnhancedSkillSwapProposal
            skill={selectedSkill}
            isOpen={showProposal}
            onClose={handleCloseProposal}
            onSubmit={handleProposalSubmit}
          />
        )}

        {/* Success Toast */}
        <SuccessToast
          title="Proposal Sent Successfully!"
          message={`Your skill swap proposal has been sent to ${selectedSkill?.user.full_name}. This is a demo - in the real app, they would receive your message and can accept or decline.`}
          isVisible={showSuccessToast}
          onClose={() => setShowSuccessToast(false)}
        />
      </div>
    </DemoDataProvider>
  );
}
