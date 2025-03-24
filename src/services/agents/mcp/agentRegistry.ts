
import { AgentType } from '../types';
import { BaseAgent } from '../baseAgent';
import { CognitiveProfileAgent } from '../cognitive-profile';
import { LearningPathAgent } from '../learning-path';
import { ContentAdaptationAgent } from '../content-adaptation';
import { AssessmentAgent } from '../assessment';
import { EngagementAgent } from '../engagement';
import { FeedbackAgent } from '../feedback';
import { UiUxAgent } from '../ui-ux';
import { SchedulingAgent } from '../scheduling';

/**
 * Agent Registry
 * 
 * Manages the creation and access to all specialized agents in the system.
 */
export function createAgentRegistry() {
  const agents = new Map<AgentType, BaseAgent>();
  
  // Initialize all agents
  function initializeAgents() {
    agents.set('COGNITIVE_PROFILE', new CognitiveProfileAgent());
    agents.set('LEARNING_PATH', new LearningPathAgent());
    agents.set('CONTENT_ADAPTATION', new ContentAdaptationAgent());
    agents.set('ASSESSMENT', new AssessmentAgent());
    agents.set('ENGAGEMENT', new EngagementAgent());
    agents.set('FEEDBACK', new FeedbackAgent());
    agents.set('UI_UX', new UiUxAgent());
    agents.set('SCHEDULING', new SchedulingAgent());
  }
  
  // Initialize agents on creation
  initializeAgents();
  
  return {
    /**
     * Get an agent by type
     */
    getAgent(type: AgentType): BaseAgent | undefined {
      return agents.get(type);
    },
    
    /**
     * Get all registered agent types
     */
    getRegisteredAgentTypes(): AgentType[] {
      return Array.from(agents.keys());
    },
    
    /**
     * Reset all agents (for testing or system reset)
     */
    resetAgents(): void {
      agents.clear();
      initializeAgents();
    }
  };
}
