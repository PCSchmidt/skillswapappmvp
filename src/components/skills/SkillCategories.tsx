/**
 * Skill Categories Component
 * 
 * Displays a grid of skill category cards with icons for the landing page.
 */

'use client';

import Link from 'next/link';
import React from 'react';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  primaryColor: string;
  lightColor: string;
  darkColor: string;
}

interface SkillCategoriesProps {
  title?: string;
  subtitle?: string;
}

export default function SkillCategories({
  title = "Explore Skill Categories",
  subtitle = "Browse our diverse range of skill categories to find what you're looking for",
}: SkillCategoriesProps) {
  // Categories matching the actual database categories
  const categories: Category[] = [
    {
      id: 'Technology',
      name: 'Technology',
      description: 'Web development, mobile apps, data science, cybersecurity, and more',
      primaryColor: 'rgb(79, 70, 229)', // indigo-600
      lightColor: 'rgb(224, 231, 255)', // indigo-100
      darkColor: 'rgb(49, 46, 129)', // indigo-800
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M14.447 3.027a.75.75 0 0 1 .527.92l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.526ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'Design',
      name: 'Design',
      description: 'Graphic design, UI/UX, digital art, illustration, and visual creation',
      primaryColor: 'rgb(236, 72, 153)', // pink-500
      lightColor: 'rgb(252, 231, 243)', // pink-100
      darkColor: 'rgb(157, 23, 77)', // pink-800
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 0 0-3.471 2.987 10.04 10.04 0 0 1 4.815 4.815 18.748 18.748 0 0 0 2.987-3.472l3.386-5.079A1.902 1.902 0 0 0 20.599 1.5Zm-8.3 14.025a18.76 18.76 0 0 0 1.896-1.207 8.026 8.026 0 0 0-4.513-4.513A18.75 18.75 0 0 0 8.475 11.7l-.278.5a5.26 5.26 0 0 1 3.601 3.602l.502-.278ZM6.75 13.5a3.75 3.75 0 0 0-3.75 3.75v1.5c0 .414.336.75.75.75h1.5a3.75 3.75 0 0 0 3.75-3.75V14.25a.75.75 0 0 0-.75-.75H6.75Z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'Business',
      name: 'Business',
      description: 'Marketing, finance, consulting, entrepreneurship, and professional skills',
      primaryColor: 'rgb(5, 150, 105)', // emerald-600
      lightColor: 'rgb(209, 250, 229)', // emerald-100
      darkColor: 'rgb(6, 95, 70)', // emerald-800
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 01-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004zM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 01-.921.42z" />
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.816a3.836 3.836 0 00-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 01-.921-.421l-.879-.66a.75.75 0 00-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 001.5 0v-.81a4.124 4.124 0 001.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 00-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 00.933-1.175l-.415-.33a3.836 3.836 0 00-1.719-.755V6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'Education',
      name: 'Education',
      description: 'Teaching, tutoring, academic research, and educational consulting',
      primaryColor: 'rgb(37, 99, 235)', // blue-600
      lightColor: 'rgb(219, 234, 254)', // blue-100
      darkColor: 'rgb(30, 58, 138)', // blue-800
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
          <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
          <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
        </svg>
      )
    },
    {
      id: 'Languages',
      name: 'Languages',
      description: 'Language learning, translation, interpretation, and communication',
      primaryColor: 'rgb(217, 70, 239)', // fuchsia-600
      lightColor: 'rgb(250, 232, 255)', // fuchsia-100
      darkColor: 'rgb(134, 25, 143)', // fuchsia-800
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 0 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'Arts & Crafts',
      name: 'Arts & Crafts',
      description: 'Creative projects, handmade crafts, painting, sculpture, and artistic skills',
      primaryColor: 'rgb(147, 51, 234)', // purple-600
      lightColor: 'rgb(243, 232, 255)', // purple-100
      darkColor: 'rgb(107, 33, 168)', // purple-800
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M20.599 1.5c-.376 0-.743.111-1.055.32l-5.08 3.385a18.747 18.747 0 0 0-3.471 2.987 10.04 10.04 0 0 1 4.815 4.815 18.748 18.748 0 0 0 2.987-3.472l3.386-5.079A1.902 1.902 0 0 0 20.599 1.5Zm-8.3 14.025a18.76 18.76 0 0 0 1.896-1.207 8.026 8.026 0 0 0-4.513-4.513A18.75 18.75 0 0 0 8.475 11.7l-.278.5a5.26 5.26 0 0 1 3.601 3.602l.502-.278ZM6.75 13.5a3.75 3.75 0 0 0-3.75 3.75v1.5c0 .414.336.75.75.75h1.5a3.75 3.75 0 0 0 3.75-3.75V14.25a.75.75 0 0 0-.75-.75H6.75Z" clipRule="evenodd" />
        </svg>
      )
    },
  ];
  
  return (
    <Section className="py-16 bg-white">
      <Container>
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/skills/browse?category=${category.id}`}
              className="group"
            >
              <div 
                className="block rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border bg-white"
                style={{ borderColor: category.lightColor }}
              >
                {/* Header with icon */}
                <div 
                  className="p-6 flex items-center justify-between"
                  style={{ backgroundColor: category.lightColor }}
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-3" style={{ backgroundColor: category.primaryColor }}>
                      <div className="text-white">{category.icon}</div>
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">{category.name}</h3>
                  </div>
                  <div 
                    className="bg-white rounded-full p-2 shadow-sm group-hover:bg-gray-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" 
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      style={{ color: category.primaryColor }}
                    >
                      <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                {/* Body with description */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center text-sm font-medium" style={{ color: category.primaryColor }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                      <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
                    </svg>
                    Explore Skills
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View all categories button */}
        <div className="mt-12 text-center">
          <Link
            href="/skills/browse"
            className="inline-flex items-center px-6 py-3 border-2 border-gray-800 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Browse All Skills
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
              <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
