import React, { useState } from 'react';
import { useStudyGroup } from '@/services/study-groups';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Users, Lock, Globe } from 'lucide-react';

/**
 * Create Group Form Component
 * @param {Object} props - Component props
 * @param {Function} props.onSuccess - Success callback
 * @param {Function} props.onCancel - Cancel callback
 * @returns {React.ReactElement} Create group form component
 */
const CreateGroupForm = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const studyGroup = useStudyGroup();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
    maxMembers: 10
  });
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle switch change
  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      isPublic: checked
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Group name is required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Initialize service if needed
      if (!studyGroup.initialized) {
        await studyGroup.initialize(user.id);
      }
      
      // Create the group
      const group = await studyGroup.createGroup({
        name: formData.name.trim(),
        description: formData.description.trim(),
        isPublic: formData.isPublic,
        maxMembers: parseInt(formData.maxMembers) || 10,
        settings: {}
      });
      
      toast({
        title: 'Success',
        description: 'Study group created successfully',
      });
      
      if (onSuccess) {
        onSuccess(group);
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create study group',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Study Group</CardTitle>
        <CardDescription>
          Create a new study group to collaborate with others
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter group name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your study group"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxMembers">Maximum Members</Label>
            <Input
              id="maxMembers"
              name="maxMembers"
              type="number"
              min="2"
              max="100"
              placeholder="10"
              value={formData.maxMembers}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isPublic" className="flex items-center gap-2">
              {formData.isPublic ? (
                <>
                  <Globe className="h-4 w-4" />
                  <span>Public Group</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Private Group</span>
                </>
              )}
            </Label>
          </div>
          
          {formData.isPublic && (
            <div className="text-sm text-muted-foreground">
              Anyone can find and join this group
            </div>
          )}
          
          {!formData.isPublic && (
            <div className="text-sm text-muted-foreground">
              Members can only join by invitation
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Create Group
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateGroupForm;
