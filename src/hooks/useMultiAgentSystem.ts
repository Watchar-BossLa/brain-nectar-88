
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { MultiAgentSystem } from '@/services/agents';
import { useToast } from '@/components/ui/use-toast';
import { TaskType, SystemState, AgentType } from '@/services/agents/types';

export function useMultiAgentSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<Map<string, boolean>>(new Map());
  const [systemState, setSystemState] = useState<SystemState>({
    activeAgents: [] as AgentType[],
    globalVariables: {},
    metrics: {
      taskSuccessRate: 0.85,
      averageProcessingTime: 230,
      systemLoad: 0.92,
    },
    priorityMatrix: {}
  });
  
  // Define TaskTypes object for the component to use
  const TaskTypes = {
    COGNITIVE_PROFILING: 'COGNITIVE_PROFILING' as TaskType,
    LEARNING_PATH_GENERATION: 'LEARNING_PATH_GENERATION' as TaskType,
    CONTENT_ADAPTATION: 'CONTENT_ADAPTATION' as TaskType,
    ASSESSMENT_GENERATION: 'ASSESSMENT_GENERATION' as TaskType,
    ENGAGEMENT_OPTIMIZATION: 'ENGAGEMENT_OPTIMIZATION' as TaskType,
    FEEDBACK_GENERATION: 'FEEDBACK_GENERATION' as TaskType,
    SCHEDULE_OPTIMIZATION: 'SCHEDULE_OPTIMIZATION' as TaskType,
    UI_OPTIMIZATION: 'UI_OPTIMIZATION' as TaskType
  };
  
  /**
   * Initialize the multi-agent system for a user
   */
  const initializeForUser = async (userId: string) => {
    if (initialized || initializing) return true;
    
    try {
      setInitializing(true);
      await MultiAgentSystem.initialize(userId);
      setInitialized(true);
      updateAgentStatuses();
      return true;
    } catch (error) {
      console.error('Error initializing multi-agent system:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize the learning system.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setInitializing(false);
    }
  };
  
  /**
   * Update the agent statuses
   */
  const updateAgentStatuses = () => {
    const system = MultiAgentSystem.getInstance();
    setAgentStatuses(system.getAgentStatuses());
    
    // Update system state with proper type casting
    setSystemState({
      activeAgents: Array.from(system.getAgentStatuses().keys())
        .filter(key => system.getAgentStatuses().get(key))
        .map(key => key as AgentType),
      globalVariables: {},
      metrics: {
        taskSuccessRate: 0.85,
        averageProcessingTime: 230,
        systemLoad: 0.92,
      },
      priorityMatrix: {}
    });
  };
  
  /**
   * Check if the system is initialized
   */
  const isInitialized = () => {
    return initialized;
  };
  
  /**
   * Get the status of all agents
   */
  const getAgentStatuses = () => {
    return agentStatuses;
  };
  
  /**
   * Submit a task to the multi-agent system
   */
  const submitTask = async (taskType: TaskType, data: any = {}) => {
    if (!user || !initialized) {
      toast({
        title: 'System Not Ready',
        description: 'The learning system is not initialized yet.',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      const system = MultiAgentSystem.getInstance();
      const taskId = `task-${Date.now()}`;
      
      // In a real implementation, we would submit the task to the system
      // For now, we'll just log it
      console.log(`Submitting task ${taskType} with ID ${taskId}`, data);
      
      // Simulate a delay and response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        taskId,
        status: 'submitted',
        message: `Task ${taskType} submitted successfully`
      };
    } catch (error) {
      console.error(`Error submitting task ${taskType}:`, error);
      toast({
        title: 'Error',
        description: 'Failed to submit the task.',
        variant: 'destructive',
      });
      return null;
    }
  };
  
  /**
   * Generate learning recommendations
   */
  const generateRecommendations = async () => {
    return submitTask(TaskTypes.LEARNING_PATH_GENERATION);
  };
  
  /**
   * Generate cognitive profile
   */
  const generateCognitiveProfile = async () => {
    return submitTask(TaskTypes.COGNITIVE_PROFILING);
  };
  
  /**
   * Optimize study schedule
   */
  const optimizeStudySchedule = async (options: any) => {
    return submitTask(TaskTypes.SCHEDULE_OPTIMIZATION, options);
  };
  
  /**
   * Generate assessment
   */
  const generateAssessment = async (topicIds: string[]) => {
    return submitTask(TaskTypes.ASSESSMENT_GENERATION, { topicIds });
  };
  
  // Initialize the system when a user logs in
  useEffect(() => {
    if (user && !initialized && !initializing) {
      initializeForUser(user.id);
    }
  }, [user, initialized, initializing]);
  
  // Update agent statuses periodically
  useEffect(() => {
    if (initialized) {
      const interval = setInterval(updateAgentStatuses, 5000);
      return () => clearInterval(interval);
    }
  }, [initialized]);
  
  return {
    initializeForUser,
    isInitialized,
    getAgentStatuses,
    submitTask,
    generateRecommendations,
    generateCognitiveProfile,
    optimizeStudySchedule,
    generateAssessment,
    TaskTypes,
    systemState
  };
}
