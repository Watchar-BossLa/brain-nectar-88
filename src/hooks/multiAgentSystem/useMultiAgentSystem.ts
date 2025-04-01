
import { useEffect } from 'react';
import { TaskType } from '@/services/agents/types';
import { useAgentInitialization } from './useAgentInitialization';
import { useAgentStatus } from './useAgentStatus';
import { useTaskSubmission } from './useTaskSubmission';

/**
 * Main hook for interacting with the multi-agent system
 */
export function useMultiAgentSystem() {
  const { 
    user, 
    initialized, 
    initializing, 
    initializeForUser, 
    isInitialized 
  } = useAgentInitialization();
  
  const { 
    agentStatuses, 
    systemState, 
    updateAgentStatuses 
  } = useAgentStatus(initialized);
  
  const {
    submitTask,
    generateRecommendations,
    generateCognitiveProfile,
    optimizeStudySchedule,
    generateAssessment
  } = useTaskSubmission();

  // Initialize the system when a user logs in
  useEffect(() => {
    if (user && !initialized && !initializing) {
      initializeForUser(user.id);
    }
  }, [user, initialized, initializing]);

  return {
    // Initialization methods
    initializeForUser,
    isInitialized,
    
    // Status methods
    getAgentStatuses: () => agentStatuses,
    systemState,
    
    // Task submission methods
    submitTask,
    generateRecommendations,
    generateCognitiveProfile,
    optimizeStudySchedule,
    generateAssessment,
    
    // Expose TaskTypes for component usage
    TaskTypes: TaskType
  };
}
