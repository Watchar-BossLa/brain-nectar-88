
import { CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth';
import ProfileAvatar from './ProfileAvatar';
import { UserProfile } from './useProfileData';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  firstName: string;
  lastName: string;
  isEditing: boolean;
}

const ProfileHeader = ({ profile, firstName, lastName, isEditing }: ProfileHeaderProps) => {
  const { user } = useAuth();
  
  return (
    <>
      <ProfileAvatar 
        avatarUrl={profile?.avatar_url}
        firstName={profile?.first_name}
        lastName={profile?.last_name}
        email={profile?.email || user?.email}
        size="lg"
      />
      <div>
        <CardTitle>
          {isEditing ? 'Edit Profile' : (
            profile?.first_name && profile?.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : 'Your Profile'
          )}
        </CardTitle>
        <CardDescription>{profile?.email || user?.email}</CardDescription>
      </div>
    </>
  );
};

export default ProfileHeader;
