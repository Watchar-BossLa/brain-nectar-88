import React, { useState, useEffect } from 'react';
import { useKnowledgeMap } from '@/services/knowledge-visualization';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Network, Search, Plus, RefreshCw } from 'lucide-react';
import KnowledgeMapCard from './KnowledgeMapCard';

/**
 * Knowledge Map List Component
 * @param {Object} props - Component props
 * @param {Function} props.onCreateMap - Create map handler
 * @returns {React.ReactElement} Knowledge map list component
 */
const KnowledgeMapList = ({ onCreateMap }) => {
  const { user } = useAuth();
  const knowledgeMap = useKnowledgeMap();
  
  const [loading, setLoading] = useState(true);
  const [maps, setMaps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('my-maps');
  
  // Load user's maps
  useEffect(() => {
    if (!user) return;
    
    const loadMaps = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!knowledgeMap.initialized) {
          await knowledgeMap.initialize(user.id);
        }
        
        // Get user's maps
        const userMaps = await knowledgeMap.getUserMaps();
        setMaps(userMaps);
      } catch (error) {
        console.error('Error loading maps:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your knowledge maps',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMaps();
  }, [user, knowledgeMap]);
  
  // Handle refresh maps
  const handleRefreshMaps = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user's maps
      const userMaps = await knowledgeMap.getUserMaps();
      setMaps(userMaps);
      
      toast({
        title: 'Success',
        description: 'Maps refreshed',
      });
    } catch (error) {
      console.error('Error refreshing maps:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh maps',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter maps based on search query
  const filteredMaps = maps.filter(map => 
    map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (map.description && map.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (map.tags && map.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  // Filter maps based on tab
  const ownedMaps = filteredMaps.filter(map => map.isOwner);
  const sharedMaps = filteredMaps.filter(map => !map.isOwner);
  
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
            placeholder="Search maps..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleRefreshMaps}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={onCreateMap}>
            <Plus className="h-4 w-4 mr-2" />
            Create Map
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="my-maps" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            <span>My Maps</span>
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Shared With Me</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-maps">
          {ownedMaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownedMaps.map(map => (
                <KnowledgeMapCard
                  key={map.id}
                  map={map}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Maps Found</CardTitle>
                <CardDescription>
                  {searchQuery ? 'No maps match your search query' : 'You have not created any knowledge maps yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={onCreateMap}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Map
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="shared">
          {sharedMaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sharedMaps.map(map => (
                <KnowledgeMapCard
                  key={map.id}
                  map={map}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Shared Maps</CardTitle>
                <CardDescription>
                  {searchQuery ? 'No shared maps match your search query' : 'No maps have been shared with you yet'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  When someone shares a knowledge map with you, it will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeMapList;
