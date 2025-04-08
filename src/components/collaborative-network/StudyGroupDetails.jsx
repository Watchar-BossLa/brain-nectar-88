import React, { useState, useEffect } from 'react';
import { useCollaborativeNetwork, useGroupResources, useRealTimeCollaboration } from '@/services/collaborative-network';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Settings, 
  FileText, 
  Calendar,
  Copy,
  ArrowLeft,
  Edit,
  Loader2,
  Globe,
  Lock,
  UserPlus,
  LogOut,
  Trash2
} from 'lucide-react';

/**
 * Study Group Details Component
 * Displays details of a study group and allows management
 * @param {Object} props - Component props
 * @param {string} props.groupId - Group ID
 * @param {Function} [props.onBack] - Callback when back button is clicked
 * @returns {React.ReactElement} Study group details component
 */
const StudyGroupDetails = ({ groupId, onBack }) => {
  const { user } = useAuth();
  const collaborativeNetwork = useCollaborativeNetwork();
  const groupResources = useGroupResources();
  const realTimeCollaboration = useRealTimeCollaboration();
  
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [resources, setResources] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editGroupData, setEditGroupData] = useState({ name: '', description: '', isPublic: false });
  const [updatingGroup, setUpdatingGroup] = useState(false);
  
  const [joinCodeDialogOpen, setJoinCodeDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [regeneratingCode, setRegeneratingCode] = useState(false);
  
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);
  
  // Load group details
  useEffect(() => {
    if (!user || !groupId) return;
    
    const loadGroupDetails = async () => {
      try {
        setLoading(true);
        
        // Initialize services if needed
        if (!collaborativeNetwork.initialized) {
          await collaborativeNetwork.initialize(user.id);
        }
        
        if (!groupResources.initialized) {
          await groupResources.initialize(user.id);
        }
        
        if (!realTimeCollaboration.initialized) {
          await realTimeCollaboration.initialize(user.id);
        }
        
        // Load group details
        const groupDetails = await collaborativeNetwork.getGroupDetails(groupId);
        setGroup(groupDetails);
        setEditGroupData({
          name: groupDetails.name,
          description: groupDetails.description || '',
          isPublic: groupDetails.is_public
        });
        setJoinCode(groupDetails.join_code);
        
        // Load group members
        const groupMembers = await collaborativeNetwork.getGroupMembers(groupId);
        setMembers(groupMembers);
        
        // Load group resources
        const groupResourcesList = await groupResources.getGroupResources(groupId);
        setResources(groupResourcesList);
        
        // Load active study sessions
        const activeSessions = await realTimeCollaboration.getActiveStudySessions(groupId);
        setSessions(activeSessions);
        
        setError(null);
      } catch (err) {
        console.error('Error loading group details:', err);
        setError(err.message || 'Failed to load group details');
      } finally {
        setLoading(false);
      }
    };
    
    loadGroupDetails();
  }, [user, groupId, collaborativeNetwork, groupResources, realTimeCollaboration]);
  
  // Handle edit group form change
  const handleEditGroupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditGroupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle updating group
  const handleUpdateGroup = async () => {
    if (!user || !group) return;
    
    try {
      setUpdatingGroup(true);
      
      const groupData = {
        name: editGroupData.name.trim(),
        description: editGroupData.description.trim(),
        isPublic: editGroupData.isPublic
      };
      
      const updatedGroup = await collaborativeNetwork.updateGroupDetails(groupId, groupData);
      
      // Update group state
      setGroup(updatedGroup);
      
      // Close dialog
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating group:', err);
      alert('Failed to update group: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdatingGroup(false);
    }
  };
  
  // Handle regenerating join code
  const handleRegenerateJoinCode = async () => {
    if (!user || !group) return;
    
    try {
      setRegeneratingCode(true);
      
      const newJoinCode = await collaborativeNetwork.regenerateJoinCode(groupId);
      
      // Update join code state
      setJoinCode(newJoinCode);
    } catch (err) {
      console.error('Error regenerating join code:', err);
      alert('Failed to regenerate join code: ' + (err.message || 'Unknown error'));
    } finally {
      setRegeneratingCode(false);
    }
  };
  
  // Handle copying join code
  const handleCopyJoinCode = () => {
    navigator.clipboard.writeText(joinCode);
    alert('Join code copied to clipboard');
  };
  
  // Handle leaving group
  const handleLeaveGroup = async () => {
    if (!user || !group) return;
    
    try {
      setLeavingGroup(true);
      
      await collaborativeNetwork.leaveStudyGroup(groupId, user.id);
      
      // Navigate back
      if (onBack) {
        onBack();
      }
    } catch (err) {
      console.error('Error leaving group:', err);
      alert('Failed to leave group: ' + (err.message || 'Unknown error'));
      setLeavingGroup(false);
      setLeaveDialogOpen(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
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
          <CardDescription>Failed to load group details</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <div className="flex space-x-4 mt-4">
            <Button 
              onClick={() => window.location.reload()} 
            >
              Retry
            </Button>
            {onBack && (
              <Button 
                variant="outline" 
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Check if group exists
  if (!group) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Group Not Found</CardTitle>
          <CardDescription>The requested study group could not be found</CardDescription>
        </CardHeader>
        <CardContent>
          {onBack && (
            <Button 
              variant="outline" 
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Check if user is admin
  const isAdmin = group.userRole === 'admin';
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <CardTitle>{group.name}</CardTitle>
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
            </div>
            <CardDescription>
              {group.description || 'No description provided'}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {onBack && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {isAdmin && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Sessions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Members ({members.length})
                </h3>
                {isAdmin && (
                  <Button 
                    variant="outline"
                    onClick={() => setJoinCodeDialogOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Members
                  </Button>
                )}
              </div>
              
              {members.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Members</h3>
                  <p className="text-sm text-muted-foreground">
                    This group has no members yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {member.avatar_url ? (
                            <img 
                              src={member.avatar_url} 
                              alt={member.username} 
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <Users className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{member.username || member.full_name}</p>
                          <Badge variant="outline" className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                      
                      {isAdmin && member.id !== user.id && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive"
                          onClick={() => {/* TODO: Implement remove member */}}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Resources ({resources.length})
                </h3>
                <Button 
                  variant="outline"
                  onClick={() => {/* TODO: Implement add resource */}}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </div>
              
              {resources.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Resources</h3>
                  <p className="text-sm text-muted-foreground">
                    This group has no shared resources yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="p-3 border rounded-md"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{resource.title}</h4>
                        <Badge>
                          {resource.resource_type}
                        </Badge>
                      </div>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {resource.description}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground mt-2">
                        <span>
                          Shared by {resource.creator?.username || 'Unknown'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sessions">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Active Sessions ({sessions.length})
                </h3>
                <Button 
                  variant="outline"
                  onClick={() => {/* TODO: Implement create session */}}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  New Session
                </Button>
              </div>
              
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    This group has no active study sessions.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-3 border rounded-md"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{session.title}</h4>
                        <Badge>
                          {session.session_type}
                        </Badge>
                      </div>
                      {session.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground">
                          Created by {session.creator?.username || 'Unknown'}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => {/* TODO: Implement join session */}}
                        >
                          Join Session
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          className="text-destructive"
          onClick={() => setLeaveDialogOpen(true)}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Leave Group
        </Button>
        
        {isAdmin && (
          <Button 
            variant="outline"
            onClick={() => setJoinCodeDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
        )}
      </CardFooter>
      
      {/* Edit Group Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Study Group</DialogTitle>
            <DialogDescription>
              Update your study group details
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
                value={editGroupData.name}
                onChange={handleEditGroupChange}
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
                value={editGroupData.description}
                onChange={handleEditGroupChange}
                placeholder="Enter group description"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                name="isPublic"
                checked={editGroupData.isPublic}
                onCheckedChange={(checked) => 
                  setEditGroupData(prev => ({ ...prev, isPublic: checked }))
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
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateGroup}
              disabled={!editGroupData.name.trim() || updatingGroup}
            >
              {updatingGroup ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Group'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Join Code Dialog */}
      <Dialog open={joinCodeDialogOpen} onOpenChange={setJoinCodeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Members</DialogTitle>
            <DialogDescription>
              Share this code with others to join your group
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 border rounded-md text-center">
              <p className="text-sm text-muted-foreground mb-2">Join Code</p>
              <p className="text-2xl font-mono font-bold tracking-wider">{joinCode}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCopyJoinCode}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
              
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleRegenerateJoinCode}
                  disabled={regeneratingCode}
                >
                  {regeneratingCode ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Regenerate
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => setJoinCodeDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Leave Group Dialog */}
      <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this group?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-muted-foreground">
              You will no longer have access to this group's resources and sessions.
              {isAdmin && members.length > 1 && (
                ' As you are an admin, you should promote another member to admin before leaving.'
              )}
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setLeaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleLeaveGroup}
              disabled={leavingGroup}
            >
              {leavingGroup ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Leaving...
                </>
              ) : (
                'Leave Group'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StudyGroupDetails;
