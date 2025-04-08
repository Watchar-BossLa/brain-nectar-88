/**
 * Learning Path Generator
 * Generates optimal learning paths through concepts
 */

import { supabase } from '@/integrations/supabase/client';
import { KnowledgeGraphService } from './KnowledgeGraphService';

/**
 * Learning Path Generator class
 */
export class LearningPathGenerator {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.knowledgeGraphService = KnowledgeGraphService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {LearningPathGenerator} The singleton instance
   */
  static getInstance() {
    if (!LearningPathGenerator.instance) {
      LearningPathGenerator.instance = new LearningPathGenerator();
    }
    return LearningPathGenerator.instance;
  }
  
  /**
   * Initialize the service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      console.log('Initializing Learning Path Generator');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Learning Path Generator:', error);
      return false;
    }
  }
  
  /**
   * Generate a learning path between concepts
   * @param {Object} pathData - Path data
   * @param {string} pathData.userId - User ID
   * @param {string} pathData.startConceptId - Start concept ID
   * @param {string} pathData.endConceptId - End concept ID
   * @param {string} pathData.name - Path name
   * @param {string} [pathData.description] - Path description
   * @param {Array<string>} [pathData.tags] - Path tags
   * @param {Object} [options] - Options
   * @param {number} [options.maxDepth=5] - Maximum path depth
   * @param {number} [options.minStrength=0.3] - Minimum relationship strength
   * @returns {Promise<Object>} Generated learning path
   */
  async generatePath(pathData, options = {}) {
    if (!this.initialized) {
      throw new Error('Learning Path Generator not initialized');
    }
    
    const {
      userId,
      startConceptId,
      endConceptId,
      name,
      description = '',
      tags = []
    } = pathData;
    
    const {
      maxDepth = 5,
      minStrength = 0.3
    } = options;
    
    // Find path between concepts
    const path = await this.knowledgeGraphService.findLearningPath(
      startConceptId,
      endConceptId,
      { maxDepth, minStrength }
    );
    
    if (!path || path.length === 0) {
      throw new Error('No path found between concepts');
    }
    
    // Create learning path
    const { data: learningPath, error } = await supabase
      .from('learning_paths')
      .insert({
        user_id: userId,
        name,
        description,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Get concepts in the path
    const conceptIds = [startConceptId];
    
    for (const step of path) {
      conceptIds.push(step.to);
    }
    
    const { data: concepts, error: conceptsError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .in('id', conceptIds);
    
    if (conceptsError) throw conceptsError;
    
    // Create path steps
    const pathSteps = [];
    
    // Add start concept
    pathSteps.push({
      path_id: learningPath.id,
      concept_id: startConceptId,
      step_order: 1,
      description: 'Starting concept',
      created_at: new Date().toISOString()
    });
    
    // Add intermediate steps
    for (let i = 0; i < path.length; i++) {
      const step = path[i];
      const concept = concepts.find(c => c.id === step.to);
      
      pathSteps.push({
        path_id: learningPath.id,
        concept_id: step.to,
        step_order: i + 2, // Start from 2 (after the start concept)
        description: `Step ${i + 2}: ${concept ? concept.name : 'Unknown concept'}`,
        created_at: new Date().toISOString()
      });
    }
    
    // Insert path steps
    const { error: stepsError } = await supabase
      .from('learning_path_steps')
      .insert(pathSteps);
    
    if (stepsError) throw stepsError;
    
    // Get the complete learning path
    const completePath = await this.getPathWithSteps(learningPath.id);
    
    return completePath;
  }
  
  /**
   * Generate a learning path from a document
   * @param {Object} pathData - Path data
   * @param {string} pathData.userId - User ID
   * @param {string} pathData.documentId - Document ID
   * @param {string} pathData.name - Path name
   * @param {string} [pathData.description] - Path description
   * @param {Array<string>} [pathData.tags] - Path tags
   * @returns {Promise<Object>} Generated learning path
   */
  async generatePathFromDocument(pathData) {
    if (!this.initialized) {
      throw new Error('Learning Path Generator not initialized');
    }
    
    const {
      userId,
      documentId,
      name,
      description = '',
      tags = []
    } = pathData;
    
    // Extract concepts from document if not already done
    await this.knowledgeGraphService.extractFromDocument(documentId);
    
    // Get document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();
    
    if (docError) throw docError;
    
    // Get concepts from document
    const { data: concepts, error: conceptsError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .eq('user_id', userId)
      .eq('source', 'document')
      .eq('source_id', documentId);
    
    if (conceptsError) throw conceptsError;
    
    if (!concepts || concepts.length === 0) {
      throw new Error('No concepts found in document');
    }
    
    // Create learning path
    const { data: learningPath, error } = await supabase
      .from('learning_paths')
      .insert({
        user_id: userId,
        name,
        description,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Sort concepts by their order in the document
    // For now, we'll use a simple approach based on section order
    const sortedConcepts = [...concepts].sort((a, b) => {
      // If concepts have section information, sort by section order
      if (a.metadata?.sectionOrder && b.metadata?.sectionOrder) {
        return a.metadata.sectionOrder - b.metadata.sectionOrder;
      }
      
      // Otherwise, sort alphabetically
      return a.name.localeCompare(b.name);
    });
    
    // Create path steps
    const pathSteps = sortedConcepts.map((concept, index) => ({
      path_id: learningPath.id,
      concept_id: concept.id,
      step_order: index + 1,
      description: `Step ${index + 1}: ${concept.name}`,
      created_at: new Date().toISOString()
    }));
    
    // Insert path steps
    const { error: stepsError } = await supabase
      .from('learning_path_steps')
      .insert(pathSteps);
    
    if (stepsError) throw stepsError;
    
    // Get the complete learning path
    const completePath = await this.getPathWithSteps(learningPath.id);
    
    return completePath;
  }
  
  /**
   * Get a learning path with steps
   * @param {string} pathId - Path ID
   * @returns {Promise<Object>} Learning path with steps
   * @private
   */
  async getPathWithSteps(pathId) {
    // Get path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('id', pathId)
      .single();
    
    if (pathError) throw pathError;
    
    // Get path steps
    const { data: steps, error: stepsError } = await supabase
      .from('learning_path_steps')
      .select('*')
      .eq('path_id', pathId)
      .order('step_order', { ascending: true });
    
    if (stepsError) throw stepsError;
    
    // Get concepts
    const conceptIds = steps.map(step => step.concept_id);
    
    const { data: concepts, error: conceptsError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .in('id', conceptIds);
    
    if (conceptsError) throw conceptsError;
    
    // Combine steps with concepts
    const stepsWithConcepts = steps.map(step => {
      const concept = concepts.find(c => c.id === step.concept_id);
      return {
        ...step,
        concept
      };
    });
    
    return {
      ...path,
      steps: stepsWithConcepts
    };
  }
  
  /**
   * Generate a prerequisite graph for a concept
   * @param {string} conceptId - Concept ID
   * @param {Object} [options] - Options
   * @param {number} [options.maxDepth=3] - Maximum depth
   * @param {number} [options.minStrength=0.5] - Minimum relationship strength
   * @returns {Promise<Object>} Prerequisite graph
   */
  async generatePrerequisiteGraph(conceptId, options = {}) {
    if (!this.initialized) {
      throw new Error('Learning Path Generator not initialized');
    }
    
    const {
      maxDepth = 3,
      minStrength = 0.5
    } = options;
    
    // Get the concept
    const concept = await this.knowledgeGraphService.getConcept(conceptId);
    
    if (!concept) {
      throw new Error('Concept not found');
    }
    
    // Get relationships where this concept is the target
    const { data: relationships, error } = await supabase
      .from('knowledge_relationships')
      .select('*')
      .eq('target_concept_id', conceptId)
      .eq('type', 'prerequisite')
      .gte('strength', minStrength);
    
    if (error) throw error;
    
    // If no prerequisites, return empty graph
    if (!relationships || relationships.length === 0) {
      return {
        nodes: [
          {
            id: concept.id,
            label: concept.name,
            description: concept.description,
            level: 0
          }
        ],
        edges: []
      };
    }
    
    // Get prerequisite concepts
    const prerequisiteIds = relationships.map(rel => rel.source_concept_id);
    
    const { data: prerequisites, error: conceptsError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .in('id', prerequisiteIds);
    
    if (conceptsError) throw conceptsError;
    
    // Build the initial graph
    const graph = {
      nodes: [
        {
          id: concept.id,
          label: concept.name,
          description: concept.description,
          level: 0
        },
        ...prerequisites.map(prereq => ({
          id: prereq.id,
          label: prereq.name,
          description: prereq.description,
          level: 1
        }))
      ],
      edges: relationships.map(rel => ({
        source: rel.source_concept_id,
        target: rel.target_concept_id,
        type: rel.type,
        strength: rel.strength
      }))
    };
    
    // If maxDepth > 1, recursively get prerequisites of prerequisites
    if (maxDepth > 1 && prerequisites.length > 0) {
      for (let depth = 1; depth < maxDepth; depth++) {
        const currentLevelIds = graph.nodes
          .filter(node => node.level === depth)
          .map(node => node.id);
        
        if (currentLevelIds.length === 0) {
          break;
        }
        
        // Get relationships for current level
        const { data: nextRelationships, error: nextError } = await supabase
          .from('knowledge_relationships')
          .select('*')
          .in('target_concept_id', currentLevelIds)
          .eq('type', 'prerequisite')
          .gte('strength', minStrength);
        
        if (nextError) throw nextError;
        
        if (!nextRelationships || nextRelationships.length === 0) {
          break;
        }
        
        // Get next level concepts
        const nextLevelIds = nextRelationships.map(rel => rel.source_concept_id);
        
        const { data: nextConcepts, error: nextConceptsError } = await supabase
          .from('knowledge_concepts')
          .select('*')
          .in('id', nextLevelIds);
        
        if (nextConceptsError) throw nextConceptsError;
        
        // Add to graph
        for (const nextConcept of nextConcepts) {
          // Check if concept is already in the graph
          if (!graph.nodes.some(node => node.id === nextConcept.id)) {
            graph.nodes.push({
              id: nextConcept.id,
              label: nextConcept.name,
              description: nextConcept.description,
              level: depth + 1
            });
          }
        }
        
        for (const rel of nextRelationships) {
          // Check if relationship is already in the graph
          if (!graph.edges.some(edge => 
            edge.source === rel.source_concept_id && 
            edge.target === rel.target_concept_id
          )) {
            graph.edges.push({
              source: rel.source_concept_id,
              target: rel.target_concept_id,
              type: rel.type,
              strength: rel.strength
            });
          }
        }
      }
    }
    
    return graph;
  }
  
  /**
   * Generate a difficulty progression for a learning path
   * @param {string} pathId - Path ID
   * @returns {Promise<Object>} Difficulty progression
   */
  async generateDifficultyProgression(pathId) {
    if (!this.initialized) {
      throw new Error('Learning Path Generator not initialized');
    }
    
    // Get the learning path with steps
    const path = await this.getPathWithSteps(pathId);
    
    if (!path || !path.steps || path.steps.length === 0) {
      throw new Error('Learning path not found or empty');
    }
    
    // Calculate difficulty for each step
    const stepsWithDifficulty = path.steps.map(step => {
      // In a real implementation, this would use more sophisticated
      // methods to calculate difficulty based on concept complexity,
      // relationships, etc.
      
      // For now, we'll use a simple approach
      let difficulty = 0.5; // Default medium difficulty
      
      // Adjust based on concept properties
      const concept = step.concept;
      
      if (concept) {
        // More tags might indicate more complex concept
        if (concept.tags && concept.tags.length > 0) {
          difficulty += concept.tags.length * 0.05;
        }
        
        // Longer descriptions might indicate more complex concept
        if (concept.description) {
          difficulty += Math.min(0.2, concept.description.length / 1000);
        }
      }
      
      // Ensure difficulty is between 0 and 1
      difficulty = Math.max(0, Math.min(1, difficulty));
      
      return {
        ...step,
        difficulty
      };
    });
    
    // Calculate cumulative difficulty
    let cumulativeDifficulty = 0;
    
    const progression = stepsWithDifficulty.map(step => {
      cumulativeDifficulty += step.difficulty;
      
      return {
        stepId: step.id,
        conceptId: step.concept_id,
        conceptName: step.concept ? step.concept.name : 'Unknown',
        stepOrder: step.step_order,
        difficulty: step.difficulty,
        cumulativeDifficulty
      };
    });
    
    return {
      pathId,
      pathName: path.name,
      stepCount: path.steps.length,
      totalDifficulty: cumulativeDifficulty,
      averageDifficulty: cumulativeDifficulty / path.steps.length,
      progression
    };
  }
}

/**
 * Hook for using the Learning Path Generator
 * @returns {Object} Learning Path Generator methods
 */
export function useLearningPathGenerator() {
  const generator = LearningPathGenerator.getInstance();
  
  return {
    initialize: generator.initialize.bind(generator),
    generatePath: generator.generatePath.bind(generator),
    generatePathFromDocument: generator.generatePathFromDocument.bind(generator),
    generatePrerequisiteGraph: generator.generatePrerequisiteGraph.bind(generator),
    generateDifficultyProgression: generator.generateDifficultyProgression.bind(generator)
  };
}
