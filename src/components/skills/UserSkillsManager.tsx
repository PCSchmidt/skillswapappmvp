/**
 * User Skills Management Component
 * 
 * Allows users to add skills they offer or want, linking to the skills catalog
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface Skill {
  id: string;
  title: string;
  category: string;
  description?: string;
}

interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  skill_type: 'offered' | 'wanted';
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  description?: string;
  skill?: Skill;
}

interface UserSkillsManagerProps {
  userId: string;
  skillType: 'offered' | 'wanted';
  title: string;
  description: string;
}

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
] as const;

export default function UserSkillsManager({
  userId,
  skillType,
  title,
  description
}: UserSkillsManagerProps) {  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [skillDescription, setSkillDescription] = useState('');
  const [error, setError] = useState<string>('');
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [newSkillDescription, setNewSkillDescription] = useState('');

  // Fetch user's skills
  const fetchUserSkills = useCallback(async () => {
    try {
      const response = await fetch(`/api/user-skills?user_id=${userId}&skill_type=${skillType}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user skills');
      }
      const data = await response.json();
      setUserSkills(data.userSkills || []);
    } catch (error) {
      console.error('Error fetching user skills:', error);
      setError('Failed to load your skills');
    }
  }, [userId, skillType]);

  // Fetch available skills for selection
  const fetchAvailableSkills = useCallback(async () => {
    try {
      const response = await fetch('/api/skills');
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      const data = await response.json();
      setAvailableSkills(data.skills || []);
    } catch (error) {
      console.error('Error fetching available skills:', error);
    }
  }, []);
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUserSkills(), fetchAvailableSkills()]);
      setIsLoading(false);
    };
    
    if (userId) {
      loadData();
    }
  }, [userId, skillType, fetchUserSkills, fetchAvailableSkills]);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSkill) {
      setError('Please select a skill');
      return;
    }

    try {
      const response = await fetch('/api/user-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          skill_id: selectedSkill,
          skill_type: skillType,
          proficiency_level: proficiencyLevel,
          description: skillDescription.trim() || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add skill');
      }

      // Reset form
      setSelectedSkill('');
      setProficiencyLevel('intermediate');
      setSkillDescription('');
      setIsAdding(false);
      setError('');
      
      // Refresh user skills
      await fetchUserSkills();
    } catch (error) {
      console.error('Error adding skill:', error);
      setError(error instanceof Error ? error.message : 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (userSkillId: string) => {
    try {
      const response = await fetch(`/api/user-skills/${userSkillId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove skill');
      }

      // Remove from local state
      setUserSkills(prev => prev.filter(skill => skill.id !== userSkillId));
    } catch (error) {
      console.error('Error removing skill:', error);
      setError('Failed to remove skill');
    }
  };

  // Create new skill first, then add to user
  const handleCreateAndAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSkillTitle || !newSkillCategory) {
      setError('Please fill in skill title and category');
      return;
    }

    try {
      // First create the skill
      const createResponse = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newSkillTitle,
          category: newSkillCategory,
          description: newSkillDescription,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Failed to create skill');
      }

      const { skill: newSkill } = await createResponse.json();

      // Then add it to user's skills
      const addResponse = await fetch('/api/user-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          skill_id: newSkill.id,
          skill_type: skillType,
          proficiency_level: proficiencyLevel,
          description: skillDescription.trim() || null
        }),
      });

      if (!addResponse.ok) {
        const errorData = await addResponse.json();
        throw new Error(errorData.error || 'Failed to add skill to profile');
      }

      // Reset form and refresh data
      setNewSkillTitle('');
      setNewSkillCategory('');
      setNewSkillDescription('');
      setSkillDescription('');
      setShowCreateNew(false);
      setIsAdding(false);
      setError('');
      await Promise.all([fetchUserSkills(), fetchAvailableSkills()]);
    } catch (error) {
      console.error('Error creating and adding skill:', error);
      setError(error instanceof Error ? error.message : 'Failed to create and add skill');
    }
  };

  const filteredSkills = availableSkills.filter(skill =>
    skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="outline"
          size="sm"
          data-testid={`add-${skillType}-skill-button`}
        >
          {isAdding ? 'Cancel' : 'Add Skill'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add Skill Form */}
      {isAdding && (
        <form onSubmit={handleAddSkill} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-4">
            <div>
              <label htmlFor="skill-search" className="block text-sm font-medium text-gray-700 mb-1">
                Search and Select Skill
              </label>
              <Input
                id="skill-search"
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-2"
              />              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required={!showCreateNew}
              >
                <option value="">Select a skill...</option>
                {filteredSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.title} ({skill.category})
                  </option>
                ))}
              </select>
              
              {/* Show "Create New Skill" option if no results found */}
              {searchTerm && filteredSkills.length === 0 && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700 mb-2">
                    No skills found for "{searchTerm}". Would you like to create a new skill?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCreateNew(true);
                      setNewSkillTitle(searchTerm);
                    }}
                  >
                    Create New Skill
                  </Button>
                </div>
              )}
              
              {/* Always show option to create new skill */}
              {!showCreateNew && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateNew(true)}
                  className="mt-2 text-sm"
                >
                  + Create a new skill instead
                </Button>
              )}
            </div>

            <div>
              <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency Level
              </label>
              <select
                id="proficiency"
                value={proficiencyLevel}
                onChange={(e) => setProficiencyLevel(e.target.value as typeof proficiencyLevel)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="skill-description" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                id="skill-description"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                placeholder="Add any specific details about your experience or what you're looking for..."
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            {/* Create New Skill Form */}
            {showCreateNew && (
              <div className="border-t pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Create New Skill</h4>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="new-skill-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Title *
                    </label>
                    <Input
                      id="new-skill-title"
                      type="text"
                      placeholder="e.g., Guitar Playing, Data Analysis, Cooking"
                      value={newSkillTitle}
                      onChange={(e) => setNewSkillTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="new-skill-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      id="new-skill-category"
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select a category...</option>
                      <option value="Technology">Technology</option>
                      <option value="Arts & Design">Arts & Design</option>
                      <option value="Music">Music</option>
                      <option value="Business">Business</option>
                      <option value="Cooking">Cooking</option>
                      <option value="Sports & Fitness">Sports & Fitness</option>
                      <option value="Languages">Languages</option>
                      <option value="Crafts">Crafts</option>
                      <option value="Academic">Academic</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="new-skill-desc" className="block text-sm font-medium text-gray-700 mb-1">
                      Skill Description (Optional)
                    </label>
                    <textarea
                      id="new-skill-desc"
                      value={newSkillDescription}
                      onChange={(e) => setNewSkillDescription(e.target.value)}
                      placeholder="Brief description of this skill..."
                      rows={2}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateAndAddSkill}
                    >
                      Create & Add Skill
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCreateNew(false);
                        setNewSkillTitle('');
                        setNewSkillCategory('');
                        setNewSkillDescription('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Regular form submission buttons - only show if not creating new skill */}
            {!showCreateNew && (
              <div className="flex space-x-3">
                <Button type="submit" size="sm">
                  Add Skill
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setSelectedSkill('');
                    setSkillDescription('');
                    setSearchTerm('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </form>
      )}

      {/* Skills List */}
      <div className="space-y-3">
        {userSkills.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            No skills added yet. Click "Add Skill" to get started.
          </p>
        ) : (
          userSkills.map((userSkill) => (
            <div
              key={userSkill.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              data-testid={`${skillType}-skill-item`}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">
                    {userSkill.skill?.title || 'Unknown Skill'}
                  </h4>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {userSkill.proficiency_level}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {userSkill.skill?.category}
                </p>
                {userSkill.description && (
                  <p className="text-sm text-gray-700 mt-1">
                    {userSkill.description}
                  </p>
                )}
              </div>
              <Button
                onClick={() => handleRemoveSkill(userSkill.id)}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
