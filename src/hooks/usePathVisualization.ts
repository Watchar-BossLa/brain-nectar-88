
import { useState, useMemo, useCallback } from 'react';
import { useLearningPath, LearningPath, LearningPathModule } from '@/hooks/useLearningPath';
import { useToast } from '@/hooks/use-toast';

export interface PathAnalytics {
  totalTopics: number;
  completedTopics: number;
  overallProgress: number;
  estimatedTimeRemaining: number;
  completedModules: number;
  totalModules: number;
  targetCompletionDate: Date;
}

export function usePathVisualization() {
  const { currentPath, loading, error, refreshPath } = useLearningPath();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const analytics = useMemo<PathAnalytics>(() => {
    if (!currentPath || !Array.isArray(currentPath.modules)) {
      return {
        totalTopics: 0,
        completedTopics: 0,
        overallProgress: 0,
        estimatedTimeRemaining: 0,
        completedModules: 0,
        totalModules: 0,
        targetCompletionDate: new Date()
      };
    }

    // Calculate topics with safety checks
    const totalTopics = currentPath.modules.reduce((acc, module) => 
      acc + (Array.isArray(module.topics) ? module.topics.length : 0), 0);
      
    const completedTopics = currentPath.modules.reduce((acc, module) => 
      acc + (Array.isArray(module.topics) 
        ? module.topics.filter(topic => topic.status === 'completed').length 
        : 0), 0);
        
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const estimatedTimeRemaining = Math.round((totalTopics - completedTopics) * 0.5);
    const completedModules = currentPath.modules.filter(m => m.status === 'completed').length;
    const totalModules = currentPath.modules.length;
    
    // Calculate target completion date
    const targetCompletionDate = new Date();
    targetCompletionDate.setDate(targetCompletionDate.getDate() + Math.max(1, estimatedTimeRemaining));

    return {
      totalTopics,
      completedTopics,
      overallProgress,
      estimatedTimeRemaining,
      completedModules,
      totalModules,
      targetCompletionDate
    };
  }, [currentPath]);

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refreshPath();
      toast({
        title: "Learning path refreshed",
        description: "Your learning path has been updated with the latest data.",
      });
    } catch (err) {
      console.error('Error refreshing path:', err);
      toast({
        title: "Refresh failed",
        description: "Could not refresh your learning path. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshPath, toast]);

  const getModuleAnalytics = useCallback((module: LearningPathModule) => {
    if (!module || !Array.isArray(module.topics)) {
      return { progress: 0, completedTopics: 0, totalTopics: 0 };
    }

    const totalTopics = module.topics.length;
    const completedTopics = module.topics.filter(t => t.status === 'completed').length;
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return { progress, completedTopics, totalTopics };
  }, []);

  return {
    path: currentPath,
    loading: loading || isRefreshing,
    isRefreshing,
    error,
    analytics,
    handleRefresh,
    getModuleAnalytics
  };
}
