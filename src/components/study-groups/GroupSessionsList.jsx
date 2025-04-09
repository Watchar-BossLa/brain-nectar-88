import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroupSessions } from '@/services/study-groups';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Calendar, Clock, Users, Play, RefreshCw, Plus, ArrowRight } from 'lucide-react';

/**
 * Group Sessions List Component
 * @param {Object} props - Component props
 * @param {string} props.groupId - Group ID
 * @param {boolean} props.isAdmin - Whether the current user is an admin
 * @param {Function} props.onCreateSession - Create session handler
 * @returns {React.ReactElement} Group sessions list component
 */
const GroupSessionsList = ({ groupId, isAdmin, onCreateSession }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const groupSessions = useGroupSessions();
  
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  
  // Load group sessions
  useEffect(() => {
    if (!user || !groupId) return;
    
    const loadSessions = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!groupSessions.initialized) {
          await groupSessions.initialize(user.id);
        }
        
        // Get group sessions
        const sessionsList = await groupSessions.getGroupSessions(groupId);
        setSessions(sessionsList);
      } catch (error) {
        console.error('Error loading sessions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load group sessions',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSessions();
  }, [user, groupId, groupSessions]);
  
  // Handle refresh sessions
  const handleRefreshSessions = async () => {
    if (!user || !groupId) return;
    
    try {
      setLoading(true);
      
      // Get group sessions
      const sessionsList = await groupSessions.getGroupSessions(groupId);
      setSessions(sessionsList);
      
      toast({
        title: 'Success',
        description: 'Sessions list refreshed',
      });
    } catch (error) {
      console.error('Error refreshing sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh sessions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle start session
  const handleStartSession = async (sessionId) => {
    if (!user || !groupId) return;
    
    try {
      // Start the session
      await groupSessions.startSession(sessionId);
      
      // Refresh sessions
      const sessionsList = await groupSessions.getGroupSessions(groupId);
      setSessions(sessionsList);
      
      toast({
        title: 'Success',
        description: 'Session started',
      });
      
      // Navigate to session page
      navigate(`/study-groups/${groupId}/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error starting session:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to start session',
        variant: 'destructive'
      });
    }
  };
  
  // Handle join session
  const handleJoinSession = async (sessionId) => {
    if (!user || !groupId) return;
    
    try {
      // Join the session
      await groupSessions.joinSession(sessionId);
      
      toast({
        title: 'Success',
        description: 'Joined session',
      });
      
      // Navigate to session page
      navigate(`/study-groups/${groupId}/sessions/${sessionId}`);
    } catch (error) {
      console.error('Error joining session:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to join session',
        variant: 'destructive'
      });
    }
  };
  
  // Handle view session
  const handleViewSession = (sessionId) => {
    navigate(`/study-groups/${groupId}/sessions/${sessionId}`);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Scheduled
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Study Sessions</CardTitle>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-full mb-3" />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Filter sessions by status
  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const activeSessions = sessions.filter(s => s.status === 'in_progress');
  const pastSessions = sessions.filter(s => s.status === 'completed');
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Study Sessions
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefreshSessions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {(isAdmin || sessions.length === 0) && (
              <Button size="sm" onClick={onCreateSession}>
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Schedule and join study sessions with your group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Active Sessions */}
          {activeSessions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Active Sessions</h3>
              <div className="space-y-3">
                {activeSessions.map(session => (
                  <div key={session.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{session.name}</h4>
                      {getStatusBadge(session.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {session.description || 'No description'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Started {formatDate(session.actual_start)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{session.attendance_count || 0} attending</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => session.isAttending ? 
                          handleViewSession(session.id) : 
                          handleJoinSession(session.id)
                        }
                      >
                        {session.isAttending ? (
                          <>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            View
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Join
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Upcoming Sessions</h3>
              <div className="space-y-3">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{session.name}</h4>
                      {getStatusBadge(session.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                      {session.description || 'No description'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Scheduled for {formatDate(session.scheduled_start)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{session.scheduled_end ? 
                            `${Math.round((new Date(session.scheduled_end) - new Date(session.scheduled_start)) / (1000 * 60))} min` : 
                            'Duration not set'}</span>
                        </div>
                      </div>
                      {(isAdmin || session.created_by === user.id) ? (
                        <Button 
                          size="sm" 
                          onClick={() => handleStartSession(session.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewSession(session.id)}
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Past Sessions */}
          {pastSessions.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Past Sessions</h3>
              <div className="space-y-3">
                {pastSessions.slice(0, 3).map(session => (
                  <div key={session.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{session.name}</h4>
                      {getStatusBadge(session.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(session.actual_start)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{session.attendance_count || 0} attended</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewSession(session.id)}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
                {pastSessions.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/study-groups/${groupId}/sessions`)}
                  >
                    View All Past Sessions
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {sessions.length === 0 && (
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Sessions Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule your first study session to collaborate with group members
              </p>
              <Button onClick={onCreateSession}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Session
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupSessionsList;
