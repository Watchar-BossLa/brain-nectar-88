
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight, Calendar, BookOpen, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface TopicInterface {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  mastery?: number;
  position: number;
}

interface ModuleInterface {
  id: string;
  title: string;
  description?: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  topics: TopicInterface[];
  position: number;
}

interface LearningPathInterface {
  id: string;
  modules: ModuleInterface[];
}

interface LearningPathVisualizationProps {
  learningPath: LearningPathInterface;
  loading: boolean;
}

const LearningPathVisualization: React.FC<LearningPathVisualizationProps> = ({ 
  learningPath, 
  loading 
}) => {
  const navigate = useNavigate();
  
  if (loading) {
    return <VisualizationSkeleton />;
  }

  // Added safety check
  if (!learningPath || !Array.isArray(learningPath.modules) || learningPath.modules.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <p className="mb-4">No learning path available to visualize.</p>
          <Button onClick={() => navigate('/qualifications')}>Select a qualification</Button>
        </CardContent>
      </Card>
    );
  }

  // Calculate overall progress with safety checks
  const totalTopics = learningPath.modules.reduce((acc, module) => 
    acc + (Array.isArray(module.topics) ? module.topics.length : 0), 0);
    
  const completedTopics = learningPath.modules.reduce((acc, module) => 
    acc + (Array.isArray(module.topics) 
      ? module.topics.filter(topic => topic.status === 'completed').length 
      : 0), 0);
      
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
                    {learningPath.modules.filter(m => m.status === 'completed').length}/{learningPath.modules.length}
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
            
            {learningPath.modules.map((module, index) => {
              if (!module || !Array.isArray(module.topics)) {
                return null;
              }
              
              // Calculate module progress
              const moduleProgress = module.topics.length > 0 
                ? Math.round((module.topics.filter(t => t.status === 'completed').length / module.topics.length) * 100) 
                : 0;
                
              // Determine status color
              let statusColor = "bg-muted";
              if (module.status === 'completed') statusColor = "bg-green-500";
              else if (module.status === 'in_progress') statusColor = "bg-blue-500";
              else if (index === 0 || (index > 0 && learningPath.modules[index-1]?.status === 'completed')) statusColor = "bg-amber-500";

              return (
                <motion.div 
                  key={module.id || `module-${index}`}
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
                          <CardTitle className="text-base">{module.title || `Module ${index + 1}`}</CardTitle>
                          <CardDescription>{module.topics?.length || 0} topics</CardDescription>
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
                          <span>{module.topics?.filter(t => t.status === 'completed').length || 0}/{module.topics?.length || 0} topics</span>
                        </div>
                        <Progress value={moduleProgress} className="h-2" />
                      </div>
                      
                      <div className="flex mt-4 justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{(module.topics?.length || 0) * 0.5} hours estimated</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          disabled={module.status === 'not_started' && index > 0 && learningPath.modules[index-1]?.status !== 'completed'}
                        >
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
