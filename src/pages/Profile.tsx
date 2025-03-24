
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MainLayout from '@/components/layout/MainLayout';
import AdaptiveLearningPath from '@/components/learning/AdaptiveLearningPath';
import { BookOpen, Clock, CalendarDays, User, Settings, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  // Get user initials for avatar
  const userInitials = user?.email 
    ? user.email.split('@')[0].substring(0, 2).toUpperCase() 
    : 'U';
  
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
