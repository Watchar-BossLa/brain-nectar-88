
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/layout/MainLayout';
import AdaptiveLearningPath from '@/components/learning/AdaptiveLearningPath';
import { BookOpen, Clock, CalendarDays, User, Settings, Award, Coins } from 'lucide-react';
import { TokenRewards } from '@/components/blockchain/TokenRewards';
import { SimpleWalletButton } from '@/components/blockchain/WalletConnect';
import { useSolana } from '@/context/SolanaContext';

const Profile = () => {
  const { user } = useAuth();
  const { connected } = useSolana();
  
  // Get user initials for avatar
  const userInitials = user?.email 
    ? user.email.split('@')[0].substring(0, 2).toUpperCase() 
    : 'U';
  
  const [rewards, setRewards] = React.useState({
    available: 75,
    total: 425,
    streak: 5
  });

  const handleClaimRewards = (amount: number) => {
    setRewards(prev => ({
      ...prev,
      available: 0,
      total: prev.total
    }));
  };
  
  return (
    <MainLayout>
      <motion.div 
        className="container mx-auto py-8 px-4 md:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-center">{user?.email?.split('@')[0]}</CardTitle>
                  <CardDescription className="text-center">{user?.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Studying for</p>
                      <p className="text-sm text-muted-foreground">ACCA Qualification</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Study time</p>
                      <p className="text-sm text-muted-foreground">127 hours total</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Joined</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.created_at 
                          ? new Date(user.created_at).toLocaleDateString() 
                          : 'Recently'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">STUDY tokens</p>
                      <p className="text-sm text-muted-foreground">{rewards.total} earned ({rewards.available} available)</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <SimpleWalletButton />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Topics Completed</span>
                  <span className="font-medium">42</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Flashcards Reviewed</span>
                  <span className="font-medium">189</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Assessments Taken</span>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                  <span className="font-medium">5 days</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="learning-path">
              <TabsList className="w-full sm:w-auto mb-6">
                <TabsTrigger value="learning-path">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learning Path
                </TabsTrigger>
                <TabsTrigger value="rewards">
                  <Coins className="h-4 w-4 mr-2" />
                  Rewards
                </TabsTrigger>
                <TabsTrigger value="account">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="learning-path">
                <AdaptiveLearningPath />
              </TabsContent>
              
              <TabsContent value="rewards">
                <TokenRewards 
                  availableRewards={rewards.available}
                  totalEarned={rewards.total}
                  streakDays={rewards.streak}
                  onClaim={handleClaimRewards}
                />
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Reward History</CardTitle>
                    <CardDescription>Your recent token earnings and redemptions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Module Completion: Financial Accounting</p>
                          <p className="text-sm text-muted-foreground">May 3, 2023</p>
                        </div>
                        <p className="text-green-500 font-medium">+50 STUDY</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Daily Streak Bonus</p>
                          <p className="text-sm text-muted-foreground">May 1, 2023</p>
                        </div>
                        <p className="text-green-500 font-medium">+25 STUDY</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Practice Exam Completion</p>
                          <p className="text-sm text-muted-foreground">April 28, 2023</p>
                        </div>
                        <p className="text-green-500 font-medium">+20 STUDY</p>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">Premium Content Purchase</p>
                          <p className="text-sm text-muted-foreground">April 20, 2023</p>
                        </div>
                        <p className="text-red-500 font-medium">-100 STUDY</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Manage your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Email</h3>
                        <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Account Type</h3>
                        <p className="text-sm text-muted-foreground mt-1">Standard User</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Email Preferences</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Subscribed to study reminders and progress updates
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Blockchain Wallet</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {connected ? "Wallet connected" : "No wallet connected"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Study Preferences</CardTitle>
                    <CardDescription>
                      Customize your learning experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">Daily Study Goal</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          45 minutes per day
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Focus Areas</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Financial Reporting, Taxation, Audit and Assurance
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Difficulty Preference</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Adaptive (adjusts based on performance)
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Blockchain Features</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          NFT Achievements, Token Rewards, Premium Content
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default Profile;
