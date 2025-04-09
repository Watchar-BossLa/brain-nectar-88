/**
 * Learning Path Service
 * Service for creating and managing learning paths
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Learning Path Service class
 */
export class LearningPathService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {LearningPathService} The singleton instance
   */
  static getInstance() {
    if (!LearningPathService.instance) {
      LearningPathService.instance = new LearningPathService();
    }
    return LearningPathService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Learning Path Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Learning Path Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new learning path
   * @param {Object} pathData - Path data
   * @returns {Promise<Object>} Created path
   */
  async createPath(pathData) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    const { 
      title, 
      description, 
      mapId, 
      isPublic, 
      difficultyLevel, 
      estimatedDuration, 
      pathData: customPathData 
    } = pathData;
    
    // Create the path
    const { data: path, error } = await supabase
      .from('learning_paths')
      .insert({
        user_id: this.userId,
        map_id: mapId,
        title,
        description,
        is_public: isPublic,
        difficulty_level: difficultyLevel,
        estimated_duration: estimatedDuration,
        path_data: customPathData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add nodes if provided
    if (pathData.nodes && pathData.nodes.length > 0) {
      const nodeInserts = pathData.nodes.map((node, index) => ({
        path_id: path.id,
        concept_id: node.conceptId,
        title: node.title,
        description: node.description,
        content: node.content,
        position: index,
        completion_criteria: node.completionCriteria || {},
        resources: node.resources || {},
        node_data: node.nodeData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const { error: nodeError } = await supabase
        .from('path_nodes')
        .insert(nodeInserts);
      
      if (nodeError) throw nodeError;
    }
    
    return path;
  }
  
  /**
   * Get user's learning paths
   * @param {Object} options - Query options
   * @returns {Promise<Array>} User's learning paths
   */
  async getUserPaths(options = {}) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    const { limit = 10, offset = 0, sortBy = 'updated_at', sortOrder = 'desc', includeProgress = true } = options;
    
    // Get paths created by the user
    const { data: paths, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        knowledge_maps:map_id(
          id,
          title
        ),
        path_nodes_count:path_nodes(count)
      `)
      .eq('user_id', this.userId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    // Get progress for each path if requested
    if (includeProgress && paths.length > 0) {
      const pathIds = paths.map(path => path.id);
      
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', this.userId)
        .eq('progress_type', 'path')
        .in('path_id', pathIds);
      
      if (progressError) throw progressError;
      
      // Create a map of path ID to progress
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.path_id] = p;
      });
      
      // Add progress to each path
      paths.forEach(path => {
        path.progress = progressMap[path.id] || null;
      });
    }
    
    return paths;
  }
  
  /**
   * Get a learning path by ID
   * @param {string} pathId - Path ID
   * @returns {Promise<Object>} Learning path with nodes
   */
  async getPathById(pathId) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    // Get the path
    const { data: path, error } = await supabase
      .from('learning_paths')
      .select(`
        *,
        knowledge_maps:map_id(
          id,
          title,
          description
        )
      `)
      .eq('id', pathId)
      .single();
    
    if (error) throw error;
    
    // Check if the user has access to this path
    if (path.user_id !== this.userId && !path.is_public) {
      throw new Error('You do not have access to this learning path');
    }
    
    // Get nodes
    const { data: nodes, error: nodesError } = await supabase
      .from('path_nodes')
      .select(`
        *,
        concepts:concept_id(
          id,
          title,
          description,
          concept_type
        )
      `)
      .eq('path_id', pathId)
      .order('position', { ascending: true });
    
    if (nodesError) throw nodesError;
    
    // Get user progress
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', this.userId)
      .eq('progress_type', 'path')
      .eq('path_id', pathId)
      .maybeSingle();
    
    if (progressError) throw progressError;
    
    // Get node progress
    const { data: nodeProgress, error: nodeProgressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', this.userId)
      .eq('progress_type', 'node')
      .eq('path_id', pathId);
    
    if (nodeProgressError) throw nodeProgressError;
    
    // Create a map of node ID to progress
    const nodeProgressMap = {};
    nodeProgress.forEach(p => {
      nodeProgressMap[p.node_id] = p;
    });
    
    // Add progress to each node
    nodes.forEach(node => {
      node.progress = nodeProgressMap[node.id] || null;
    });
    
    return {
      ...path,
      nodes,
      progress,
      isOwner: path.user_id === this.userId
    };
  }
  
  /**
   * Update a learning path
   * @param {string} pathId - Path ID
   * @param {Object} pathData - Updated path data
   * @returns {Promise<Object>} Updated path
   */
  async updatePath(pathId, pathData) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    // Check if the user is the owner of the path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('user_id')
      .eq('id', pathId)
      .single();
    
    if (pathError) throw pathError;
    
    if (path.user_id !== this.userId) {
      throw new Error('You do not have permission to update this path');
    }
    
    // Update the path
    const { data: updatedPath, error } = await supabase
      .from('learning_paths')
      .update({
        title: pathData.title,
        description: pathData.description,
        map_id: pathData.mapId,
        is_public: pathData.isPublic,
        difficulty_level: pathData.difficultyLevel,
        estimated_duration: pathData.estimatedDuration,
        path_data: pathData.pathData || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', pathId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedPath;
  }
  
  /**
   * Delete a learning path
   * @param {string} pathId - Path ID
   * @returns {Promise<boolean>} Success status
   */
  async deletePath(pathId) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    // Check if the user is the owner of the path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('user_id')
      .eq('id', pathId)
      .single();
    
    if (pathError) throw pathError;
    
    if (path.user_id !== this.userId) {
      throw new Error('You do not have permission to delete this path');
    }
    
    // Delete the path (cascades to nodes and progress)
    const { error } = await supabase
      .from('learning_paths')
      .delete()
      .eq('id', pathId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Add a node to a learning path
   * @param {string} pathId - Path ID
   * @param {Object} nodeData - Node data
   * @returns {Promise<Object>} Created node
   */
  async addNode(pathId, nodeData) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    // Check if the user is the owner of the path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('user_id')
      .eq('id', pathId)
      .single();
    
    if (pathError) throw pathError;
    
    if (path.user_id !== this.userId) {
      throw new Error('You do not have permission to modify this path');
    }
    
    // Get the current highest position
    const { data: highestNode, error: posError } = await supabase
      .from('path_nodes')
      .select('position')
      .eq('path_id', pathId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (posError) throw posError;
    
    const position = highestNode ? highestNode.position + 1 : 0;
    
    // Create the node
    const { data: node, error } = await supabase
      .from('path_nodes')
      .insert({
        path_id: pathId,
        concept_id: nodeData.conceptId,
        title: nodeData.title,
        description: nodeData.description,
        content: nodeData.content,
        position,
        completion_criteria: nodeData.completionCriteria || {},
        resources: nodeData.resources || {},
        node_data: nodeData.nodeData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return node;
  }
  
  /**
   * Update a node
   * @param {string} nodeId - Node ID
   * @param {Object} nodeData - Updated node data
   * @returns {Promise<Object>} Updated node
   */
  async updateNode(nodeId, nodeData) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    // Get the node to check path ID
    const { data: node, error: nodeError } = await supabase
      .from('path_nodes')
      .select('path_id')
      .eq('id', nodeId)
      .single();
    
    if (nodeError) throw nodeError;
    
    // Check if the user is the owner of the path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('user_id')
      .eq('id', node.path_id)
      .single();
    
    if (pathError) throw pathError;
    
    if (path.user_id !== this.userId) {
      throw new Error('You do not have permission to modify this path');
    }
    
    // Update the node
    const { data: updatedNode, error } = await supabase
      .from('path_nodes')
      .update({
        concept_id: nodeData.conceptId,
        title: nodeData.title,
        description: nodeData.description,
        content: nodeData.content,
        completion_criteria: nodeData.completionCriteria || {},
        resources: nodeData.resources || {},
        node_data: nodeData.nodeData || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', nodeId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedNode;
  }
  
  /**
   * Delete a node
   * @param {string} nodeId - Node ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteNode(nodeId) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    // Get the node to check path ID
    const { data: node, error: nodeError } = await supabase
      .from('path_nodes')
      .select('path_id')
      .eq('id', nodeId)
      .single();
    
    if (nodeError) throw nodeError;
    
    // Check if the user is the owner of the path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('user_id')
      .eq('id', node.path_id)
      .single();
    
    if (pathError) throw pathError;
    
    if (path.user_id !== this.userId) {
      throw new Error('You do not have permission to modify this path');
    }
    
    // Delete the node
    const { error } = await supabase
      .from('path_nodes')
      .delete()
      .eq('id', nodeId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Reorder nodes in a path
   * @param {string} pathId - Path ID
   * @param {Array<string>} nodeIds - Ordered node IDs
   * @returns {Promise<boolean>} Success status
   */
  async reorderNodes(pathId, nodeIds) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    // Check if the user is the owner of the path
    const { data: path, error: pathError } = await supabase
      .from('learning_paths')
      .select('user_id')
      .eq('id', pathId)
      .single();
    
    if (pathError) throw pathError;
    
    if (path.user_id !== this.userId) {
      throw new Error('You do not have permission to modify this path');
    }
    
    // Update each node's position
    for (let i = 0; i < nodeIds.length; i++) {
      const { error } = await supabase
        .from('path_nodes')
        .update({ position: i })
        .eq('id', nodeIds[i])
        .eq('path_id', pathId);
      
      if (error) throw error;
    }
    
    return true;
  }
  
  /**
   * Update user progress on a path
   * @param {string} pathId - Path ID
   * @param {Object} progressData - Progress data
   * @returns {Promise<Object>} Updated progress
   */
  async updatePathProgress(pathId, progressData) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    const { status, completionPercentage } = progressData;
    
    // Check if progress already exists
    const { data: existingProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', this.userId)
      .eq('progress_type', 'path')
      .eq('path_id', pathId)
      .maybeSingle();
    
    if (progressError) throw progressError;
    
    if (existingProgress) {
      // Update existing progress
      const { data: updatedProgress, error } = await supabase
        .from('user_progress')
        .update({
          status,
          completion_percentage: completionPercentage,
          last_activity: new Date().toISOString(),
          progress_data: progressData.progressData || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return updatedProgress;
    } else {
      // Create new progress
      const { data: newProgress, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: this.userId,
          path_id: pathId,
          progress_type: 'path',
          status,
          completion_percentage: completionPercentage,
          last_activity: new Date().toISOString(),
          progress_data: progressData.progressData || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return newProgress;
    }
  }
  
  /**
   * Update user progress on a node
   * @param {string} nodeId - Node ID
   * @param {Object} progressData - Progress data
   * @returns {Promise<Object>} Updated progress
   */
  async updateNodeProgress(nodeId, progressData) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    const { status, completionPercentage } = progressData;
    
    // Get the node to get path ID
    const { data: node, error: nodeError } = await supabase
      .from('path_nodes')
      .select('path_id')
      .eq('id', nodeId)
      .single();
    
    if (nodeError) throw nodeError;
    
    // Check if progress already exists
    const { data: existingProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', this.userId)
      .eq('progress_type', 'node')
      .eq('node_id', nodeId)
      .maybeSingle();
    
    if (progressError) throw progressError;
    
    if (existingProgress) {
      // Update existing progress
      const { data: updatedProgress, error } = await supabase
        .from('user_progress')
        .update({
          status,
          completion_percentage: completionPercentage,
          last_activity: new Date().toISOString(),
          progress_data: progressData.progressData || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update path progress
      await this._updateOverallPathProgress(node.path_id);
      
      return updatedProgress;
    } else {
      // Create new progress
      const { data: newProgress, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: this.userId,
          path_id: node.path_id,
          node_id: nodeId,
          progress_type: 'node',
          status,
          completion_percentage: completionPercentage,
          last_activity: new Date().toISOString(),
          progress_data: progressData.progressData || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update path progress
      await this._updateOverallPathProgress(node.path_id);
      
      return newProgress;
    }
  }
  
  /**
   * Generate a learning path from a knowledge map
   * @param {string} mapId - Map ID
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated path
   */
  async generateFromMap(mapId, options = {}) {
    if (!this.initialized) {
      throw new Error('Learning Path Service not initialized');
    }
    
    // Check if the user has access to this map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('*')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    if (map.user_id !== this.userId && !map.is_public) {
      // Check if the user is a collaborator
      const { data: collaborator, error: collabError } = await supabase
        .from('map_collaborators')
        .select('role')
        .eq('map_id', mapId)
        .eq('user_id', this.userId)
        .maybeSingle();
      
      if (collabError) throw collabError;
      
      if (!collaborator) {
        throw new Error('You do not have access to this map');
      }
    }
    
    // Get concepts and relationships
    const { data: concepts, error: conceptsError } = await supabase
      .from('concepts')
      .select('*')
      .eq('map_id', mapId);
    
    if (conceptsError) throw conceptsError;
    
    const { data: relationships, error: relError } = await supabase
      .from('relationships')
      .select('*')
      .eq('map_id', mapId);
    
    if (relError) throw relError;
    
    // Build the graph
    const graph = {};
    concepts.forEach(concept => {
      graph[concept.id] = {
        concept,
        outgoing: [],
        incoming: []
      };
    });
    
    relationships.forEach(rel => {
      if (graph[rel.source_id]) {
        graph[rel.source_id].outgoing.push({
          relationship: rel,
          target: rel.target_id
        });
      }
      
      if (graph[rel.target_id]) {
        graph[rel.target_id].incoming.push({
          relationship: rel,
          source: rel.source_id
        });
      }
    });
    
    // Find starting points (concepts with no incoming relationships)
    const startingPoints = Object.values(graph)
      .filter(node => node.incoming.length === 0)
      .map(node => node.concept);
    
    // If no starting points, use concepts with the fewest incoming relationships
    let orderedConcepts = [];
    if (startingPoints.length === 0) {
      orderedConcepts = Object.values(graph)
        .sort((a, b) => a.incoming.length - b.incoming.length)
        .map(node => node.concept);
    } else {
      // Start with starting points
      orderedConcepts = [...startingPoints];
      
      // Add remaining concepts in topological order (if possible)
      const visited = new Set(orderedConcepts.map(c => c.id));
      
      // Keep adding concepts until all are visited
      while (visited.size < concepts.length) {
        let added = false;
        
        for (const concept of concepts) {
          if (visited.has(concept.id)) continue;
          
          // Check if all prerequisites are visited
          const prerequisites = graph[concept.id].incoming.map(rel => rel.source);
          const allPrerequisitesVisited = prerequisites.every(prereq => visited.has(prereq));
          
          if (allPrerequisitesVisited) {
            orderedConcepts.push(concept);
            visited.add(concept.id);
            added = true;
          }
        }
        
        // If no concepts were added in this iteration, there might be a cycle
        // Add the concept with the most visited prerequisites
        if (!added) {
          const remainingConcepts = concepts.filter(c => !visited.has(c.id));
          
          const conceptWithMostVisitedPrereqs = remainingConcepts
            .map(concept => {
              const prerequisites = graph[concept.id].incoming.map(rel => rel.source);
              const visitedPrereqs = prerequisites.filter(prereq => visited.has(prereq));
              return { concept, visitedCount: visitedPrereqs.length };
            })
            .sort((a, b) => b.visitedCount - a.visitedCount)[0];
          
          orderedConcepts.push(conceptWithMostVisitedPrereqs.concept);
          visited.add(conceptWithMostVisitedPrereqs.concept.id);
        }
      }
    }
    
    // Create path data
    const pathData = {
      title: options.title || `Learning Path for ${map.title}`,
      description: options.description || `Automatically generated from the knowledge map "${map.title}"`,
      mapId,
      isPublic: options.isPublic !== undefined ? options.isPublic : false,
      difficultyLevel: options.difficultyLevel || 'intermediate',
      estimatedDuration: options.estimatedDuration || 60, // minutes
      pathData: {
        generatedFrom: 'map',
        generationOptions: options,
        generatedAt: new Date().toISOString()
      },
      nodes: orderedConcepts.map(concept => ({
        conceptId: concept.id,
        title: concept.title,
        description: concept.description,
        content: concept.content,
        completionCriteria: {},
        resources: {},
        nodeData: {
          conceptType: concept.concept_type,
          originalPosition: {
            x: concept.position_x,
            y: concept.position_y
          }
        }
      }))
    };
    
    // Create the path
    return this.createPath(pathData);
  }
  
  /**
   * Update overall path progress based on node progress
   * @param {string} pathId - Path ID
   * @returns {Promise<Object>} Updated path progress
   * @private
   */
  async _updateOverallPathProgress(pathId) {
    // Get all nodes for this path
    const { data: nodes, error: nodesError } = await supabase
      .from('path_nodes')
      .select('id')
      .eq('path_id', pathId);
    
    if (nodesError) throw nodesError;
    
    if (nodes.length === 0) return null;
    
    // Get progress for all nodes
    const { data: nodeProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', this.userId)
      .eq('progress_type', 'node')
      .eq('path_id', pathId);
    
    if (progressError) throw progressError;
    
    // Calculate overall completion percentage
    const totalNodes = nodes.length;
    const completedNodes = nodeProgress.filter(p => p.status === 'completed').length;
    const inProgressNodes = nodeProgress.filter(p => p.status === 'in_progress').length;
    
    let completionPercentage = 0;
    if (totalNodes > 0) {
      // Count completed nodes as 100% and in-progress nodes based on their completion percentage
      const completedPercentage = (completedNodes / totalNodes) * 100;
      
      // Calculate average completion percentage for in-progress nodes
      let inProgressPercentage = 0;
      if (inProgressNodes > 0) {
        const inProgressTotal = nodeProgress
          .filter(p => p.status === 'in_progress')
          .reduce((sum, p) => sum + (p.completion_percentage || 0), 0);
        
        inProgressPercentage = (inProgressTotal / 100) * (inProgressNodes / totalNodes) * 100;
      }
      
      completionPercentage = completedPercentage + inProgressPercentage;
    }
    
    // Determine overall status
    let status = 'not_started';
    if (completedNodes === totalNodes) {
      status = 'completed';
    } else if (completedNodes > 0 || inProgressNodes > 0) {
      status = 'in_progress';
    }
    
    // Update path progress
    return this.updatePathProgress(pathId, {
      status,
      completionPercentage,
      progressData: {
        totalNodes,
        completedNodes,
        inProgressNodes,
        lastUpdated: new Date().toISOString()
      }
    });
  }
}

/**
 * Hook for using the Learning Path Service
 * @returns {Object} Learning Path Service methods
 */
export function useLearningPath() {
  const service = LearningPathService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createPath: service.createPath.bind(service),
    getUserPaths: service.getUserPaths.bind(service),
    getPathById: service.getPathById.bind(service),
    updatePath: service.updatePath.bind(service),
    deletePath: service.deletePath.bind(service),
    addNode: service.addNode.bind(service),
    updateNode: service.updateNode.bind(service),
    deleteNode: service.deleteNode.bind(service),
    reorderNodes: service.reorderNodes.bind(service),
    updatePathProgress: service.updatePathProgress.bind(service),
    updateNodeProgress: service.updateNodeProgress.bind(service),
    generateFromMap: service.generateFromMap.bind(service)
  };
}
