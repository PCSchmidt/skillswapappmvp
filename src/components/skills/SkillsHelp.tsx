/**
 * Skills Help Component
 * 
 * Provides helpful tips and guidance for users when adding or searching for skills.
 * Can be used as a sidebar, modal, or inline component.
 */

'use client';

import React, { useState } from 'react';
import { TRENDING_SEARCHES, POPULAR_SKILLS } from '@/data/skillSuggestions';

interface SkillsHelpProps {
  mode?: 'sidebar' | 'inline' | 'compact';
  showTips?: boolean;
  showExamples?: boolean;
  className?: string;
}

export default function SkillsHelp({
  mode = 'inline',
  showTips = true,
  showExamples = true,
  className = ''
}: SkillsHelpProps) {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const tips = [
    {
      icon: '💡',
      title: 'Be Specific',
      description: 'Use specific skill names like "React.js Development" instead of just "Programming".',
      examples: ['React.js Development', 'Spanish Conversation', 'Watercolor Painting', 'Excel Data Analysis']
    },
    {
      icon: '📝',
      title: 'Add Context',
      description: 'Include your experience level and what you can offer or need.',
      examples: ['Beginner seeking help', 'Expert willing to mentor', 'Intermediate looking to improve']
    },
    {
      icon: '🎯',
      title: 'Set Clear Goals',
      description: 'Define what success looks like for your skill exchange.',
      examples: ['Learn basics in 4 weeks', 'Master advanced techniques', 'Build a portfolio project']
    },
    {
      icon: '🤝',
      title: 'Be Open',
      description: 'Consider both in-person and remote options to find the best matches.',
      examples: ['Video call sessions', 'Local meetups', 'Online collaboration', 'Hybrid approach']
    }
  ];

  const skillWritingTips = [
    'Use action words: "Learn", "Master", "Improve", "Teach"',
    'Include the benefit: "Build portfolio", "Career change", "Personal growth"',
    'Mention tools: "Adobe Photoshop", "Microsoft Excel", "Guitar (acoustic)"',
    'Add time frame: "Weekend workshop", "6-week course", "Monthly sessions"'
  ];

  if (mode === 'compact') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-lg">💡</div>
          <div>
            <h4 className="font-medium text-blue-900 text-sm">Quick Tip</h4>
            <p className="text-blue-800 text-sm mt-1">
              Be specific about your skills. "React.js Development" works better than "Programming".
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Skills Help & Tips</h3>
        </div>

        {showTips && (
          <div className="space-y-4 mb-6">
            {tips.map((tip, index) => (
              <div key={index} className="border border-gray-100 rounded-lg">
                <button
                  onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{tip.icon}</span>
                    <span className="font-medium text-gray-900">{tip.title}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      expandedTip === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedTip === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm mb-3">{tip.description}</p>
                    <div className="bg-gray-50 rounded-md p-3">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Examples:</h5>
                      <div className="space-y-1">
                        {tip.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="text-xs text-gray-600">
                            • {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {showExamples && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">💫 Popular Skills Right Now</h4>
              <div className="grid grid-cols-1 gap-2">
                {POPULAR_SKILLS.slice(0, 6).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <span className="text-sm text-gray-700 font-medium">{skill.name}</span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                      {skill.subcategory}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">🔥 Trending Searches</h4>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.slice(0, 8).map((search, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full border border-primary-200"
                  >
                    {search}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">✍️ Writing Better Skill Descriptions</h4>
              <div className="space-y-2">
                {skillWritingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-200 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    </div>
                    <span className="text-sm text-gray-600">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Need more help? Check out our</span>
            <a href="/how-it-works" className="text-primary-600 hover:text-primary-700 font-medium">
              How It Works guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick Tips Component for Forms
export function QuickTips({ tips }: { tips: string[] }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-yellow-600 text-lg">💡</div>
        <div>
          <h4 className="font-medium text-yellow-900 text-sm mb-2">Quick Tips</h4>
          <ul className="space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="text-yellow-800 text-sm">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Success Examples Component
export function SuccessExamples() {
  const examples = [
    {
      skill: 'Web Development',
      exchange: 'Taught React.js in exchange for Spanish lessons',
      outcome: 'Built a portfolio website and learned conversational Spanish'
    },
    {
      skill: 'Graphic Design',
      exchange: 'Created logos for small businesses in exchange for business coaching',
      outcome: 'Improved design skills and learned entrepreneurship basics'
    },
    {
      skill: 'Cooking',
      exchange: 'Taught Italian cooking in exchange for guitar lessons',
      outcome: 'Shared family recipes and learned to play favorite songs'
    }
  ];

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-green-600 text-lg">🌟</div>
        <h4 className="font-medium text-green-900 text-sm">Success Stories</h4>
      </div>
      <div className="space-y-3">
        {examples.map((example, index) => (
          <div key={index} className="bg-white rounded-md p-3 border border-green-100">
            <div className="font-medium text-green-900 text-sm mb-1">{example.skill}</div>
            <div className="text-green-700 text-xs mb-1">{example.exchange}</div>
            <div className="text-green-600 text-xs italic">"{example.outcome}"</div>
          </div>
        ))}
      </div>
    </div>
  );
}
