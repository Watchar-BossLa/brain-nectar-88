
import { CognitiveProfileAgent } from '../cognitive-profile';
import { LearningPathAgent } from '../learning-path';
import { UiUxAgent } from '../ui-ux';
import { agentRegistry } from '../mcp/agentRegistry';

/**
 * Initialize all required agents
 */
export function initializeAgents(): void {
  // Create and register all agents
  const cognitiveProfileAgent = new CognitiveProfileAgent();
  const learningPathAgent = new LearningPathAgent();
  const uiUxAgent = new UiUxAgent();
  
  // Register the agents
  agentRegistry.registerAgent(cognitiveProfileAgent);
  agentRegistry.registerAgent(learningPathAgent);
  agentRegistry.registerAgent(uiUxAgent);
  
  console.log(`Initialized ${agentRegistry.getAllAgents().length} agents`);
}

/**
 * Reset the agent system
 */
export function resetAgentSystem(): void {
  agentRegistry.clear();
  console.log('Agent system reset');
}
