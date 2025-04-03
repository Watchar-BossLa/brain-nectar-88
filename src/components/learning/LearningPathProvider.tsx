
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { userLearningPathService } from '@/services/learningPath/userLearningPathService';

// Define types for the learning path
type LearningPathTopic = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  status: 'not_started' | 'in_progress' | 'completed';
  masteryLevel: number;
};

type LearningPathModule = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  status: 'not_started' | 'in_progress' | 'completed';
  topics: LearningPathTopic[];
};

type LearningPath = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'completed';
  pathData: Record<string, any>;
  modules: LearningPathModule[];
};

type LearningPathContextType = {
  currentPath: LearningPath | null;
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadLearningPath = async () => {
    if (!user) {
      setCurrentPath(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // This is a temporary implementation using a mock qualification ID
      // In a real implementation, we would get the user's selected qualification
      const mockQualificationId = '123';
      
      const path = await userLearningPathService.getUserLearningPath(user.id, mockQualificationId);
      setCurrentPath(path as LearningPath);
      setError(null);
    } catch (err) {
      console.error('Error loading learning path:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPath = async () => {
    await loadLearningPath();
  };

  const updateTopicProgress = async (
    topicId: string, 
    status: 'not_started' | 'in_progress' | 'completed',
    masteryLevel: number
  ) => {
    if (!user) return;
    
    try {
      await userLearningPathService.updateTopicProgress(user.id, topicId, status, masteryLevel);
      await refreshPath();
    } catch (err) {
      console.error('Error updating topic progress:', err);
      setError(err as Error);
    }
  };

  useEffect(() => {
    loadLearningPath();
  }, [user]);

  return (
    <LearningPathContext.Provider 
      value={{ 
        currentPath, 
        loading, 
        error, 
        refreshPath,
        updateTopicProgress
      }}
    >
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
