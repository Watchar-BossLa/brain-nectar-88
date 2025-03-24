
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MultiAgentSystem, SystemState } from '@/services/agents';

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
          setSystemState(MultiAgentSystem.getSystemState());
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
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to submit tasks');
    }
    
    await MultiAgentSystem.submitTask(
      user.id,
      taskType as any,
      description,
      data,
      priority
    );
    
    // Update the system state
    setSystemState(MultiAgentSystem.getSystemState());
  };

  return {
    isInitialized,
    systemState,
    submitTask,
    TaskTypes: MultiAgentSystem.TaskTypes
  };
};
