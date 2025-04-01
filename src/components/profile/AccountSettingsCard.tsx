
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const AccountSettingsCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account preferences and settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <h3 className="font-medium">Settings coming soon</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Account settings and preferences will be available in a future update
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSettingsCard;
