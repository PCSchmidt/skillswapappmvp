'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import Grid from '@/components/layout/Grid';
import EnhancedSkillCard from '@/components/skills/EnhancedSkillCard';
import SearchComponent from '@/components/search/SearchComponent';
import SkillFilters from '@/components/skills/SkillFilters';

// Mock data for demonstration purposes
const MOCK_SKILLS = [
  {
    id: '1',
    title: 'Web Development Tutoring',
    description: 'Learn modern web development with React, Next.js, and more.',
    category: 'Technology',
    experienceLevel: 'Intermediate',
    location: 'Remote',
    type: 'offering',
    imageUrl: '',
    userAvatar: '',
    userName: 'Alex Chen',
    rating: 4.8
  },
  {
    id: '2',
    title: 'Piano Lessons for Beginners',
    description: 'Private piano lessons for those just starting their musical journey.',
    category: 'Music',
    experienceLevel: 'Beginner',
    location: 'In-person',
    type: 'offering',
    imageUrl: '',
    userAvatar: '',
    userName: 'Sarah Johnson',
    rating: 4.9
  },
  {
    id: '3',
    title: 'French Language Exchange',
    description: 'Looking to practice my French with a native speaker. Happy to help with English in return.',
    category: 'Languages',
    experienceLevel: 'Intermediate',
    location: 'Remote',
    type: 'seeking',
    imageUrl: '',
    userAvatar: '',
    userName: 'Michael Brown',
    rating: 4.5
  },
  {
    id: '4',
    title: 'Yoga Sessions',
    description: 'Learn yoga postures and breathing techniques for stress reduction and flexibility.',
    category: 'Health & Wellness',
    experienceLevel: 'All Levels',
    location: 'In-person',
    type: 'offering',
    imageUrl: '',
    userAvatar: '',
    userName: 'Emily Wilson',
    rating: 5.0
  },
  {
    id: '5',
    title: 'Photography Basics',
    description: 'Learn composition, lighting, and editing to take better photos with any camera.',
    category: 'Arts & Crafts',
    experienceLevel: 'Beginner',
    location: 'Hybrid',
    type: 'offering',
    imageUrl: '',
    userAvatar: '',
    userName: 'David Martinez',
    rating: 4.7
  },
  {
    id: '6',
    title: 'Seeking Guitar Instructor',
    description: 'Looking for someone to teach me guitar basics, preferably acoustic.',
    category: 'Music',
    experienceLevel: 'Beginner',
    location: 'In-person',
    type: 'seeking',
    imageUrl: '',
    userAvatar: '',
    userName: 'Jessica Lee',
    rating: null
  },
  {
    id: '7',
    title: 'Cooking Classes - Italian Cuisine',
    description: 'Learn to make authentic pasta, pizza, and other Italian classics from scratch.',
    category: 'Cooking',
    experienceLevel: 'Intermediate',
    location: 'In-person',
    type: 'offering',
    imageUrl: '',
    userAvatar: '',
    userName: 'Marco Rossi',
    rating: 4.9
  },
  {
    id: '8',
    title: 'DIY Home Repair',
    description: 'Practical sessions on common home repairs - from fixing leaky faucets to basic electrical work.',
    category: 'Home & Garden',
    experienceLevel: 'All Levels',
    location: 'In-person',
    type: 'offering',
    imageUrl: '',
    userAvatar: '',
    userName: 'Robert Taylor',
    rating: 4.6
  }
];

