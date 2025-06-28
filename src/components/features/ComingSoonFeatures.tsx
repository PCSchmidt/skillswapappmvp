'use client';

import React from 'react';

interface ComingSoonFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'Premium' | 'Pro' | 'Enterprise';
  estimatedRelease: string;
  isPriority?: boolean;
}

interface ComingSoonFeaturesProps {
  features: ComingSoonFeature[];
  className?: string;
}

export default function ComingSoonFeatures({ features, className = '' }: ComingSoonFeaturesProps) {
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'Premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pro': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Enterprise': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          🚀 Coming Soon to SkillSwap
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're constantly evolving! Here's a preview of exciting features in development 
          that will take your skill-sharing experience to the next level.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow relative"
          >
            {feature.isPriority && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                High Priority
              </div>
            )}
            
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {feature.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryStyle(feature.category)}`}>
                {feature.category}
              </span>
              <span className="text-xs text-gray-500">
                {feature.estimatedRelease}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <div className="bg-white rounded-lg p-6 border border-gray-200 inline-block">
          <h3 className="font-semibold text-gray-900 mb-2">Want to be notified?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Join our early access list to be the first to try new features
          </p>
          <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
            Join Early Access
          </button>
        </div>
      </div>
    </div>
  );
}
