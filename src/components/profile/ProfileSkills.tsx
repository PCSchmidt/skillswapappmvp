import React from 'react';

interface Skill {
  id: string;
  title: string;
  description: string;
  category: { id: string; name: string };
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ProfileSkillsProps {
  skills: Skill[];
  userId: string;
  isCurrentUser: boolean;
}

const ProfileSkills: React.FC<ProfileSkillsProps> = () => <div>ProfileSkills placeholder</div>;
export default ProfileSkills;
