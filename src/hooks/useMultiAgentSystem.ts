
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { MultiAgentSystem, TaskType } from '@/services/agents';
import { mcp } from '@/services/agents/mcp';

// Define the SystemState interface here since it's missing from the export
interface SystemState {
  activeAgents: string[];
  metrics: {
    taskCompletionRate: number;
    averageResponseTime: number;
    userSatisfactionScore: number;
    [key: string]: number;
  };
  priorityMatrix?: Record<string, number>;
  globalVariables?: Record<string, any>;
}

/**
 * Hook to access the multi-agent system
 */
export const useMultiAgentSystem = () => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemState, setSystemState] = useState<SystemState | null>(null);

  // Initialize the multi-agent system when a user signs in
  useEffect(() => {
    if (user && !isInitialized) {
      console.log('Initializing multi-agent system for user:', user.id);
      
      MultiAgentSystem.initialize(user.id)
        .then(() => {
          setIsInitialized(true);
          // Get system state from MCP instead
          setSystemState(mcp.getSystemState());
        })
        .catch(error => {
          console.error('Error initializing multi-agent system:', error);
        });
    } else if (!user) {
      setIsInitialized(false);
      setSystemState(null);
    }
  }, [user, isInitialized]);

  /**
   * Submit a task to the multi-agent system
   */
  const submitTask = async (
    taskType: string,
    description: string,
    data: Record<string, any> = {},
    priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM'
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to submit tasks');
    }
    
    await MultiAgentSystem.submitTask(
      user.id,
      taskType as TaskType,
      description,
      data,
      priority
    );
    
    // Update the system state from MCP
    setSystemState(mcp.getSystemState());
  };

  // Define task types directly in the hook
  const TaskTypes = {
    LEARNING_PATH_GENERATION: 'LEARNING_PATH_GENERATION' as TaskType,
    TOPIC_MASTERY_ASSESSMENT: 'TOPIC_MASTERY_ASSESSMENT' as TaskType,
    LEARNING_PATH_UPDATE: 'LEARNING_PATH_UPDATE' as TaskType,
  };

  return {
    isInitialized,
    systemState,
    submitTask,
    TaskTypes
  };
};
