/**
 * Knowledge Graph Service
 * Manages concept relationships and provides the foundation for knowledge visualization
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Knowledge Graph Service class
 */
export class KnowledgeGraphService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.graphCache = null;
  }
  
  /**
   * Get the singleton instance
   * @returns {KnowledgeGraphService} The singleton instance
   */
  static getInstance() {
    if (!KnowledgeGraphService.instance) {
      KnowledgeGraphService.instance = new KnowledgeGraphService();
    }
    return KnowledgeGraphService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Knowledge Graph Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Knowledge Graph Service:', error);
      return false;
    }
  }
  
  /**
   * Add a concept to the knowledge graph
   * @param {Object} conceptData - Concept data
   * @param {string} conceptData.name - Concept name
   * @param {string} conceptData.description - Concept description
   * @param {string} [conceptData.source] - Source of the concept (e.g., 'document', 'user')
   * @param {string} [conceptData.sourceId] - Source ID
   * @param {Array<string>} [conceptData.tags] - Concept tags
   * @returns {Promise<Object>} Created concept
   */
  async addConcept(conceptData) {
    if (!this.initialized) {
      throw new Error('Knowledge Graph Service not initialized');
    }
    
    const {
      name,
      description,
      source = 'user',
      sourceId = null,
      tags = []
    } = conceptData;
    
    // Check if concept already exists
    const { data: existingConcept, error: checkError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .eq('user_id', this.userId)
      .ilike('name', name)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingConcept) {
      // Update existing concept
      const { data, error } = await supabase
        .from('knowledge_concepts')
        .update({
          description: description || existingConcept.description,
          tags: [...new Set([...existingConcept.tags, ...tags])],
          updated_at: new Date().toISOString()
        })
        .eq('id', existingConcept.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    }
    
    // Create new concept
    const { data, error } = await supabase
      .from('knowledge_concepts')
      .insert({
        user_id: this.userId,
        name,
        description,
        source,
        source_id: sourceId,
        tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidate cache
    this.graphCache = null;
    
    return data;
  }
  
  /**
   * Add a relationship between concepts
   * @param {Object} relationshipData - Relationship data
   * @param {string} relationshipData.sourceConcept - Source concept ID or name
   * @param {string} relationshipData.targetConcept - Target concept ID or name
   * @param {string} [relationshipData.type='related'] - Relationship type
   * @param {number} [relationshipData.strength=1] - Relationship strength (0-1)
   * @param {string} [relationshipData.description] - Relationship description
   * @returns {Promise<Object>} Created relationship
   */
  async addRelationship(relationshipData) {
    if (!this.initialized) {
      throw new Error('Knowledge Graph Service not initialized');
    }
    
    const {
      sourceConcept,
      targetConcept,
      type = 'related',
      strength = 1,
      description = ''
    } = relationshipData;
    
    // Get or create source concept
    let sourceConceptId = sourceConcept;
    if (!this.isUUID(sourceConcept)) {
      const source = await this.getOrCreateConceptByName(sourceConcept);
      sourceConceptId = source.id;
    }
    
    // Get or create target concept
    let targetConceptId = targetConcept;
    if (!this.isUUID(targetConcept)) {
      const target = await this.getOrCreateConceptByName(targetConcept);
      targetConceptId = target.id;
    }
    
    // Check if relationship already exists
    const { data: existingRelationship, error: checkError } = await supabase
      .from('knowledge_relationships')
      .select('*')
      .eq('user_id', this.userId)
      .eq('source_concept_id', sourceConceptId)
      .eq('target_concept_id', targetConceptId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingRelationship) {
      // Update existing relationship
      const { data, error } = await supabase
        .from('knowledge_relationships')
        .update({
          type,
          strength: Math.max(existingRelationship.strength, strength),
          description: description || existingRelationship.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRelationship.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Invalidate cache
      this.graphCache = null;
      
      return data;
    }
    
    // Create new relationship
    const { data, error } = await supabase
      .from('knowledge_relationships')
      .insert({
        user_id: this.userId,
        source_concept_id: sourceConceptId,
        target_concept_id: targetConceptId,
        type,
        strength,
        description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidate cache
    this.graphCache = null;
    
    return data;
  }
  
  /**
   * Get or create a concept by name
   * @param {string} name - Concept name
   * @returns {Promise<Object>} Concept
   * @private
   */
  async getOrCreateConceptByName(name) {
    // Check if concept exists
    const { data: existingConcept, error: checkError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .eq('user_id', this.userId)
      .ilike('name', name)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingConcept) {
      return existingConcept;
    }
    
    // Create new concept
    const { data, error } = await supabase
      .from('knowledge_concepts')
      .insert({
        user_id: this.userId,
        name,
        description: '',
        source: 'auto',
        tags: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Check if a string is a UUID
   * @param {string} str - String to check
   * @returns {boolean} Whether the string is a UUID
   * @private
   */
  isUUID(str) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  }
  
  /**
   * Get the knowledge graph
   * @param {Object} [options] - Options
   * @param {Array<string>} [options.tags] - Filter by tags
   * @param {string} [options.source] - Filter by source
   * @param {number} [options.minStrength=0] - Minimum relationship strength
   * @returns {Promise<Object>} Knowledge graph
   */
  async getGraph(options = {}) {
    if (!this.initialized) {
      throw new Error('Knowledge Graph Service not initialized');
    }
    
    const {
      tags = [],
      source,
      minStrength = 0
    } = options;
    
    // Use cache if available and no filters are applied
    if (this.graphCache && !tags.length && !source && minStrength === 0) {
      return this.graphCache;
    }
    
    // Get concepts
    let conceptsQuery = supabase
      .from('knowledge_concepts')
      .select('*')
      .eq('user_id', this.userId);
    
    if (tags.length > 0) {
      conceptsQuery = conceptsQuery.contains('tags', tags);
    }
    
    if (source) {
      conceptsQuery = conceptsQuery.eq('source', source);
    }
    
    const { data: concepts, error: conceptsError } = await conceptsQuery;
    
    if (conceptsError) throw conceptsError;
    
    // Get relationships
    let relationshipsQuery = supabase
      .from('knowledge_relationships')
      .select(`
        id,
        source_concept_id,
        target_concept_id,
        type,
        strength,
        description
      `)
      .eq('user_id', this.userId);
    
    if (minStrength > 0) {
      relationshipsQuery = relationshipsQuery.gte('strength', minStrength);
    }
    
    const { data: relationships, error: relationshipsError } = await relationshipsQuery;
    
    if (relationshipsError) throw relationshipsError;
    
    // Filter relationships to only include concepts that match the filters
    const conceptIds = concepts.map(concept => concept.id);
    const filteredRelationships = relationships.filter(
      rel => conceptIds.includes(rel.source_concept_id) && conceptIds.includes(rel.target_concept_id)
    );
    
    // Build graph
    const graph = {
      nodes: concepts.map(concept => ({
        id: concept.id,
        label: concept.name,
        description: concept.description,
        tags: concept.tags,
        source: concept.source,
        sourceId: concept.source_id
      })),
      edges: filteredRelationships.map(rel => ({
        id: rel.id,
        source: rel.source_concept_id,
        target: rel.target_concept_id,
        type: rel.type,
        strength: rel.strength,
        description: rel.description
      }))
    };
    
    // Cache graph if no filters are applied
    if (!tags.length && !source && minStrength === 0) {
      this.graphCache = graph;
    }
    
    return graph;
  }
  
  /**
   * Get a concept by ID
   * @param {string} conceptId - Concept ID
   * @returns {Promise<Object>} Concept
   */
  async getConcept(conceptId) {
    if (!this.initialized) {
      throw new Error('Knowledge Graph Service not initialized');
    }
    
    const { data, error } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .eq('id', conceptId)
      .eq('user_id', this.userId)
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Get related concepts
   * @param {string} conceptId - Concept ID
   * @param {Object} [options] - Options
   * @param {number} [options.maxDepth=1] - Maximum relationship depth
   * @param {number} [options.limit=10] - Maximum number of related concepts
   * @param {number} [options.minStrength=0] - Minimum relationship strength
   * @returns {Promise<Array<Object>>} Related concepts
   */
  async getRelatedConcepts(conceptId, options = {}) {
    if (!this.initialized) {
      throw new Error('Knowledge Graph Service not initialized');
    }
    
    const {
      maxDepth = 1,
      limit = 10,
      minStrength = 0
    } = options;
    
    // Get direct relationships
    const { data: directRelationships, error: directError } = await supabase
      .from('knowledge_relationships')
      .select(`
        id,
        source_concept_id,
        target_concept_id,
        type,
        strength,
        description
      `)
      .eq('user_id', this.userId)
      .or(`source_concept_id.eq.${conceptId},target_concept_id.eq.${conceptId}`)
      .gte('strength', minStrength);
    
    if (directError) throw directError;
    
    // Get related concept IDs
    const relatedConceptIds = new Set();
    
    for (const rel of directRelationships) {
      if (rel.source_concept_id === conceptId) {
        relatedConceptIds.add(rel.target_concept_id);
      } else {
        relatedConceptIds.add(rel.source_concept_id);
      }
    }
    
    // If maxDepth > 1, get indirect relationships
    if (maxDepth > 1 && relatedConceptIds.size > 0) {
      // TODO: Implement multi-level traversal
      // This would require recursive queries or multiple queries
    }
    
    // Get related concepts
    const { data: relatedConcepts, error: conceptsError } = await supabase
      .from('knowledge_concepts')
      .select('*')
      .eq('user_id', this.userId)
      .in('id', Array.from(relatedConceptIds))
      .limit(limit);
    
    if (conceptsError) throw conceptsError;
    
    // Add relationship information to concepts
    const result = relatedConcepts.map(concept => {
      const relationships = directRelationships.filter(
        rel => rel.source_concept_id === concept.id || rel.target_concept_id === concept.id
      );
      
      return {
        ...concept,
        relationships
      };
    });
    
    return result;
  }
  
  /**
   * Find a learning path between concepts
   * @param {string} startConceptId - Start concept ID
   * @param {string} endConceptId - End concept ID
   * @param {Object} [options] - Options
   * @param {number} [options.maxDepth=5] - Maximum path depth
   * @param {number} [options.minStrength=0] - Minimum relationship strength
   * @returns {Promise<Array<Object>>} Learning path
   */
  async findLearningPath(startConceptId, endConceptId, options = {}) {
    if (!this.initialized) {
      throw new Error('Knowledge Graph Service not initialized');
    }
    
    const {
      maxDepth = 5,
      minStrength = 0
    } = options;
    
    // Get the full graph
    const graph = await this.getGraph({ minStrength });
    
    // Create an adjacency list for the graph
    const adjacencyList = new Map();
    
    for (const node of graph.nodes) {
      adjacencyList.set(node.id, []);
    }
    
    for (const edge of graph.edges) {
      adjacencyList.get(edge.source).push({
        id: edge.target,
        edge
      });
      
      // Add reverse direction for undirected graph
      adjacencyList.get(edge.target).push({
        id: edge.source,
        edge
      });
    }
    
    // Breadth-first search to find the shortest path
    const queue = [{ id: startConceptId, path: [] }];
    const visited = new Set([startConceptId]);
    
    while (queue.length > 0) {
      const { id, path } = queue.shift();
      
      // Check if we've reached the end concept
      if (id === endConceptId) {
        // Return the path
        return path;
      }
      
      // Check if we've reached the maximum depth
      if (path.length >= maxDepth) {
        continue;
      }
      
      // Add neighbors to the queue
      const neighbors = adjacencyList.get(id) || [];
      
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          
          queue.push({
            id: neighbor.id,
            path: [...path, {
              from: id,
              to: neighbor.id,
              edge: neighbor.edge
            }]
          });
        }
      }
    }
    
    // No path found
    return [];
  }
  
  /**
   * Extract concepts and relationships from text
   * @param {string} text - Text to extract from
   * @param {Object} [options] - Options
   * @param {string} [options.source='text'] - Source of the concepts
   * @param {string} [options.sourceId] - Source ID
   * @returns {Promise<Object>} Extracted concepts and relationships
   */
  async extractFromText(text, options = {}) {
    if (!this.initialized) {
      throw new Error('Knowledge Graph Service not initialized');
    }
    
    const {
      source = 'text',
      sourceId = null
    } = options;
    
    // In a real implementation, this would use NLP to extract concepts and relationships
    // For now, we'll use a simple approach to extract potential concepts
    
    // Extract potential concepts (words that start with a capital letter)
    const potentialConcepts = new Set();
    const words = text.split(/\s+/);
    
    for (const word of words) {
      // Clean the word
      const cleanWord = word.replace(/[^\w\s]/g, '');
      
      // Check if it starts with a capital letter and is at least 3 characters long
      if (cleanWord.length >= 3 && /^[A-Z]/.test(cleanWord)) {
        potentialConcepts.add(cleanWord);
      }
    }
    
    // Create concepts
    const concepts = [];
    
    for (const conceptName of potentialConcepts) {
      try {
        const concept = await this.addConcept({
          name: conceptName,
          description: `Extracted from text: "${text.substring(0, 100)}..."`,
          source,
          sourceId,
          tags: ['extracted']
        });
        
        concepts.push(concept);
      } catch (error) {
        console.error(`Error adding concept ${conceptName}:`, error);
      }
    }
    
    // Create relationships between concepts that appear close to each other
    const relationships = [];
    const conceptArray = Array.from(potentialConcepts);
    
    for (let i = 0; i < conceptArray.length; i++) {
      for (let j = i + 1; j < conceptArray.length && j < i + 5; j++) {
        try {
          const relationship = await this.addRelationship({
            sourceConcept: conceptArray[i],
            targetConcept: conceptArray[j],
            type: 'co-occurrence',
            strength: 0.5,
            description: `Co-occurred in text: "${text.substring(0, 100)}..."`
          });
          
          relationships.push(relationship);
        } catch (error) {
          console.error(`Error adding relationship between ${conceptArray[i]} and ${conceptArray[j]}:`, error);
        }
      }
    }
    
    return {
      concepts,
      relationships
    };
  }
  
  /**
   * Extract concepts and relationships from a document
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Extracted concepts and relationships
   */
  async extractFromDocument(documentId) {
    if (!this.initialized) {
      throw new Error('Knowledge Graph Service not initialized');
    }
    
    // Get document from database
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', this.userId)
      .single();
    
    if (error) throw error;
    
    // Check if document processing is complete
    if (document.status !== 'completed') {
      throw new Error('Document processing is not complete');
    }
    
    const concepts = [];
    const relationships = [];
    
    // Extract from document structure
    if (document.structure && document.structure.sections) {
      for (const section of document.structure.sections) {
        try {
          // Add section title as concept
          const sectionConcept = await this.addConcept({
            name: section.title,
            description: section.content,
            source: 'document',
            sourceId: document.id,
            tags: ['document', 'section']
          });
          
          concepts.push(sectionConcept);
          
          // Process subsections if they exist
          if (section.subsections && section.subsections.length > 0) {
            for (const subsection of section.subsections) {
              try {
                // Add subsection title as concept
                const subsectionConcept = await this.addConcept({
                  name: subsection.title,
                  description: subsection.content,
                  source: 'document',
                  sourceId: document.id,
                  tags: ['document', 'subsection']
                });
                
                concepts.push(subsectionConcept);
                
                // Add relationship between section and subsection
                const relationship = await this.addRelationship({
                  sourceConcept: sectionConcept.id,
                  targetConcept: subsectionConcept.id,
                  type: 'contains',
                  strength: 1,
                  description: 'Section contains subsection'
                });
                
                relationships.push(relationship);
              } catch (error) {
                console.error(`Error processing subsection ${subsection.title}:`, error);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing section ${section.title}:`, error);
        }
      }
    }
    
    // Extract from key concepts
    if (document.analysis && document.analysis.keyConcepts) {
      for (const keyConcept of document.analysis.keyConcepts) {
        try {
          // Add key concept
          const concept = await this.addConcept({
            name: keyConcept.name,
            description: `Key concept from document: ${document.file_name}`,
            source: 'document',
            sourceId: document.id,
            tags: ['document', 'key-concept']
          });
          
          concepts.push(concept);
          
          // Add relationships between key concept and related concepts
          if (keyConcept.relatedConcepts && keyConcept.relatedConcepts.length > 0) {
            for (const relatedConceptName of keyConcept.relatedConcepts) {
              try {
                // Add related concept
                const relatedConcept = await this.addConcept({
                  name: relatedConceptName,
                  description: `Related to key concept: ${keyConcept.name}`,
                  source: 'document',
                  sourceId: document.id,
                  tags: ['document', 'related-concept']
                });
                
                // Add relationship
                const relationship = await this.addRelationship({
                  sourceConcept: concept.id,
                  targetConcept: relatedConcept.id,
                  type: 'related',
                  strength: 0.8,
                  description: 'Related concepts from document analysis'
                });
                
                relationships.push(relationship);
              } catch (error) {
                console.error(`Error processing related concept ${relatedConceptName}:`, error);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing key concept ${keyConcept.name}:`, error);
        }
      }
    }
    
    return {
      concepts,
      relationships
    };
  }
}

/**
 * Hook for using the Knowledge Graph Service
 * @returns {Object} Knowledge Graph Service methods
 */
export function useKnowledgeGraph() {
  const service = KnowledgeGraphService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    addConcept: service.addConcept.bind(service),
    addRelationship: service.addRelationship.bind(service),
    getGraph: service.getGraph.bind(service),
    getConcept: service.getConcept.bind(service),
    getRelatedConcepts: service.getRelatedConcepts.bind(service),
    findLearningPath: service.findLearningPath.bind(service),
    extractFromText: service.extractFromText.bind(service),
    extractFromDocument: service.extractFromDocument.bind(service)
  };
}
