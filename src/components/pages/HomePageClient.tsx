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
      <SkillCategories />
      
      {/* Demo Features Banner */}
      <section className="py-12 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              🎭 Explore All Planned Features in Demo Mode
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              See the complete SkillSwap experience! Test both current functionality and 
              planned premium features including payments, video calls, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/demo"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-flex items-center gap-2"
              >
                <span>🚀</span>
                Try Demo Features
              </a>
              <span className="text-purple-200 text-sm">
                Perfect for testing • No payment required • Full feature preview
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
