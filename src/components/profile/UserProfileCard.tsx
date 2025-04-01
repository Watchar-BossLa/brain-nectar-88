
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useProfileData } from './useProfileData';
import ProfileAvatar from './ProfileAvatar';
import ProfileHeader from './ProfileHeader';
import ProfileForm from './ProfileForm';
import ProfileActions from './ProfileActions';
import ProfileLoading from './ProfileLoading';

const UserProfileCard = () => {
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
        <ProfileHeader 
          profile={profile}
          firstName={firstName}
          lastName={lastName}
          isEditing={isEditing}
        />
      </CardHeader>
      <CardContent>
        <ProfileForm
          firstName={firstName}
          lastName={lastName}
          email={profile?.email}
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
