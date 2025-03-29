
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight, Calendar, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface LearningPathVisualizationProps {
  learningPath: any;
  loading: boolean;
}

const LearningPathVisualization: React.FC<LearningPathVisualizationProps> = ({ 
  learningPath, 
  loading 
}) => {
  if (loading) {
    return <VisualizationSkeleton />;
  }

  if (!learningPath || !learningPath.modules || learningPath.modules.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="mb-4">No learning path available to visualize.</p>
          <Button>Select a qualification</Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall progress
  const totalTopics = learningPath.modules.reduce((acc: number, module: any) => acc + module.topics.length, 0);
  const completedTopics = learningPath.modules.reduce((acc: number, module: any) => 
    acc + module.topics.filter((topic: any) => topic.status === 'completed').length, 0);
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Learning Path Visualization</CardTitle>
          <CardDescription>
            Interactive view of your qualification journey and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Overall Progress Display */}
          <div className="mb-8 p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-medium mb-2">Overall Qualification Progress</h3>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{completedTopics}/{totalTopics} topics completed</span>
            </div>
            <Progress value={overallProgress} className="h-3 mb-4" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-background rounded-md border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed Modules</p>
                  <p className="font-medium">
                    {learningPath.modules.filter((m: any) => m.status === 'completed').length}/{learningPath.modules.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-md border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Estimated Time Remaining</p>
                  <p className="font-medium">
                    {Math.round((totalTopics - completedTopics) * 0.5)} hours
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background rounded-md border">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Target Completion</p>
                  <p className="font-medium">
                    {new Date(Date.now() + (totalTopics - completedTopics) * 0.5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Timeline Visualization */}
          <div className="mt-8 relative">
            <h3 className="text-lg font-medium mb-6">Learning Journey Timeline</h3>
            <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-border"></div>
            
            {learningPath.modules.map((module: any, index: number) => {
              // Calculate module progress
              const moduleProgress = module.topics.length > 0 
                ? Math.round((module.topics.filter((t: any) => t.status === 'completed').length / module.topics.length) * 100) 
                : 0;
                
              // Determine status color
              let statusColor = "bg-muted";
              if (module.status === 'completed') statusColor = "bg-green-500";
              else if (module.status === 'in_progress') statusColor = "bg-blue-500";
              else if (index === 0 || learningPath.modules[index-1]?.status === 'completed') statusColor = "bg-amber-500";

              return (
                <motion.div 
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="ml-10 mb-8 relative"
                >
                  {/* Timeline node */}
                  <div className={`absolute -left-14 top-4 w-8 h-8 rounded-full border-4 border-background ${statusColor} flex items-center justify-center z-10`}>
                    {module.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-xs text-white font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Module card */}
                  <Card className={`border-l-4 ${module.status === 'completed' ? 'border-l-green-500' : module.status === 'in_progress' ? 'border-l-blue-500' : 'border-l-muted'}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{module.title}</CardTitle>
                          <CardDescription>{module.topics.length} topics</CardDescription>
                        </div>
                        <Badge variant={module.status === 'completed' ? 'default' : 'secondary'}>
                          {module.status === 'completed' ? 'Completed' : module.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <div className="flex justify-between mb-1 text-xs">
                          <span>{moduleProgress}% complete</span>
                          <span>{module.topics.filter((t: any) => t.status === 'completed').length}/{module.topics.length} topics</span>
                        </div>
                        <Progress value={moduleProgress} className="h-2" />
                      </div>
                      
                      <div className="flex mt-4 justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{module.topics.length * 0.5} hours estimated</span>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs">
                          {module.status === 'completed' ? 'Review' : 'Start Learning'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Show connector to next module if not the last one */}
                  {index < learningPath.modules.length - 1 && (
                    <div className="flex justify-center my-3 -ml-10">
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const VisualizationSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full mb-6" />
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningPathVisualization;
