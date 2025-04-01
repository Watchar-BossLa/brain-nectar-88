
import MainLayout from '@/components/layout/MainLayout';
import { UserProfileCard } from '@/components/profile';
import { ProfileHeader, ProfileTabs, useProfileStats } from '@/components/profile';

const Profile = () => {
  const { isLoading, learningStats } = useProfileStats();

  return (
    <MainLayout>
      <div className="flex flex-col space-y-6">
        <ProfileHeader />
        
        <UserProfileCard />
        
        <ProfileTabs isLoading={isLoading} learningStats={learningStats} />
      </div>
    </MainLayout>
  );
};

export default Profile;
