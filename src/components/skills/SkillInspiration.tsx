/**
 * Skill Inspiration Section
 * 
 * Showcases popular skills and categories to inspire users and help them
 * understand what kinds of skills they can share or learn on the platform.
 */

'use client';

import Link from 'next/link';
import React from 'react';
import { SKILL_CATEGORIES, POPULAR_SKILLS, getRandomSkills } from '@/data/skillSuggestions';

export default function SkillInspiration() {
  // Get a curated selection of skills for display
  const featuredSkills = getRandomSkills(8);
  const categories = Object.values(SKILL_CATEGORIES).slice(0, 6); // Show first 6 categories

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Discover Amazing Skills
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            From coding to cooking, design to dancing - explore the incredible skills our community has to offer.
            Find your next learning adventure or share your expertise with others.
          </p>
        </div>

        {/* Popular Skills Grid */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            🔥 Trending Skills Right Now
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredSkills.map((skill, index) => (
              <Link
                key={index}
                href={`/skills/browse?search=${encodeURIComponent(skill.name)}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all duration-200"
              >
                <div className="flex items-start space-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 line-clamp-1">
                      {skill.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {skill.description}
                    </p>
                    <div className="flex items-center mt-3">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {skill.subcategory}
                      </span>
                      {skill.isPopular && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Showcase */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Explore by Category
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/skills/browse?category=${encodeURIComponent(category.name)}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md hover:border-primary-300 transition-all duration-200"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary-700 mb-2">
                  {category.name}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link
              href="/skills/browse"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse All Skills
            </Link>
            <Link
              href="/skills/add"
              className="inline-flex items-center px-6 py-3 border border-primary-600 text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Share Your Skills
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Join thousands of learners and teachers in our growing community
          </p>
        </div>
      </div>
    </section>
  );
}

// Compact version for smaller sections
export function SkillInspirationCompact() {
  const popularSkills = POPULAR_SKILLS.slice(0, 6);

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        💡 Popular Skills to Get Started
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {popularSkills.map((skill, index) => (
          <Link
            key={index}
            href={`/skills/browse?search=${encodeURIComponent(skill.name)}`}
            className="group bg-white rounded-md p-3 text-center hover:shadow-sm hover:bg-primary-50 transition-all"
          >
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-700 line-clamp-1">
              {skill.name}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
              {skill.subcategory}
            </p>
          </Link>
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link
          href="/skills/browse"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Explore all skills →
        </Link>
      </div>
    </div>
  );
}
