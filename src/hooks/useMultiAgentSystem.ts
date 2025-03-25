import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { MultiAgentSystem } from '@/services/agents';
import { useToast } from '@/hooks/use-toast';

export function useMultiAgentSystem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<Map<string, boolean>>(new Map());
  
  useEffect(() => {
    if (!user) return;
    
    const system = MultiAgentSystem.getInstance();
    
    // If system is already initialized for this user, update our state
    if (system.isInitialized() && system.getCurrentUserId() === user.id) {
      setInitialized(true);
      setAgentStatuses(system.getAgentStatuses());
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
  
  return {
    initialized,
    initializing,
    agentStatuses,
    refreshAgentStatuses
  };
}
