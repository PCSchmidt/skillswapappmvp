'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import AuthPreview from '@/components/auth/AuthPreview';
import CallToAction from '@/components/landing/CallToAction';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorksSkeleton from '@/components/landing/skeletons/HowItWorksSkeleton';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

// Import skeleton component

// Dynamic import for HowItWorks component
const HowItWorks = dynamic(
  () => import('@/components/landing/HowItWorks'),
  { loading: () => <HowItWorksSkeleton /> }
);

// Import our newly created components
import SearchComponent from '@/components/search/SearchComponent';
import FeaturedSkills from '@/components/skills/FeaturedSkills';
import SkillCategories from '@/components/skills/SkillCategories';
import SkillFilters from '@/components/skills/SkillFilters';

// Dynamic import for TestimonialsCarousel which is likely heavy due to animations
const TestimonialsCarousel = dynamic(
  () => import('@/components/testimonials/TestimonialsCarousel'),
  { 
    loading: () => (
      <Section className="py-16 bg-primary-50">
        <Container>
          <div className="text-center mb-8">
            <div className="h-8 w-60 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl h-64 bg-white rounded-lg shadow-sm animate-pulse"></div>
          </div>
        </Container>
      </Section>
    ),
    ssr: false // Testimonials carousel is likely to use browser-specific APIs
  }
);

// Import Phase 5 components

export default function HomePage() {
  const router = useRouter();
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Handle search from the hero section
  const handleHeroSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    setIsFiltering(true);
    // In a real implementation, this would fetch filtered skills from the API
    // For the preview, we'll just simulate a delay
    setTimeout(() => {
      setIsFiltering(false);
    }, 500);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <HeroSection>
        <div className="max-w-2xl mx-auto mt-8">
          <SearchComponent 
            placeholder="Search for skills (e.g., 'Web Design', 'Spanish Lessons')" 
            className="w-full"
            onSearch={handleHeroSearch}
          />
        </div>
      </HeroSection>

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

      {/* Skills Section with Filtering - Using Phase 5 components */}
      <Section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Skills</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Use our interactive filters to find exactly what you're looking for
            </p>
            
            <div className="max-w-2xl mx-auto">
              <SearchComponent 
                placeholder="Search skills by title, description, or tags"
                className="mb-8"
              />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with filters */}
            <div className="w-full lg:w-1/4">
              <SkillFilters
                onFilterChange={handleFilterChange}
                className="bg-white p-6 rounded-xl shadow-sm"
              />
            </div>
            
            {/* Featured skills grid */}
            <div className="w-full lg:w-3/4">
              {isFiltering ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <FeaturedSkills 
                  title=""
                  subtitle=""
                  limit={6}
                />
              )}
            </div>
          </div>
        </Container>
      </Section>
      
      {/* Skill Categories Section */}
      <SkillCategories
        title="Explore Skill Categories"
        subtitle="Browse through skill categories to find what you're looking for"
      />

      {/* Testimonials Section - Using our carousel component */}
      <TestimonialsCarousel />

      {/* Auth Preview Section */}
      <Section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Join Our Community Today
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Create your free account to start sharing skills, connecting with others,
                and building a stronger local community through knowledge exchange.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 text-primary-600 p-2 rounded-full shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Personalized Profile</h3>
                    <p className="text-gray-600">Showcase your skills and interests to connect with like-minded people</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 text-primary-600 p-2 rounded-full shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Messaging System</h3>
                    <p className="text-gray-600">Direct messaging to arrange skill exchanges and discuss details</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary-100 text-primary-600 p-2 rounded-full shrink-0 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Review System</h3>
                    <p className="text-gray-600">Build your reputation through meaningful exchanges and reviews</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <AuthPreview variant="card" className="max-w-md mx-auto" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Call to Action Section - Using our new component */}
      <CallToAction theme="secondary" />
    </div>
  );
}
