
import { supabase } from '@/integrations/supabase/client';
import { AgentMessage } from '../types';
import { CommunicationManager } from './communication';

/**
 * UserContextManager
 * 
 * Manages user-specific context and initialization.
 */
export class UserContextManager {
  private communicationManager: CommunicationManager;

  constructor(communicationManager: CommunicationManager) {
    this.communicationManager = communicationManager;
  }

  /**
   * Initialize the system for a specific user
   */
  public async initializeForUser(userId: string, setGlobalVariable: (key: string, value: any) => void): Promise<void> {
    console.log(`Initializing MCP for user: ${userId}`);
    
    // Set the user ID in the global variables
    setGlobalVariable('currentUserId', userId);
    
    // Notify all agents that we're initializing for a new user
    this.communicationManager.broadcastMessage({
      type: 'SYSTEM',
      content: 'INITIALIZE_FOR_USER',
      data: { userId },
      timestamp: new Date().toISOString(),
    });
    
    // Load user-specific data and preferences
    try {
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      } else if (profile) {
        setGlobalVariable('userProfile', profile);
      }
      
    } catch (error) {
      console.error('Error initializing user context:', error);
    }
  }
}