interface SearchFilters {
  query: string;
  categories: string[];
  experienceLevel: string[];
  locationType: string[];
  type: string;
  page: number;
  sortBy: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    experienceLevel: [],
    locationType: [],
    type: 'all',
    page: 1,
    sortBy: 'relevance'
  });

  // Pagination settings
  const resultsPerPage = 6;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  // Update filters from URL params on initial load
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const categories = searchParams.getAll('category');
    const experienceLevel = searchParams.getAll('level');
    const locationType = searchParams.getAll('location');
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = searchParams.get('sort') || 'relevance';

    setFilters({
      query,
      categories,
      experienceLevel,
      locationType,
      type,
      page,
      sortBy
    });

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // Filter mock data based on search params
      const filtered = MOCK_SKILLS.filter(skill => {
        // Filter by query
        if (query && !skill.title.toLowerCase().includes(query.toLowerCase()) &&
            !skill.description.toLowerCase().includes(query.toLowerCase())) {
          return false;
        }
        
        // Filter by categories
        if (categories.length > 0 && !categories.includes(skill.category)) {
          return false;
        }
        
        // Filter by experience level
        if (experienceLevel.length > 0 && !experienceLevel.includes(skill.experienceLevel)) {
          return false;
        }
        
        // Filter by location type
        if (locationType.length > 0 && !locationType.includes(skill.location)) {
          return false;
        }
        
        // Filter by offering/seeking
        if (type !== 'all' && skill.type !== type) {
          return false;
        }
        
        return true;
      });
      
      setTotalResults(filtered.length);
      
      // Apply pagination
      const paginatedResults = filtered.slice((page - 1) * resultsPerPage, page * resultsPerPage);
      setResults(paginatedResults);
      setIsLoading(false);
    }, 800);
  }, [searchParams]);

  // Handle search input changes
  const handleSearch = (searchTerm: string) => {
    // In a real app, you would update the URL with the new search term
    // which would then trigger the useEffect above
    console.log('Searching for:', searchTerm);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    // In a real app, you would update the URL with the new filters
    // which would then trigger the useEffect above
    console.log('Filters changed:', newFilters);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    // In a real app, you would update the URL with the new page
    // which would then trigger the useEffect above
    console.log('Page changed:', newPage);
  };

  // Handle sort change
  const handleSortChange = (sortOption: string) => {
    // In a real app, you would update the URL with the new sort option
    // which would then trigger the useEffect above
    console.log('Sort changed:', sortOption);
  };

  return (
    <main>
      <Section className="bg-gradient-to-b from-primary-50 to-white py-8">
        <Container>
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          <div className="mb-8">
            <SearchComponent 
              placeholder="Search skills, descriptions, or keywords"
              onSearch={handleSearch}
              className="max-w-2xl"
            />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="w-full lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="font-medium text-lg mb-4">Filters</h2>
                <SkillFilters
                  onFilterChange={handleFilterChange}
                  className="w-full"
                  showCounts={true}
                />
              </div>
            </div>
            
            {/* Results area */}
            <div className="w-full lg:w-3/4">
              {/* Results header */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {isLoading ? 'Searching...' : `${totalResults} results found`}
                </p>
                
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                  <select 
                    id="sort"
                    className="border rounded-md p-2 text-sm"
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="newest">Newest</option>
                    <option value="rating-high">Highest Rated</option>
                    <option value="rating-low">Lowest Rated</option>
                  </select>
                </div>
              </div>
              
              {/* Results grid */}
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : results.length > 0 ? (
                <>
                  <Grid columns={{ sm: 1, md: 2, lg: 2 }} gap="md" className="mb-8">
                    {results.map(skill => {
                      // Convert our mock data to match the shape expected by EnhancedSkillCard
                      const skillData = {
                        id: skill.id,
                        user_id: 'user-' + skill.id,
                        title: skill.title,
                        description: skill.description,
                        category: skill.category,
                        subcategory: null,
                        experience_level: skill.experienceLevel.toLowerCase(),
                        hourly_equivalent_value: 25,
                        availability: 'weekends',
                        location_type: skill.location === 'Remote' ? 'remote' : 'in_person',
                        is_offering: skill.type === 'offering',
                        is_remote_friendly: skill.location === 'Remote',
                        is_active: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        users: {
                          id: 'user-' + skill.id,
                          full_name: skill.userName,
                          profile_image_url: skill.userAvatar || null,
                          location_city: null,
                          location_state: skill.location
                        }
                      };
                      
                      return (
                        <EnhancedSkillCard
                          key={skill.id}
                          skill={skillData}
                          showActions={true}
                        />
                      );
                    })}
                  </Grid>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <nav className="inline-flex rounded-md shadow-sm">
                        <button 
                          className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => handlePageChange(filters.page - 1)}
                          disabled={filters.page === 1}
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button 
                            key={i}
                            className={`px-4 py-2 border border-gray-300 text-sm font-medium ${
                              filters.page === i + 1
                                ? 'bg-primary-50 text-primary-600 border-primary-300'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button 
                          className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          onClick={() => handlePageChange(filters.page + 1)}
                          disabled={filters.page === totalPages}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <button 
                    className="btn bg-primary-600 hover:bg-primary-700 text-white px-4 py-2"
                    onClick={() => {
                      // In a real app, you would reset the URL params
                      console.log('Clearing filters');
                    }}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
