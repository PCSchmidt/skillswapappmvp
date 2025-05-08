/**
 * Testimonials Carousel Component
 * 
 * Displays user testimonials in an interactive carousel for the landing page.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

interface Testimonial {
  id: string;
  quote: string;
  userName: string;
  userRole: string;
  userImageUrl?: string;
  skillExchanged: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

interface TestimonialsCarouselProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
}

export default function TestimonialsCarousel({
  title = "What Our Users Are Saying",
  subtitle = "Read success stories from our community members who have exchanged skills",
  testimonials: initialTestimonials,
}: TestimonialsCarouselProps) {
  // Sample testimonials (used if none are provided)
  const defaultTestimonials: Testimonial[] = [
    {
      id: '1',
      quote: "I was struggling with design for my startup's website until I connected with Alex through SkillSwap. In exchange for my marketing help, Alex designed a beautiful website that's helped me attract more customers. This platform is a game-changer!",
      userName: "Sarah Johnson",
      userRole: "Tech Entrepreneur",
      userImageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      skillExchanged: "Web Design",
      rating: 5
    },
    {
      id: '2',
      quote: "As a coding bootcamp graduate, I needed real-world experience. Through SkillSwap, I found someone who needed a personal website, and in return, they helped me improve my public speaking skills. I've now landed a great developer role thanks to this experience.",
      userName: "Michael Chen",
      userRole: "Junior Developer",
      userImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
      skillExchanged: "Web Development",
      rating: 5
    },
    {
      id: '3',
      quote: "SkillSwap connected me with a fantastic Spanish tutor who needed help with digital marketing. Our weekly skill exchanges have been incredible—my Spanish has improved dramatically, and I've been able to help someone grow their business. Win-win!",
      userName: "Emily Rodriguez",
      userRole: "Marketing Specialist",
      userImageUrl: "https://randomuser.me/api/portraits/women/63.jpg",
      skillExchanged: "Language Learning",
      rating: 4
    },
    {
      id: '4',
      quote: "I can't believe how much money I've saved by using SkillSwap! Instead of hiring a photographer for my small business, I connected with Jamie who needed accounting help. We exchanged skills, and now I have professional product photos without the price tag.",
      userName: "David Parker",
      userRole: "Small Business Owner",
      userImageUrl: "https://randomuser.me/api/portraits/men/55.jpg",
      skillExchanged: "Photography",
      rating: 5
    },
    {
      id: '5',
      quote: "I was nervous about using a skill exchange platform at first, but SkillSwap made it so easy and comfortable. I taught yoga to someone who helped me build my professional portfolio website. The community here is supportive and talented!",
      userName: "Priya Patel",
      userRole: "Yoga Instructor",
      userImageUrl: "https://randomuser.me/api/portraits/women/89.jpg",
      skillExchanged: "Web Development",
      rating: 4
    }
  ];
  
  const testimonials = initialTestimonials || defaultTestimonials;
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const goToNextSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating, testimonials.length]);
  
  const goToPrevSlide = useCallback(() => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  }, [isAnimating, testimonials.length]);
  
  useEffect(() => {
    // Auto-advance the carousel every 8 seconds
    const interval = setInterval(goToNextSlide, 8000);
    return () => clearInterval(interval);
  }, [goToNextSlide]);
  
  // Generate star rating display based on rating value
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-5 h-5 ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <path
              fillRule="evenodd"
              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
    );
  };
  
  return (
    <Section className="relative py-16 bg-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 rounded-full bg-primary-100 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-24 h-24 md:w-48 md:h-48 rounded-full bg-secondary-100 translate-x-1/3 translate-y-1/3" />
      
      <Container>
        {/* Section heading */}
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Testimonial carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Big quote marks */}
          <div className="absolute -top-10 left-0 text-primary-200 opacity-30 z-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          
          {/* Carousel content */}
          <div className="relative bg-white rounded-xl shadow-md p-8 md:p-12 z-10">
            <div className="transition-all duration-500 ease-in-out">
              <div className="mb-6">
                <p className="text-lg md:text-xl text-gray-800 italic mb-6">
                  "{testimonials[activeIndex].quote}"
                </p>
                {renderStarRating(testimonials[activeIndex].rating)}
              </div>
              
              <div className="flex items-center">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                  {testimonials[activeIndex].userImageUrl ? (
                    <Image
                      src={testimonials[activeIndex].userImageUrl}
                      alt={testimonials[activeIndex].userName}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 text-xl font-semibold">
                        {testimonials[activeIndex].userName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonials[activeIndex].userName}</h4>
                  <p className="text-gray-600 text-sm">{testimonials[activeIndex].userRole}</p>
                  <p className="text-sm text-primary-600 mt-1">
                    <span className="font-medium">Skill Exchanged:</span> {testimonials[activeIndex].skillExchanged}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 md:mt-10">
              <button
                onClick={goToPrevSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Previous testimonial"
                disabled={isAnimating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => !isAnimating && setActiveIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeIndex === index ? 'bg-primary-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-current={activeIndex === index}
                  />
                ))}
              </div>
              <button
                onClick={goToNextSlide}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Next testimonial"
                disabled={isAnimating}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
