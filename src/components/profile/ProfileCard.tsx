import React from 'react';

import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

import { cn } from '@/lib/utils';

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The URL of the user's avatar image.
   */
  avatarUrl?: string | null;
  /**
   * The full name of the user.
   */
  fullName: string;
  /**
   * A short description or bio of the user.
   */
  bio?: string | null;
  /**
   * Optional: Number of skills the user has.
   */
  skillCount?: number;
  /**
   * Optional: Number of successful exchanges the user has completed.
   */
  exchangeCount?: number;
  /**
   * Callback function when the "View Profile" button is clicked.
   */
  onViewProfile?: () => void;
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
      avatarUrl,
      fullName,
      bio,
      skillCount,
      exchangeCount,
      onViewProfile,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Card ref={ref} className={cn('p-6 text-center', className)} {...props}>
        <div className="flex flex-col items-center">
          <Avatar src={avatarUrl} alt={fullName} size="lg" className="mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">{fullName}</h3>
          {bio && <p className="text-sm text-gray-600 mt-1">{bio}</p>}

          <div className="mt-4 flex justify-center space-x-6">
            {skillCount !== undefined && (
              <div>
                <div className="text-lg font-bold text-gray-900">{skillCount}</div>
                <div className="text-sm text-gray-500">Skills</div>
              </div>
            )}
            {exchangeCount !== undefined && (
              <div>
                <div className="text-lg font-bold text-gray-900">{exchangeCount}</div>
                <div className="text-sm text-gray-500">Exchanges</div>
              </div>
            )}
          </div>

          {onViewProfile && (
            <Button onClick={onViewProfile} className="mt-6 w-full">
              View Profile
            </Button>
          )}
        </div>
      </Card>
    );
  }
);

ProfileCard.displayName = 'ProfileCard';

export { ProfileCard };
