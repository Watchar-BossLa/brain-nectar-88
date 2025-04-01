
import React from 'react';
import { UserProfile } from './useProfileData';
import ProfileAvatar from './ProfileAvatar';

interface ProfileHeaderProps {
  profile?: UserProfile | null;
  firstName: string;
  lastName: string;
  isEditing: boolean;
}

const ProfileHeader = ({ profile, firstName, lastName, isEditing }: ProfileHeaderProps) => {
  const displayName = isEditing 
    ? `${firstName || ''} ${lastName || ''}`.trim() || 'Edit your profile'
    : `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Welcome!';
    
  return (
    <div className="flex items-center gap-4">
      <ProfileAvatar 
        avatarUrl={profile?.avatar_url}
        firstName={profile?.first_name}
        lastName={profile?.last_name}
        email={profile?.email}
        size="lg"
      />
      <div>
        <h2 className="text-2xl font-bold">{displayName}</h2>
        <p className="text-muted-foreground">{profile?.email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
