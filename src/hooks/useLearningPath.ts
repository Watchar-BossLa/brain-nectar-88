
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
      
      // In a real implementation, we'd get the user's selected qualification
      // For now, we'll use a mock qualification ID
      const mockQualificationId = 'acca-123';
      
      // Fetch the user's learning path
      const { data, error } = await supabase
        .from('learning_paths')
        .select(`
          id,
          created_at,
          updated_at,
          status,
          path_data,
          modules:learning_path_modules(
            id,
            title,
            description,
            position,
            status,
            topics:learning_path_topics(
              id,
              title,
              description,
              position,
              status,
              mastery
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('qualification_id', mockQualificationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        // If the learning path doesn't exist, fall back to a mock path for demo purposes
        console.log("No learning path found, using mock data");
        setCurrentPath(getMockLearningPath());
        setError(null);
      } else {
        setCurrentPath(data as unknown as LearningPath);
        setError(null);
      }
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
      // Update the topic in the database
      const { error } = await supabase
        .from('learning_path_topics')
        .update({
          status,
          mastery: masteryLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', topicId);
        
      if (error) {
        throw error;
      }
      
      // Update the local state
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
