/**
 * Skill Form Component
 * 
 * Used for creating and editing skills. Handles both skills being offered and skills being requested.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Skill } from '@/components/skills/SkillCard';
import { useSupabase } from '@/contexts/SupabaseContext';

interface SkillFormProps {
  userId: string;
  initialData?: Skill;
  defaultIsOffering?: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Education',
  'Health',
  'Lifestyle',
  'Arts & Crafts',
  'Music',
  'Cooking',
  'Sports & Fitness',
  'Languages',
  'Other'
];

const SUBCATEGORIES = {
  'Technology': [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity',
    'Blockchain',
    'Machine Learning',
    'Other'
  ],
  'Design': [
    'Graphic Design',
    'UI/UX Design',
    'Web Design',
    'Illustration',
    'Animation',
    '3D Modeling',
    'Other'
  ],
  'Business': [
    'Marketing',
    'Finance',
    'Sales',
    'Entrepreneurship',
    'Project Management',
    'Consulting',
    'Human Resources',
    'Other'
  ],
  'Education': [
    'Tutoring',
    'College Prep',
    'STEM Education',
    'Language Teaching',
    'Test Preparation',
    'Career Coaching',
    'Other'
  ],
  'Health': [
    'Fitness Training',
    'Nutrition',
    'Mental Health',
    'Physical Therapy',
    'Yoga Instruction',
    'Meditation',
    'Other'
  ],
  'Lifestyle': [
    'Personal Development',
    'Parenting',
    'Pet Care',
    'Home Organization',
    'Travel Planning',
    'Fashion Styling',
    'Other'
  ],
  'Arts & Crafts': [
    'Painting',
    'Drawing',
    'Sculpture',
    'Knitting',
    'Sewing',
    'Woodworking',
    'Jewelry Making',
    'Other'
  ],
  'Music': [
    'Instrument Lessons',
    'Vocal Training',
    'Music Production',
    'DJing',
    'Songwriting',
    'Music Theory',
    'Other'
  ],
  'Cooking': [
    'Baking',
    'International Cuisine',
    'Meal Prep',
    'Vegan/Vegetarian',
    'Coffee/Tea',
    'Mixology',
    'Other'
  ],
  'Sports & Fitness': [
    'Personal Training',
    'Sports Coaching',
    'Yoga',
    'Dance',
    'Martial Arts',
    'Swimming',
    'Other'
  ],
  'Languages': [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Arabic',
    'Russian',
    'Other'
  ],
  'Other': [
    'Please Specify'
  ]
};

const EXPERIENCE_LEVELS = [
  'beginner',
  'intermediate',
  'expert'
];

export default function SkillForm({
  userId,
  initialData,
  defaultIsOffering = true,
  onSave,
  onCancel
}: SkillFormProps) {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || CATEGORIES[0],
    subcategory: initialData?.subcategory || '',
    experience_level: initialData?.experience_level || EXPERIENCE_LEVELS[0],
    hourly_equivalent_value: initialData?.hourly_equivalent_value?.toString() || '',
    is_remote_friendly: initialData?.is_remote_friendly || true,
    is_offering: initialData ? initialData.is_offering : defaultIsOffering,
    is_active: initialData?.is_active ?? true
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [currentSubcategories, setCurrentSubcategories] = useState<string[]>([]);
  
  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      setCurrentSubcategories(SUBCATEGORIES[formData.category as keyof typeof SUBCATEGORIES] || []);
      
      // If current subcategory isn't in the new list, reset it
      if (!SUBCATEGORIES[formData.category as keyof typeof SUBCATEGORIES]?.includes(formData.subcategory)) {
        setFormData(prev => ({
          ...prev,
          subcategory: SUBCATEGORIES[formData.category as keyof typeof SUBCATEGORIES]?.[0] || ''
        }));
      }
    }
  }, [formData.category]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const skillData = {
        ...formData,
        user_id: userId,
        hourly_equivalent_value: formData.hourly_equivalent_value 
          ? parseFloat(formData.hourly_equivalent_value) 
          : null,
        updated_at: new Date().toISOString()
      };
      
      if (initialData?.id) {
        // Update existing skill
        const { error } = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', initialData.id);
        
        if (error) throw error;
      } else {
        // Insert new skill
        const { error } = await supabase
          .from('skills')
          .insert({
            ...skillData,
            created_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving skill:', error);
      setErrors({
        form: 'Failed to save skill. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                id="is_offering"
                name="is_offering"
                type="radio"
                checked={formData.is_offering}
                onChange={() => setFormData({ ...formData, is_offering: true })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="is_offering" className="ml-2 block text-sm font-medium text-gray-700">
                I'm offering this skill
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="is_requesting"
                name="is_offering"
                type="radio"
                checked={!formData.is_offering}
                onChange={() => setFormData({ ...formData, is_offering: false })}
                className="h-4 w-4 text-secondary-600 focus:ring-secondary-500"
              />
              <label htmlFor="is_requesting" className="ml-2 block text-sm font-medium text-gray-700">
                I'm looking for this skill
              </label>
            </div>
          </div>
        </div>
      
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
              errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="E.g., JavaScript Development, Graphic Design, Spanish Tutoring"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="Describe your skill or what you're looking for..."
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
          
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">Select a subcategory</option>
              {currentSubcategories.map(subcategory => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <select
              id="experience_level"
              name="experience_level"
              value={formData.experience_level}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="hourly_equivalent_value" className="block text-sm font-medium text-gray-700">
              Hourly Value (USD)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="hourly_equivalent_value"
                id="hourly_equivalent_value"
                value={formData.hourly_equivalent_value}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="0.00"
                aria-describedby="hourly-value-description"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm" id="hourly-value-description">
                  /hr
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              This helps others understand the value you place on this skill
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="is_remote_friendly"
              name="is_remote_friendly"
              type="checkbox"
              checked={formData.is_remote_friendly}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="is_remote_friendly" className="font-medium text-gray-700">
              Remote Friendly
            </label>
            <p className="text-gray-500">Indicate if this skill can be exchanged remotely</p>
          </div>
        </div>
        
        {errors.form && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errors.form}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Skill'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
