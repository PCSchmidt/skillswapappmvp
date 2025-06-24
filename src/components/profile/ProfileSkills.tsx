'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import SkillCard from '@/components/skills/SkillCard';
import { Skill } from '@/types/supabase';

interface ProfileSkillsProps {
  skills: Skill[];
  userId: string;
  isCurrentUser: boolean;
}

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ skills, isCurrentUser }) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'category'>('list');
  const [searchQuery, setSearchQuery] = useState('');  // Filter skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return skills;
    return skills.filter(skill => {
      const categoryText = typeof skill.category === 'string' 
        ? skill.category 
        : (skill.category as { name: string })?.name || '';
      
      return skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryText.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [skills, searchQuery]);

  // Group skills by category for category view
  const skillsByCategory = useMemo(() => {
    const grouped: { [categoryName: string]: Skill[] } = {};
    filteredSkills.forEach(skill => {
      const categoryName = typeof skill.category === 'string' 
        ? skill.category 
        : (skill.category as { name: string })?.name || 'Uncategorized';
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(skill);
    });
    return grouped;
  }, [filteredSkills]);

  const handleAddSkill = () => {
    router.push('/skills/new');
  };

  const handleSkillClick = (skill: Skill) => {
    router.push(`/skills/${skill.id}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderEmptyState = () => {
    if (isCurrentUser) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't added any skills yet.</p>
          <button
            onClick={handleAddSkill}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add your first skill
          </button>
        </div>
      );
    } else {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">No skills yet.</p>
        </div>
      );
    }
  };

  const renderSkillsList = () => {
    if (viewMode === 'category') {
      return (
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([categoryName, categorySkills]) => (
            <div key={categoryName}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{categoryName}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categorySkills.map(skill => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onClick={() => handleSkillClick(skill)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onClick={() => handleSkillClick(skill)}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        {isCurrentUser && (
          <button
            onClick={handleAddSkill}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Skill
          </button>
        )}
      </div>

      {/* Search and View Controls */}
      {skills.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('category')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'category'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              By Category
            </button>
          </div>
        </div>
      )}

      {/* Skills Content */}
      {filteredSkills.length === 0 ? renderEmptyState() : renderSkillsList()}
    </div>
  );
};

export default ProfileSkills;
