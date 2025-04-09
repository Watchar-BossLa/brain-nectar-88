import React, { useState, useEffect } from 'react';
import { useAICoachInsight } from '@/services/ai-coach';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { 
  Lightbulb, 
  BarChart, 
  CheckCircle2,
  Loader2,
  Brain,
  Clock,
  Calendar,
  BookOpen,
  RefreshCw
} from 'lucide-react';

/**
 * Learning Insights Card Component
 * Displays personalized learning insights and recommendations
 * @returns {React.ReactElement} Learning insights card component
 */
const LearningInsightsCard = () => {
  const { user } = useAuth();
  const aiCoachInsight = useAICoachInsight();
  
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load recommendations
  useEffect(() => {
    if (!user) return;
    
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        
        // Initialize service if needed
        if (!aiCoachInsight.initialized) {
          await aiCoachInsight.initialize(user.id);
        }
        
        // Load active recommendations
        const userRecommendations = await aiCoachInsight.getUserRecommendations(null, true);
        setRecommendations(userRecommendations);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load learning insights',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [user, aiCoachInsight]);
  
  // Handle viewing recommendation details
  const handleViewDetails = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setDetailsOpen(true);
  };
  
  // Handle applying a recommendation
  const handleApplyRecommendation = async (recommendationId) => {
    try {
      await aiCoachInsight.markRecommendationAsApplied(recommendationId);
      
      // Update recommendations list
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId));
      
      // Close details dialog if open
      if (selectedRecommendation && selectedRecommendation.id === recommendationId) {
        setDetailsOpen(false);
        setSelectedRecommendation(null);
      }
      
      toast({
        title: 'Recommendation Applied',
        description: 'The recommendation has been applied successfully',
      });
    } catch (error) {
      console.error('Error applying recommendation:', error);
      toast({
        title: 'Action Failed',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    }
  };
  
  // Handle refreshing recommendations
  const handleRefreshRecommendations = async () => {
    try {
      setRefreshing(true);
      
      // Generate new recommendations from insights
      await aiCoachInsight.generateRecommendationsFromInsights();
      
      // Reload recommendations
      const userRecommendations = await aiCoachInsight.getUserRecommendations(null, true);
      setRecommendations(userRecommendations);
      
      toast({
        title: 'Insights Refreshed',
        description: 'Your learning insights have been refreshed',
      });
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      toast({
        title: 'Refresh Failed',
        description: error.message || 'An error occurred while refreshing insights',
        variant: 'destructive'
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  // Get recommendation icon
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'schedule_optimization':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'session_optimization':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'learning_style_optimization':
        return <Brain className="h-5 w-5 text-purple-500" />;
      case 'subject_focus':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
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
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Learning Insights</CardTitle>
            <CardDescription>
              Personalized recommendations based on your learning patterns
            </CardDescription>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefreshRecommendations}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {!refreshing && 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Insights Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Continue studying and we'll generate personalized insights based on your learning patterns.
            </p>
            <Button 
              onClick={handleRefreshRecommendations}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleViewDetails(recommendation)}
              >
                <div className="flex items-start space-x-3">
                  {getRecommendationIcon(recommendation.recommendation_type)}
                  <div>
                    <h3 className="font-medium">{recommendation.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recommendation.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyRecommendation(recommendation.id);
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(recommendation);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
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
          onClick={() => {
            // TODO: Implement learning analytics
            toast({
              title: 'Learning Analytics',
              description: 'This feature is not yet implemented',
            });
          }}
        >
          <BarChart className="h-4 w-4 mr-2" />
          View Learning Analytics
        </Button>
      </CardFooter>
      
      {/* Recommendation Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          {selectedRecommendation && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedRecommendation.title}</DialogTitle>
                <DialogDescription>
                  Personalized recommendation based on your learning data
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex items-start space-x-3">
                  {getRecommendationIcon(selectedRecommendation.recommendation_type)}
                  <p className="text-sm">
                    {selectedRecommendation.description}
                  </p>
                </div>
                
                {selectedRecommendation.recommendation_type === 'learning_style_optimization' && 
                 selectedRecommendation.recommendation_data.strategies && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Recommended Strategies:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {selectedRecommendation.recommendation_data.strategies.map((strategy, index) => (
                        <li key={index}>{strategy}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedRecommendation.recommendation_type === 'schedule_optimization' && (
                  <div className="bg-muted p-3 rounded text-sm">
                    <p className="font-medium">Best Time to Study:</p>
                    <p className="capitalize">{selectedRecommendation.recommendation_data.mostProductiveTime}</p>
                  </div>
                )}
                
                {selectedRecommendation.recommendation_type === 'session_optimization' && (
                  <div className="bg-muted p-3 rounded text-sm">
                    <p className="font-medium">Optimal Session Duration:</p>
                    <p>{selectedRecommendation.recommendation_data.durationMinutes} minutes</p>
                  </div>
                )}
                
                {selectedRecommendation.recommendation_type === 'subject_focus' && (
                  <div className="bg-muted p-3 rounded text-sm">
                    <p className="font-medium">Focus Subject:</p>
                    <p>{selectedRecommendation.recommendation_data.subject}</p>
                  </div>
                )}
                
                <div className="bg-primary/10 p-3 rounded text-sm">
                  <p className="text-primary font-medium">Why this matters:</p>
                  <p className="mt-1">
                    {selectedRecommendation.recommendation_type === 'schedule_optimization' && 
                      'Studying during your most productive hours can significantly improve retention and focus.'}
                    {selectedRecommendation.recommendation_type === 'session_optimization' && 
                      'Optimizing your study session length helps maintain focus and prevents burnout.'}
                    {selectedRecommendation.recommendation_type === 'learning_style_optimization' && 
                      'Using techniques that match your learning style can improve comprehension and retention.'}
                    {selectedRecommendation.recommendation_type === 'subject_focus' && 
                      'Focusing on areas that need improvement helps balance your knowledge and skills.'}
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button 
                  onClick={() => handleApplyRecommendation(selectedRecommendation.id)}
                >
                  Apply Recommendation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LearningInsightsCard;
