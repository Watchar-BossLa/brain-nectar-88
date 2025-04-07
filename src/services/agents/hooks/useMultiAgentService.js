import { useToast } from '@/hooks/use-toast';
import { MultiAgentSystem } from '../MultiAgentSystem';

/**
 * Hook to access the multi-agent system
 * @returns {Object} Multi-agent system methods
 */
export function useMultiAgentService() {
  const system = MultiAgentSystem.getInstance();
  const { toast } = useToast();
  
  /**
   * Initialize the multi-agent system for a user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  const initializeForUser = async (userId) => {
    try {
      await MultiAgentSystem.initialize(userId);
      return true;
    } catch (error) {
      console.error('Error initializing multi-agent system:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize the learning system.',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  /**
   * Get the status of all agents
   * @returns {Map<string, boolean>} Agent statuses
   */
  const getAgentStatuses = () => {
    return system.getAgentStatuses();
  };
  
  /**
   * Check if the system is initialized
   * @returns {boolean} Whether the system is initialized
   */
  const isInitialized = () => {
    return system.isInitialized();
  };
  
  /**
   * Get the current user ID
   * @returns {string|null} Current user ID
   */
  const getCurrentUserId = () => {
    return system.getCurrentUserId();
  };
  
  return {
    initializeForUser,
    getAgentStatuses,
    isInitialized,
    getCurrentUserId
  };
}
