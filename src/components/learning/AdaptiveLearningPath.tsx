import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, BookOpenIcon, CheckCircleIcon, BarChart2Icon, BrainIcon, FlaskConicalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Fix: Removed Motion, just use motion

interface Topic {
  id: string;
  title: string;
  description: string;
  module_id: string;
  order_index: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  qualification_id: string;
  order_index: number;
  topics?: Topic[];
}

interface Qualification {
  id: string;
  title: string;
  description: string;
}

interface UserProgress {
  topic_id: string;
  progress_percentage: number;
}

interface LearningPathItem {
  id: string;
  type: 'topic' | 'module';
  title: string;
  description: string;
  parent_id: string;
  order_index: number;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  recommendation_score: number;
  related_flashcards?: number;
}

const AdaptiveLearningPath = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [currentQualification, setCurrentQualification] = useState<string | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPathItem[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchQualifications = async () => {
      try {
        setLoading(true);
        
        // Fetch qualifications
        const { data: qualificationsData, error: qualificationsError } = await supabase
          .from('qualifications')
          .select('*')
          .order('title');
        
        if (qualificationsError) throw qualificationsError;
        
        if (qualificationsData && qualificationsData.length > 0) {
          setQualifications(qualificationsData);
          
          // Set the first qualification as default if none is selected
          if (!currentQualification) {
            setCurrentQualification(qualificationsData[0].id);
          }
        }
        
      } catch (error) {
        console.error('Error fetching qualifications:', error);
        toast({
          title: "Error",
          description: "Failed to load qualifications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQualifications();
  }, [user, toast, currentQualification]);

  useEffect(() => {
    if (!user || !currentQualification) return;

    const fetchLearningPath = async () => {
      try {
        setLoading(true);
        
        // Fetch modules for the current qualification
        const { data: modulesData, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .eq('qualification_id', currentQualification)
          .order('order_index');
        
        if (modulesError) throw modulesError;
        
        // Fetch topics for all modules
        let allTopics: Topic[] = [];
        if (modulesData && modulesData.length > 0) {
          for (const module of modulesData) {
            const { data: topicsData, error: topicsError } = await supabase
              .from('topics')
              .select('*')
              .eq('module_id', module.id)
              .order('order_index');
            
            if (topicsError) throw topicsError;
            
            if (topicsData) {
              allTopics = [...allTopics, ...topicsData];
            }
          }
        }
        
        // Fetch user progress
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('content_id, progress_percentage, status')
          .eq('user_id', user.id);
        
        if (progressError) throw progressError;
        
        // Fetch flashcard counts for topics
        const { data: flashcardData, error: flashcardError } = await supabase
          .from('flashcards')
          .select('topic_id, count(*)')
          .eq('user_id', user.id)
          .not('topic_id', 'is', null);
          // Fix: Removed the .group('topic_id') call
        
        if (flashcardError) throw flashcardError;
        
        // Process flashcard data
        const topicFlashcardCounts = new Map();
        flashcardData?.forEach(item => {
          topicFlashcardCounts.set(item.topic_id, item.count);
        });
        
        // Simple algorithm to calculate recommendation score
        // This would be much more sophisticated in a real system
        const calculateRecommendationScore = (topicId: string, progress: number) => {
          // Base score - inverse of progress (recommend less completed topics higher)
          let score = 100 - progress;
          
          // Bonus for topics with flashcards
          const flashcardCount = topicFlashcardCounts.get(topicId) || 0;
          score += flashcardCount * 5;
          
          // Cap at 100
          return Math.min(100, score);
        };
        
        // Create learning path items from topics
        const pathItems: LearningPathItem[] = allTopics.map(topic => {
          const progress = progressData?.find(p => p.content_id === topic.id)?.progress_percentage || 0;
          const status = progress === 0 ? 'not_started' : 
                       progress === 100 ? 'completed' : 'in_progress';
          const recommendationScore = calculateRecommendationScore(topic.id, progress);
          
          return {
            id: topic.id,
            type: 'topic',
            title: topic.title,
            description: topic.description || '',
            parent_id: topic.module_id,
            order_index: topic.order_index,
            progress: progress,
            status: status as any,
            recommendation_score: recommendationScore,
            related_flashcards: topicFlashcardCounts.get(topic.id) || 0
          };
        });
        
        // Sort by recommendation score (highest first)
        pathItems.sort((a, b) => b.recommendation_score - a.recommendation_score);
        
        setLearningPath(pathItems);
        
        // Calculate overall progress
        if (pathItems.length > 0) {
          const totalProgress = pathItems.reduce((sum, item) => sum + item.progress, 0);
          setOverallProgress(Math.round(totalProgress / pathItems.length));
        }
        
      } catch (error) {
        console.error('Error fetching learning path:', error);
        toast({
          title: "Error",
          description: "Failed to load your learning path.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPath();
  }, [user, toast, currentQualification]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Adaptive Learning Path</h2>
          <p className="text-muted-foreground">
            Personalized learning recommendations based on your progress
          </p>
        </div>
        
        <select
          className="border rounded-md px-3 py-2 bg-background"
          value={currentQualification || ''}
          onChange={(e) => setCurrentQualification(e.target.value)}
        >
          {qualifications.map(qual => (
            <option key={qual.id} value={qual.id}>{qual.title}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
          <Progress value={overallProgress} className="h-2" />
        </div>
        <div className="text-right">
          <span className="text-xl font-bold">{overallProgress}%</span>
        </div>
      </div>
      
      <Tabs defaultValue="recommended">
        <TabsList>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="all">All Topics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recommended">
          <div className="space-y-4 mt-4">
            {learningPath.slice(0, 5).map(item => (
              <PathItem key={item.id} item={item} />
            ))}
            
            {learningPath.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>No topics found for this qualification.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="inprogress">
          <div className="space-y-4 mt-4">
            {learningPath
              .filter(item => item.status === 'in_progress')
              .map(item => (
                <PathItem key={item.id} item={item} />
              ))}
            
            {learningPath.filter(item => item.status === 'in_progress').length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>You have no topics in progress.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all">
          <div className="space-y-4 mt-4">
            {learningPath
              .sort((a, b) => a.order_index - b.order_index)
              .map(item => (
                <PathItem key={item.id} item={item} />
              ))}
            
            {learningPath.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p>No topics found for this qualification.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Learning Path Item Component
const PathItem = ({ item }: { item: LearningPathItem }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${getStatusColor(item.status)}`}></div>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{item.title}</h3>
              <Badge variant="outline" className="text-xs">
                {item.status === 'not_started' ? 'Not Started' : 
                 item.status === 'in_progress' ? 'In Progress' : 
                 'Completed'}
              </Badge>
            </div>
            
            {item.description && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                {item.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <BrainIcon className="h-4 w-4" />
                <span>Score: {item.recommendation_score}</span>
              </div>
              
              {item.related_flashcards > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <BookOpenIcon className="h-4 w-4" />
                  <span>{item.related_flashcards} flashcards</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <BarChart2Icon className="h-4 w-4" />
                <span>{item.progress}% complete</span>
              </div>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="mt-1"
            onClick={() => navigate(`/courses?topic=${item.id}`)}
          >
            {item.status === 'not_started' ? 'Start' : 
             item.status === 'completed' ? 'Review' : 'Continue'}
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in_progress':
      return 'bg-blue-500';
    default:
      return 'bg-gray-300';
  }
}

export default AdaptiveLearningPath;
