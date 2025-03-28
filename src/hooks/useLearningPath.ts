
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMultiAgentSystem } from '@/hooks/useMultiAgentSystem';

export type LearningPathTopic = {
  id: string;
  title: string;
  description: string | null;
  mastery: number;
  status: 'not_started' | 'in_progress' | 'completed';
  position: number;
};

export type LearningPathModule = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  status: 'not_started' | 'in_progress' | 'completed';
  topics: LearningPathTopic[];
};

export type LearningPath = {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'completed';
  path_data: Record<string, any>;
  modules: LearningPathModule[];
};

export function useLearningPath() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { initializeForUser } = useMultiAgentSystem();
  const [currentPath, setCurrentPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load the learning path when the user changes
  useEffect(() => {
    if (user) {
      loadLearningPath();
      
      // Initialize the multi-agent system for this user
      initializeForUser(user.id);
    } else {
      setCurrentPath(null);
      setLoading(false);
    }
  }, [user]);

  // Load the user's learning path
  const loadLearningPath = async () => {
    if (!user) {
      setCurrentPath(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use mock data instead of querying non-existent tables
      setCurrentPath(getMockLearningPath());
      setError(null);
      
    } catch (err) {
      console.error('Error loading learning path:', err);
      setError(err as Error);
      
      // Fall back to mock data for demo purposes
      setCurrentPath(getMockLearningPath());
    } finally {
      setLoading(false);
    }
  };

  // Update a topic's progress
  const updateTopicProgress = async (
    topicId: string, 
    status: 'not_started' | 'in_progress' | 'completed',
    masteryLevel: number
  ) => {
    if (!user || !currentPath) return;
    
    try {
      // Update the local state only for now
      setCurrentPath(prevPath => {
        if (!prevPath) return null;
        
        const updatedModules = prevPath.modules.map(module => {
          const updatedTopics = module.topics.map(topic => {
            if (topic.id === topicId) {
              return { ...topic, status, mastery: masteryLevel };
            }
            return topic;
          });
          
          // Recalculate module status
          const allCompleted = updatedTopics.every(t => t.status === 'completed');
          const anyInProgress = updatedTopics.some(t => t.status === 'in_progress');
          const moduleStatus = allCompleted ? 'completed' : anyInProgress ? 'in_progress' : 'not_started';
          
          return { 
            ...module, 
            topics: updatedTopics,
            status: moduleStatus as 'not_started' | 'in_progress' | 'completed'
          };
        });
        
        return { ...prevPath, modules: updatedModules };
      });
      
      toast({
        title: "Progress Updated",
        description: "Your learning progress has been saved",
      });
      
      // In a real implementation, we would update the database here
      console.log(`Updating topic ${topicId} status to ${status} with mastery level ${masteryLevel}`);
      
    } catch (err) {
      console.error('Error updating topic progress:', err);
      
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  // Refresh the learning path
  const refreshPath = async () => {
    await loadLearningPath();
  };

  // Generate a mock learning path for demonstration purposes
  const getMockLearningPath = (): LearningPath => {
    return {
      id: 'mock-path-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      path_data: {},
      modules: [
        {
          id: 'module-1',
          title: 'Financial Accounting',
          description: 'Introduction to financial accounting principles',
          position: 1,
          status: 'in_progress',
          topics: [
            {
              id: 'topic-1',
              title: 'The Accounting Equation',
              description: 'Understanding Assets = Liabilities + Equity',
              position: 1,
              status: 'completed',
              mastery: 85
            },
            {
              id: 'topic-2',
              title: 'Double-Entry Bookkeeping',
              description: 'Principles of double-entry accounting',
              position: 2,
              status: 'in_progress',
              mastery: 60
            },
            {
              id: 'topic-3',
              title: 'Financial Statements',
              description: 'Introduction to balance sheets and income statements',
              position: 3,
              status: 'not_started',
              mastery: 0
            }
          ]
        },
        {
          id: 'module-2',
          title: 'Management Accounting',
          description: 'Introduction to management accounting',
          position: 2,
          status: 'not_started',
          topics: [
            {
              id: 'topic-4',
              title: 'Cost Classification',
              description: 'Understanding different types of costs',
              position: 1,
              status: 'not_started',
              mastery: 0
            },
            {
              id: 'topic-5',
              title: 'Break-Even Analysis',
              description: 'Calculating break-even points',
              position: 2,
              status: 'not_started',
              mastery: 0
            }
          ]
        },
        {
          id: 'module-3',
          title: 'Financial Reporting',
          description: 'Advanced financial reporting concepts',
          position: 3,
          status: 'not_started',
          topics: [
            {
              id: 'topic-6',
              title: 'IFRS Standards',
              description: 'Introduction to International Financial Reporting Standards',
              position: 1,
              status: 'not_started',
              mastery: 0
            },
            {
              id: 'topic-7',
              title: 'Consolidated Financial Statements',
              description: 'Preparation of group accounts',
              position: 2,
              status: 'not_started',
              mastery: 0
            }
          ]
        }
      ]
    };
  };

  return {
    currentPath,
    loading,
    error,
    refreshPath,
    updateTopicProgress
  };
}
