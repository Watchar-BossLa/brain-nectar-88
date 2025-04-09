import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Shield, Download, Trash2, Eye, EyeOff, Lock, Database } from 'lucide-react';
import { OfflineDataService } from '@/services/offline';

/**
 * Privacy Controls Component
 * Allows users to manage their data privacy settings
 * 
 * @returns {React.ReactElement} Privacy controls component
 */
const PrivacyControls = () => {
  const [settings, setSettings] = useState({
    shareAnalytics: true,
    storeOffline: true,
    syncAcrossDevices: true,
    personalizedRecommendations: true,
    anonymousUsageData: true,
    thirdPartyIntegrations: false,
    locationData: false,
  });
  
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        
        // Try to load from IndexedDB first
        const storedSettings = await OfflineDataService.getUserSettings();
        
        if (storedSettings) {
          setSettings(prev => ({ ...prev, ...storedSettings }));
        } else {
          // Fallback to localStorage
          const localSettings = localStorage.getItem('privacySettings');
          if (localSettings) {
            setSettings(prev => ({ ...prev, ...JSON.parse(localSettings) }));
          }
        }
      } catch (error) {
        console.error('Error loading privacy settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings when they change
  const saveSettings = async (newSettings) => {
    try {
      // Save to IndexedDB
      await OfflineDataService.storeUserSettings(newSettings);
      
      // Also save to localStorage as backup
      localStorage.setItem('privacySettings', JSON.stringify(newSettings));
      
      toast({
        title: 'Settings Saved',
        description: 'Your privacy settings have been updated',
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: 'Error Saving Settings',
        description: 'There was a problem saving your privacy settings',
        variant: 'destructive',
      });
    }
  };
  
  // Handle setting change
  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };
  
  // Handle data export
  const handleExportData = async () => {
    setExportLoading(true);
    
    try {
      // In a real implementation, this would fetch all user data
      // For now, we'll just create a JSON file with the settings
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        settings,
        // This would include all user data in a real implementation
        profile: {
          email: 'user@example.com',
          name: 'Example User',
        },
        timestamp: new Date().toISOString(),
      };
      
      // Create a downloadable file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create a link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `studybee-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Data Exported',
        description: 'Your data has been exported successfully',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export Failed',
        description: 'There was a problem exporting your data',
        variant: 'destructive',
      });
    } finally {
      setExportLoading(false);
    }
  };
  
  // Handle data deletion
  const handleDeleteData = async () => {
    // In a real implementation, this would delete user data from the server
    // For now, we'll just clear local storage and IndexedDB
    
    if (!window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return;
    }
    
    setDeleteLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear IndexedDB
      await OfflineDataService.deleteAllData('flashcards');
      await OfflineDataService.deleteAllData('courses');
      await OfflineDataService.deleteAllData('progress');
      
      // Clear localStorage
      localStorage.removeItem('privacySettings');
      localStorage.removeItem('userPreferences');
      
      toast({
        title: 'Data Deleted',
        description: 'Your data has been deleted successfully',
      });
      
      // Reset settings to defaults
      const defaultSettings = {
        shareAnalytics: false,
        storeOffline: true,
        syncAcrossDevices: false,
        personalizedRecommendations: false,
        anonymousUsageData: false,
        thirdPartyIntegrations: false,
        locationData: false,
      };
      
      setSettings(defaultSettings);
      saveSettings(defaultSettings);
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: 'Deletion Failed',
        description: 'There was a problem deleting your data',
        variant: 'destructive',
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Privacy Controls
          </CardTitle>
          <CardDescription>Manage your data privacy settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground">Loading privacy settings...</div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Privacy Controls
        </CardTitle>
        <CardDescription>Manage your data privacy settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="settings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="data">Your Data</TabsTrigger>
            <TabsTrigger value="info">Privacy Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shareAnalytics">Share Analytics</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow us to collect anonymous usage analytics
                  </div>
                </div>
                <Switch
                  id="shareAnalytics"
                  checked={settings.shareAnalytics}
                  onCheckedChange={(checked) => handleSettingChange('shareAnalytics', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="storeOffline">Store Data Offline</Label>
                  <div className="text-sm text-muted-foreground">
                    Store your study data on this device for offline use
                  </div>
                </div>
                <Switch
                  id="storeOffline"
                  checked={settings.storeOffline}
                  onCheckedChange={(checked) => handleSettingChange('storeOffline', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="syncAcrossDevices">Sync Across Devices</Label>
                  <div className="text-sm text-muted-foreground">
                    Synchronize your data across all your devices
                  </div>
                </div>
                <Switch
                  id="syncAcrossDevices"
                  checked={settings.syncAcrossDevices}
                  onCheckedChange={(checked) => handleSettingChange('syncAcrossDevices', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="personalizedRecommendations">Personalized Recommendations</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive personalized learning recommendations
                  </div>
                </div>
                <Switch
                  id="personalizedRecommendations"
                  checked={settings.personalizedRecommendations}
                  onCheckedChange={(checked) => handleSettingChange('personalizedRecommendations', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymousUsageData">Anonymous Usage Data</Label>
                  <div className="text-sm text-muted-foreground">
                    Share anonymous usage data to improve the app
                  </div>
                </div>
                <Switch
                  id="anonymousUsageData"
                  checked={settings.anonymousUsageData}
                  onCheckedChange={(checked) => handleSettingChange('anonymousUsageData', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="thirdPartyIntegrations">Third-Party Integrations</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow integration with third-party services
                  </div>
                </div>
                <Switch
                  id="thirdPartyIntegrations"
                  checked={settings.thirdPartyIntegrations}
                  onCheckedChange={(checked) => handleSettingChange('thirdPartyIntegrations', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="locationData">Location Data</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow access to your location data
                  </div>
                </div>
                <Switch
                  id="locationData"
                  checked={settings.locationData}
                  onCheckedChange={(checked) => handleSettingChange('locationData', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Your Data
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You can export or delete all your data from Study Bee. Exporting gives you a copy of all your data in JSON format.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={exportLoading}
                    className="flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {exportLoading ? 'Exporting...' : 'Export Your Data'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteData}
                    disabled={deleteLoading}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteLoading ? 'Deleting...' : 'Delete All Data'}
                  </Button>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-primary" />
                  Data Visibility
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Control who can see your learning data and activity.
                </p>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <select
                      id="profileVisibility"
                      className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                      defaultValue="friends"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="activityVisibility">Learning Activity</Label>
                    <select
                      id="activityVisibility"
                      className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                      defaultValue="friends"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="progressVisibility">Progress Visibility</Label>
                    <select
                      id="progressVisibility"
                      className="rounded-md border border-input bg-background px-3 py-1 text-sm"
                      defaultValue="private"
                    >
                      <option value="public">Public</option>
                      <option value="friends">Friends Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-primary" />
                  How We Protect Your Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Study Bee takes your privacy seriously. We use industry-standard encryption to protect your data both in transit and at rest. Your personal information is never sold to third parties.
                </p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <EyeOff className="h-5 w-5 mr-2 text-primary" />
                  Data Collection
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We collect the following types of data to provide and improve our services:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Account information (email, name)</li>
                  <li>Learning activity and progress</li>
                  <li>Study materials and notes</li>
                  <li>Device information and app usage</li>
                </ul>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-2">Data Retention</h3>
                <p className="text-sm text-muted-foreground">
                  We retain your data for as long as your account is active. You can delete your data at any time from the "Your Data" tab. When you delete your data, it is permanently removed from our servers within 30 days.
                </p>
              </div>
              
              <div className="mt-4">
                <Button variant="link" className="px-0">
                  View Full Privacy Policy
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PrivacyControls;
