// Placeholder for UserCard.tsx
import React from 'react';
import Avatar from '@/components/shared/Avatar'; // Assuming Avatar is in shared

interface User {
  id: string;
  full_name?: string | null;
  email?: string | null;
  // Add other user properties as needed by the tests/components
  skills_offered?: Array<{ name: string; category?: { name: string } }>;
  skills_seeking?: Array<{ name: string; category?: { name: string } }>;
  location?: string | null;
  bio?: string | null;
}

interface UserCardProps {
  user: User;
  onClick?: (user: User) => void;
  className?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick, className }) => {
  return (
    <div
      data-testid={`user-card-${user.id}`}
      className={`user-card-placeholder ${className}`}
      onClick={() => onClick?.(user)}
      style={{ border: '1px solid #eee', padding: '10px', margin: '5px', cursor: onClick ? 'pointer' : 'default' }}
    >
      <Avatar user={user} size="md" />
      <h4>{user.full_name || user.email || 'Unnamed User'}</h4>
      {user.location && <p>Location: {user.location}</p>}
      {/* Add more user details if needed for tests */}
    </div>
  );
};

export default UserCard;
