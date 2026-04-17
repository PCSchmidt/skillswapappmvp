'use client';

import React from 'react';
import Link from 'next/link';
import SkillList from '@/components/skills/SkillList';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-28 ambient-glow">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="eyebrow mb-4">Skill-Sharing Platform</p>
            <h1 className="text-display-md md:text-display-lg font-display font-semibold mb-6">
              Trade Skills, Build Community
            </h1>
            <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
              SkillSwap connects people to exchange skills and knowledge in a collaborative, 
              community-driven marketplace. Share what you know, learn what you don't.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/skills/browse" className="btn btn-primary py-3 px-6">
                Discover Skills
              </Link>
              <Link href="/signup" className="btn btn-secondary py-3 px-6">
                Join SkillSwap
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <p className="eyebrow text-center mb-3">How It Works</p>
          <h2 className="text-display-sm font-display font-semibold text-center mb-14">Three Simple Steps</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-900/30 text-emerald-400 border border-emerald-700/40 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Skills</h3>
              <p className="text-text-secondary">
                Share what you're good at or what you want to learn. From coding to cooking, 
                any skill can be valuable to someone else.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-900/30 text-emerald-400 border border-emerald-700/40 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Arrange</h3>
              <p className="text-text-secondary">
                Find people with matching interests, chat to discuss details, 
                and arrange a time and place to meet up.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-900/30 text-emerald-400 border border-emerald-700/40 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Exchange Skills</h3>
              <p className="text-text-secondary">
                Meet up and share knowledge. Rate your experience afterward to 
                help build a trusted community of learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="eyebrow mb-2">Browse</p>
              <h2 className="text-display-sm font-display font-semibold">Featured Skills</h2>
            </div>
            <Link href="/skills/browse" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">
              View All Skills →
            </Link>
          </div>
          
          <SkillList limit={6} featured={true} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 border-t border-border ambient-glow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-display-sm font-display font-semibold mb-4">Ready to Start Swapping?</h2>
          <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
            Join our community today and start exchanging skills, 
            expanding your knowledge, and making meaningful connections.
          </p>
          <Link href="/signup" className="btn btn-primary py-3 px-8">
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
