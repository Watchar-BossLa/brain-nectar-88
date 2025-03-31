
import { BaseAgent } from './BaseAgent';

// Registry to store agent instances
const registry = new Map<string, BaseAgent>();

// Export createAgentRegistry function for compatibility with existing code
export function createAgentRegistry() {
  return agentRegistry;
}

// Create the agent registry singleton
export const agentRegistry = {
  /**
   * Register an agent in the registry
   */
  registerAgent(agent: BaseAgent): void {
    registry.set(agent.id, agent);
  },

  /**
   * Get an agent by ID
   */
  getAgent(agentId: string): BaseAgent | undefined {
    return registry.get(agentId);
  },

  /**
   * Get all registered agents
   */
  getAllAgents(): BaseAgent[] {
    return Array.from(registry.values());
  },

  /**
   * Get agents by type
   */
  getAgentsByType(type: string): BaseAgent[] {
    return Array.from(registry.values()).filter(agent => agent.type === type);
  },

  /**
   * Remove an agent from the registry
   */
  removeAgent(agentId: string): boolean {
    return registry.delete(agentId);
  },

  /**
   * Clear the registry
   */
  clear(): void {
    registry.clear();
  }
};
