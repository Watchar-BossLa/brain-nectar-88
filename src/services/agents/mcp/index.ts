
import { MasterControlProgram } from './MasterControlProgram';

// Export the master control program functionality
export { MasterControlProgram };

// Export a singleton instance for use throughout the application
export const mcp = MasterControlProgram.getInstance();

// Re-export important types and components for easier access
export * from './systemState';
export * from './communication';
export * from './taskProcessor';
export * from './taskQueueManager';
