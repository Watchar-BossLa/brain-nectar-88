
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileCard from './ProfileCard';
import LearningStats from './LearningStats';
import { UserProfileData, LearningStats as LearningStatsType } from './useUserProfileData';

interface ProfileTabsProps {
  profileData: UserProfileData | null;
  firstName: string;
  lastName: string;
  userEmail: string | undefined;
  saving: boolean;
  learningStats: LearningStatsType;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  handleSaveProfile: () => Promise<void>;
}

const ProfileTabs = ({
  profileData,
  firstName,
  lastName,
  userEmail,
  saving,
  learningStats,
  setFirstName,
  setLastName,
  handleSaveProfile
}: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="profile">
      <TabsList className="mb-6">
        <TabsTrigger value="profile">Profile Information</TabsTrigger>
        <TabsTrigger value="learning">Learning Statistics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileCard 
          profileData={profileData}
          firstName={firstName}
          lastName={lastName}
          userEmail={userEmail}
          saving={saving}
          setFirstName={setFirstName}
          setLastName={setLastName}
          handleSaveProfile={handleSaveProfile}
        />
      </TabsContent>
      
      <TabsContent value="learning">
        <LearningStats learningStats={learningStats} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
