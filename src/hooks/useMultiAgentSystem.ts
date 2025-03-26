import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { MultiAgentSystem } from '@/services/agents';
import { useToast } from '@/hooks/use-toast';
import { TaskType } from '@/services/agents/types';

export function useMultiAgentSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<Map<string, boolean>>(new Map());
  const [systemState, setSystemState] = useState<any>(null);
  
  // Define TaskTypes object for the component to use
  const TaskTypes = {
    COGNITIVE_PROFILING: 'COGNITIVE_PROFILING' as TaskType,
    LEARNING_PATH_GENERATION: 'LEARNING_PATH_GENERATION' as TaskType,
    CONTENT_ADAPTATION: 'CONTENT_ADAPTATION' as TaskType,
    ASSESSMENT_GENERATION: 'ASSESSMENT_GENERATION' as TaskType,
    ENGAGEMENT_OPTIMIZATION: 'ENGAGEMENT_OPTIMIZATION' as TaskType,
    FEEDBACK_GENERATION: 'FEEDBACK_GENERATION' as TaskType,
    UI_OPTIMIZATION: 'UI_OPTIMIZATION' as TaskType,
    SCHEDULE_OPTIMIZATION: 'SCHEDULE_OPTIMIZATION' as TaskType,
    FLASHCARD_OPTIMIZATION: 'FLASHCARD_OPTIMIZATION' as TaskType,
    MULTI_AGENT_COORDINATION: 'MULTI_AGENT_COORDINATION' as TaskType
  };
  
  useEffect(() => {
    if (!user) return;
    
    const system = MultiAgentSystem.getInstance();
    
    // If system is already initialized for this user, update our state
    if (system.isInitialized() && system.getCurrentUserId() === user.id) {
      setInitialized(true);
      setAgentStatuses(system.getAgentStatuses());
      
      // Mock system state for now until we have real data
      setSystemState({
        activeAgents: Array.from(system.getAgentStatuses().entries())
          .filter(([_, isActive]) => isActive)
          .map(([name]) => name),
        metrics: {
          taskCompletionRate: 0.85,
          averageResponseTime: 1.2,
          userSatisfactionScore: 4.2
        },
        priorityMatrix: {
          'COGNITIVE_PROFILING': 0.9,
          'LEARNING_PATH_GENERATION': 0.8,
          'ASSESSMENT_GENERATION': 0.7
        },
        globalVariables: {
          llmSystemAvailable: true,
          llmOrchestrationEnabled: true,
          recentLLMExecutions: 5
        }
      });
      
      return;
    }
    
    // Otherwise initialize the system
    const initializeSystem = async () => {
      if (initializing) return;
      
      try {
        setInitializing(true);
        await MultiAgentSystem.initialize(user.id);
        setInitialized(true);
        setAgentStatuses(system.getAgentStatuses());
        
        // Set initial system state
        setSystemState({
          activeAgents: Array.from(system.getAgentStatuses().entries())
            .filter(([_, isActive]) => isActive)
            .map(([name]) => name),
          metrics: {
            taskCompletionRate: 0.85,
            averageResponseTime: 1.2,
            userSatisfactionScore: 4.2
          },
          priorityMatrix: {
            'COGNITIVE_PROFILING': 0.9,
            'LEARNING_PATH_GENERATION': 0.8,
            'ASSESSMENT_GENERATION': 0.7
          },
          globalVariables: {
            llmSystemAvailable: true,
            llmOrchestrationEnabled: true,
            recentLLMExecutions: 5
          }
        });
        
      } catch (error) {
        console.error('Error initializing multi-agent system:', error);
        toast({
          title: 'Agent System Error',
          description: 'Failed to initialize the learning system.',
          variant: 'destructive',
        });
      } finally {
        setInitializing(false);
      }
    };
    
    initializeSystem();
  }, [user, toast, initializing]);
  
  // Get the latest agent statuses
  const refreshAgentStatuses = () => {
    const system = MultiAgentSystem.getInstance();
    if (system.isInitialized()) {
      setAgentStatuses(system.getAgentStatuses());
    }
  };
  
  // Submit a task to the system
  const submitTask = async (
    taskType: TaskType,
    description: string,
    taskData: any,
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
  ) => {
    if (!user) return;
    
    try {
      console.log(`Submitting task: ${taskType} - ${description}`);
      // This would call the actual task submission in a real implementation
      toast({
        title: 'Task Submitted',
        description: `Task ${description} has been submitted.`,
      });
      return true;
    } catch (error) {
      console.error('Error submitting task:', error);
      toast({
        title: 'Task Submission Failed',
        description: 'Failed to submit the task.',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  return {
    isInitialized: initialized,
    initializing,
    agentStatuses,
    refreshAgentStatuses,
    systemState,
    submitTask,
    TaskTypes
  };
}
