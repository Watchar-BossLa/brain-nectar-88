import React, { useState, useEffect } from 'react';
import { useAICoachProfile } from '@/services/ai-coach';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  User, 
  Settings, 
  Edit, 
  Sparkles,
  Loader2
} from 'lucide-react';

/**
 * Coach Profile Card Component
 * Displays the AI coach profile and allows customization
 * @returns {React.ReactElement} Coach profile card component
 */
const CoachProfileCard = () => {
  const { user } = useAuth();
  const aiCoachProfile = useAICoachProfile();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState({
    coach_name: '',
    coach_personality: '',
    coaching_style: ''
  });
  const [saving, setSaving] = useState(false);
  
  // Load coach profile
  useEffect(() => {
    if (!user) return;
    
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!aiCoachProfile.initialized) {
          await aiCoachProfile.initialize(user.id);
        }
        
        // Load profile
        const coachProfile = await aiCoachProfile.getCoachProfile();
        setProfile(coachProfile);
        
        // Set edit data
        setEditData({
          coach_name: coachProfile.coach_name,
          coach_personality: coachProfile.coach_personality,
          coaching_style: coachProfile.coaching_style
        });
      } catch (error) {
        console.error('Error loading coach profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load coach profile',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, aiCoachProfile]);
  
  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle radio change
  const handleRadioChange = (name, value) => {
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save profile
  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    
    try {
      setSaving(true);
      
      // Update profile
      const updatedProfile = await aiCoachProfile.updateCoachProfile(editData);
      setProfile(updatedProfile);
      
      // Close dialog
      setEditDialogOpen(false);
      
      toast({
        title: 'Profile Updated',
        description: 'Your coach profile has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating coach profile:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'An error occurred while updating the profile',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Get avatar fallback text
  const getAvatarFallback = (name) => {
    if (!name) return 'SC';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  // Get personality description
  const getPersonalityDescription = (personality) => {
    switch (personality) {
      case 'supportive':
        return 'Encouraging and positive';
      case 'analytical':
        return 'Logical and detail-oriented';
      case 'motivational':
        return 'Energetic and inspiring';
      case 'challenging':
        return 'Pushes you to excel';
      default:
        return 'Balanced approach';
    }
  };
  
  // Get coaching style description
  const getCoachingStyleDescription = (style) => {
    switch (style) {
      case 'directive':
        return 'Provides clear instructions';
      case 'socratic':
        return 'Uses questions to guide learning';
      case 'facilitative':
        return 'Helps you discover solutions';
      case 'balanced':
        return 'Adapts to your needs';
      default:
        return 'Balanced approach';
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render if no profile
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study Coach</CardTitle>
          <CardDescription>
            Your personal AI study coach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Unable to load coach profile. Please try again later.</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Study Coach</CardTitle>
            <CardDescription>
              Personalized guidance for your learning journey
            </CardDescription>
          </div>
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Customize Your Coach</DialogTitle>
                <DialogDescription>
                  Personalize your AI study coach to match your preferences
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="coach_name">Coach Name</Label>
                  <Input
                    id="coach_name"
                    name="coach_name"
                    value={editData.coach_name}
                    onChange={handleEditChange}
                    placeholder="Enter coach name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Coach Personality</Label>
                  <RadioGroup
                    value={editData.coach_personality}
                    onValueChange={(value) => handleRadioChange('coach_personality', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="supportive" id="personality-supportive" />
                      <Label htmlFor="personality-supportive">Supportive</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="analytical" id="personality-analytical" />
                      <Label htmlFor="personality-analytical">Analytical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="motivational" id="personality-motivational" />
                      <Label htmlFor="personality-motivational">Motivational</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="challenging" id="personality-challenging" />
                      <Label htmlFor="personality-challenging">Challenging</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Coaching Style</Label>
                  <RadioGroup
                    value={editData.coaching_style}
                    onValueChange={(value) => handleRadioChange('coaching_style', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="directive" id="style-directive" />
                      <Label htmlFor="style-directive">Directive</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="socratic" id="style-socratic" />
                      <Label htmlFor="style-socratic">Socratic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="facilitative" id="style-facilitative" />
                      <Label htmlFor="style-facilitative">Facilitative</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="balanced" id="style-balanced" />
                      <Label htmlFor="style-balanced">Balanced</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.settings?.coach_avatar_url || ''} />
            <AvatarFallback className="text-lg bg-primary text-primary-foreground">
              {getAvatarFallback(profile.coach_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-medium">{profile.coach_name}</h3>
            <div className="text-sm text-muted-foreground space-y-1 mt-1">
              <p>Personality: {getPersonalityDescription(profile.coach_personality)}</p>
              <p>Style: {getCoachingStyleDescription(profile.coaching_style)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">Personalized Learning</p>
              <p className="text-sm text-muted-foreground">
                Your coach adapts to your learning style and goals
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-primary mt-1" />
            <div>
              <p className="font-medium">1-on-1 Guidance</p>
              <p className="text-sm text-muted-foreground">
                Get personalized advice and support for your studies
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {
            // TODO: Implement settings
            toast({
              title: 'Coach Settings',
              description: 'This feature is not yet implemented',
            });
          }}
        >
          <Settings className="h-4 w-4 mr-2" />
          Coach Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CoachProfileCard;
