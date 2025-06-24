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
}: UserSkillsManagerProps) {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [proficiencyLevel, setProficiencyLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('intermediate');
  const [skillDescription, setSkillDescription] = useState('');
  const [error, setError] = useState<string>('');

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
              />
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Select a skill...</option>
                {filteredSkills.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.title} ({skill.category})
                  </option>
                ))}
              </select>
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

            <div className="flex space-x-3">
              <Button type="submit" size="sm">
                Add Skill
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            </div>
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
