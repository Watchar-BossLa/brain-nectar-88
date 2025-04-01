
import React from 'react';
import { useAuth } from '@/context/auth';
import { 
  ProfileTabs, 
  ProfileSkeleton,
  useUserProfileData 
} from '@/components/user-profile';

const UserProfile = () => {
  const { user } = useAuth();
  const {
    profileData,
    loading,
    saving,
    firstName,
    lastName,
    learningStats,
    setFirstName,
    setLastName,
    handleSaveProfile
  } = useUserProfileData();

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      
      <ProfileTabs
        profileData={profileData}
        firstName={firstName}
        lastName={lastName}
        userEmail={user?.email}
        saving={saving}
        learningStats={learningStats}
        setFirstName={setFirstName}
        setLastName={setLastName}
        handleSaveProfile={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfile;
