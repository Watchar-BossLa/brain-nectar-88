/**
 * Services index
 * This file exports all services and utilities
 */

// Adaptive Learning AI
import * as ai from './ai';

// Immersive Learning
import * as immersive from './immersive';

// Collaborative Knowledge Network
import * as collaborative from './collaborative';

// Cognitive Optimization
import * as cognitive from './cognitive';

// Blockchain Credentials
import * as credentials from './credentials';

// Multi-Agent System
import * as agents from './agents';

// Timer Service
import * as timer from './timerService';

// Export all services
export {
  ai,
  immersive,
  collaborative,
  cognitive,
  credentials,
  agents,
  timer
};

/**
 * Initialize all services
 * @param {string} userId - User identifier
 * @returns {Promise<boolean>} Success status
 */
export async function initializeAllServices(userId) {
  try {
    console.log('Initializing all services for user:', userId);
    
    // Initialize services in parallel
    await Promise.all([
      ai.AdaptiveLearningEngine.getInstance().initialize(userId),
      immersive.ImmersiveLearningService.getInstance().initialize(),
      collaborative.CollaborativeKnowledgeNetwork.getInstance().initialize(),
      cognitive.CognitiveOptimizationSystem.getInstance().initialize(),
      credentials.BlockchainCredentialSystem.getInstance().initialize()
    ]);
    
    console.log('All services initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing services:', error);
    return false;
  }
}

/**
 * Run all database migrations
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - Supabase client
 * @returns {Promise<boolean>} Success status
 */
export async function runAllMigrations(supabase) {
  try {
    console.log('Running all database migrations');
    
    // Run migrations in sequence
    await ai.runMigrations(supabase);
    await immersive.runMigrations(supabase);
    await collaborative.runMigrations(supabase);
    await cognitive.runMigrations(supabase);
    await credentials.runMigrations(supabase);
    
    console.log('All database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}
