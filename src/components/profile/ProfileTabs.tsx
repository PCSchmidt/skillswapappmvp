/**
 * Profile Tabs Component
 * 
 * Provides tabs to display and manage a user's offered and requested skills.
 */

'use client';

import React, { useState } from 'react';
import SkillCard, { Skill } from '@/components/skills/SkillCard';
import SkillForm from '@/components/skills/SkillForm';
import { useSupabase } from '@/contexts/SupabaseContext';

interface ProfileTabsProps {
  userId: string;
  offeredSkills: Skill[];
  requestedSkills: Skill[];
  onSkillsChange: () => void;
}

export default function ProfileTabs({
  userId,
  offeredSkills,
  requestedSkills,
  onSkillsChange
}: ProfileTabsProps) {
  const { supabase } = useSupabase();
  const [activeTab, setActiveTab] = useState<'offering' | 'seeking'>('offering');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<string | null>(null);

  const handleTabChange = (tab: 'offering' | 'seeking') => {
    setActiveTab(tab);
  };

  const handleAddSkill = () => {
    setEditingSkill(null);
    setIsAddingSkill(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setIsAddingSkill(false);
    setEditingSkill(skill);
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('skills')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', skillId);

      if (error) throw error;
      
      setDeleteConfirmOpen(null);
      onSkillsChange();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const handleCancelForm = () => {
    setIsAddingSkill(false);
    setEditingSkill(null);
  };

  const handleSaveForm = () => {
    setIsAddingSkill(false);
    setEditingSkill(null);
    onSkillsChange();
  };

  const tabs = [
    { id: 'offering', label: 'Skills I Offer', count: offeredSkills.length },
    { id: 'seeking', label: 'Skills I Want', count: requestedSkills.length }
  ];

  const currentSkills = activeTab === 'offering' ? offeredSkills : requestedSkills;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as 'offering' | 'seeking')}
              className={`px-6 py-4 whitespace-nowrap font-medium text-sm flex items-center justify-center border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="p-6">
        {/* Form section (add/edit skill) */}
        {(isAddingSkill || editingSkill) ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isAddingSkill ? `Add a ${activeTab === 'offering' ? 'Skill to Offer' : 'Skill You Want'}` : 'Edit Skill'}
            </h2>
            <SkillForm
              userId={userId}
              initialData={editingSkill || undefined}
              defaultIsOffering={activeTab === 'offering'}
              onSave={handleSaveForm}
              onCancel={handleCancelForm}
            />
          </div>
        ) : (
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'offering' ? 'Skills I Offer' : 'Skills I Want'}
            </h2>
            <button
              onClick={handleAddSkill}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add {activeTab === 'offering' ? 'Skill to Offer' : 'Skill You Want'}
            </button>
          </div>
        )}

        {/* Skills grid */}
        {!isAddingSkill && !editingSkill && (
          <>
            {currentSkills.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No skills yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'offering' 
                    ? 'Start by adding a skill you can offer to others' 
                    : 'Add a skill you want to learn or acquire'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAddSkill}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Your First {activeTab === 'offering' ? 'Skill' : 'Request'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSkills.map(skill => (
                  <div key={skill.id} className="relative">
                    <SkillCard
                      skill={skill}
                      isOwner={true}
                      isProfileView={true}
                      onEdit={() => handleEditSkill(skill)}
                      onDelete={() => setDeleteConfirmOpen(skill.id)}
                      onClick={() => {}}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
              <button onClick={() => setDeleteConfirmOpen(null)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete this skill? This action can't be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmOpen(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteSkill(deleteConfirmOpen)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
