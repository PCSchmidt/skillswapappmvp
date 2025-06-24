'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import CallToAction from '@/components/landing/CallToAction';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSkeleton from '@/components/landing/skeletons/HowItWorksSkeleton';
import SkillCategories from '@/components/skills/SkillCategories';

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
      <HowItWorks />
      <TestimonialsCarousel />
      <CallToAction />
    </main>
  );
}
