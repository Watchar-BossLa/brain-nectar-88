import React, { useState, useEffect } from 'react';
import { useGroupMembers } from '@/services/study-groups';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Users, MoreVertical, Crown, UserMinus, UserPlus, RefreshCw, Shield } from 'lucide-react';

/**
 * Group Members List Component
 * @param {Object} props - Component props
 * @param {string} props.groupId - Group ID
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 * @returns {React.ReactElement} Group members list component
 */
const GroupMembersList = ({ groupId, isAdmin }) => {
  const { user } = useAuth();
  const groupMembers = useGroupMembers();
  
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  
  // Load group members
  useEffect(() => {
    if (!user || !groupId) return;
    
    const loadMembers = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!groupMembers.initialized) {
          await groupMembers.initialize(user.id);
        }
        
        // Get group members
        const membersList = await groupMembers.getGroupMembers(groupId);
        setMembers(membersList);
      } catch (error) {
        console.error('Error loading members:', error);
        toast({
          title: 'Error',
          description: 'Failed to load group members',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMembers();
  }, [user, groupId, groupMembers]);
  
  // Handle refresh members
  const handleRefreshMembers = async () => {
    if (!user || !groupId) return;
    
    try {
      setLoading(true);
      
      // Get group members
      const membersList = await groupMembers.getGroupMembers(groupId);
      setMembers(membersList);
      
      toast({
        title: 'Success',
        description: 'Members list refreshed',
      });
    } catch (error) {
      console.error('Error refreshing members:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh members',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle promote to admin
  const handlePromoteToAdmin = async (memberId) => {
    if (!user || !groupId || !isAdmin) return;
    
    try {
      // Update member role
      await groupMembers.updateMemberRole(groupId, memberId, 'admin');
      
      // Refresh members
      const membersList = await groupMembers.getGroupMembers(groupId);
      setMembers(membersList);
      
      toast({
        title: 'Success',
        description: 'Member promoted to admin',
      });
    } catch (error) {
      console.error('Error promoting member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to promote member',
        variant: 'destructive'
      });
    }
  };
  
  // Handle demote to member
  const handleDemoteToMember = async (memberId) => {
    if (!user || !groupId || !isAdmin) return;
    
    try {
      // Update member role
      await groupMembers.updateMemberRole(groupId, memberId, 'member');
      
      // Refresh members
      const membersList = await groupMembers.getGroupMembers(groupId);
      setMembers(membersList);
      
      toast({
        title: 'Success',
        description: 'Admin demoted to member',
      });
    } catch (error) {
      console.error('Error demoting member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to demote admin',
        variant: 'destructive'
      });
    }
  };
  
  // Handle remove member
  const handleRemoveMember = async (memberId) => {
    if (!user || !groupId || !isAdmin) return;
    
    try {
      // Remove member
      await groupMembers.removeMember(groupId, memberId);
      
      // Refresh members
      const membersList = await groupMembers.getGroupMembers(groupId);
      setMembers(membersList);
      
      toast({
        title: 'Success',
        description: 'Member removed from group',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove member',
        variant: 'destructive'
      });
    }
  };
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Members</CardTitle>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Members ({members.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefreshMembers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          {isAdmin ? 'Manage group members' : 'View group members'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {members.length > 0 ? (
          <div className="space-y-4">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} alt={member.fullName || member.username} />
                    <AvatarFallback>{getInitials(member.fullName || member.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.fullName || member.username}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {member.role === 'admin' ? (
                        <Badge variant="secondary" className="mr-2">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mr-2">
                          Member
                        </Badge>
                      )}
                      <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                {isAdmin && member.userId !== user.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.role === 'member' ? (
                        <DropdownMenuItem onClick={() => handlePromoteToAdmin(member.id)}>
                          <Crown className="h-4 w-4 mr-2" />
                          Promote to Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleDemoteToMember(member.id)}>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Demote to Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove from Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No members found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupMembersList;
