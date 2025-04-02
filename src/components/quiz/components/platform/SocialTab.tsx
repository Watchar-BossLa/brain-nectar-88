
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Share2 } from 'lucide-react';
import Leaderboard from '../social/Leaderboard';
import ChallengeCard from '../social/ChallengeCard';

const SocialTab: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("leaderboard");
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-6 w-6" />
          Social
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="leaderboard" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="challenge" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Challenge
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>
          
          <TabsContent value="challenge">
            <ChallengeCard />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialTab;
