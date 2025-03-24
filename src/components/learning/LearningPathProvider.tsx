
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userLearningPathService } from '@/services/learningPath/userLearningPathService';
import { useToast } from '@/hooks/use-toast';

// Define types for our learning path data
type LearningPathTopic = {
  id: string;
  title: string;
  description: string;
  position: number;
  status: 'not_started' | 'in_progress' | 'completed';
  mastery_level: number;
};

type LearningPathModule = {
  id: string;
  title: string;
  description: string;
  position: number;
  status: 'not_started' | 'in_progress' | 'completed';
  topics: LearningPathTopic[];
};

type LearningPath = {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'generating' | 'active' | 'archived';
  path_data: Record<string, any>;
  modules: LearningPathModule[];
};

type LearningPathContextType = {
  currentPath: LearningPath | null;
  isLoading: boolean;
  error: Error | null;
  refreshPath: () => Promise<void>;
  updateTopicProgress: (
    topicId: string, 
    status: 'not_started' | 'in_progress' | 'completed',
    masteryLevel: number
  ) => Promise<void>;
};

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export const LearningPathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Default qualification ID - in a real app, this might be selected by the user
  const DEFAULT_QUALIFICATION_ID = 'acca-qualification';
  
  const fetchLearningPath = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const path = await userLearningPathService.getUserLearningPath(
        user.id, 
        DEFAULT_QUALIFICATION_ID
      );
      
      setCurrentPath(path);
    } catch (err) {
      console.error('Error fetching learning path:', err);
      setError(err as Error);
      
      toast({
        title: 'Error',
        description: 'Failed to load your learning path. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateTopicProgress = async (
    topicId: string, 
    status: 'not_started' | 'in_progress' | 'completed',
    masteryLevel: number
  ) => {
    if (!user) return;
    
    try {
      await userLearningPathService.updateTopicProgress(
        user.id,
        topicId,
        status,
        masteryLevel
      );
      
      // Refresh the learning path to reflect the updates
      await fetchLearningPath();
      
      toast({
        title: 'Progress updated',
        description: 'Your learning progress has been saved.',
      });
    } catch (err) {
      console.error('Error updating topic progress:', err);
      
      toast({
        title: 'Error',
        description: 'Failed to update your progress. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Initialize learning path when the user changes
  useEffect(() => {
    if (user) {
      // First try to fetch existing learning path
      fetchLearningPath();
      
      // If no path exists, initialize one (the service will check if one exists)
      userLearningPathService.initializeForUser(user.id, DEFAULT_QUALIFICATION_ID)
        .catch(err => {
          console.error('Error initializing learning path:', err);
        });
    } else {
      setCurrentPath(null);
      setIsLoading(false);
    }
  }, [user]);
  
  return (
    <LearningPathContext.Provider value={{
      currentPath,
      isLoading,
      error,
      refreshPath: fetchLearningPath,
      updateTopicProgress
    }}>
      {children}
    </LearningPathContext.Provider>
  );
};

export const useLearningPath = () => {
  const context = useContext(LearningPathContext);
  if (context === undefined) {
    throw new Error('useLearningPath must be used within a LearningPathProvider');
  }
  return context;
};
