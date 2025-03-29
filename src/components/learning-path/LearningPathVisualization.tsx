
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, BookOpen, Clock, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LearningPath, LearningPathModule } from '@/hooks/useLearningPath';

interface LearningPathVisualizationProps {
  learningPath: LearningPath | null;
  loading: boolean;
}

const LearningPathVisualization: React.FC<LearningPathVisualizationProps> = ({
  learningPath,
  loading
}) => {
  // Calculate total progress statistics
  const stats = useMemo(() => {
    if (!learningPath || !learningPath.modules) {
      return { 
        totalTopics: 0, 
        completedTopics: 0, 
        completedModules: 0, 
        totalModules: 0, 
        overallProgress: 0 
      };
    }

    const totalTopics = learningPath.modules.reduce((acc, module) => acc + module.topics.length, 0);
    const completedTopics = learningPath.modules.reduce((acc, module) => 
      acc + module.topics.filter(topic => topic.status === 'completed').length, 0);
    const completedModules = learningPath.modules.filter(m => m.status === 'completed').length;
    const totalModules = learningPath.modules.length;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return { totalTopics, completedTopics, completedModules, totalModules, overallProgress };
  }, [learningPath]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 w-full bg-muted rounded-md mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-24 w-full bg-muted rounded-md"></div>
              <div className="h-24 w-full bg-muted rounded-md"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!learningPath || !learningPath.modules || learningPath.modules.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-2">No Learning Path Available</h3>
          <p className="text-muted-foreground mb-4">
            Select a qualification to generate your personalized learning path
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Learning Path Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-medium">{stats.completedTopics}/{stats.totalTopics} topics completed</span>
            </div>
            <Progress value={stats.overallProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-md">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Modules</p>
                <p className="text-xl font-bold">
                  {stats.completedModules}/{stats.totalModules}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-md">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estimated Time Remaining</p>
                <p className="text-xl font-bold">
                  {Math.round((stats.totalTopics - stats.completedTopics) * 0.5)} hours
                </p>
              </div>
            </div>
          </div>

          {/* Path Timeline Visualization */}
          <div className="mt-8 space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-border">
            {learningPath.modules.map((module, index) => (
              <ModuleVisualizationItem key={module.id} module={module} index={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ModuleVisualizationItemProps {
  module: LearningPathModule;
  index: number;
}

const ModuleVisualizationItem: React.FC<ModuleVisualizationItemProps> = ({ module, index }) => {
  // Calculate module progress
  const topicsCount = module.topics.length;
  const completedTopics = module.topics.filter(t => t.status === 'completed').length;
  const progress = topicsCount > 0 ? Math.round((completedTopics / topicsCount) * 100) : 0;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-10"
    >
      <div className={`absolute left-0 top-1 h-8 w-8 rounded-full flex items-center justify-center ${getStatusColor(module.status)}`}>
        {module.status === 'completed' ? (
          <CheckCircle className="h-4 w-4" />
        ) : module.status === 'in_progress' ? (
          <BookOpen className="h-4 w-4" />
        ) : (
          <span className="text-sm">{index + 1}</span>
        )}
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{module.title}</h3>
            <Badge className={`${module.status === 'completed' ? 'bg-green-100 text-green-800' : 
                               module.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                               'bg-gray-100 text-gray-800'}`}>
              {module.status === 'completed' ? 'Completed' : 
               module.status === 'in_progress' ? 'In Progress' : 
               'Not Started'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{topicsCount * 30} min</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs">{completedTopics}/{topicsCount}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {module.topics.slice(0, 4).map((topic) => (
              <div 
                key={topic.id}
                className={`text-xs px-2 py-1 rounded-sm 
                  ${topic.status === 'completed' ? 'bg-green-50 text-green-700' : 
                   topic.status === 'in_progress' ? 'bg-blue-50 text-blue-700' : 
                   'bg-gray-50 text-gray-700'}`}
              >
                {topic.title.length > 20 ? `${topic.title.substring(0, 20)}...` : topic.title}
              </div>
            ))}
            {module.topics.length > 4 && (
              <div className="text-xs px-2 py-1 bg-gray-50 rounded-sm text-muted-foreground">
                +{module.topics.length - 4} more topics
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningPathVisualization;
