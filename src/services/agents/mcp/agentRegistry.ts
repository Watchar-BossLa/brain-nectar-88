
import { BaseAgent } from './BaseAgent';
import { LearningPathAgent, learningPathAgent } from '../learning-path';

/**
 * AgentRegistry manages all agents in the system
 */
class AgentRegistry {
  private agents: Map<string, BaseAgent>;
  
  constructor() {
    this.agents = new Map<string, BaseAgent>();
  }
  
  /**
   * Register an agent in the registry
   */
  registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.id, agent);
    console.log(`Agent registered: ${agent.name} (${agent.id})`);
  }
  
  /**
   * Get an agent by ID
   */
  getAgent(id: string): BaseAgent | undefined {
    return this.agents.get(id);
  }
  
  /**
   * Initialize the registry with all available agents
   */
  initialize(): void {
    // Register the learning path agent
    // Cast to BaseAgent since we've updated LearningPathAgent to extend AbstractBaseAgent
    this.registerAgent(learningPathAgent as BaseAgent);
  }
}

// Export a singleton instance
export const agentRegistry = new AgentRegistry();

// Initialize the registry
agentRegistry.initialize();
