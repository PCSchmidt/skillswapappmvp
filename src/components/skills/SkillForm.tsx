/**
 * Skill Form Component
 * 
 * A reusable form component for creating and editing skills.
 * Used in both the new skill creation page and the edit skill page.
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/contexts/SupabaseContext';

// Define the base skill structure
interface SkillFormData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  experience_level: string;
  hourly_equivalent_value: string;
  availability: string[];
  is_offering: boolean;
  is_remote_friendly: boolean;
}

// Props for the component
interface SkillFormProps {
  initialData?: Partial<SkillFormData>;
  skillId?: string;
  isEdit?: boolean;
  onSuccess?: (skillId: string) => void;
}

export default function SkillForm({ 
  initialData, 
  skillId, 
  isEdit = false,
  onSuccess
}: SkillFormProps) {
  const router = useRouter();
  const { supabase, user } = useSupabase();
  
  // Set up form state with default values or provided initialData
  const [formData, setFormData] = useState<SkillFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    subcategory: initialData?.subcategory || '',
    experience_level: initialData?.experience_level || 'beginner',
    hourly_equivalent_value: initialData?.hourly_equivalent_value || '',
    availability: initialData?.availability || [],
    is_offering: initialData?.is_offering !== undefined ? initialData.is_offering : true,
    is_remote_friendly: initialData?.is_remote_friendly || false,
  });
  
  // Form submission and UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // List of predefined skill categories
  const categories = [
    'Technology',
    'Arts & Crafts', 
    'Culinary',
    'Education',
    'Fitness & Wellness',
    'Home Improvement',
    'Languages',
    'Music',
    'Professional Services',
    'Other'
  ];
  
  // Dynamic subcategories based on selected category
  const subcategories: Record<string, string[]> = {
    'Technology': [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'UI/UX Design',
      'DevOps',
      'Cybersecurity',
      'Other'
    ],
    'Arts & Crafts': [
      'Painting',
      'Drawing',
      'Sculpture',
      'Knitting',
      'Sewing',
      'Woodworking',
      'Other'
    ],
    'Culinary': [
      'Cooking',
      'Baking',
      'Meal Planning',
      'Specialty Diets',
      'Fermentation',
      'Other'
    ],
    'Education': [
      'Math',
      'Science',
      'History',
      'Literature',
      'Test Preparation',
      'College Counseling',
      'Other'
    ],
    'Fitness & Wellness': [
      'Yoga',
      'Personal Training',
      'Nutrition',
      'Meditation',
      'Massage',
      'Other'
    ],
    'Home Improvement': [
      'Plumbing',
      'Electrical',
      'Carpentry',
      'Gardening',
      'Painting',
      'Interior Design',
      'Other'
    ],
    'Languages': [
      'English',
      'Spanish',
      'French',
      'German',
      'Chinese',
      'Japanese',
      'Other'
    ],
    'Music': [
      'Guitar',
      'Piano',
      'Vocals',
      'Drums',
      'Production',
      'DJ Skills',
      'Other'
    ],
    'Professional Services': [
      'Accounting',
      'Legal Advice',
      'Marketing',
      'Career Coaching',
      'Resume Writing',
      'Other'
    ],
    'Other': [
      'Other'
    ]
  };
  
  // Days of the week for availability selection
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];
  
  // Experience levels
  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' }
  ];
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  // Handle availability selection
  const handleAvailabilityChange = (day: string) => {
    const newAvailability = [...formData.availability];
    
    if (newAvailability.includes(day)) {
      // Remove day if already selected
      const index = newAvailability.indexOf(day);
      newAvailability.splice(index, 1);
    } else {
      // Add day if not selected
      newAvailability.push(day);
    }
    
    setFormData({ ...formData, availability: newAvailability });
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create or edit a skill');
      return;
    }
    
    // Validate required fields
    if (!formData.title || !formData.category) {
      setError('Please provide a title and category for your skill');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format availability as JSONB for database
      const availabilityJson = formData.availability.length > 0 
        ? JSON.stringify(formData.availability) 
        : null;
      
      // Format hourly value as float
      const hourlyValue = formData.hourly_equivalent_value 
        ? parseFloat(formData.hourly_equivalent_value) 
        : null;
      
      let result;
      
      if (isEdit && skillId) {
        // Update existing skill
        const updateData = {
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory || null,
          experience_level: formData.experience_level,
          hourly_equivalent_value: hourlyValue,
          availability: availabilityJson,
          is_offering: formData.is_offering,
          is_remote_friendly: formData.is_remote_friendly,
          updated_at: new Date().toISOString(),
        };
        
        result = await supabase
          .from('skills')
          .update(updateData)
          .eq('id', skillId)
          .select()
          .single();
      } else {
        // Insert new skill
        const insertData = {
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          subcategory: formData.subcategory || null,
          experience_level: formData.experience_level,
          hourly_equivalent_value: hourlyValue,
          availability: availabilityJson,
          is_offering: formData.is_offering,
          is_remote_friendly: formData.is_remote_friendly,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        result = await supabase
          .from('skills')
          .insert(insertData)
          .select()
          .single();
      }
      
      const { data, error } = result;
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      
      // Call success callback if provided
      if (onSuccess && data) {
        onSuccess(data.id);
      } else {
        // Or redirect after a short delay
        setTimeout(() => {
          router.push(isEdit ? `/skills/${skillId}` : '/dashboard');
        }, 1500);
      }
      
    } catch (err: any) {
      console.error('Error saving skill:', err);
      setError(err.message || 'Failed to save skill');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Edit Skill' : 'Add a New Skill'}
        </h2>
        
        {error && (
          <div className="mb-6 p-4 bg-error-50 text-error-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-success-50 text-success-700 rounded-md">
            Skill {isEdit ? 'updated' : 'created'} successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Skill Type (Offering or Seeking) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="inline-flex items-center">
                <input
                  type="radio"
                  id="offering"
                  name="is_offering"
                  checked={formData.is_offering === true}
                  onChange={() => setFormData({ ...formData, is_offering: true })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="offering" className="ml-2 block text-sm text-gray-700">
                  I'm offering this skill
                </label>
              </div>
              
              <div className="inline-flex items-center">
                <input
                  type="radio"
                  id="seeking"
                  name="is_offering"
                  checked={formData.is_offering === false}
                  onChange={() => setFormData({ ...formData, is_offering: false })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="seeking" className="ml-2 block text-sm text-gray-700">
                  I'm seeking this skill
                </label>
              </div>
            </div>
            
            {/* Skill Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Skill Title <span className="text-error-600">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="E.g., Web Development, Piano Lessons, French Cooking"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Describe your skill, experience level, and what you hope to trade it for..."
              />
            </div>
            
            {/* Category and Subcategory */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category <span className="text-error-600">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      category: e.target.value,
                      subcategory: '' // Reset subcategory when category changes
                    });
                  }}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  disabled={!formData.category}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Select a subcategory</option>
                  {formData.category && subcategories[formData.category]?.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Experience Level and Hourly Value */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
                  Experience Level
                </label>
                <select
                  id="experience_level"
                  name="experience_level"
                  value={formData.experience_level}
                  onChange={handleInputChange}
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="hourly_equivalent_value" className="block text-sm font-medium text-gray-700">
                  Estimated Hourly Value (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="hourly_equivalent_value"
                    name="hourly_equivalent_value"
                    min="0"
                    step="0.01"
                    value={formData.hourly_equivalent_value}
                    onChange={handleInputChange}
                    className="pl-7 mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  This helps others understand the value of your skill for bartering
                </p>
              </div>
            </div>
            
            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {daysOfWeek.map((day) => (
                  <div key={day} className="flex items-center">
                    <input
                      id={`day-${day}`}
                      type="checkbox"
                      checked={formData.availability.includes(day)}
                      onChange={() => handleAvailabilityChange(day)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`day-${day}`} className="ml-2 block text-sm text-gray-700">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Select the days you are generally available
              </p>
            </div>
            
            {/* Remote Friendly */}
            <div className="flex items-center">
              <input
                id="is_remote_friendly"
                name="is_remote_friendly"
                type="checkbox"
                checked={formData.is_remote_friendly}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_remote_friendly" className="ml-2 block text-sm text-gray-700">
                This skill can be provided/received remotely
              </label>
            </div>
            
            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading 
                  ? (isEdit ? 'Updating...' : 'Creating...') 
                  : (isEdit ? 'Update Skill' : 'Create Skill')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
