/**
 * Concept Graph Service
 * Service for analyzing and working with concept graphs
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Concept Graph Service class
 */
export class ConceptGraphService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {ConceptGraphService} The singleton instance
   */
  static getInstance() {
    if (!ConceptGraphService.instance) {
      ConceptGraphService.instance = new ConceptGraphService();
    }
    return ConceptGraphService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Concept Graph Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Concept Graph Service:', error);
      return false;
    }
  }
  
  /**
   * Analyze a concept graph
   * @param {string} mapId - Map ID
   * @returns {Promise<Object>} Graph analysis
   */
  async analyzeGraph(mapId) {
    if (!this.initialized) {
      throw new Error('Concept Graph Service not initialized');
    }
    
    // Check if the user has access to this map
    await this._checkViewPermission(mapId);
    
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
    
    // Calculate basic metrics
    const conceptCount = concepts.length;
    const relationshipCount = relationships.length;
    const density = conceptCount > 1 ? 
      relationshipCount / (conceptCount * (conceptCount - 1)) : 
      0;
    
    // Calculate degree for each concept
    const degrees = {};
    concepts.forEach(concept => {
      degrees[concept.id] = {
        inDegree: 0,
        outDegree: 0,
        total: 0
      };
    });
    
    relationships.forEach(rel => {
      if (degrees[rel.source_id]) {
        degrees[rel.source_id].outDegree += 1;
        degrees[rel.source_id].total += 1;
      }
      
      if (degrees[rel.target_id]) {
        degrees[rel.target_id].inDegree += 1;
        degrees[rel.target_id].total += 1;
      }
      
      // For bidirectional relationships, count both ways
      if (rel.bidirectional) {
        if (degrees[rel.target_id]) {
          degrees[rel.target_id].outDegree += 1;
          degrees[rel.target_id].total += 1;
        }
        
        if (degrees[rel.source_id]) {
          degrees[rel.source_id].inDegree += 1;
          degrees[rel.source_id].total += 1;
        }
      }
    });
    
    // Find central concepts (highest degree)
    const centralConcepts = concepts
      .map(concept => ({
        ...concept,
        degree: degrees[concept.id]?.total || 0
      }))
      .sort((a, b) => b.degree - a.degree)
      .slice(0, 5);
    
    // Find isolated concepts (no connections)
    const isolatedConcepts = concepts.filter(
      concept => (degrees[concept.id]?.total || 0) === 0
    );
    
    // Find relationship types distribution
    const relationshipTypes = {};
    relationships.forEach(rel => {
      relationshipTypes[rel.relationship_type] = 
        (relationshipTypes[rel.relationship_type] || 0) + 1;
    });
    
    // Find concept types distribution
    const conceptTypes = {};
    concepts.forEach(concept => {
      if (concept.concept_type) {
        conceptTypes[concept.concept_type] = 
          (conceptTypes[concept.concept_type] || 0) + 1;
      }
    });
    
    return {
      metrics: {
        conceptCount,
        relationshipCount,
        density,
        averageDegree: conceptCount > 0 ? 
          relationshipCount * 2 / conceptCount : 
          0,
        isolatedConceptsCount: isolatedConcepts.length
      },
      centralConcepts,
      isolatedConcepts,
      relationshipTypes,
      conceptTypes,
      degrees
    };
  }
  
  /**
   * Find the shortest path between two concepts
   * @param {string} mapId - Map ID
   * @param {string} sourceId - Source concept ID
   * @param {string} targetId - Target concept ID
   * @returns {Promise<Object>} Path information
   */
  async findShortestPath(mapId, sourceId, targetId) {
    if (!this.initialized) {
      throw new Error('Concept Graph Service not initialized');
    }
    
    // Check if the user has access to this map
    await this._checkViewPermission(mapId);
    
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
      graph[concept.id] = [];
    });
    
    relationships.forEach(rel => {
      // Add forward direction
      if (graph[rel.source_id]) {
        graph[rel.source_id].push({
          id: rel.id,
          target: rel.target_id,
          type: rel.relationship_type,
          label: rel.label,
          bidirectional: rel.bidirectional
        });
      }
      
      // Add reverse direction for bidirectional relationships
      if (rel.bidirectional && graph[rel.target_id]) {
        graph[rel.target_id].push({
          id: rel.id,
          target: rel.source_id,
          type: rel.relationship_type,
          label: rel.label,
          bidirectional: rel.bidirectional
        });
      }
    });
    
    // Breadth-first search for shortest path
    const queue = [{ id: sourceId, path: [], relationships: [] }];
    const visited = new Set([sourceId]);
    
    while (queue.length > 0) {
      const { id, path, relationships } = queue.shift();
      
      if (id === targetId) {
        // Found the target, return the path
        const pathConcepts = await this._getConceptsByIds([sourceId, ...path]);
        
        return {
          found: true,
          path: [sourceId, ...path],
          relationships,
          pathConcepts,
          length: path.length
        };
      }
      
      // Explore neighbors
      const neighbors = graph[id] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.target)) {
          visited.add(neighbor.target);
          queue.push({
            id: neighbor.target,
            path: [...path, neighbor.target],
            relationships: [...relationships, neighbor.id]
          });
        }
      }
    }
    
    // No path found
    return {
      found: false,
      path: [],
      relationships: [],
      pathConcepts: [],
      length: 0
    };
  }
  
  /**
   * Find related concepts
   * @param {string} mapId - Map ID
   * @param {string} conceptId - Concept ID
   * @param {number} depth - Search depth
   * @returns {Promise<Object>} Related concepts
   */
  async findRelatedConcepts(mapId, conceptId, depth = 1) {
    if (!this.initialized) {
      throw new Error('Concept Graph Service not initialized');
    }
    
    // Check if the user has access to this map
    await this._checkViewPermission(mapId);
    
    // Get relationships
    const { data: relationships, error: relError } = await supabase
      .from('relationships')
      .select('*')
      .eq('map_id', mapId)
      .or(`source_id.eq.${conceptId},target_id.eq.${conceptId}`);
    
    if (relError) throw relError;
    
    // Get directly connected concept IDs
    const directlyConnectedIds = new Set();
    relationships.forEach(rel => {
      if (rel.source_id === conceptId) {
        directlyConnectedIds.add(rel.target_id);
      } else if (rel.target_id === conceptId) {
        directlyConnectedIds.add(rel.source_id);
      }
    });
    
    // If depth > 1, find additional connections
    let allConnectedIds = new Set([...directlyConnectedIds]);
    if (depth > 1) {
      const secondaryIds = new Set([...directlyConnectedIds]);
      
      for (let i = 1; i < depth; i++) {
        const currentIds = [...secondaryIds];
        secondaryIds.clear();
        
        // For each ID in the current level
        for (const id of currentIds) {
          // Find its connections
          const { data: secondaryRels, error: secError } = await supabase
            .from('relationships')
            .select('*')
            .eq('map_id', mapId)
            .or(`source_id.eq.${id},target_id.eq.${id}`);
          
          if (secError) throw secError;
          
          // Add new connections
          secondaryRels.forEach(rel => {
            const newId = rel.source_id === id ? rel.target_id : rel.source_id;
            if (newId !== conceptId && !allConnectedIds.has(newId)) {
              secondaryIds.add(newId);
              allConnectedIds.add(newId);
            }
          });
        }
        
        // If no new connections were found, break early
        if (secondaryIds.size === 0) break;
      }
    }
    
    // Get concept details
    const connectedConceptIds = [...allConnectedIds];
    const concepts = await this._getConceptsByIds(connectedConceptIds);
    
    // Get all relationships between these concepts
    const { data: allRelationships, error: allRelError } = await supabase
      .from('relationships')
      .select('*')
      .eq('map_id', mapId)
      .in('source_id', [conceptId, ...connectedConceptIds])
      .in('target_id', [conceptId, ...connectedConceptIds]);
    
    if (allRelError) throw allRelError;
    
    // Get the central concept
    const { data: centralConcept, error: centralError } = await supabase
      .from('concepts')
      .select('*')
      .eq('id', conceptId)
      .single();
    
    if (centralError) throw centralError;
    
    return {
      centralConcept,
      relatedConcepts: concepts,
      relationships: allRelationships,
      directConnections: [...directlyConnectedIds],
      indirectConnections: [...allConnectedIds].filter(id => !directlyConnectedIds.has(id))
    };
  }
  
  /**
   * Generate a concept map from text
   * @param {string} text - Text to analyze
   * @returns {Promise<Object>} Generated concept map
   */
  async generateFromText(text) {
    if (!this.initialized) {
      throw new Error('Concept Graph Service not initialized');
    }
    
    // This is a placeholder for AI-based concept extraction
    // In a real implementation, this would call an AI service
    
    // Extract key concepts (simplified example)
    const concepts = [];
    const relationships = [];
    
    // Simple keyword extraction (for demonstration)
    const words = text.split(/\s+/);
    const wordFrequency = {};
    
    words.forEach(word => {
      // Clean the word
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (cleanWord.length > 3) { // Only consider words longer than 3 characters
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });
    
    // Find top keywords
    const topKeywords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    
    // Create concepts from top keywords
    const conceptMap = {};
    topKeywords.forEach((keyword, index) => {
      const concept = {
        id: `temp_${index}`,
        title: keyword.charAt(0).toUpperCase() + keyword.slice(1),
        positionX: 100 + Math.random() * 400,
        positionY: 100 + Math.random() * 400,
        conceptType: 'keyword'
      };
      
      concepts.push(concept);
      conceptMap[keyword] = concept.id;
    });
    
    // Create simple relationships based on word proximity
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i].toLowerCase().replace(/[^\w]/g, '');
      const word2 = words[i + 1].toLowerCase().replace(/[^\w]/g, '');
      
      if (conceptMap[word1] && conceptMap[word2] && conceptMap[word1] !== conceptMap[word2]) {
        // Check if this relationship already exists
        const existingRel = relationships.find(
          rel => rel.sourceId === conceptMap[word1] && rel.targetId === conceptMap[word2]
        );
        
        if (!existingRel) {
          relationships.push({
            sourceId: conceptMap[word1],
            targetId: conceptMap[word2],
            relationshipType: 'related',
            label: 'related to'
          });
        }
      }
    }
    
    return {
      title: 'Generated from Text',
      description: `Automatically generated from text (${text.length} characters)`,
      concepts,
      relationships
    };
  }
  
  /**
   * Get concepts by IDs
   * @param {Array<string>} ids - Concept IDs
   * @returns {Promise<Array>} Concepts
   * @private
   */
  async _getConceptsByIds(ids) {
    if (ids.length === 0) return [];
    
    const { data, error } = await supabase
      .from('concepts')
      .select('*')
      .in('id', ids);
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Check if the user has permission to view a map
   * @param {string} mapId - Map ID
   * @returns {Promise<boolean>} Has permission
   * @private
   */
  async _checkViewPermission(mapId) {
    // Check if the user is the owner of the map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('user_id, is_public')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    if (map.user_id === this.userId || map.is_public) {
      return true;
    }
    
    // Check if the user is a collaborator
    const { data: collaborator, error: collabError } = await supabase
      .from('map_collaborators')
      .select('role')
      .eq('map_id', mapId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (collabError) throw collabError;
    
    if (!collaborator) {
      throw new Error('You do not have permission to view this map');
    }
    
    return true;
  }
}

/**
 * Hook for using the Concept Graph Service
 * @returns {Object} Concept Graph Service methods
 */
export function useConceptGraph() {
  const service = ConceptGraphService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    analyzeGraph: service.analyzeGraph.bind(service),
    findShortestPath: service.findShortestPath.bind(service),
    findRelatedConcepts: service.findRelatedConcepts.bind(service),
    generateFromText: service.generateFromText.bind(service)
  };
}
