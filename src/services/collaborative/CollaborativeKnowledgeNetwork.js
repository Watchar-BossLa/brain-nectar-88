/**
 * CollaborativeKnowledgeNetwork - Enables collaborative learning and knowledge sharing
 * This service provides a platform for students to collaborate, share insights,
 * and build a collective knowledge base.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} KnowledgeNode
 * @property {string} id - Node identifier
 * @property {string} title - Node title
 * @property {string} content - Node content
 * @property {string} type - Node type (concept, question, insight, resource)
 * @property {string} creatorId - Creator user identifier
 * @property {Array<string>} tags - Node tags
 * @property {Array<string>} relatedNodes - Related node identifiers
 * @property {Object} metadata - Additional metadata
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} Collaboration
 * @property {string} id - Collaboration identifier
 * @property {string} title - Collaboration title
 * @property {string} description - Collaboration description
 * @property {string} creatorId - Creator user identifier
 * @property {Array<string>} participantIds - Participant user identifiers
 * @property {Array<string>} nodeIds - Knowledge node identifiers
 * @property {Object} settings - Collaboration settings
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Update timestamp
 */

/**
 * @typedef {Object} Contribution
 * @property {string} id - Contribution identifier
 * @property {string} userId - User identifier
 * @property {string} nodeId - Knowledge node identifier
 * @property {string} type - Contribution type (create, edit, comment, vote)
 * @property {Object} content - Contribution content
 * @property {Date} createdAt - Creation timestamp
 */

