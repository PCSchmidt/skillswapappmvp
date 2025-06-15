import React from 'react';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollow: (userId: string) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, isFollowing, onFollow }) => {
  return (
    <button onClick={() => onFollow(userId)}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;
