'use client';

import React from 'react';
import Link from 'next/link';
import SkillList from '@/components/skills/SkillList';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trade Skills, Build Community
            </h1>
            <p className="text-xl mb-8">
              SkillSwap connects people to exchange skills and knowledge in a collaborative, 
              community-driven marketplace. Share what you know, learn what you don't.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/skills/discover" 
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg shadow-md"
              >
                Discover Skills
              </Link>
              <Link 
                href="/signup" 
                className="bg-accent-500 hover:bg-accent-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
              >
                Join SkillSwap
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How SkillSwap Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Skills</h3>
              <p className="text-gray-600">
                Share what you're good at or what you want to learn. From coding to cooking, 
                any skill can be valuable to someone else.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Arrange</h3>
              <p className="text-gray-600">
                Find people with matching interests, chat to discuss details, 
                and arrange a time and place to meet up.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Exchange Skills</h3>
              <p className="text-gray-600">
                Meet up and share knowledge. Rate your experience afterward to 
                help build a trusted community of learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Skills</h2>
            <Link href="/skills/discover" className="text-primary-600 hover:text-primary-500 font-medium">
              View All Skills →
            </Link>
          </div>
          
          <SkillList limit={6} featured={true} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-secondary-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Swapping?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community today and start exchanging skills, 
            expanding your knowledge, and making meaningful connections.
          </p>
          <Link 
            href="/signup" 
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
