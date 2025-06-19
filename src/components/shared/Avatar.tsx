// Placeholder for Avatar.tsx
import React from 'react';

interface AvatarProps {
  user?: { full_name?: string | null; avatar_url?: string | null; email?: string | null };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md', className = '' }) => {
  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return '?';
  };

  return (
    <div
      data-testid="avatar-mock"
      className={`avatar-placeholder ${className} size-${size}`}
      style={{
        width: size === 'xl' ? '64px' : size === 'lg' ? '48px' : size === 'md' ? '32px' : size === 'sm' ? '24px' : '16px',
        height: size === 'xl' ? '64px' : size === 'lg' ? '48px' : size === 'md' ? '32px' : size === 'sm' ? '24px' : '16px',
        borderRadius: '50%',
        backgroundColor: '#ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
      }}
    >
      {user?.avatar_url ? <img src={user.avatar_url} alt={user.full_name || 'User Avatar'} style={{width: '100%', height: '100%', borderRadius: '50%'}} /> : getInitials()}
    </div>
  );
};

export default Avatar;
