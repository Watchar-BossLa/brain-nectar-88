import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/auth';
import { useStudyGroup } from '@/services/study-groups';
import { GroupMembersList, GroupSessionsList, SessionScheduler } from '@/components/study-groups';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Users, 
  Calendar, 
  Settings, 
  ArrowLeft, 
  LogOut, 
  Trash2, 
  Copy, 
  Plus,
  Loader2
} from 'lucide-react';

/**
 * Study Group Detail Page
 * @returns {React.ReactElement} Study group detail page
 */
const StudyGroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const studyGroup = useStudyGroup();
  
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [leavingGroup, setLeavingGroup] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);
  
  // Load group details
  useEffect(() => {
    if (!user || !groupId) return;
    
    const loadGroup = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!studyGroup.initialized) {
          await studyGroup.initialize(user.id);
        }
        
        // Get group details
        const groupDetails = await studyGroup.getGroupById(groupId);
        setGroup(groupDetails);
      } catch (error) {
        console.error('Error loading group:', error);
        toast({
          title: 'Error',
          description: 'Failed to load group details',
          variant: 'destructive'
        });
        navigate('/study-groups');
      } finally {
        setLoading(false);
      }
    };
    
    loadGroup();
  }, [user, groupId, studyGroup, navigate]);
  
  // Handle back to groups
  const handleBackToGroups = () => {
    navigate('/study-groups');
  };
  
  // Handle schedule session
  const handleScheduleSession = () => {
    setShowScheduleForm(true);
  };
  
  // Handle schedule success
  const handleScheduleSuccess = (session) => {
    setShowScheduleForm(false);
    toast({
      title: 'Success',
      description: 'Session scheduled successfully',
    });
  };
  
  // Handle cancel schedule
  const handleCancelSchedule = () => {
    setShowScheduleForm(false);
  };
  
  // Handle copy join code
  const handleCopyJoinCode = () => {
    if (!group || !group.join_code) return;
    
    navigator.clipboard.writeText(group.join_code).then(
      () => {
        toast({
          title: 'Copied to Clipboard',
          description: 'Join code has been copied to clipboard',
        });
      },
      (err) => {
        console.error('Error copying join code:', err);
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy join code to clipboard',
          variant: 'destructive'
        });
      }
    );
  };
  
  // Handle leave group
  const handleLeaveGroup = async () => {
    if (!user || !groupId) return;
    
    try {
      setLeavingGroup(true);
      
      // Leave the group
      await studyGroup.leaveGroup(groupId);
      
      toast({
        title: 'Success',
        description: 'You have left the group',
      });
      
      navigate('/study-groups');
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to leave the group',
        variant: 'destructive'
      });
    } finally {
      setLeavingGroup(false);
    }
  };
  
  // Handle delete group
  const handleDeleteGroup = async () => {
    if (!user || !groupId) return;
    
    try {
      setDeletingGroup(true);
      
      // Delete the group
      await studyGroup.deleteGroup(groupId);
      
      toast({
        title: 'Success',
        description: 'Group has been deleted',
      });
      
      navigate('/study-groups');
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete the group',
        variant: 'destructive'
      });
    } finally {
      setDeletingGroup(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center mb-4">
              <Button variant="outline" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Skeleton className="h-8 w-64" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Render if group not found
  if (!group) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 max-w-7xl">
          <div className="flex flex-col space-y-6">
            <Button variant="outline" onClick={handleBackToGroups} className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle>Group Not Found</CardTitle>
                <CardDescription>
                  The study group you're looking for doesn't exist or you don't have access to it
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Please check the URL or go back to your groups</p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleBackToGroups}>
                  Go to My Groups
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Check if user is admin
  const isAdmin = group.memberRole === 'admin';
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <Button variant="outline" onClick={handleBackToGroups} className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Groups
            </Button>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
                <p className="text-muted-foreground">
                  {group.description || 'No description'}
                </p>
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Group Settings</DialogTitle>
                        <DialogDescription>
                          Manage your study group settings
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">Join Code</h3>
                          {group.is_public ? (
                            <div className="flex items-center space-x-2">
                              <code className="bg-muted px-2 py-1 rounded">{group.join_code}</code>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={handleCopyJoinCode}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              This is a private group. Members can only join by invitation.
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium text-destructive">Danger Zone</h3>
                          <Button 
                            variant="destructive" 
                            onClick={handleDeleteGroup}
                            disabled={deletingGroup}
                          >
                            {deletingGroup ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Group
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Leave Group
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Leave Group</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to leave this group?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p>
                        You will no longer have access to this group's sessions and resources.
                        {isAdmin && " As an admin, make sure there's another admin before leaving."}
                      </p>
                      <div className="flex justify-end space-x-2">
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogTrigger>
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
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          {showScheduleForm ? (
            <div>
              <Button 
                variant="outline" 
                className="mb-4"
                onClick={handleCancelSchedule}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Group
              </Button>
              <SessionScheduler 
                groupId={groupId}
                onSuccess={handleScheduleSuccess}
                onCancel={handleCancelSchedule}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="sessions" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Sessions</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Group Overview</CardTitle>
                        <CardDescription>
                          Information about this study group
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium">Description</h3>
                            <p className="text-muted-foreground">
                              {group.description || 'No description provided'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium">Created</h3>
                              <p className="text-muted-foreground">
                                {new Date(group.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-medium">Members</h3>
                              <p className="text-muted-foreground">
                                {group.memberCount || 0} members
                              </p>
                            </div>
                            <div>
                              <h3 className="font-medium">Visibility</h3>
                              <p className="text-muted-foreground">
                                {group.is_public ? 'Public' : 'Private'}
                              </p>
                            </div>
                            <div>
                              <h3 className="font-medium">Your Role</h3>
                              <p className="text-muted-foreground">
                                {group.memberRole === 'admin' ? 'Admin' : 'Member'}
                              </p>
                            </div>
                          </div>
                          
                          {group.is_public && (
                            <div>
                              <h3 className="font-medium">Join Code</h3>
                              <div className="flex items-center space-x-2">
                                <code className="bg-muted px-2 py-1 rounded">{group.join_code}</code>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={handleCopyJoinCode}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Share this code with others to let them join the group
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="mt-6">
                      <GroupSessionsList 
                        groupId={groupId}
                        isAdmin={isAdmin}
                        onCreateSession={handleScheduleSession}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sessions">
                    <GroupSessionsList 
                      groupId={groupId}
                      isAdmin={isAdmin}
                      onCreateSession={handleScheduleSession}
                    />
                  </TabsContent>
                </Tabs>
              </div>
              
              <div>
                <GroupMembersList 
                  groupId={groupId}
                  isAdmin={isAdmin}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudyGroupDetail;
