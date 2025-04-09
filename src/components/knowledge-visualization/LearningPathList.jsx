import React, { useState, useEffect } from 'react';
import { useLearningPath } from '@/services/knowledge-visualization';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Route, Search, Plus, RefreshCw, Network } from 'lucide-react';
import LearningPathCard from './LearningPathCard';

/**
 * Learning Path List Component
 * @param {Object} props - Component props
 * @param {Function} props.onCreatePath - Create path handler
 * @returns {React.ReactElement} Learning path list component
 */
const LearningPathList = ({ onCreatePath }) => {
  const { user } = useAuth();
  const learningPath = useLearningPath();
  
  const [loading, setLoading] = useState(true);
  const [paths, setPaths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all-paths');
  
  // Load user's paths
  useEffect(() => {
    if (!user) return;
    
    const loadPaths = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!learningPath.initialized) {
          await learningPath.initialize(user.id);
        }
        
        // Get user's paths
        const userPaths = await learningPath.getUserPaths();
        setPaths(userPaths);
      } catch (error) {
        console.error('Error loading paths:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your learning paths',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPaths();
  }, [user, learningPath]);
  
  // Handle refresh paths
  const handleRefreshPaths = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user's paths
      const userPaths = await learningPath.getUserPaths();
      setPaths(userPaths);
      
      toast({
        title: 'Success',
        description: 'Paths refreshed',
      });
    } catch (error) {
      console.error('Error refreshing paths:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh paths',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter paths based on search query
  const filteredPaths = paths.filter(path => 
    path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (path.description && path.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (path.knowledge_maps && path.knowledge_maps.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Filter paths based on tab
  const inProgressPaths = filteredPaths.filter(path => 
    path.progress && path.progress.status === 'in_progress'
  );
  
  const completedPaths = filteredPaths.filter(path => 
    path.progress && path.progress.status === 'completed'
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
            placeholder="Search paths..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleRefreshPaths}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onCreatePath}>
            <Plus className="h-4 w-4 mr-2" />
            Create Path
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all-paths" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span>All Paths</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            <span>In Progress</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            <span>Completed</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-paths">
          {filteredPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPaths.map(path => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Paths Found</CardTitle>
                <CardDescription>
                  {searchQuery ? 'No paths match your search query' : 'You have not created any learning paths yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={onCreatePath}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Path
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress">
          {inProgressPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressPaths.map(path => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Paths In Progress</CardTitle>
                <CardDescription>
                  {searchQuery ? 'No in-progress paths match your search query' : 'You have no learning paths in progress'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Start a learning path to track your progress.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedPaths.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedPaths.map(path => (
                <LearningPathCard
                  key={path.id}
                  path={path}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Completed Paths</CardTitle>
                <CardDescription>
                  {searchQuery ? 'No completed paths match your search query' : 'You have not completed any learning paths yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Complete a learning path to see it here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningPathList;
