
import { useState, useEffect } from 'react';
import { MultiAgentSystem } from '@/services/agents';
import { AgentType } from '@/services/agents/types';
import { AgentSystemState } from './types';

/**
 * Hook for managing agent statuses
 */
export function useAgentStatus(initialized: boolean) {
  const [agentStatuses, setAgentStatuses] = useState<Map<string, boolean>>(new Map());
  const [systemState, setSystemState] = useState<AgentSystemState>({
    activeAgents: {} as Record<AgentType, boolean>,
    taskQueue: [],
    completedTasks: [],
    metrics: {
      completedTasks: 0,
      averageResponseTime: 230,
      successRate: 0.85,
      taskCompletionRate: 0.85
    },
    globalVariables: {},
    priorityMatrix: {},
    lastUpdated: new Date().toISOString()
  });

  /**
   * Update agent statuses from the MultiAgentSystem
   */
  const updateAgentStatuses = () => {
    const system = MultiAgentSystem.getInstance();
    setAgentStatuses(system.getAgentStatuses());
    
    // Create a proper object for activeAgents
    const agentStatusMap = {} as Record<AgentType, boolean>;
    Array.from(system.getAgentStatuses().keys()).forEach(key => {
      agentStatusMap[key as AgentType] = system.getAgentStatuses().get(key) || false;
    });
    
    // Update system state with proper type casting
    setSystemState({
      activeAgents: agentStatusMap,
      taskQueue: [],
      completedTasks: [],
      metrics: {
        completedTasks: 0,
        averageResponseTime: 230,
        successRate: 0.85,
        taskCompletionRate: 0.85
      },
      globalVariables: {},
      priorityMatrix: {},
      lastUpdated: new Date().toISOString()
    });
  };

  // Update agent statuses periodically when initialized
  useEffect(() => {
    if (initialized) {
      updateAgentStatuses();
      const interval = setInterval(updateAgentStatuses, 5000);
      return () => clearInterval(interval);
    }
  }, [initialized]);

  return {
    agentStatuses,
    systemState,
    updateAgentStatuses
  };
}
