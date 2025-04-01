
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LearningStatsCard from './LearningStatsCard';
import AchievementsCard from './AchievementsCard';
import AccountSettingsCard from './AccountSettingsCard';
import { LearningStats } from './types';

interface ProfileTabsProps {
  isLoading: boolean;
  learningStats: LearningStats | null;
}

const ProfileTabs = ({ isLoading, learningStats }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="learning-stats" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="learning-stats">Learning Statistics</TabsTrigger>
        <TabsTrigger value="achievements">Achievements</TabsTrigger>
        <TabsTrigger value="account-settings">Account Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="learning-stats" className="mt-4 space-y-6">
        <LearningStatsCard isLoading={isLoading} learningStats={learningStats} />
      </TabsContent>
      
      <TabsContent value="achievements" className="mt-4">
        <AchievementsCard />
      </TabsContent>
      
      <TabsContent value="account-settings" className="mt-4">
        <AccountSettingsCard />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
