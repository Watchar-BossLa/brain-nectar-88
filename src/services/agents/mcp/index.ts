
// Export MCP core functionality
import MasterControlProgram from './MCP';
import { SystemStateManager } from './systemState';
import { TaskQueueManager } from './taskQueueManager';
import { TaskProcessor } from './taskProcessor';
import { TaskRouter } from './taskRouting';
import { communicationManager } from './communication';

// Re-export components
export { MasterControlProgram };
export { SystemStateManager };
export { TaskQueueManager };
export { TaskProcessor };
export { TaskRouter };
export { communicationManager };

// Re-export type definitions
export type { AgentType, AgentTask } from '../types';
