
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

/**
 * Learning Profile Form component
 * Allows users to create and update their learning profile preferences
 * @param {Object} props - Component props
 * @param {Object} props.profile - Current user profile data
 * @param {Function} props.onUpdate - Function to call when profile is updated
 * @returns {React.ReactElement} Learning profile form component
 */
const LearningProfileForm = ({ profile = {}, onUpdate }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    preferredLanguage: profile.preferredLanguage || 'english',
    difficultyPreference: profile.difficultyPreference || 'balanced',
    learningGoals: profile.learningGoals || '',
    contentPreferences: profile.contentPreferences || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real implementation, this would save to a backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (onUpdate) {
        onUpdate(formData);
      }
      
      toast({
        title: 'Profile Updated',
        description: 'Your learning profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update your learning profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Learning Profile</CardTitle>
        <CardDescription>
          Customize your learning preferences to get more personalized content recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredLanguage">Preferred Language</Label>
            <Select 
              value={formData.preferredLanguage} 
              onValueChange={(value) => handleChange('preferredLanguage', value)}
            >
              <SelectTrigger id="preferredLanguage">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficultyPreference">Content Difficulty</Label>
            <Select 
              value={formData.difficultyPreference} 
              onValueChange={(value) => handleChange('difficultyPreference', value)}
            >
              <SelectTrigger id="difficultyPreference">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner - More explanations</SelectItem>
                <SelectItem value="balanced">Balanced - Mix of content types</SelectItem>
                <SelectItem value="advanced">Advanced - Challenging content</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningGoals">Learning Goals</Label>
            <Textarea 
              id="learningGoals"
              value={formData.learningGoals}
              onChange={(e) => handleChange('learningGoals', e.target.value)}
              placeholder="What do you want to achieve with your studies?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentPreferences">Content Preferences</Label>
            <Textarea 
              id="contentPreferences"
              value={formData.contentPreferences}
              onChange={(e) => handleChange('contentPreferences', e.target.value)}
              placeholder="What types of content do you prefer? (e.g. videos, articles, interactive exercises)"
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? (
            <>
              <span className="mr-2">Saving</span>
              <span className="animate-spin">⋯</span>
            </>
          ) : 'Save Profile'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LearningProfileForm;
