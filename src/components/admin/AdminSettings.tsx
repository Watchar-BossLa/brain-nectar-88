
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Switch 
} from "@/components/ui/switch";

export default function AdminSettings() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Study Bee",
    siteDescription: "Adaptive Learning Platform",
    allowRegistration: true,
    requirePayment: false,
    maintenanceMode: false
  });
  const { toast } = useToast();

  function handleSettingChange(key: string, value: string | boolean) {
    setSiteSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }

  function handleSaveSettings() {
    toast({
      title: "Settings Saved",
      description: "Your site settings have been updated successfully.",
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Admin Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure the general settings for your platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input 
                id="site-name"
                value={siteSettings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea 
                id="site-description"
                value={siteSettings.siteDescription}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Registration & Access</CardTitle>
            <CardDescription>
              Control user registration and site access settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allow-registration" className="block">Allow Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Enable/disable new user registrations
                </p>
              </div>
              <Switch 
                id="allow-registration"
                checked={siteSettings.allowRegistration}
                onCheckedChange={(value) => handleSettingChange('allowRegistration', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require-payment" className="block">Require Payment</Label>
                <p className="text-sm text-muted-foreground">
                  Require payment for access to the platform
                </p>
              </div>
              <Switch 
                id="require-payment"
                checked={siteSettings.requirePayment}
                onCheckedChange={(value) => handleSettingChange('requirePayment', value)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance-mode" className="block">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Put the site in maintenance mode (admins only access)
                </p>
              </div>
              <Switch 
                id="maintenance-mode"
                checked={siteSettings.maintenanceMode}
                onCheckedChange={(value) => handleSettingChange('maintenanceMode', value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>
              Configure payment gateways and options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your payment processor to start accepting payments.
              You'll need to provide API keys from your payment service provider.
            </p>
            <Button variant="secondary">Configure Payment Gateways</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Account</CardTitle>
            <CardDescription>
              Manage administrator accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add or modify administrator accounts that can access this admin panel.
            </p>
            <Button variant="secondary">Manage Admin Users</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
