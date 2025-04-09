import React, { useState, useEffect } from 'react';
import { useStudyGroup } from '@/services/study-groups';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Users, Search, Plus, RefreshCw } from 'lucide-react';
import StudyGroupCard from './StudyGroupCard';

/**
 * Study Group List Component
 * @param {Object} props - Component props
 * @param {Function} props.onCreateGroup - Create group handler
 * @returns {React.ReactElement} Study group list component
 */
const StudyGroupList = ({ onCreateGroup }) => {
  const { user } = useAuth();
  const studyGroup = useStudyGroup();
  
  const [loading, setLoading] = useState(true);
  const [myGroups, setMyGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('my-groups');
  
  // Load user's groups
  useEffect(() => {
    if (!user) return;
    
    const loadGroups = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!studyGroup.initialized) {
          await studyGroup.initialize(user.id);
        }
        
        // Get user's groups
        const groups = await studyGroup.getUserGroups();
        setMyGroups(groups);
      } catch (error) {
        console.error('Error loading groups:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your study groups',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadGroups();
  }, [user, studyGroup]);
  
  // Handle join group
  const handleJoinGroup = async (groupId) => {
    if (!user) return;
    
    try {
      // Join the group
      await studyGroup.joinGroup(groupId);
      
      // Refresh the groups
      const groups = await studyGroup.getUserGroups();
      setMyGroups(groups);
      
      toast({
        title: 'Success',
        description: 'You have joined the group',
      });
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to join the group',
        variant: 'destructive'
      });
    }
  };
  
  // Handle refresh groups
  const handleRefreshGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user's groups
      const groups = await studyGroup.getUserGroups();
      setMyGroups(groups);
      
      toast({
        title: 'Success',
        description: 'Groups refreshed',
      });
    } catch (error) {
      console.error('Error refreshing groups:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh groups',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter groups based on search query
  const filteredGroups = myGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Render loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleRefreshGroups}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onCreateGroup}>
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="my-groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>My Groups</span>
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Discover</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-groups">
          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroups.map(group => (
                <StudyGroupCard
                  key={group.id}
                  group={group}
                  onJoin={handleJoinGroup}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Groups Found</CardTitle>
                <CardDescription>
                  {searchQuery ? 'No groups match your search query' : 'You are not a member of any study groups yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={onCreateGroup}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Group
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="discover">
          <Card>
            <CardHeader>
              <CardTitle>Discover Study Groups</CardTitle>
              <CardDescription>
                Find public study groups to join
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-4">
                Discover feature coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyGroupList;
