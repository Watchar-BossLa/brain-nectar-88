
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { generateLearningPath, getUserLearningPaths } from '@/services/learningPathService';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, BookOpen, GraduationCap, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const AdaptiveLearningPath = ({ qualificationId }: { qualificationId?: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePath, setActivePath] = useState<any>(null);
  const [learningPaths, setLearningPaths] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchLearningPaths();
    }
  }, [user]);

  const fetchLearningPaths = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await getUserLearningPaths(user.id);
    
    if (error) {
      console.error('Error fetching learning paths:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your learning paths. Please try again.',
        variant: 'destructive',
      });
    } else if (data && data.length > 0) {
      setLearningPaths(data);
      setActivePath(data[0]); // Set the most recent plan as active
    }
    
    setIsLoading(false);
  };

  const handleGeneratePath = async () => {
    if (!user || !qualificationId) {
      toast({
        title: 'Error',
        description: 'Please select a qualification first.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGenerating(true);
    const { data, error } = await generateLearningPath(user.id, qualificationId);
    
    if (error) {
      console.error('Error generating learning path:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate a learning path. Please try again.',
        variant: 'destructive',
      });
    } else if (data) {
      toast({
        title: 'Success',
        description: 'Your personalized learning path has been created.',
      });
      fetchLearningPaths(); // Refresh the list after generating
    }
    
    setIsGenerating(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Learning Path</h2>
        <Button 
          onClick={handleGeneratePath}
          disabled={isGenerating || !qualificationId}
          size="sm"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Path
            </>
          )}
        </Button>
      </div>

      {learningPaths.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Learning Path Available</CardTitle>
            <CardDescription>
              Generate a personalized learning path to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Your adaptive learning path will be tailored to your progress and strengths.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleGeneratePath}
              disabled={isGenerating || !qualificationId}
            >
              {isGenerating ? 'Generating...' : 'Generate Learning Path'}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs defaultValue={activePath?.id} onValueChange={(value) => {
          const selected = learningPaths.find(path => path.id === value);
          if (selected) setActivePath(selected);
        }}>
          <TabsList className="mb-4">
            {learningPaths.map((path) => (
              <TabsTrigger key={path.id} value={path.id}>
                {path.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {learningPaths.map((path) => (
            <TabsContent key={path.id} value={path.id} className="space-y-4">
              {/* Path overview card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    {path.qualification?.title || 'Learning Path'}
                  </CardTitle>
                  <CardDescription>
                    Created {new Date(path.created_at).toLocaleDateString()}
                    {path.description && ` • ${path.description}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span className="font-medium">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              {/* Recommended modules and topics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recommended Study Plan</h3>
                
                {[1, 2, 3].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover-scale subtle-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Module {index}</CardTitle>
                        <CardDescription>
                          {index === 1 ? 'Financial Reporting' : 
                           index === 2 ? 'Audit and Assurance' : 'Taxation'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[1, 2].map((topicIndex) => (
                            <div key={`${index}-${topicIndex}`} className="flex items-center gap-3">
                              <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">
                                    Topic {topicIndex}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {Math.floor(Math.random() * 100)}% Mastery
                                  </span>
                                </div>
                                <Progress value={Math.floor(Math.random() * 100)} className="h-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">
                          Start Learning
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default AdaptiveLearningPath;
