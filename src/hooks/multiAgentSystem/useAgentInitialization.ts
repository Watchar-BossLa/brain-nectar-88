
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { useToast } from '@/hooks/use-toast';
import { MultiAgentSystem } from '@/services/agents';

/**
 * Hook for managing multi-agent system initialization
 */
export function useAgentInitialization() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);

  /**
   * Initialize the multi-agent system for a user
   */
  const initializeForUser = async (userId: string) => {
    if (initialized || initializing) return true;
    
    try {
      setInitializing(true);
      await MultiAgentSystem.initialize(userId);
      setInitialized(true);
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
   * Check if the system is initialized
   */
  const isInitialized = () => {
    return initialized;
  };

  return {
    user,
    initialized,
    initializing,
    initializeForUser,
    isInitialized
  };
}
