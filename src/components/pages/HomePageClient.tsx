'use client';

import Link from 'next/link';
import React from 'react';

export default function HomePageClient() {
  return (
    <main>
      <section className="bg-gradient-primary text-white py-14 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Trade Skills, Build Community
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              SkillSwap connects people to exchange skills and knowledge in a collaborative, community-driven marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/signup" 
                className="bg-accent-yellow-500 hover:bg-accent-yellow-600 text-neutral-900 font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all text-center"
              >
                🚀 Join SkillSwap
              </a>
              <a 
                href="/skills/discover" 
                className="border border-white text-white hover:bg-white/20 px-6 py-4 rounded-lg text-center transition-all"
              >
                🔍 Discover Skills
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community and start sharing skills in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link href="/signup" className="text-center p-6 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Create Profile</h3>
              <p className="text-gray-600">Tell us about your skills and what you'd like to learn</p>
            </Link>
            <Link href="/discovery" className="text-center p-6 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors">
              <div className="w-16 h-16 bg-secondary-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">Connect</h3>
              <p className="text-gray-600">Browse skills and connect with other members</p>
            </Link>
            <Link href="/skills/browse" className="text-center p-6 bg-accent-yellow-50 rounded-xl hover:bg-accent-yellow-100 transition-colors">
              <div className="w-16 h-16 bg-accent-yellow-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Trade</h3>
              <p className="text-gray-600">Exchange skills and start learning</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
