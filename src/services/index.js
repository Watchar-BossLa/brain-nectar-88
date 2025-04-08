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

// Collaborative Network
import * as collaborativeNetwork from './collaborative-network';

// Visual Recognition
import * as visualRecognition from './visual-recognition';

// Cognitive Optimization
import * as cognitive from './cognitive';

// Blockchain Credentials
import * as credentials from './credentials';

// Multi-Agent System
import * as agents from './agents';

// Document Analysis
import * as documents from './documents';

// Spaced Repetition
import * as spacedRepetition from './spaced-repetition';

// Knowledge Graph
import * as knowledgeGraph from './knowledge-graph';

// Timer Service
import * as timer from './timerService';

// Export all services
export {
  ai,
  immersive,
  collaborative,
  collaborativeNetwork,
  visualRecognition,
  cognitive,
  credentials,
  agents,
  documents,
  spacedRepetition,
  knowledgeGraph,
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
      credentials.BlockchainCredentialSystem.getInstance().initialize(),
      documents.DocumentAnalysisService.getInstance().initialize(),
      spacedRepetition.SpacedRepetitionService.getInstance().initialize(userId),
      spacedRepetition.StudyItemGenerator.getInstance().initialize(),
      knowledgeGraph.KnowledgeGraphService.getInstance().initialize(userId),
      knowledgeGraph.GraphVisualizationEngine.getInstance().initialize(),
      knowledgeGraph.LearningPathGenerator.getInstance().initialize(),
      collaborativeNetwork.CollaborativeNetworkService.getInstance().initialize(userId),
      collaborativeNetwork.GroupResourceService.getInstance().initialize(userId),
      collaborativeNetwork.KnowledgeExchangeService.getInstance().initialize(userId),
      collaborativeNetwork.RealTimeCollaborationService.getInstance().initialize(userId),
      collaborativeNetwork.SocialLearningService.getInstance().initialize(userId),
      visualRecognition.VisualRecognitionService.getInstance().initialize(userId),
      visualRecognition.ImageAnalysisService.getInstance().initialize(),
      visualRecognition.StudyMaterialGeneratorService.getInstance().initialize(userId)
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
    await documents.runMigrations(supabase);
    await spacedRepetition.runMigrations(supabase);
    await knowledgeGraph.runMigrations(supabase);
    await collaborativeNetwork.runMigrations(supabase);
    await visualRecognition.runMigrations(supabase);

    console.log('All database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    return false;
  }
}
