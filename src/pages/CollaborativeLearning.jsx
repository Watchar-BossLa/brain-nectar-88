import React, { useState, useEffect } from 'react';
import { useCollaborativeNetwork, useGroupResources, useKnowledgeExchange, useRealTimeCollaboration, useSocialLearning } from '@/services/collaborative-network';
import { useAuth } from '@/context/auth';
import MainLayout from '@/components/layout/MainLayout';
import { StudyGroupList, StudyGroupDetails } from '@/components/collaborative-network';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  UserPlus, 
  Activity,
  Search,
  Plus
} from 'lucide-react';

/**
 * Collaborative Learning Page
 * Page for collaborative learning features
 * @returns {React.ReactElement} Collaborative learning page
 */
const CollaborativeLearning = () => {
  const { user } = useAuth();
  const collaborativeNetwork = useCollaborativeNetwork();
  const socialLearning = useSocialLearning();
  
  const [activeTab, setActiveTab] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activities, setActivities] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize services
  useEffect(() => {
    if (user) {
      const initializeServices = async () => {
        try {
          await collaborativeNetwork.initialize(user.id);
          await socialLearning.initialize(user.id);
        } catch (err) {
          console.error('Error initializing services:', err);
        }
      };
      
      initializeServices();
    }
  }, [user, collaborativeNetwork, socialLearning]);
  
  // Load activities and connections
  useEffect(() => {
    if (!user || !socialLearning.initialized) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load network activities
        const networkActivities = await socialLearning.getNetworkActivities();
        setActivities(networkActivities);
        
        // Load user connections
        const userConnections = await socialLearning.getUserConnections(user.id);
        setConnections(userConnections);
      } catch (err) {
        console.error('Error loading social data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [user, socialLearning]);
  
  // Handle group selection
  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };
  
  // Handle back from group details
  const handleBackFromGroup = () => {
    setSelectedGroup(null);
  };
  
  // Format activity content
  const formatActivityContent = (activity) => {
    switch (activity.activity_type) {
      case 'created_group':
        return `created a new study group: ${activity.content.group_name}`;
      case 'joined_group':
        return `joined the study group: ${activity.content.group_name}`;
      case 'shared_resource':
        return `shared a ${activity.content.resource_type} in a study group`;
      case 'created_study_session':
        return `started a new study session: ${activity.content.session_title}`;
      case 'asked_question':
        return `asked a question: ${activity.content.question_title}`;
      case 'answered_question':
        return `answered a question`;
      case 'created_connection':
        return `connected with another student`;
      default:
        return `performed an activity`;
    }
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-2">Collaborative Learning Network</h1>
        <p className="text-lg mb-6">
          Connect, collaborate, and learn together with other students
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {selectedGroup ? (
              <StudyGroupDetails 
                groupId={selectedGroup.id} 
                onBack={handleBackFromGroup}
              />
            ) : (
              <StudyGroupList onSelectGroup={handleSelectGroup} />
            )}
          </div>
          
          <div className="lg:col-span-1">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Activity</span>
                </TabsTrigger>
                <TabsTrigger value="connections" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Connections</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Activity</CardTitle>
                    <CardDescription>
                      Recent activity from your learning network
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activities.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Activity</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Join groups to see activity from your network.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start space-x-3 p-3 border rounded-md"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {activity.user?.avatar_url ? (
                                <img 
                                  src={activity.user.avatar_url} 
                                  alt={activity.user.username} 
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <Users className="h-4 w-4 text-primary" />
                              )}
                            </div>
                            <div>
                              <p>
                                <span className="font-medium">
                                  {activity.user?.username || 'Unknown user'}
                                </span>{' '}
                                {formatActivityContent(activity)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="connections">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Connections</CardTitle>
                    <CardDescription>
                      Students you've connected with
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {connections.length === 0 ? (
                      <div className="text-center py-8">
                        <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Connections</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Connect with other students to build your learning network.
                        </p>
                        <Button>
                          <Search className="h-4 w-4 mr-2" />
                          Find Study Buddies
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {connections.map((connection) => (
                          <div
                            key={connection.id}
                            className="flex items-center justify-between p-3 border rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                {connection.connected_user?.avatar_url ? (
                                  <img 
                                    src={connection.connected_user.avatar_url} 
                                    alt={connection.connected_user.username} 
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <Users className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {connection.connected_user?.username || connection.connected_user?.full_name || 'Unknown user'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {connection.connection_type}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Find Study Buddies
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CollaborativeLearning;
