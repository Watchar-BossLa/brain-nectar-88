
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import { Module, LearningPathStats, LearningPathContextType, LearningPathProviderProps } from '@/types/learningPath';
import { learningPathDbService } from '@/services/database/learningPathDbService';

// Create context with default values
const DatabasedLearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

/**
 * Custom hook to use the learning path context
 */
export const useDatabasedLearningPath = () => {
  const context = useContext(DatabasedLearningPathContext);
  if (context === undefined) {
    throw new Error('useDatabasedLearningPath must be used within a DatabasedLearningPathProvider');
  }
  return context;
};

/**
 * Provider component for learning path data from database
 */
export const DatabasedLearningPathProvider: React.FC<LearningPathProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState<LearningPathStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch learning path data from the database
  const fetchLearningPath = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch modules with topics
      const { data, error: fetchError } = await learningPathDbService.getUserLearningPaths(user.id);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data) {
        setModules(data);
      }

      // Fetch statistics
      const statsData = await learningPathDbService.getLearningPathStats(user.id);
      if (statsData) {
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching learning path:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast({
        title: "Error",
        description: "Failed to load your learning path. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a new learning path
  const generateLearningPath = async (qualificationId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { success, error: genError } = await learningPathDbService.generateLearningPath(
        user.id,
        qualificationId
      );

      if (genError) {
        throw new Error(genError.message);
      }

      if (success) {
        toast({
          title: "Success",
          description: "Your learning path has been generated",
        });
        await fetchLearningPath();
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error generating learning path:', err);
      toast({
        title: "Error",
        description: "Failed to generate learning path. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Update topic progress
  const updateTopicProgress = async (topicId: string, progressPercentage: number): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error: updateError } = await learningPathDbService.updateTopicProgress(
        user.id,
        topicId,
        progressPercentage
      );

      if (updateError) {
        throw new Error(updateError.message);
      }

      // Refresh the learning path after updating progress
      await fetchLearningPath();
      return true;
    } catch (err) {
      console.error('Error updating topic progress:', err);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Fetch learning path when user changes
  useEffect(() => {
    fetchLearningPath();
  }, [user?.id]);

  // Context value
  const value: LearningPathContextType = {
    modules,
    isLoading,
    error,
    stats,
    generateLearningPath,
    updateTopicProgress,
    refreshLearningPath: fetchLearningPath
  };

  return (
    <DatabasedLearningPathContext.Provider value={value}>
      {children}
    </DatabasedLearningPathContext.Provider>
  );
};