export class CollaborativeKnowledgeNetwork {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.knowledgeNodes = new Map();
    this.collaborations = new Map();
    this.userContributions = new Map();
    this.activeCollaborations = new Map();
  }
  
  /**
   * Get the CollaborativeKnowledgeNetwork singleton instance
   * @returns {CollaborativeKnowledgeNetwork} The singleton instance
   */
  static getInstance() {
    if (!CollaborativeKnowledgeNetwork.instance) {
      CollaborativeKnowledgeNetwork.instance = new CollaborativeKnowledgeNetwork();
    }
    return CollaborativeKnowledgeNetwork.instance;
  }
  
  /**
   * Initialize the service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      console.log('Initializing Collaborative Knowledge Network');
      
      // Set up real-time subscriptions
      this.setupRealtimeSubscriptions();
      
      this.initialized = true;
      console.log('Collaborative Knowledge Network initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Collaborative Knowledge Network:', error);
      return false;
    }
  }
  
  /**
   * Set up real-time subscriptions for collaborative features
   * @private
   */
  setupRealtimeSubscriptions() {
    // Subscribe to knowledge node changes
    const nodeSubscription = supabase
      .channel('knowledge-nodes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'knowledge_nodes'
      }, (payload) => {
        this.handleKnowledgeNodeChange(payload);
      })
      .subscribe();
    
    // Subscribe to collaboration changes
    const collaborationSubscription = supabase
      .channel('collaborations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'collaborations'
      }, (payload) => {
        this.handleCollaborationChange(payload);
      })
      .subscribe();
    
    // Subscribe to contribution changes
    const contributionSubscription = supabase
      .channel('contributions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'contributions'
      }, (payload) => {
        this.handleContributionChange(payload);
      })
      .subscribe();
  }
  
  /**
   * Handle real-time knowledge node changes
   * @param {Object} payload - Change payload
   * @private
   */
  handleKnowledgeNodeChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      this.knowledgeNodes.set(newRecord.id, newRecord);
      
      // Notify active collaborations that include this node
      this.notifyCollaborationsOfNodeChange(newRecord.id, eventType, newRecord);
    } else if (eventType === 'DELETE') {
      this.knowledgeNodes.delete(oldRecord.id);
      
      // Notify active collaborations that include this node
      this.notifyCollaborationsOfNodeChange(oldRecord.id, eventType, oldRecord);
    }
  }
  
  /**
   * Handle real-time collaboration changes
   * @param {Object} payload - Change payload
   * @private
   */
  handleCollaborationChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      this.collaborations.set(newRecord.id, newRecord);
      
      // Update active collaboration if it exists
      if (this.activeCollaborations.has(newRecord.id)) {
        this.activeCollaborations.set(newRecord.id, {
          ...this.activeCollaborations.get(newRecord.id),
          collaboration: newRecord
        });
      }
    } else if (eventType === 'DELETE') {
      this.collaborations.delete(oldRecord.id);
      
      // Remove from active collaborations
      this.activeCollaborations.delete(oldRecord.id);
    }
  }
  
  /**
   * Handle real-time contribution changes
   * @param {Object} payload - Change payload
   * @private
   */
  handleContributionChange(payload) {
    const { eventType, new: newRecord } = payload;
    
    if (eventType === 'INSERT') {
      // Update user contributions
      if (!this.userContributions.has(newRecord.user_id)) {
        this.userContributions.set(newRecord.user_id, []);
      }
      
      this.userContributions.get(newRecord.user_id).push(newRecord);
      
      // Notify active collaborations
      this.notifyCollaborationsOfContribution(newRecord);
    }
  }
  
  /**
   * Notify active collaborations of a node change
   * @param {string} nodeId - Node identifier
   * @param {string} eventType - Event type
   * @param {Object} node - Node data
   * @private
   */
  notifyCollaborationsOfNodeChange(nodeId, eventType, node) {
    for (const [collaborationId, collaborationState] of this.activeCollaborations.entries()) {
      const { collaboration, callbacks } = collaborationState;
      
      if (collaboration.node_ids.includes(nodeId) && callbacks.onNodeChange) {
        callbacks.onNodeChange(nodeId, eventType, node);
      }
    }
  }
  
  /**
   * Notify active collaborations of a contribution
   * @param {Object} contribution - Contribution data
   * @private
   */
  notifyCollaborationsOfContribution(contribution) {
    for (const [collaborationId, collaborationState] of this.activeCollaborations.entries()) {
      const { collaboration, callbacks } = collaborationState;
      
      if (collaboration.node_ids.includes(contribution.node_id) && callbacks.onContribution) {
        callbacks.onContribution(contribution);
      }
    }
  }
  
  /**
   * Create a new knowledge node
   * @param {Object} nodeData - Node data
   * @param {string} nodeData.title - Node title
   * @param {string} nodeData.content - Node content
   * @param {string} nodeData.type - Node type
   * @param {string} nodeData.creatorId - Creator user identifier
   * @param {Array<string>} [nodeData.tags] - Node tags
   * @param {Array<string>} [nodeData.relatedNodes] - Related node identifiers
   * @param {Object} [nodeData.metadata] - Additional metadata
   * @returns {Promise<KnowledgeNode>} Created knowledge node
   */
  async createKnowledgeNode(nodeData) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const { title, content, type, creatorId, tags = [], relatedNodes = [], metadata = {} } = nodeData;
    
    // Validate required fields
    if (!title || !content || !type || !creatorId) {
      throw new Error('Missing required fields for knowledge node');
    }
    
    // Create node in database
    const { data, error } = await supabase
      .from('knowledge_nodes')
      .insert({
        title,
        content,
        type,
        creator_id: creatorId,
        tags,
        related_nodes: relatedNodes,
        metadata
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Create contribution record
    await supabase
      .from('contributions')
      .insert({
        user_id: creatorId,
        node_id: data.id,
        type: 'create',
        content: { action: 'created_node' }
      });
    
    return data;
  }
  
  /**
   * Get a knowledge node by ID
   * @param {string} nodeId - Node identifier
   * @returns {Promise<KnowledgeNode>} Knowledge node
   */
  async getKnowledgeNode(nodeId) {
    // Check if node is in memory
    if (this.knowledgeNodes.has(nodeId)) {
      return this.knowledgeNodes.get(nodeId);
    }
    
    // Get node from database
    const { data, error } = await supabase
      .from('knowledge_nodes')
      .select('*')
      .eq('id', nodeId)
      .single();
    
    if (error) throw error;
    
    // Store in memory
    this.knowledgeNodes.set(nodeId, data);
    
    return data;
  }
  
  /**
   * Update a knowledge node
   * @param {string} nodeId - Node identifier
   * @param {Object} updates - Updates to apply
   * @param {string} userId - User making the update
   * @returns {Promise<KnowledgeNode>} Updated knowledge node
   */
  async updateKnowledgeNode(nodeId, updates, userId) {
    // Get current node
    const currentNode = await this.getKnowledgeNode(nodeId);
    
    // Create update object
    const updateData = {};
    
    // Only include valid fields
    if (updates.title) updateData.title = updates.title;
    if (updates.content) updateData.content = updates.content;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.relatedNodes) updateData.related_nodes = updates.relatedNodes;
    if (updates.metadata) updateData.metadata = { ...currentNode.metadata, ...updates.metadata };
    
    // Update node in database
    const { data, error } = await supabase
      .from('knowledge_nodes')
      .update(updateData)
      .eq('id', nodeId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Create contribution record
    await supabase
      .from('contributions')
      .insert({
        user_id: userId,
        node_id: nodeId,
        type: 'edit',
        content: { 
          action: 'updated_node',
          changes: Object.keys(updateData)
        }
      });
    
    return data;
  }
  
  /**
   * Search for knowledge nodes
   * @param {Object} filters - Search filters
   * @param {string} [filters.query] - Search query
   * @param {Array<string>} [filters.types] - Node types to include
   * @param {Array<string>} [filters.tags] - Tags to filter by
   * @param {string} [filters.creatorId] - Creator user identifier
   * @param {Object} [options] - Search options
   * @param {number} [options.limit] - Maximum number of results
   * @param {number} [options.offset] - Result offset
   * @returns {Promise<Array<KnowledgeNode>>} Matching knowledge nodes
   */
  async searchKnowledgeNodes(filters = {}, options = {}) {
    const { query, types, tags, creatorId } = filters;
    const { limit = 20, offset = 0 } = options;
    
    let queryBuilder = supabase
      .from('knowledge_nodes')
      .select('*');
    
    // Apply filters
    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
    }
    
    if (types && types.length > 0) {
      queryBuilder = queryBuilder.in('type', types);
    }
    
    if (tags && tags.length > 0) {
      // Filter by tags (array contains)
      for (const tag of tags) {
        queryBuilder = queryBuilder.contains('tags', [tag]);
      }
    }
    
    if (creatorId) {
      queryBuilder = queryBuilder.eq('creator_id', creatorId);
    }
    
    // Apply pagination
    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data, error } = await queryBuilder;
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Create a new collaboration
   * @param {Object} collaborationData - Collaboration data
   * @param {string} collaborationData.title - Collaboration title
   * @param {string} collaborationData.description - Collaboration description
   * @param {string} collaborationData.creatorId - Creator user identifier
   * @param {Array<string>} [collaborationData.participantIds] - Participant user identifiers
   * @param {Array<string>} [collaborationData.nodeIds] - Knowledge node identifiers
   * @param {Object} [collaborationData.settings] - Collaboration settings
   * @returns {Promise<Collaboration>} Created collaboration
   */
  async createCollaboration(collaborationData) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const { 
      title, 
      description, 
      creatorId, 
      participantIds = [], 
      nodeIds = [], 
      settings = {} 
    } = collaborationData;
    
    // Validate required fields
    if (!title || !description || !creatorId) {
      throw new Error('Missing required fields for collaboration');
    }
    
    // Ensure creator is included in participants
    if (!participantIds.includes(creatorId)) {
      participantIds.push(creatorId);
    }
    
    // Create collaboration in database
    const { data, error } = await supabase
      .from('collaborations')
      .insert({
        title,
        description,
        creator_id: creatorId,
        participant_ids: participantIds,
        node_ids: nodeIds,
        settings
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Get a collaboration by ID
   * @param {string} collaborationId - Collaboration identifier
   * @returns {Promise<Collaboration>} Collaboration
   */
  async getCollaboration(collaborationId) {
    // Check if collaboration is in memory
    if (this.collaborations.has(collaborationId)) {
      return this.collaborations.get(collaborationId);
    }
    
    // Get collaboration from database
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
      .eq('id', collaborationId)
      .single();
    
    if (error) throw error;
    
    // Store in memory
    this.collaborations.set(collaborationId, data);
    
    return data;
  }
  
  /**
   * Join a collaboration
   * @param {string} collaborationId - Collaboration identifier
   * @param {string} userId - User identifier
   * @param {Object} callbacks - Callback functions
   * @param {Function} [callbacks.onNodeChange] - Called when a node changes
   * @param {Function} [callbacks.onContribution] - Called when a contribution is made
   * @param {Function} [callbacks.onParticipantJoin] - Called when a participant joins
   * @param {Function} [callbacks.onParticipantLeave] - Called when a participant leaves
   * @returns {Promise<boolean>} Success status
   */
  async joinCollaboration(collaborationId, userId, callbacks = {}) {
    // Get collaboration
    const collaboration = await this.getCollaboration(collaborationId);
    
    // Check if user is already a participant
    if (!collaboration.participant_ids.includes(userId)) {
      // Add user to participants
      const updatedParticipantIds = [...collaboration.participant_ids, userId];
      
      // Update collaboration in database
      const { error } = await supabase
        .from('collaborations')
        .update({ participant_ids: updatedParticipantIds })
        .eq('id', collaborationId);
      
      if (error) throw error;
      
      // Update in memory
      collaboration.participant_ids = updatedParticipantIds;
      this.collaborations.set(collaborationId, collaboration);
    }
    
    // Add to active collaborations
    this.activeCollaborations.set(collaborationId, {
      collaboration,
      userId,
      callbacks
    });
    
    return true;
  }
  
  /**
   * Leave a collaboration
   * @param {string} collaborationId - Collaboration identifier
   * @param {string} userId - User identifier
   * @returns {Promise<boolean>} Success status
   */
  async leaveCollaboration(collaborationId, userId) {
    // Get collaboration
    const collaboration = await this.getCollaboration(collaborationId);
    
    // Check if user is a participant
    if (collaboration.participant_ids.includes(userId)) {
      // Remove user from participants
      const updatedParticipantIds = collaboration.participant_ids.filter(id => id !== userId);
      
      // Update collaboration in database
      const { error } = await supabase
        .from('collaborations')
        .update({ participant_ids: updatedParticipantIds })
        .eq('id', collaborationId);
      
      if (error) throw error;
      
      // Update in memory
      collaboration.participant_ids = updatedParticipantIds;
      this.collaborations.set(collaborationId, collaboration);
    }
    
    // Remove from active collaborations
    this.activeCollaborations.delete(collaborationId);
    
    return true;
  }
  
  /**
   * Add a node to a collaboration
   * @param {string} collaborationId - Collaboration identifier
   * @param {string} nodeId - Node identifier
   * @param {string} userId - User identifier
   * @returns {Promise<boolean>} Success status
   */
  async addNodeToCollaboration(collaborationId, nodeId, userId) {
    // Get collaboration
    const collaboration = await this.getCollaboration(collaborationId);
    
    // Check if user is a participant
    if (!collaboration.participant_ids.includes(userId)) {
      throw new Error('User is not a participant in this collaboration');
    }
    
    // Check if node is already in collaboration
    if (collaboration.node_ids.includes(nodeId)) {
      return true;
    }
    
    // Add node to collaboration
    const updatedNodeIds = [...collaboration.node_ids, nodeId];
    
    // Update collaboration in database
    const { error } = await supabase
      .from('collaborations')
      .update({ node_ids: updatedNodeIds })
      .eq('id', collaborationId);
    
    if (error) throw error;
    
    // Update in memory
    collaboration.node_ids = updatedNodeIds;
    this.collaborations.set(collaborationId, collaboration);
    
    // Create contribution record
    await supabase
      .from('contributions')
      .insert({
        user_id: userId,
        node_id: nodeId,
        type: 'collaboration',
        content: { 
          action: 'added_to_collaboration',
          collaboration_id: collaborationId
        }
      });
    
    return true;
  }
  
  /**
   * Get user collaborations
   * @param {string} userId - User identifier
   * @returns {Promise<Array<Collaboration>>} User collaborations
   */
  async getUserCollaborations(userId) {
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
      .contains('participant_ids', [userId])
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Get collaboration nodes
   * @param {string} collaborationId - Collaboration identifier
   * @returns {Promise<Array<KnowledgeNode>>} Collaboration nodes
   */
  async getCollaborationNodes(collaborationId) {
    // Get collaboration
    const collaboration = await this.getCollaboration(collaborationId);
    
    if (collaboration.node_ids.length === 0) {
      return [];
    }
    
    // Get nodes
    const { data, error } = await supabase
      .from('knowledge_nodes')
      .select('*')
      .in('id', collaboration.node_ids);
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Add a comment to a knowledge node
   * @param {string} nodeId - Node identifier
   * @param {string} userId - User identifier
   * @param {string} comment - Comment text
   * @returns {Promise<Contribution>} Created contribution
   */
  async addComment(nodeId, userId, comment) {
    // Create contribution record
    const { data, error } = await supabase
      .from('contributions')
      .insert({
        user_id: userId,
        node_id: nodeId,
        type: 'comment',
        content: { 
          comment,
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Get comments for a knowledge node
   * @param {string} nodeId - Node identifier
   * @returns {Promise<Array<Contribution>>} Node comments
   */
  async getComments(nodeId) {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('node_id', nodeId)
      .eq('type', 'comment')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Vote on a knowledge node
   * @param {string} nodeId - Node identifier
   * @param {string} userId - User identifier
   * @param {boolean} isUpvote - Whether this is an upvote
   * @returns {Promise<boolean>} Success status
   */
  async voteOnNode(nodeId, userId, isUpvote) {
    // Check if user has already voted
    const { data: existingVotes, error: voteError } = await supabase
      .from('contributions')
      .select('*')
      .eq('node_id', nodeId)
      .eq('user_id', userId)
      .eq('type', 'vote');
    
    if (voteError) throw voteError;
    
    // If user has already voted, update the vote
    if (existingVotes && existingVotes.length > 0) {
      const existingVote = existingVotes[0];
      
      // If vote is the same, do nothing
      if (existingVote.content.isUpvote === isUpvote) {
        return true;
      }
      
      // Update vote
      const { error } = await supabase
        .from('contributions')
        .update({
          content: { 
            isUpvote,
            timestamp: new Date().toISOString()
          }
        })
        .eq('id', existingVote.id);
      
      if (error) throw error;
    } else {
      // Create new vote
      const { error } = await supabase
        .from('contributions')
        .insert({
          user_id: userId,
          node_id: nodeId,
          type: 'vote',
          content: { 
            isUpvote,
            timestamp: new Date().toISOString()
          }
        });
      
      if (error) throw error;
    }
    
    // Update node vote count
    const node = await this.getKnowledgeNode(nodeId);
    
    const voteCount = node.metadata.voteCount || 0;
    const updatedVoteCount = isUpvote ? voteCount + 1 : voteCount - 1;
    
    await this.updateKnowledgeNode(nodeId, {
      metadata: {
        ...node.metadata,
        voteCount: updatedVoteCount
      }
    }, userId);
    
    return true;
  }
  
  /**
   * Get user contributions
   * @param {string} userId - User identifier
   * @returns {Promise<Array<Contribution>>} User contributions
   */
  async getUserContributions(userId) {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Get related nodes
   * @param {string} nodeId - Node identifier
   * @returns {Promise<Array<KnowledgeNode>>} Related nodes
   */
  async getRelatedNodes(nodeId) {
    // Get node
    const node = await this.getKnowledgeNode(nodeId);
    
    if (!node.related_nodes || node.related_nodes.length === 0) {
      return [];
    }
    
    // Get related nodes
    const { data, error } = await supabase
      .from('knowledge_nodes')
      .select('*')
      .in('id', node.related_nodes);
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Get node contributors
   * @param {string} nodeId - Node identifier
   * @returns {Promise<Array<Object>>} Node contributors
   */
  async getNodeContributors(nodeId) {
    // Get contributions for this node
    const { data: contributions, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('node_id', nodeId);
    
    if (error) throw error;
    
    if (!contributions || contributions.length === 0) {
      return [];
    }
    
    // Get unique contributor IDs
    const contributorIds = [...new Set(contributions.map(c => c.user_id))];
    
    // Get contributor profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', contributorIds);
    
    if (profileError) throw profileError;
    
    // Count contributions by type
    const contributorStats = contributorIds.map(id => {
      const userContributions = contributions.filter(c => c.user_id === id);
      const profile = profiles.find(p => p.id === id);
      
      return {
        userId: id,
        profile,
        totalContributions: userContributions.length,
        contributionTypes: userContributions.reduce((acc, curr) => {
          acc[curr.type] = (acc[curr.type] || 0) + 1;
          return acc;
        }, {})
      };
    });
    
    return contributorStats;
  }
}

/**
 * Hook for using the Collaborative Knowledge Network
 * @returns {Object} Collaborative Knowledge Network methods
 */
export function useCollaborativeKnowledge() {
  const network = CollaborativeKnowledgeNetwork.getInstance();
  
  return {
    initialize: network.initialize.bind(network),
    createKnowledgeNode: network.createKnowledgeNode.bind(network),
    getKnowledgeNode: network.getKnowledgeNode.bind(network),
    updateKnowledgeNode: network.updateKnowledgeNode.bind(network),
    searchKnowledgeNodes: network.searchKnowledgeNodes.bind(network),
    createCollaboration: network.createCollaboration.bind(network),
    getCollaboration: network.getCollaboration.bind(network),
    joinCollaboration: network.joinCollaboration.bind(network),
    leaveCollaboration: network.leaveCollaboration.bind(network),
    addNodeToCollaboration: network.addNodeToCollaboration.bind(network),
    getUserCollaborations: network.getUserCollaborations.bind(network),
    getCollaborationNodes: network.getCollaborationNodes.bind(network),
    addComment: network.addComment.bind(network),
    getComments: network.getComments.bind(network),
    voteOnNode: network.voteOnNode.bind(network),
    getUserContributions: network.getUserContributions.bind(network),
    getRelatedNodes: network.getRelatedNodes.bind(network),
    getNodeContributors: network.getNodeContributors.bind(network)
  };
}
