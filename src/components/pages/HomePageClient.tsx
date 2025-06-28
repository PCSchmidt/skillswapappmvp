'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import CallToAction from '@/components/landing/CallToAction';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSkeleton from '@/components/landing/skeletons/HowItWorksSkeleton';
import SkillCategories from '@/components/skills/SkillCategories';
import SkillInspiration from '@/components/skills/SkillInspiration';

// Dynamic imports for heavier components
const HowItWorks = dynamic(
  () => import('@/components/landing/HowItWorks'),
  { loading: () => <HowItWorksSkeleton /> }
);

const TestimonialsCarousel = dynamic(
  () => import('@/components/testimonials/TestimonialsCarousel'),
  { 
    loading: () => (
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 w-60 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
                <div className="flex items-center mt-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="ml-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-24"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
);

export default function HomePageClient() {
  return (
    <main>
      <HeroSection />
      
      {/* User Journey Quick Start */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Your SkillSwap Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community and experience the full power of skill sharing in just a few minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-gray-600 mb-4">Tell us about your skills and what you'd like to learn</p>
              <a href="/signup" className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1">
                Get Started <span>→</span>
              </a>
            </div>
            
            <div className="text-center p-6 bg-secondary-50 rounded-xl">
              <div className="w-16 h-16 bg-secondary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Discover & Connect</h3>
              <p className="text-gray-600 mb-4">Browse skills with our interactive discovery experience</p>
              <a href="/discovery" className="text-secondary-600 font-medium hover:text-secondary-700 inline-flex items-center gap-1">
                Try New Discovery <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-2 py-1 rounded-full ml-2">New!</span>
              </a>
            </div>
            
            <div className="text-center p-6 bg-accent-yellow-50 rounded-xl">
              <div className="w-16 h-16 bg-accent-yellow-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Start Trading</h3>
              <p className="text-gray-600 mb-4">Propose skill swaps and begin learning from each other</p>
              <a href="/demo" className="text-accent-yellow-600 font-medium hover:text-accent-yellow-700 inline-flex items-center gap-1">
                Try Demo <span>→</span>
              </a>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">500+</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-600">1,200+</div>
              <div className="text-gray-600">Skills Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-yellow-600">300+</div>
              <div className="text-gray-600">Successful Swaps</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">4.9★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
      
      <SkillCategories />
      
      {/* Demo Features Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              🎭 Experience Tomorrow's Features Today
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Test drive the complete SkillSwap ecosystem! Explore current features alongside premium capabilities 
              like secure payments, video sessions, and AI matching - all in a safe demo environment.
            </p>
            
            {/* Feature preview grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
                <div className="text-3xl mb-3">💳</div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure Payments</h3>
                <p className="text-purple-100 text-sm">Demo escrow system and transaction management</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
                <div className="text-3xl mb-3">📹</div>
                <h3 className="text-lg font-semibold text-white mb-2">Video Sessions</h3>
                <p className="text-purple-100 text-sm">Test virtual skill sharing and tutoring</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold text-white mb-2">AI Matching</h3>
                <p className="text-purple-100 text-sm">Experience intelligent skill pairing</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/demo"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                <span>🚀</span>
                Enter Demo Mode
              </a>
              <a 
                href="/how-it-works"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              >
                <span>📖</span>
                Learn More
              </a>
            </div>
            <div className="mt-4">
              <span className="text-purple-200 text-sm">
                ✨ Full feature preview • No payment required • Safe testing environment
              </span>
            </div>
          </div>
        </div>
      </section>
      
      <SkillInspiration />
      <HowItWorks />
      <TestimonialsCarousel />
      <CallToAction />
    </main>
  );
}
