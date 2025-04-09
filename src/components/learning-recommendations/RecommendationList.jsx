import React, { useState, useEffect } from 'react';
import { useRecommendations } from '@/services/learning-recommendations';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Sparkles, RefreshCw, Tag, Zap, Star, Bookmark } from 'lucide-react';
import RecommendationCard from './RecommendationCard';

/**
 * Recommendation List Component
 * @param {Object} props - Component props
 * @param {Function} props.onViewContent - View content handler
 * @returns {React.ReactElement} Recommendation list component
 */
const RecommendationList = ({ onViewContent }) => {
  const { user } = useAuth();
  const recommendations = useRecommendations();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recommendationsList, setRecommendationsList] = useState([]);
  const [savedRecommendations, setSavedRecommendations] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Load recommendations
  useEffect(() => {
    if (!user) return;
    
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!recommendations.initialized) {
          await recommendations.initialize(user.id);
        }
        
        // Get recommendations
        const recs = await recommendations.getRecommendations();
        setRecommendationsList(recs);
        
        // Get saved recommendations
        const saved = await recommendations.getSavedRecommendations();
        setSavedRecommendations(saved);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recommendations',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [user, recommendations]);
  
  // Handle refresh recommendations
  const handleRefreshRecommendations = async () => {
    if (!user) return;
    
    try {
      setRefreshing(true);
      
      // Generate new recommendations
      await recommendations.generateRecommendations();
      
      // Get updated recommendations
      const recs = await recommendations.getRecommendations();
      setRecommendationsList(recs);
      
      toast({
        title: 'Success',
        description: 'Recommendations refreshed',
      });
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh recommendations',
        variant: 'destructive'
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  // Handle view recommendation
  const handleViewRecommendation = async (recommendationId) => {
    try {
      // Mark recommendation as viewed
      await recommendations.markAsViewed(recommendationId);
      
      // Find the recommendation
      const recommendation = recommendationsList.find(r => r.id === recommendationId) || 
                            savedRecommendations.find(r => r.id === recommendationId);
      
      if (recommendation && onViewContent) {
        onViewContent(recommendation.content_items);
      }
    } catch (error) {
      console.error('Error viewing recommendation:', error);
      toast({
        title: 'Error',
        description: 'Failed to view recommendation',
        variant: 'destructive'
      });
    }
  };
  
  // Handle save recommendation
  const handleSaveRecommendation = async (recommendationId) => {
    try {
      // Save recommendation
      await recommendations.saveRecommendation(recommendationId);
      
      // Update recommendation in list
      setRecommendationsList(prev => 
        prev.map(r => r.id === recommendationId ? { ...r, is_saved: true } : r)
      );
      
      // Get updated saved recommendations
      const saved = await recommendations.getSavedRecommendations();
      setSavedRecommendations(saved);
      
      toast({
        title: 'Success',
        description: 'Recommendation saved',
      });
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast({
        title: 'Error',
        description: 'Failed to save recommendation',
        variant: 'destructive'
      });
    }
  };
  
  // Handle dismiss recommendation
  const handleDismissRecommendation = async (recommendationId) => {
    try {
      // Dismiss recommendation
      await recommendations.dismissRecommendation(recommendationId);
      
      // Remove recommendation from list
      setRecommendationsList(prev => 
        prev.filter(r => r.id !== recommendationId)
      );
      
      toast({
        title: 'Success',
        description: 'Recommendation dismissed',
      });
    } catch (error) {
      console.error('Error dismissing recommendation:', error);
      toast({
        title: 'Error',
        description: 'Failed to dismiss recommendation',
        variant: 'destructive'
      });
    }
  };
  
  // Filter recommendations by type
  const getFilteredRecommendations = () => {
    if (activeTab === 'saved') {
      return savedRecommendations;
    }
    
    if (activeTab === 'all') {
      return recommendationsList;
    }
    
    return recommendationsList.filter(r => r.recommendation_type === activeTab);
  };
  
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
  
  const filteredRecommendations = getFilteredRecommendations();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Recommendations</h2>
        <Button 
          onClick={handleRefreshRecommendations} 
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="topic_based" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>Topics</span>
          </TabsTrigger>
          <TabsTrigger value="activity_based" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
          <TabsTrigger value="learning_style" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Style</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            <span>Saved</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab}>
          {filteredRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecommendations.map(recommendation => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onView={handleViewRecommendation}
                  onSave={handleSaveRecommendation}
                  onDismiss={handleDismissRecommendation}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Recommendations</CardTitle>
                <CardDescription>
                  {activeTab === 'saved' ? 
                    'You have not saved any recommendations yet' : 
                    'No recommendations available for this category'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab !== 'saved' && (
                  <Button onClick={handleRefreshRecommendations} disabled={refreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Generate Recommendations
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationList;
