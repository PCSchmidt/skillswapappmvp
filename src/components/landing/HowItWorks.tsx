/**
 * How It Works Section Component
 * 
 * Displays the step-by-step process of how SkillSwap works with visual indicators.
 */

'use client';

import React from 'react';
import Container from '../layout/Container';
import Section from '../layout/Section';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface HowItWorksProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
}

export default function HowItWorks({
  title = "How SkillSwap Works",
  subtitle = "Our platform makes skill exchange simple and effective through a step-by-step process.",
  steps = defaultSteps,
}: HowItWorksProps) {
  return (
    <Section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{title}</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        <div className="relative">
          {/* Process connector line */}
          <div className="absolute hidden md:block left-0 right-0 top-1/2 h-0.5 bg-neutral-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className={`bg-white rounded-xl p-6 border transition-all duration-300 hover:shadow-lg relative ${
                  index === 0 ? 'border-primary-500 md:-mt-2' :
                  index === 1 ? 'border-secondary-500 md:mt-8' :
                  'border-tertiary-500 md:-mt-2'
                }`}
              >
                {/* Step number circle */}
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-5 ${
                    index === 0 ? 'bg-primary-500' :
                    index === 1 ? 'bg-secondary-500' :
                    'bg-tertiary-500'
                  }`}
                >
                  {step.number}
                </div>
                
                {/* Step icon */}
                <div className="mb-4 text-neutral-800">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
                
                {/* Connecting arrow to next step (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 transform z-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Default steps with icons
const defaultSteps: Step[] = [
  {
    number: 1,
    title: "Create Your Profile",
    description: "Sign up and list the skills you can share and the ones you want to learn.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    )
  },
  {
    number: 2,
    title: "Browse & Connect",
    description: "Find members with complementary skills and send a swap request.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-secondary-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    )
  },
  {
    number: 3,
    title: "Exchange Skills",
    description: "Schedule sessions, exchange knowledge, and grow your skillset.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-tertiary-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    )
  }
];
