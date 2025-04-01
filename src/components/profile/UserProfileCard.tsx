
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth';
import ProfileAvatar from './ProfileAvatar';
import ProfileForm from './ProfileForm';
import ProfileActions from './ProfileActions';
import ProfileLoading from './ProfileLoading';
import { useProfileData } from './useProfileData';

const UserProfileCard = () => {
  const { user } = useAuth();
  const {
    profile,
    isLoading,
    isEditing,
    isSaving,
    firstName,
    lastName,
    setIsEditing,
    setFirstName,
    setLastName,
    handleSave,
    handleCancel
  } = useProfileData();

  if (isLoading) {
    return <ProfileLoading />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
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
      </CardHeader>
      <CardContent>
        <ProfileForm
          firstName={firstName}
          lastName={lastName}
          email={profile?.email || user?.email}
          isEditing={isEditing}
          onChange={{
            firstName: setFirstName,
            lastName: setLastName
          }}
        />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <ProfileActions 
          isEditing={isEditing}
          isSaving={isSaving}
          onEdit={() => setIsEditing(true)}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </CardFooter>
    </Card>
  );
};

export default UserProfileCard;
