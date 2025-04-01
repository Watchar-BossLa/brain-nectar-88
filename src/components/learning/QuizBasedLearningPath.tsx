import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Book, Brain, Lightbulb, ArrowRight } from 'lucide-react';
import { generateLearningPath } from '@/services/learningPathService';
import { useNavigate } from 'react-router-dom';
import { LearningPath } from '@/types/learningPath';

const QuizBasedLearningPath: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [learningPath, setLearningPath] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchLearningPath = async () => {
      setLoading(true);
      try {
        // In a real app, you would get the qualification ID from user preferences or context
        const mockQualificationId = '123';
        const data = await generateLearningPath(user.id, [mockQualificationId]);
        
        if (data) {
          setLearningPath(data);
        }
      } catch (err) {
        console.error('Error in fetchLearningPath:', err);
        toast({
          title: 'Failed to load learning path',
          description: 'There was an error loading your personalized learning path',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchLearningPath();
  }, [user]);

  const navigateToTopic = (topicId: string) => {
    navigate(`/topic/${topicId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Learning Path</CardTitle>
          <CardDescription>Based on your quiz performance</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-4 bg-muted rounded"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!learningPath || !learningPath.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personalized Learning Path</CardTitle>
          <CardDescription>Based on your quiz performance</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="mb-4">Take more quizzes to get personalized learning recommendations</p>
          <Button onClick={() => navigate('/quiz')}>Go to Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  // Find modules with recommended topics
  const modulesWithRecommendations = learningPath.filter(
    (module: any) => module.topics.some((topic: any) => topic.recommended)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Personalized Learning Path
        </CardTitle>
        <CardDescription>
          Based on your recent quiz performance - focusing on areas that need improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {modulesWithRecommendations.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Great job! You're performing well in all areas.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate('/quiz')}>
              Take Another Quiz
            </Button>
          </div>
        ) : (
          modulesWithRecommendations.slice(0, 2).map((module: any) => (
            <div key={module.id} className="space-y-3">
              <h3 className="text-lg font-medium flex items-center">
                <Book className="h-5 w-5 mr-2" />
                {module.title}
              </h3>
              
              {module.topics
                .filter((topic: any) => topic.recommended)
                .slice(0, 3)
                .map((topic: any) => (
                  <div key={topic.id} className="rounded-lg border p-3 hover:bg-accent/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{topic.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {topic.description || "Improve your understanding of this topic"}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => navigateToTopic(topic.id)}
                      >
                        Study <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Mastery</span>
                        <span>{topic.mastery}%</span>
                      </div>
                      <Progress value={topic.mastery} className="h-1.5" />
                    </div>
                  </div>
                ))}
            </div>
          ))
        )}
        
        <div className="flex justify-center mt-4">
          <Button onClick={() => navigate('/learning-path')} variant="outline">
            View Full Learning Path
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizBasedLearningPath;
