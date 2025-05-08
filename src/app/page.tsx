'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

// Import our newly created components
import FeaturedSkills from '@/components/skills/FeaturedSkills';
import SkillCategories from '@/components/skills/SkillCategories';
import TestimonialsCarousel from '@/components/testimonials/TestimonialsCarousel';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import CallToAction from '@/components/landing/CallToAction';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

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

      {/* How It Works Section - Using our new component */}
      <HowItWorks />

      {/* Featured Skills Section - Using our new component */}
      <FeaturedSkills 
        title="Featured Skills"
        subtitle="Discover our community's most popular skills ready for exchange"
        limit={6}
      />
      
      {/* Skill Categories Section */}
      <SkillCategories
        title="Explore Skill Categories"
        subtitle="Browse through skill categories to find what you're looking for"
      />

      {/* Testimonials Section - Using our carousel component */}
      <TestimonialsCarousel />

      {/* Call to Action Section - Using our new component */}
      <CallToAction theme="secondary" />
    </div>
  );
}
