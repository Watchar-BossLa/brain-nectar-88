import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PrivacyControls } from '@/components/settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

/**
 * Settings Page
 * User settings and preferences
 * 
 * @returns {React.ReactElement} Settings page
 */
const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email: 'user@example.com',
    name: 'Example User',
    language: 'en',
    timezone: 'UTC',
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    studyReminders: true,
    assessmentReminders: true,
    marketingEmails: false,
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    highContrast: false,
    reducedMotion: false,
  });
  
  // Handle account settings change
  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle notification settings change
  const handleNotificationChange = (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle appearance settings change
  const handleAppearanceChange = (key, value) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Handle save settings
  const handleSaveSettings = () => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      
      toast({
        title: 'Settings Saved',
        description: 'Your settings have been updated successfully',
      });
    }, 1000);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <SettingsIcon className="h-8 w-8 mr-2 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={accountSettings.name}
                          onChange={handleAccountChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={accountSettings.email}
                          onChange={handleAccountChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select
                          id="language"
                          name="language"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={accountSettings.language}
                          onChange={handleAccountChange}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <select
                          id="timezone"
                          name="timezone"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                          value={accountSettings.timezone}
                          onChange={handleAccountChange}
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time (EST)</option>
                          <option value="CST">Central Time (CST)</option>
                          <option value="MST">Mountain Time (MST)</option>
                          <option value="PST">Pacific Time (PST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible account actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-destructive/20 p-4">
                    <h3 className="font-medium text-destructive mb-2">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </div>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive push notifications on your device
                        </div>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="studyReminders">Study Reminders</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive reminders for scheduled study sessions
                        </div>
                      </div>
                      <Switch
                        id="studyReminders"
                        checked={notificationSettings.studyReminders}
                        onCheckedChange={(checked) => handleNotificationChange('studyReminders', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="assessmentReminders">Assessment Reminders</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive reminders for upcoming assessments
                        </div>
                      </div>
                      <Switch
                        id="assessmentReminders"
                        checked={notificationSettings.assessmentReminders}
                        onCheckedChange={(checked) => handleNotificationChange('assessmentReminders', checked)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketingEmails">Marketing Emails</Label>
                        <div className="text-sm text-muted-foreground">
                          Receive marketing and promotional emails
                        </div>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-primary" />
                    Appearance Settings
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={appearanceSettings.theme === 'light' ? 'default' : 'outline'}
                          className="flex flex-col items-center justify-center h-20 w-full"
                          onClick={() => handleAppearanceChange('theme', 'light')}
                        >
                          <Sun className="h-6 w-6 mb-2" />
                          <span>Light</span>
                        </Button>
                        <Button
                          variant={appearanceSettings.theme === 'dark' ? 'default' : 'outline'}
                          className="flex flex-col items-center justify-center h-20 w-full"
                          onClick={() => handleAppearanceChange('theme', 'dark')}
                        >
                          <Moon className="h-6 w-6 mb-2" />
                          <span>Dark</span>
                        </Button>
                        <Button
                          variant={appearanceSettings.theme === 'system' ? 'default' : 'outline'}
                          className="flex flex-col items-center justify-center h-20 w-full"
                          onClick={() => handleAppearanceChange('theme', 'system')}
                        >
                          <Monitor className="h-6 w-6 mb-2" />
                          <span>System</span>
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <select
                        id="fontSize"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={appearanceSettings.fontSize}
                        onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="x-large">Extra Large</option>
                      </select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="highContrast">High Contrast</Label>
                          <div className="text-sm text-muted-foreground">
                            Increase contrast for better visibility
                          </div>
                        </div>
                        <Switch
                          id="highContrast"
                          checked={appearanceSettings.highContrast}
                          onCheckedChange={(checked) => handleAppearanceChange('highContrast', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reducedMotion">Reduced Motion</Label>
                          <div className="text-sm text-muted-foreground">
                            Minimize animations and transitions
                          </div>
                        </div>
                        <Switch
                          id="reducedMotion"
                          checked={appearanceSettings.reducedMotion}
                          onCheckedChange={(checked) => handleAppearanceChange('reducedMotion', checked)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button 
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <PrivacyControls />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
