'use client';

import React from 'react';
import Link from 'next/link';
import SkillList from '@/components/skills/SkillList';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="font-heading font-bold mb-6">
                Trade Skills, Build Community
              </h1>
              <p className="text-xl mb-8 text-white/90">
                SkillSwap connects people to exchange skills and knowledge in a collaborative, 
                community-driven marketplace. Share what you know, learn what you don't.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/skills/discover" 
                  className="btn-outline border-white text-white hover:bg-white/10 px-6 py-3"
                >
                  Discover Skills
                </Link>
                <Link 
                  href="/signup" 
                  className="btn bg-accent-yellow-500 hover:bg-accent-yellow-600 text-neutral-900 font-semibold px-6 py-3"
                >
                  Join SkillSwap
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl hidden md:block">
              {/* Placeholder for hero image - would be replaced with actual image */}
              <div className="bg-primary-800 h-80 flex items-center justify-center">
                <span className="text-xl opacity-70">Community collaboration illustration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose SkillSwap?</h2>
            <p className="text-neutral-700 text-lg">
              Our platform makes skill-sharing simple, safe, and rewarding for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover-lift transition-normal p-6">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
              <p className="text-neutral-700">
                Join a vibrant local community where skills and knowledge are freely exchanged.
              </p>
            </div>
            
            <div className="card hover-lift transition-normal p-6">
              <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Trusted</h3>
              <p className="text-neutral-700">
                Verified profiles, reviews, and our community guidelines ensure positive experiences.
              </p>
            </div>
            
            <div className="card hover-lift transition-normal p-6">
              <div className="w-12 h-12 bg-tertiary-100 text-tertiary-700 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-neutral-700">
                Arrange skill exchanges when and where it works for you. No pressure, just opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">How SkillSwap Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover-lift transition-normal">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Skills</h3>
              <p className="text-neutral-700">
                Share what you're good at or what you want to learn. From coding to cooking, 
                any skill can be valuable to someone else.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover-lift transition-normal">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Arrange</h3>
              <p className="text-neutral-700">
                Find people with matching interests, chat to discuss details, 
                and arrange a time and place to meet up.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover-lift transition-normal">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Exchange Skills</h3>
              <p className="text-neutral-700">
                Meet up and share knowledge. Rate your experience afterward to 
                help build a trusted community of learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Skills Section */}
      <section className="section">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Skills</h2>
            <Link href="/skills/discover" className="text-primary-600 hover:text-primary-700 font-medium group">
              View All Skills <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          
          <SkillList limit={6} featured={true} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Community Says</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                  JD
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">John Doe</h4>
                  <div className="flex text-accent-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-neutral-700">
                "I've learned more about photography in two skill-swap sessions than I did in months of YouTube tutorials. The personal connections make all the difference."
              </p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-700 font-bold">
                  AS
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Aisha Smith</h4>
                  <div className="flex text-accent-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-neutral-700">
                "Teaching Spanish while learning graphic design has been amazing. I'm saving money while building skills and making friends in my community."
              </p>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-tertiary-100 rounded-full flex items-center justify-center text-tertiary-700 font-bold">
                  MJ
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">Michael Johnson</h4>
                  <div className="flex text-accent-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                  </div>
                </div>
              </div>
              <p className="text-neutral-700">
                "As a retiree, SkillSwap lets me share decades of woodworking experience while learning about modern technology from younger members. It's a win-win."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-gradient-secondary text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Swapping?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community today and start exchanging skills, 
            expanding your knowledge, and making meaningful connections.
          </p>
          <Link 
            href="/signup" 
            className="btn-lg bg-white text-secondary-600 hover:bg-white/90 font-semibold shadow-md"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
