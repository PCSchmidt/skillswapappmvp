/**
 * Hero Section Component
 * 
 * The primary landing section with headline, subheading, CTA and illustration.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import SkillSearch from '@/components/skills/SkillSearch';

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  badgeText?: string;
  imagePlaceholder?: boolean;
  trustBadge?: boolean;
  children?: React.ReactNode;
}

export default function HeroSection({
  title = "Trade Skills,\nBuild Community",
  subtitle = "SkillSwap connects people to exchange skills and knowledge in a collaborative, community-driven marketplace. Share what you know, learn what you don't.",
  ctaPrimaryText = "Join SkillSwap",
  ctaPrimaryLink = "/signup",
  ctaSecondaryText = "Discover Skills",
  ctaSecondaryLink = "/skills/discover",
  badgeText = "Launching Summer 2025",
  imagePlaceholder = true,
  trustBadge = true,
  children
}: HeroSectionProps) {
  // Replace newline characters with <br /> for line breaks in title
  const formattedTitle = title.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < title.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));

  return (
    <section className="bg-gradient-primary text-white py-14 md:py-24 relative overflow-hidden">
      {/* Abstract shape decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary-800/30 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            {badgeText && (
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-sm font-medium mb-6 animate-pulse">
                {badgeText}
              </span>
            )}
            
            <h1 className="font-heading font-bold mb-4 text-4xl md:text-5xl lg:text-6xl">
              {formattedTitle}
            </h1>
            
            <p className="text-xl mb-8 text-white/90 max-w-lg">
              {subtitle}
            </p>
              <div className="flex flex-col sm:flex-row gap-4">
              {ctaSecondaryText && ctaSecondaryLink && (
                <Link 
                  href={ctaSecondaryLink} 
                  className="btn-outline border-white text-white hover:bg-white/20 focus:bg-white/30 px-6 py-3 text-center"
                >
                  {ctaSecondaryText}
                </Link>
              )}
                {ctaPrimaryText && ctaPrimaryLink && (
                <Link 
                  href={ctaPrimaryLink} 
                  className="btn bg-accent-yellow-500 hover:bg-accent-yellow-600 text-neutral-900 font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all text-center"
                  data-testid="signup-button"
                >
                  {ctaPrimaryText}
                </Link>
              )}
            </div>
            
            {/* Enhanced Search Section */}
            <div className="mt-8">
              <div className="text-center mb-4">
                <p className="text-white/90 text-sm">
                  Or explore what's available right now
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <SkillSearch
                  placeholder="Search for skills..."
                  redirectOnSearch={true}
                  className="w-full"
                  showSuggestions={true}
                  maxSuggestions={5}
                />
              </div>
            </div>
            
            {children && (
              <div className="mt-6">{children}</div>
            )}
            
            {trustBadge && (
              <div className="mt-12 flex items-center gap-3 text-white/90">
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent-yellow-400">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                </span>
                <span>Trusted by 10,000+ members</span>
              </div>
            )}
          </div>
          
          <div className="relative">
            {/* Decorative backgrounds */}
            <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg transform rotate-3"></div>
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-accent-yellow-400 to-accent-yellow-600 rounded-lg transform -rotate-3"></div>
            
            {/* Hero image container */}
            <div className="rounded-lg overflow-hidden shadow-2xl relative z-10 bg-white">
              <div className="relative w-full h-[420px]">
                {imagePlaceholder ? (
                  /* Placeholder for hero image */
                  <div className="absolute inset-0 bg-primary-800 flex items-center justify-center">
                    <div className="text-center text-white/70">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 mx-auto mb-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                      </svg>
                      <span className="text-xl font-medium">Community collaboration illustration</span>
                    </div>
                  </div>
                ) : (
                  /* Actual hero image when provided */
                  <Image 
                    src="/images/hero-image.jpg" 
                    alt="People exchanging skills in a community setting"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                )}
              </div>
            </div>
            
            {/* Floating stats cards */}
            <div className="absolute top-5 -right-5 md:-right-10 z-20 bg-white rounded-lg shadow-xl px-4 py-3 max-w-[160px]">
              <div className="text-primary-600 text-2xl font-bold">3,500+</div>
              <div className="text-neutral-600 text-sm">Skills shared this month</div>
            </div>
            <div className="absolute -bottom-5 -left-5 md:-left-10 z-20 bg-white rounded-lg shadow-xl px-4 py-3 max-w-[160px]">
              <div className="text-secondary-600 text-2xl font-bold">98%</div>
              <div className="text-neutral-600 text-sm">Positive experiences</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
