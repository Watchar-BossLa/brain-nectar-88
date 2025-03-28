
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/context/theme';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfileCard } from '@/components/profile/UserProfileCard';

const Settings = () => {
  const { theme, setMode, toggleHighContrast } = useTheme();

  return (
    <MainLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
        
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <UserProfileCard />
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      className={`p-3 border rounded-md flex justify-center items-center ${theme.mode === 'light' ? 'border-primary bg-primary/10' : ''}`}
                      onClick={() => setMode('light')}
                    >
                      Light
                    </button>
                    <button 
                      className={`p-3 border rounded-md flex justify-center items-center ${theme.mode === 'dark' ? 'border-primary bg-primary/10' : ''}`}
                      onClick={() => setMode('dark')}
                    >
                      Dark
                    </button>
                    <button 
                      className={`p-3 border rounded-md flex justify-center items-center ${theme.mode === 'system' ? 'border-primary bg-primary/10' : ''}`}
                      onClick={() => setMode('system')}
                    >
                      System
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="high-contrast" className="cursor-pointer">High Contrast Mode</Label>
                  <Switch 
                    id="high-contrast" 
                    checked={theme.highContrast} 
                    onCheckedChange={toggleHighContrast} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="cursor-pointer">Email Notifications</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="cursor-pointer">Push Notifications</Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="study-reminders" className="cursor-pointer">Study Reminders</Label>
                  <Switch id="study-reminders" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
