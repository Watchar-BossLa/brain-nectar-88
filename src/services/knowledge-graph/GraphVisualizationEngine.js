/**
 * Graph Visualization Engine
 * Provides utilities for rendering and interacting with knowledge graphs
 */

import { supabase } from '@/integrations/supabase/client';
import { KnowledgeGraphService } from './KnowledgeGraphService';

/**
 * Graph Visualization Engine class
 */
export class GraphVisualizationEngine {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.knowledgeGraphService = KnowledgeGraphService.getInstance();
    this.layoutCache = new Map();
  }
  
  /**
   * Get the singleton instance
   * @returns {GraphVisualizationEngine} The singleton instance
   */
  static getInstance() {
    if (!GraphVisualizationEngine.instance) {
      GraphVisualizationEngine.instance = new GraphVisualizationEngine();
    }
    return GraphVisualizationEngine.instance;
  }
  
  /**
   * Initialize the service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      console.log('Initializing Graph Visualization Engine');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Graph Visualization Engine:', error);
      return false;
    }
  }
  
  /**
   * Create a knowledge map
   * @param {Object} mapData - Map data
   * @param {string} mapData.userId - User ID
   * @param {string} mapData.name - Map name
   * @param {string} [mapData.description] - Map description
   * @param {Array<string>} [mapData.tags] - Map tags
   * @param {boolean} [mapData.isPublic=false] - Whether the map is public
   * @returns {Promise<Object>} Created map
   */
  async createMap(mapData) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    const {
      userId,
      name,
      description = '',
      tags = [],
      isPublic = false
    } = mapData;
    
    // Create map in database
    const { data, error } = await supabase
      .from('knowledge_maps')
      .insert({
        user_id: userId,
        name,
        description,
        tags,
        is_public: isPublic,
        layout_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Add concepts to a map
   * @param {string} mapId - Map ID
   * @param {Array<string>} conceptIds - Concept IDs
   * @param {Object} [options] - Options
   * @param {boolean} [options.includeRelationships=true] - Whether to include relationships
   * @returns {Promise<Object>} Updated map
   */
  async addConceptsToMap(mapId, conceptIds, options = {}) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    const {
      includeRelationships = true
    } = options;
    
    // Get map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('*')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    // Get existing concepts in map
    const { data: existingMapConcepts, error: existingError } = await supabase
      .from('knowledge_map_concepts')
      .select('concept_id')
      .eq('map_id', mapId);
    
    if (existingError) throw existingError;
    
    const existingConceptIds = existingMapConcepts.map(mc => mc.concept_id);
    
    // Filter out concepts that are already in the map
    const newConceptIds = conceptIds.filter(id => !existingConceptIds.includes(id));
    
    if (newConceptIds.length === 0) {
      return map;
    }
    
    // Calculate positions for new concepts
    const positions = this.calculatePositions(newConceptIds.length, existingConceptIds.length);
    
    // Add concepts to map
    const mapConcepts = newConceptIds.map((conceptId, index) => ({
      map_id: mapId,
      concept_id: conceptId,
      position_x: positions[index].x,
      position_y: positions[index].y,
      created_at: new Date().toISOString()
    }));
    
    const { error: insertError } = await supabase
      .from('knowledge_map_concepts')
      .insert(mapConcepts);
    
    if (insertError) throw insertError;
    
    // If includeRelationships is true, add relationships between concepts
    if (includeRelationships) {
      // Get all concepts in the map
      const allConceptIds = [...existingConceptIds, ...newConceptIds];
      
      // Get relationships between these concepts
      const { data: relationships, error: relError } = await supabase
        .from('knowledge_relationships')
        .select('*')
        .eq('user_id', map.user_id)
        .or(`source_concept_id.in.(${allConceptIds.join(',')}),target_concept_id.in.(${allConceptIds.join(',')})`);
      
      if (relError) throw relError;
      
      // Filter relationships to only include concepts in the map
      const mapRelationships = relationships.filter(
        rel => allConceptIds.includes(rel.source_concept_id) && allConceptIds.includes(rel.target_concept_id)
      );
      
      // Update layout data with relationships
      const { data: updatedMap, error: updateError } = await supabase
        .from('knowledge_maps')
        .update({
          layout_data: {
            ...map.layout_data,
            relationships: mapRelationships
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', mapId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      return updatedMap;
    }
    
    return map;
  }
  
  /**
   * Calculate positions for new concepts
   * @param {number} count - Number of new concepts
   * @param {number} existingCount - Number of existing concepts
   * @returns {Array<Object>} Positions
   * @private
   */
  calculatePositions(count, existingCount) {
    const positions = [];
    const radius = 200 + existingCount * 10;
    const angleStep = (2 * Math.PI) / count;
    
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      positions.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle)
      });
    }
    
    return positions;
  }
  
  /**
   * Get a knowledge map
   * @param {string} mapId - Map ID
   * @returns {Promise<Object>} Knowledge map
   */
  async getMap(mapId) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    // Get map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('*')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    // Get map concepts
    const { data: mapConcepts, error: conceptsError } = await supabase
      .from('knowledge_map_concepts')
      .select('concept_id, position_x, position_y')
      .eq('map_id', mapId);
    
    if (conceptsError) throw conceptsError;
    
    // Get concepts
    const conceptIds = mapConcepts.map(mc => mc.concept_id);
    
    if (conceptIds.length === 0) {
      return {
        ...map,
        concepts: [],
        relationships: []
      };
    }
    
    const { data: concepts, error: getConceptsError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .in('id', conceptIds);
    
    if (getConceptsError) throw getConceptsError;
    
    // Get relationships between concepts
    const { data: relationships, error: relError } = await supabase
      .from('knowledge_relationships')
      .select('*')
      .eq('user_id', map.user_id)
      .or(`source_concept_id.in.(${conceptIds.join(',')}),target_concept_id.in.(${conceptIds.join(',')})`);
    
    if (relError) throw relError;
    
    // Filter relationships to only include concepts in the map
    const mapRelationships = relationships.filter(
      rel => conceptIds.includes(rel.source_concept_id) && conceptIds.includes(rel.target_concept_id)
    );
    
    // Combine concepts with positions
    const conceptsWithPositions = concepts.map(concept => {
      const mapConcept = mapConcepts.find(mc => mc.concept_id === concept.id);
      return {
        ...concept,
        position: {
          x: mapConcept.position_x,
          y: mapConcept.position_y
        }
      };
    });
    
    return {
      ...map,
      concepts: conceptsWithPositions,
      relationships: mapRelationships
    };
  }
  
  /**
   * Update concept positions in a map
   * @param {string} mapId - Map ID
   * @param {Array<Object>} conceptPositions - Concept positions
   * @param {string} conceptPositions[].conceptId - Concept ID
   * @param {number} conceptPositions[].x - X position
   * @param {number} conceptPositions[].y - Y position
   * @returns {Promise<boolean>} Success status
   */
  async updateConceptPositions(mapId, conceptPositions) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    // Update positions in database
    for (const position of conceptPositions) {
      const { error } = await supabase
        .from('knowledge_map_concepts')
        .update({
          position_x: position.x,
          position_y: position.y
        })
        .eq('map_id', mapId)
        .eq('concept_id', position.conceptId);
      
      if (error) throw error;
    }
    
    // Update map
    const { error: updateError } = await supabase
      .from('knowledge_maps')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', mapId);
    
    if (updateError) throw updateError;
    
    return true;
  }
  
  /**
   * Remove concepts from a map
   * @param {string} mapId - Map ID
   * @param {Array<string>} conceptIds - Concept IDs
   * @returns {Promise<boolean>} Success status
   */
  async removeConceptsFromMap(mapId, conceptIds) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    // Remove concepts from map
    const { error } = await supabase
      .from('knowledge_map_concepts')
      .delete()
      .eq('map_id', mapId)
      .in('concept_id', conceptIds);
    
    if (error) throw error;
    
    // Update map
    const { error: updateError } = await supabase
      .from('knowledge_maps')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', mapId);
    
    if (updateError) throw updateError;
    
    return true;
  }
  
  /**
   * Get user maps
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} User maps
   */
  async getUserMaps(userId) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    const { data, error } = await supabase
      .from('knowledge_maps')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Create a learning path
   * @param {Object} pathData - Path data
   * @param {string} pathData.userId - User ID
   * @param {string} pathData.name - Path name
   * @param {string} [pathData.description] - Path description
   * @param {Array<string>} [pathData.tags] - Path tags
   * @returns {Promise<Object>} Created path
   */
  async createLearningPath(pathData) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    const {
      userId,
      name,
      description = '',
      tags = []
    } = pathData;
    
    // Create path in database
    const { data, error } = await supabase
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
    
    return data;
  }
  
  /**
   * Add steps to a learning path
   * @param {string} pathId - Path ID
   * @param {Array<Object>} steps - Path steps
   * @param {string} steps[].conceptId - Concept ID
   * @param {number} steps[].order - Step order
   * @param {string} [steps[].description] - Step description
   * @returns {Promise<boolean>} Success status
   */
  async addPathSteps(pathId, steps) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    // Add steps to path
    const pathSteps = steps.map(step => ({
      path_id: pathId,
      concept_id: step.conceptId,
      step_order: step.order,
      description: step.description || '',
      created_at: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('learning_path_steps')
      .insert(pathSteps);
    
    if (error) throw error;
    
    // Update path
    const { error: updateError } = await supabase
      .from('learning_paths')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', pathId);
    
    if (updateError) throw updateError;
    
    return true;
  }
  
  /**
   * Get a learning path
   * @param {string} pathId - Path ID
   * @returns {Promise<Object>} Learning path
   */
  async getLearningPath(pathId) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    // Get path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('id', pathId)
      .single();
    
    if (pathError) throw pathError;
    
    // Get path steps
    const { data: pathSteps, error: stepsError } = await supabase
      .from('learning_path_steps')
      .select('*')
      .eq('path_id', pathId)
      .order('step_order', { ascending: true });
    
    if (stepsError) throw stepsError;
    
    // Get concepts
    const conceptIds = pathSteps.map(step => step.concept_id);
    
    if (conceptIds.length === 0) {
      return {
        ...path,
        steps: []
      };
    }
    
    const { data: concepts, error: conceptsError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .in('id', conceptIds);
    
    if (conceptsError) throw conceptsError;
    
    // Combine steps with concepts
    const stepsWithConcepts = pathSteps.map(step => {
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
   * Get user learning paths
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} User learning paths
   */
  async getUserLearningPaths(userId) {
    if (!this.initialized) {
      throw new Error('Graph Visualization Engine not initialized');
    }
    
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Generate a force-directed layout for a graph
   * @param {Object} graph - Graph data
   * @param {Array<Object>} graph.nodes - Graph nodes
   * @param {Array<Object>} graph.edges - Graph edges
   * @param {Object} [options] - Layout options
   * @param {number} [options.width=800] - Layout width
   * @param {number} [options.height=600] - Layout height
   * @param {number} [options.iterations=100] - Number of iterations
   * @returns {Object} Layout data
   */
  generateForceDirectedLayout(graph, options = {}) {
    const {
      width = 800,
      height = 600,
      iterations = 100
    } = options;
    
    // Create a copy of the graph
    const nodes = [...graph.nodes];
    const edges = [...graph.edges];
    
    // Initialize node positions randomly
    for (const node of nodes) {
      node.x = Math.random() * width;
      node.y = Math.random() * height;
      node.vx = 0;
      node.vy = 0;
    }
    
    // Run force-directed layout algorithm
    const repulsionForce = 100;
    const attractionForce = 0.1;
    const maxVelocity = 10;
    
    for (let i = 0; i < iterations; i++) {
      // Apply repulsion forces between nodes
      for (let j = 0; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const nodeA = nodes[j];
          const nodeB = nodes[k];
          
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = repulsionForce / (distance * distance);
          
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          nodeA.vx -= fx;
          nodeA.vy -= fy;
          nodeB.vx += fx;
          nodeB.vy += fy;
        }
      }
      
      // Apply attraction forces along edges
      for (const edge of edges) {
        const sourceNode = nodes.find(node => node.id === edge.source);
        const targetNode = nodes.find(node => node.id === edge.target);
        
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          
          const force = distance * attractionForce;
          
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;
          
          sourceNode.vx += fx;
          sourceNode.vy += fy;
          targetNode.vx -= fx;
          targetNode.vy -= fy;
        }
      }
      
      // Update node positions
      for (const node of nodes) {
        // Limit velocity
        const velocity = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (velocity > maxVelocity) {
          node.vx = (node.vx / velocity) * maxVelocity;
          node.vy = (node.vy / velocity) * maxVelocity;
        }
        
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        
        // Constrain to bounds
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
        
        // Dampen velocity
        node.vx *= 0.9;
        node.vy *= 0.9;
      }
    }
    
    // Extract final positions
    const layout = {
      nodes: nodes.map(node => ({
        id: node.id,
        x: node.x,
        y: node.y
      })),
      edges
    };
    
    return layout;
  }
}

/**
 * Hook for using the Graph Visualization Engine
 * @returns {Object} Graph Visualization Engine methods
 */
export function useGraphVisualization() {
  const engine = GraphVisualizationEngine.getInstance();
  
  return {
    initialize: engine.initialize.bind(engine),
    createMap: engine.createMap.bind(engine),
    addConceptsToMap: engine.addConceptsToMap.bind(engine),
    getMap: engine.getMap.bind(engine),
    updateConceptPositions: engine.updateConceptPositions.bind(engine),
    removeConceptsFromMap: engine.removeConceptsFromMap.bind(engine),
    getUserMaps: engine.getUserMaps.bind(engine),
    createLearningPath: engine.createLearningPath.bind(engine),
    addPathSteps: engine.addPathSteps.bind(engine),
    getLearningPath: engine.getLearningPath.bind(engine),
    getUserLearningPaths: engine.getUserLearningPaths.bind(engine),
    generateForceDirectedLayout: engine.generateForceDirectedLayout.bind(engine)
  };
}
