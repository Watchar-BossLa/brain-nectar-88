
import { AgentType, AgentTypeEnum } from '../types';
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
 * Acts as a factory and repository for agent instances.
 */
export function createAgentRegistry() {
  const agents = new Map<AgentType, BaseAgent>();
  
  // Initialize all agents
  function initializeAgents() {
    agents.set(AgentTypeEnum.COGNITIVE_PROFILE, new CognitiveProfileAgent());
    agents.set(AgentTypeEnum.LEARNING_PATH, new LearningPathAgent());
    agents.set(AgentTypeEnum.CONTENT_ADAPTATION, new ContentAdaptationAgent());
    agents.set(AgentTypeEnum.ASSESSMENT, new AssessmentAgent());
    agents.set(AgentTypeEnum.ENGAGEMENT, new EngagementAgent());
    agents.set(AgentTypeEnum.FEEDBACK, new FeedbackAgent());
    agents.set(AgentTypeEnum.UI_UX, new UiUxAgent());
    agents.set(AgentTypeEnum.SCHEDULING, new SchedulingAgent());
  }
  
  // Initialize agents on creation
  initializeAgents();
  
  return {
    /**
     * Get an agent by type
     * @param type The type of agent to retrieve
     * @returns The agent instance or undefined if not found
     */
    getAgent(type: AgentType): BaseAgent | undefined {
      return agents.get(type);
    },
    
    /**
     * Get all registered agent types
     * @returns Array of all registered agent types
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
