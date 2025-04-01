
import MainLayout from '@/components/layout/MainLayout';
import { UserProfileCard, ProfileHeader, ProfileTabs } from '@/components/profile';
import { useProfileStats, useProfileData } from '@/components/profile';

const Profile = () => {
  const { isLoading, learningStats } = useProfileStats();
  const { profile, firstName, lastName, isEditing } = useProfileData();

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <ProfileHeader 
          profile={profile}
          firstName={firstName}
          lastName={lastName}
          isEditing={isEditing}
        />
        
        <UserProfileCard />
        
        <ProfileTabs isLoading={isLoading} learningStats={learningStats} />
      </div>
    </MainLayout>
  );
};

export default Profile;
