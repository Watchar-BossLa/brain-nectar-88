
// Re-export all LLM orchestration components
export * from './types';
export { modelOrchestration } from './modelOrchestration';
export { modelRegistry } from './modelRegistry/modelRegistryService';
export { modelSelection } from './modelSelection/modelSelectionService';
export { modelParameters } from './modelParameters/modelParametersService';
export { modelExecution } from './modelExecution';
export { providerIntegration } from './providerIntegration';
export { performanceMonitoring } from './performanceMonitoring';
export { agentIntegration } from './agentIntegration';

// Main entry point for LLM orchestration system
import { modelOrchestration } from './modelOrchestration';
import { modelExecution } from './modelExecution';
import { providerIntegration } from './providerIntegration';
import { performanceMonitoring } from './performanceMonitoring';
import { agentIntegration } from './agentIntegration';

/**
 * Initialize the LLM orchestration system
 */
export const initializeLLMSystem = async () => {
  console.log('Initializing LLM Orchestration System');
  
  // These services are already initialized through their getInstance methods
  // The following is for logging purposes
  
  console.log(`Model orchestration initialized with ${modelOrchestration.getAllModels().length} models`);
  console.log(`Provider integration initialized with ${providerIntegration.getAllProviders().length} providers`);
  
  return {
    modelOrchestration,
    modelExecution,
    providerIntegration,
    performanceMonitoring,
    agentIntegration
  };
};
