// Placeholder for SkillSelect.tsx
import React, { useState } from 'react';

interface Skill {
  id: string;
  name: string;
  category?: { id: string; name: string };
}

interface SkillSelectProps {
  userId: string;
  selectedSkills: Skill[];
  onChange: (selectedSkills: Skill[]) => void;
  skillType: 'offered' | 'seeking';
  className?: string;
  // Add other props as needed by tests/components
  label?: string;
  placeholder?: string;
  maxSkills?: number;
}

const SkillSelect: React.FC<SkillSelectProps> = ({
  userId,
  selectedSkills,
  onChange,
  skillType,
  className,
  label = "Select Skills",
  placeholder = "Search and add skills...",
  maxSkills = 5,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  // Mock available skills for the placeholder
  const mockAvailableSkills: Skill[] = [
    { id: 'skill-1', name: 'JavaScript', category: { id: 'cat-1', name: 'Programming' } },
    { id: 'skill-2', name: 'React', category: { id: 'cat-1', name: 'Programming' } },
    { id: 'skill-3', name: 'Node.js', category: { id: 'cat-1', name: 'Programming' } },
    { id: 'skill-4', name: 'Graphic Design', category: { id: 'cat-2', name: 'Design' } },
    { id: 'skill-5', name: 'Spanish', category: { id: 'cat-3', name: 'Languages' } },
  ];

  const handleAddSkill = (skill: Skill) => {
    if (selectedSkills.length < maxSkills && !selectedSkills.find(s => s.id === skill.id)) {
      onChange([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    onChange(selectedSkills.filter(s => s.id !== skillId));
  };

  const filteredAvailableSkills = mockAvailableSkills.filter(
    skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
             !selectedSkills.find(s => s.id === skill.id)
  );

  return (
    <div className={`skill-select-placeholder ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label} ({skillType})</label>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-input w-full mb-2"
      />
      <div className="selected-skills mb-2">
        {selectedSkills.map(skill => (
          <span key={skill.id} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-1 mb-1">
            {skill.name}
            <button onClick={() => handleRemoveSkill(skill.id)} className="ml-1 text-primary-600 hover:text-primary-800">
              &times;
            </button>
          </span>
        ))}
      </div>
      {searchTerm && filteredAvailableSkills.length > 0 && (
        <ul className="border rounded-md max-h-40 overflow-y-auto">
          {filteredAvailableSkills.map(skill => (
            <li
              key={skill.id}
              onClick={() => handleAddSkill(skill)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {skill.name} {skill.category && `(${skill.category.name})`}
            </li>
          ))}
        </ul>
      )}
      {selectedSkills.length >= maxSkills && (
        <p className="text-xs text-red-500">Maximum of {maxSkills} skills reached.</p>
      )}
    </div>
  );
};

export default SkillSelect;
