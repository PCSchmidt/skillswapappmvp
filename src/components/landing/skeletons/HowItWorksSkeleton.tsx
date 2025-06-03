import React from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

const HowItWorksSkeleton: React.FC = () => {
  return (
    <Section className="py-16 bg-gray-50">
      <Container>
        {/* Header skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
          <div className="h-4 w-3/4 max-w-2xl bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
        
        {/* Steps skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              {/* Step number */}
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4"></div>
              
              {/* Title */}
              <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-3"></div>
              
              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA skeleton */}
        <div className="mt-12 text-center">
          <div className="h-10 w-40 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
        </div>
      </Container>
    </Section>
  );
};

export default HowItWorksSkeleton;
