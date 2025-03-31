
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { masterControlProgram } from '@/services/agents/mcp/MasterControlProgram';
import {
  orchestrateContentReview,
  orchestrateFlashcardGeneration,
  orchestrateLearningPath,
  orchestrateQuizGeneration,
  orchestrateStudyPlan,
  orchestrateTutoring,
  initializeAgents
} from '@/services/agents/orchestration/agentOrchestrator';

export const useAgentOrchestration = () => {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [taskStatus, setTaskStatus] = useState<Record<string, string>>({});
  const [isEnabled, setIsEnabled] = useState(false);

  // Initialize orchestration system
  useEffect(() => {
    if (!initialized && user) {
      const success = initializeAgents();
      if (success) {
        setInitialized(true);
        const enabled = masterControlProgram.isLLMOrchestrationEnabled();
        setIsEnabled(enabled);
      }
    }
  }, [user, initialized]);

  // Generate flashcards based on learning content
  const generateFlashcards = async (content: string, count: number = 5) => {
    if (!user || !initialized) return null;
    
    try {
      const taskId = await orchestrateFlashcardGeneration(
        user.id, 
        ['auto'], 
        count,
        { sourceContent: content }
      );
      
      if (taskId) {
        setTaskStatus(prev => ({
          ...prev,
          [taskId]: 'pending'
        }));
      }
      
      return taskId;
    } catch (error) {
      console.error('Error generating flashcards:', error);
      return null;
    }
  };

  // Generate personalized learning path
  const generateLearningPath = async () => {
    if (!user || !initialized) return null;
    
    try {
      const taskId = await orchestrateLearningPath(user.id);
      
      if (taskId) {
        setTaskStatus(prev => ({
          ...prev,
          [taskId]: 'pending'
        }));
      }
      
      return taskId;
    } catch (error) {
      console.error('Error generating learning path:', error);
      return null;
    }
  };

  // Generate a study plan
  const generateStudyPlan = async (goalId: string, daysToGoal: number) => {
    if (!user || !initialized) return null;
    
    try {
      const taskId = await orchestrateStudyPlan(
        user.id,
        goalId,
        daysToGoal
      );
      
      if (taskId) {
        setTaskStatus(prev => ({
          ...prev,
          [taskId]: 'pending'
        }));
      }
      
      return taskId;
    } catch (error) {
      console.error('Error generating study plan:', error);
      return null;
    }
  };

  // Check task status
  const checkTaskStatus = async (taskId: string) => {
    if (!taskId) return null;
    
    try {
      const status = await masterControlProgram.getTaskStatus(taskId);
      
      if (status) {
        setTaskStatus(prev => ({
          ...prev,
          [taskId]: status
        }));
      }
      
      return status;
    } catch (error) {
      console.error('Error checking task status:', error);
      return null;
    }
  };

  // Get task result
  const getTaskResult = async (taskId: string) => {
    if (!taskId) return null;
    
    try {
      return await masterControlProgram.getTaskResult(taskId);
    } catch (error) {
      console.error('Error getting task result:', error);
      return null;
    }
  };

  // Toggle agent system
  const toggleAgentSystem = (enable?: boolean) => {
    const newValue = enable !== undefined ? enable : !isEnabled;
    masterControlProgram.setLLMOrchestrationEnabled(newValue);
    setIsEnabled(newValue);
  };

  return {
    initialized,
    isEnabled,
    generateFlashcards,
    generateLearningPath,
    generateStudyPlan,
    checkTaskStatus,
    getTaskResult,
    toggleAgentSystem,
    taskStatus
  };
};
