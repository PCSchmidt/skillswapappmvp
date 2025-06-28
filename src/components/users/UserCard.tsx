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
  const skillsOffered = user.skills_offered || [];
  const skillsSeeking = user.skills_seeking || [];
  
  return (
    <div
      data-testid={`user-card-${user.id}`}
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 cursor-pointer hover:border-primary-300 ${className}`}
      onClick={() => onClick?.(user)}
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar user={user} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {user.full_name || user.email || 'Unnamed User'}
          </h3>
          {user.location && (
            <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
              <span>📍</span>
              {user.location}
            </p>
          )}
          {user.bio && (
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>
      
      {/* Skills section */}
      <div className="space-y-3">
        {skillsOffered.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
              <span>🎯</span>
              OFFERS
            </h4>
            <div className="flex flex-wrap gap-1">
              {skillsOffered.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
              {skillsOffered.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{skillsOffered.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {skillsSeeking.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-blue-700 mb-2 flex items-center gap-1">
              <span>🎓</span>
              SEEKING
            </h4>
            <div className="flex flex-wrap gap-1">
              {skillsSeeking.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  {skill.name}
                </span>
              ))}
              {skillsSeeking.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{skillsSeeking.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Action hint */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Click to view profile and connect
        </p>
      </div>
    </div>
  );
};

export default UserCard;
