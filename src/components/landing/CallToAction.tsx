/**
 * Call-to-Action Section Component
 * 
 * A compelling CTA section to encourage user sign-ups with visual appeal.
 */

'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import Container from '../layout/Container';
import Section from '../layout/Section';

interface BenefitItem {
  text: string;
}

interface UserAvatar {
  initials: string;
  color: string;
}

interface CallToActionProps {
  title?: string;
  subtitle?: string;
  benefits?: BenefitItem[];
  ctaText?: string;
  ctaLink?: string;
  theme?: 'primary' | 'secondary' | 'tertiary';
  showEmailForm?: boolean;
  showUserAvatars?: boolean;
  userAvatars?: UserAvatar[];
}

export default function CallToAction({
  title = "Ready to start exchanging skills?",
  subtitle = "Join thousands of people sharing knowledge and learning new skills every day.",
  benefits = defaultBenefits,
  ctaText = "Join SkillSwap",
  ctaLink = "/signup",
  theme = 'primary',
  showEmailForm = true,
  showUserAvatars = true,
  userAvatars = defaultUserAvatars
}: CallToActionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Background and text color classes based on theme
  const themeClasses = {
    primary: 'bg-gradient-to-br from-primary-500 to-primary-700 text-white',
    secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-700 text-white',
    tertiary: 'bg-gradient-to-br from-tertiary-500 to-tertiary-700 text-white'
  };

  // Button color classes based on theme
  const buttonClasses = {
    primary: 'bg-accent-yellow-500 hover:bg-accent-yellow-600 text-neutral-900',
    secondary: 'bg-primary-500 hover:bg-primary-600 text-white',
    tertiary: 'bg-secondary-500 hover:bg-secondary-600 text-white'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setEmail('');
        setSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <Section className={`py-16 md:py-24 relative overflow-hidden ${themeClasses[theme]}`}>
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 rounded-full bg-white"></div>
        <div className="absolute -bottom-16 right-1/4 w-80 h-80 rounded-full bg-white"></div>
      </div>
      
      <Container className="relative z-10">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center">
          {/* Content Column */}
          <div className="md:col-span-3">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">{title}</h2>
            <p className="text-xl mb-8 opacity-90">{subtitle}</p>
            
            {/* Benefits List */}
            {benefits.length > 0 && (
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-accent-yellow-400">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {/* User Avatars */}
            {showUserAvatars && userAvatars.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    {userAvatars.map((avatar, index) => (
                      <div 
                        key={index} 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${avatar.color}`}
                        title={`User ${avatar.initials}`}
                      >
                        {avatar.initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm opacity-90">100+ people joined this week</span>
                </div>
              </div>
            )}
            
            {/* CTA Link */}
            {!showEmailForm && (
              <Link 
                href={ctaLink} 
                className={`inline-block px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${buttonClasses[theme]}`}
              >
                {ctaText}
              </Link>
            )}
          </div>
          
          {/* Form Column */}
          <div className="md:col-span-2">
            {showEmailForm ? (
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl">
                <h3 className="text-xl font-bold text-neutral-900 mb-4">
                  Join our community today
                </h3>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className={`w-full px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${buttonClasses[theme]} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : success ? (
                      <span className="flex items-center justify-center">
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Sign-up Successful!
                      </span>
                    ) : (
                      ctaText
                    )}
                  </button>
                  
                  <p className="mt-4 text-xs text-neutral-600 text-center">
                    By joining, you agree to our{' '}
                    <Link href="/terms" className="underline hover:text-primary-600">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline hover:text-primary-600">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </div>
            ) : (
              <div className="flex justify-center md:justify-end">
                <Link 
                  href={ctaLink} 
                  className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 ${buttonClasses[theme]}`}
                >
                  {ctaText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Default benefits
const defaultBenefits: BenefitItem[] = [
  { text: "Access to a community of skilled individuals" },
  { text: "Learn new skills without financial cost" },
  { text: "Share your knowledge and help others grow" },
  { text: "Build meaningful connections with like-minded people" }
];

// Default user avatars with color classes
const defaultUserAvatars: UserAvatar[] = [
  { initials: "JD", color: "bg-primary-400" },
  { initials: "KL", color: "bg-secondary-400" },
  { initials: "MN", color: "bg-tertiary-400" },
  { initials: "OP", color: "bg-primary-600" },
  { initials: "RS", color: "bg-secondary-600" }
];
