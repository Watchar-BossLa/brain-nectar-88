import React, { useState, useEffect } from 'react';
import { useCollaborativeNetwork } from '@/services/collaborative-network';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  UserPlus,
  Loader2,
  Globe,
  Lock,
  User
} from 'lucide-react';

/**
 * Study Group List Component
 * Displays a list of user's study groups and allows creating new ones
 * @param {Object} props - Component props
 * @param {Function} [props.onSelectGroup] - Callback when a group is selected
 * @returns {React.ReactElement} Study group list component
 */
const StudyGroupList = ({ onSelectGroup }) => {
  const { user } = useAuth();
  const collaborativeNetwork = useCollaborativeNetwork();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({ name: '', description: '', isPublic: false });
  const [creatingGroup, setCreatingGroup] = useState(false);
  
  // Load user's groups
  useEffect(() => {
    if (!user) return;
    
    const loadGroups = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!collaborativeNetwork.initialized) {
          await collaborativeNetwork.initialize(user.id);
        }
        
        const userGroups = await collaborativeNetwork.getUserGroups(user.id);
        setGroups(userGroups);
        setError(null);
      } catch (err) {
        console.error('Error loading groups:', err);
        setError(err.message || 'Failed to load groups');
      } finally {
        setLoading(false);
      }
    };
    
    loadGroups();
  }, [user, collaborativeNetwork]);
  
  // Handle group selection
  const handleSelectGroup = (group) => {
    if (onSelectGroup) {
      onSelectGroup(group);
    }
  };
  
  // Handle new group form change
  const handleNewGroupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewGroupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle creating a new group
  const handleCreateGroup = async () => {
    if (!user || !newGroupData.name.trim()) return;
    
    try {
      setCreatingGroup(true);
      
      const groupData = {
        name: newGroupData.name.trim(),
        description: newGroupData.description.trim(),
        isPublic: newGroupData.isPublic
      };
      
      const newGroup = await collaborativeNetwork.createStudyGroup(groupData);
      
      // Add new group to list
      setGroups(prev => [newGroup, ...prev]);
      
      // Reset form
      setNewGroupData({ name: '', description: '', isPublic: false });
      setCreateDialogOpen(false);
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group: ' + (err.message || 'Unknown error'));
    } finally {
      setCreatingGroup(false);
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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>Failed to load study groups</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
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
            <CardTitle>Study Groups</CardTitle>
            <CardDescription>
              {groups.length === 0
                ? 'Create your first study group'
                : `You are a member of ${groups.length} group${groups.length === 1 ? '' : 's'}`
              }
            </CardDescription>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Study Group</DialogTitle>
                <DialogDescription>
                  Create a new group to collaborate with other students
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Group Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newGroupData.name}
                    onChange={handleNewGroupChange}
                    placeholder="Enter group name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newGroupData.description}
                    onChange={handleNewGroupChange}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPublic"
                    name="isPublic"
                    checked={newGroupData.isPublic}
                    onCheckedChange={(checked) => 
                      setNewGroupData(prev => ({ ...prev, isPublic: checked }))
                    }
                  />
                  <Label htmlFor="isPublic">
                    Make this group public (discoverable by other users)
                  </Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateGroup}
                  disabled={!newGroupData.name.trim() || creatingGroup}
                >
                  {creatingGroup ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Group'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {groups.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Groups</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first study group to collaborate with other students.
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSelectGroup(group)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Users className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium">{group.name}</h3>
                      {group.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {group.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {group.is_public ? (
                      <Badge variant="outline" className="flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                    <Badge className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {group.userRole}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => {/* TODO: Implement join group by code */}}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Join Group with Code
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudyGroupList;
