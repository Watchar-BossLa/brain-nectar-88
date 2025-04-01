
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SaveIcon } from 'lucide-react';
import { UserProfileData } from './useUserProfileData';

interface ProfileCardProps {
  profileData: UserProfileData | null;
  firstName: string;
  lastName: string;
  userEmail: string | undefined;
  saving: boolean;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  handleSaveProfile: () => Promise<void>;
}

const ProfileCard = ({
  profileData,
  firstName,
  lastName,
  userEmail,
  saving,
  setFirstName,
  setLastName,
  handleSaveProfile
}: ProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <p className="text-muted-foreground">
          Update your personal information
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileData?.avatar_url || ''} />
            <AvatarFallback className="text-2xl">
              {userEmail?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">
              {firstName || lastName 
                ? `${firstName} ${lastName}`.trim() 
                : 'Study Bee User'}
            </h2>
            <p className="text-muted-foreground">{userEmail}</p>
            {profileData && (
              <p className="text-sm text-muted-foreground mt-1">
                Member since {new Date(profileData?.created_at || '').toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              First Name
            </Label>
            <Input
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Last Name
            </Label>
            <Input
              id="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={userEmail || ''}
              disabled
              className="col-span-3"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSaveProfile} 
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
