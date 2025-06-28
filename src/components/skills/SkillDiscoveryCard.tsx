'use client';

import Link from 'next/link';
import React from 'react';

interface SkillDiscoveryCardProps {
  title: string;
  description: string;
  category: string;
  learnersCount: number;
  teachersCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  isPopular?: boolean;
  link: string;
}

export default function SkillDiscoveryCard({
  title,
  description,
  category,
  learnersCount,
  teachersCount,
  difficulty,
  estimatedTime,
  isPopular = false,
  link
}: SkillDiscoveryCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={link} className="block group">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-primary-300 transition-all duration-200 relative">
        {isPopular && (
          <div className="absolute -top-2 -right-2 bg-accent-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            🔥 Popular
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
              {title}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {category}
            </span>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {description}
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{learnersCount} learning</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🎯</span>
            <span>{teachersCount} teaching</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
            <span className="text-xs text-gray-500">
              ⏱️ {estimatedTime}
            </span>
          </div>
          <span className="text-primary-600 text-sm font-medium group-hover:text-primary-700">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
