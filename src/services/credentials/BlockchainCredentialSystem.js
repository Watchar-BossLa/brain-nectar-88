/**
 * BlockchainCredentialSystem - Manages blockchain-based credentials and achievements
 * This service provides a secure, verifiable way to issue, manage, and verify
 * educational credentials and achievements using blockchain technology.
 */

import { supabase } from '@/integrations/supabase/client';
import { useSolana } from '@/context/blockchain/useSolana';

/**
 * @typedef {Object} Credential
 * @property {string} id - Credential identifier
 * @property {string} type - Credential type
 * @property {string} title - Credential title
 * @property {string} description - Credential description
 * @property {string} recipientId - Recipient user identifier
 * @property {string} issuerId - Issuer identifier
 * @property {Date} issuedAt - Issuance timestamp
 * @property {Date} expiresAt - Expiration timestamp
 * @property {string} [transactionId] - Blockchain transaction identifier
 * @property {Object} metadata - Additional metadata
 */

/**
 * @typedef {Object} Achievement
 * @property {string} id - Achievement identifier
 * @property {string} type - Achievement type
 * @property {string} title - Achievement title
 * @property {string} description - Achievement description
 * @property {string} recipientId - Recipient user identifier
 * @property {Date} earnedAt - Earning timestamp
 * @property {string} [transactionId] - Blockchain transaction identifier
 * @property {Object} criteria - Achievement criteria
 * @property {Object} metadata - Additional metadata
 */

/**
 * @typedef {Object} VerificationResult
 * @property {boolean} valid - Whether the credential is valid
 * @property {string} status - Verification status
 * @property {Object} details - Verification details
 */

export class BlockchainCredentialSystem {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.credentials = new Map();
    this.achievements = new Map();
    this.verificationCache = new Map();
  }
  
  /**
   * Get the BlockchainCredentialSystem singleton instance
   * @returns {BlockchainCredentialSystem} The singleton instance
   */
  static getInstance() {
    if (!BlockchainCredentialSystem.instance) {
      BlockchainCredentialSystem.instance = new BlockchainCredentialSystem();
    }
    return BlockchainCredentialSystem.instance;
  }
  
  /**
   * Initialize the system
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      console.log('Initializing Blockchain Credential System');
      
      this.initialized = true;
      console.log('Blockchain Credential System initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Blockchain Credential System:', error);
      return false;
    }
  }
  
  /**
   * Issue a credential
   * @param {Object} credentialData - Credential data
   * @param {string} credentialData.type - Credential type
   * @param {string} credentialData.title - Credential title
   * @param {string} credentialData.description - Credential description
   * @param {string} credentialData.recipientId - Recipient user identifier
   * @param {string} credentialData.issuerId - Issuer identifier
   * @param {Date} [credentialData.expiresAt] - Expiration timestamp
   * @param {Object} [credentialData.metadata] - Additional metadata
   * @returns {Promise<Credential>} Issued credential
   */
  async issueCredential(credentialData) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const { 
      type, 
      title, 
      description, 
      recipientId, 
      issuerId, 
      expiresAt, 
      metadata = {} 
    } = credentialData;
    
    // Validate required fields
    if (!type || !title || !description || !recipientId || !issuerId) {
      throw new Error('Missing required fields for credential');
    }
    
    // Create credential object
    const credential = {
      type,
      title,
      description,
      recipientId,
      issuerId,
      issuedAt: new Date(),
      expiresAt: expiresAt || null,
      metadata: {
        ...metadata,
        version: '1.0',
        platform: 'StudyBee'
      }
    };
    
    // Store credential in database
    const { data, error } = await supabase
      .from('credentials')
      .insert({
        type: credential.type,
        title: credential.title,
        description: credential.description,
        recipient_id: credential.recipientId,
        issuer_id: credential.issuerId,
        issued_at: credential.issuedAt.toISOString(),
        expires_at: credential.expiresAt ? credential.expiresAt.toISOString() : null,
        metadata: credential.metadata
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Store in memory
    this.credentials.set(data.id, {
      ...credential,
      id: data.id
    });
    
    // Record credential issuance event
    await this.recordCredentialEvent(data.id, 'issued', {
      issuerId: credential.issuerId
    });
    
    return {
      ...credential,
      id: data.id
    };
  }
  
  /**
   * Record a credential event
   * @param {string} credentialId - Credential identifier
   * @param {string} eventType - Event type
   * @param {Object} eventData - Event data
   * @returns {Promise<boolean>} Success status
   * @private
   */
  async recordCredentialEvent(credentialId, eventType, eventData) {
    const { error } = await supabase
      .from('credential_events')
      .insert({
        credential_id: credentialId,
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error recording credential event:', error);
      return false;
    }
    
    return true;
  }
  
  /**
   * Get a credential by ID
   * @param {string} credentialId - Credential identifier
   * @returns {Promise<Credential>} Credential
   */
  async getCredential(credentialId) {
    // Check if credential is in memory
    if (this.credentials.has(credentialId)) {
      return this.credentials.get(credentialId);
    }
    
    // Get credential from database
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('id', credentialId)
      .single();
    
    if (error) throw error;
    
    // Transform to Credential object
    const credential = {
      id: data.id,
      type: data.type,
      title: data.title,
      description: data.description,
      recipientId: data.recipient_id,
      issuerId: data.issuer_id,
      issuedAt: new Date(data.issued_at),
      expiresAt: data.expires_at ? new Date(data.expires_at) : null,
      transactionId: data.transaction_id,
      metadata: data.metadata
    };
    
    // Store in memory
    this.credentials.set(credentialId, credential);
    
    return credential;
  }
  
  /**
   * Get user credentials
   * @param {string} userId - User identifier
   * @returns {Promise<Array<Credential>>} User credentials
   */
  async getUserCredentials(userId) {
    const { data, error } = await supabase
      .from('credentials')
      .select('*')
      .eq('recipient_id', userId)
      .order('issued_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform to Credential objects
    const credentials = data.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      recipientId: item.recipient_id,
      issuerId: item.issuer_id,
      issuedAt: new Date(item.issued_at),
      expiresAt: item.expires_at ? new Date(item.expires_at) : null,
      transactionId: item.transaction_id,
      metadata: item.metadata
    }));
    
    // Store in memory
    credentials.forEach(credential => {
      this.credentials.set(credential.id, credential);
    });
    
    return credentials;
  }
  
  /**
   * Revoke a credential
   * @param {string} credentialId - Credential identifier
   * @param {string} revokerId - Revoker user identifier
   * @param {string} reason - Revocation reason
   * @returns {Promise<boolean>} Success status
   */
  async revokeCredential(credentialId, revokerId, reason) {
    // Get credential
    const credential = await this.getCredential(credentialId);
    
    // Check if revoker is the issuer
    if (credential.issuerId !== revokerId) {
      throw new Error('Only the issuer can revoke a credential');
    }
    
    // Update credential in database
    const { error } = await supabase
      .from('credentials')
      .update({
        revoked: true,
        revoked_at: new Date().toISOString(),
        revoked_by: revokerId,
        revocation_reason: reason
      })
      .eq('id', credentialId);
    
    if (error) throw error;
    
    // Update in memory
    credential.revoked = true;
    credential.revokedAt = new Date();
    credential.revokedBy = revokerId;
    credential.revocationReason = reason;
    
    this.credentials.set(credentialId, credential);
    
    // Record credential revocation event
    await this.recordCredentialEvent(credentialId, 'revoked', {
      revokerId,
      reason
    });
    
    return true;
  }
  
  /**
   * Verify a credential
   * @param {string} credentialId - Credential identifier
   * @returns {Promise<VerificationResult>} Verification result
   */
  async verifyCredential(credentialId) {
    // Check if verification result is cached
    if (this.verificationCache.has(credentialId)) {
      const cachedResult = this.verificationCache.get(credentialId);
      
      // Check if cache is still valid (less than 1 hour old)
      const cacheAge = Date.now() - cachedResult.timestamp;
      if (cacheAge < 3600000) {
        return cachedResult.result;
      }
    }
    
    // Get credential
    const credential = await this.getCredential(credentialId);
    
    // Check if credential exists
    if (!credential) {
      return {
        valid: false,
        status: 'not_found',
        details: {
          message: 'Credential not found'
        }
      };
    }
    
    // Check if credential is revoked
    if (credential.revoked) {
      return {
        valid: false,
        status: 'revoked',
        details: {
          message: 'Credential has been revoked',
          revokedAt: credential.revokedAt,
          reason: credential.revocationReason
        }
      };
    }
    
    // Check if credential is expired
    if (credential.expiresAt && credential.expiresAt < new Date()) {
      return {
        valid: false,
        status: 'expired',
        details: {
          message: 'Credential has expired',
          expiresAt: credential.expiresAt
        }
      };
    }
    
    // Check blockchain verification if transaction ID exists
    if (credential.transactionId) {
      const blockchainVerification = await this.verifyOnBlockchain(credential);
      
      if (!blockchainVerification.valid) {
        return blockchainVerification;
      }
    }
    
    // Credential is valid
    const result = {
      valid: true,
      status: 'valid',
      details: {
        message: 'Credential is valid',
        issuedAt: credential.issuedAt,
        issuer: credential.issuerId
      }
    };
    
    // Cache verification result
    this.verificationCache.set(credentialId, {
      timestamp: Date.now(),
      result
    });
    
    return result;
  }
  
  /**
   * Verify a credential on the blockchain
   * @param {Credential} credential - Credential to verify
   * @returns {Promise<VerificationResult>} Verification result
   * @private
   */
  async verifyOnBlockchain(credential) {
    // In a real implementation, this would verify the credential on the blockchain
    // by checking the transaction and validating the credential data
    
    // For now, we'll simulate blockchain verification
    return {
      valid: true,
      status: 'blockchain_verified',
      details: {
        message: 'Credential verified on blockchain',
        transactionId: credential.transactionId,
        blockchainTimestamp: new Date(credential.issuedAt.getTime() + 5000) // Simulate blockchain timestamp
      }
    };
  }
  
  /**
   * Register a credential on the blockchain
   * @param {string} credentialId - Credential identifier
   * @returns {Promise<string>} Transaction identifier
   */
  async registerOnBlockchain(credentialId) {
    // Get credential
    const credential = await this.getCredential(credentialId);
    
    // Check if credential is already registered
    if (credential.transactionId) {
      return credential.transactionId;
    }
    
    // Get Solana context
    const solana = useSolana();
    
    // Check if wallet is connected
    if (!solana.connected) {
      throw new Error('Wallet not connected');
    }
    
    // Prepare credential data for blockchain
    const credentialData = {
      id: credential.id,
      type: credential.type,
      title: credential.title,
      recipientId: credential.recipientId,
      issuerId: credential.issuerId,
      issuedAt: credential.issuedAt.toISOString(),
      hash: this.hashCredential(credential)
    };
    
    // In a real implementation, this would register the credential on the blockchain
    // For now, we'll simulate blockchain registration
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update credential in database
    const { error } = await supabase
      .from('credentials')
      .update({
        transaction_id: transactionId,
        blockchain_data: {
          network: 'solana',
          timestamp: new Date().toISOString()
        }
      })
      .eq('id', credentialId);
    
    if (error) throw error;
    
    // Update in memory
    credential.transactionId = transactionId;
    credential.blockchainData = {
      network: 'solana',
      timestamp: new Date()
    };
    
    this.credentials.set(credentialId, credential);
    
    // Record credential blockchain registration event
    await this.recordCredentialEvent(credentialId, 'blockchain_registered', {
      transactionId,
      network: 'solana'
    });
    
    return transactionId;
  }
  
  /**
   * Hash a credential for blockchain registration
   * @param {Credential} credential - Credential to hash
   * @returns {string} Credential hash
   * @private
   */
  hashCredential(credential) {
    // In a real implementation, this would create a cryptographic hash of the credential
    // For now, we'll simulate a hash
    const credentialString = JSON.stringify({
      id: credential.id,
      type: credential.type,
      title: credential.title,
      description: credential.description,
      recipientId: credential.recipientId,
      issuerId: credential.issuerId,
      issuedAt: credential.issuedAt.toISOString()
    });
    
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < credentialString.length; i++) {
      const char = credentialString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(16);
  }
  
  /**
   * Award an achievement
   * @param {Object} achievementData - Achievement data
   * @param {string} achievementData.type - Achievement type
   * @param {string} achievementData.title - Achievement title
   * @param {string} achievementData.description - Achievement description
   * @param {string} achievementData.recipientId - Recipient user identifier
   * @param {Object} achievementData.criteria - Achievement criteria
   * @param {Object} [achievementData.metadata] - Additional metadata
   * @returns {Promise<Achievement>} Awarded achievement
   */
  async awardAchievement(achievementData) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const { 
      type, 
      title, 
      description, 
      recipientId, 
      criteria, 
      metadata = {} 
    } = achievementData;
    
    // Validate required fields
    if (!type || !title || !description || !recipientId || !criteria) {
      throw new Error('Missing required fields for achievement');
    }
    
    // Create achievement object
    const achievement = {
      type,
      title,
      description,
      recipientId,
      earnedAt: new Date(),
      criteria,
      metadata: {
        ...metadata,
        version: '1.0',
        platform: 'StudyBee'
      }
    };
    
    // Store achievement in database
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        type: achievement.type,
        title: achievement.title,
        description: achievement.description,
        recipient_id: achievement.recipientId,
        earned_at: achievement.earnedAt.toISOString(),
        criteria: achievement.criteria,
        metadata: achievement.metadata
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Store in memory
    this.achievements.set(data.id, {
      ...achievement,
      id: data.id
    });
    
    // Record achievement award event
    await this.recordAchievementEvent(data.id, 'awarded', {});
    
    return {
      ...achievement,
      id: data.id
    };
  }
  
  /**
   * Record an achievement event
   * @param {string} achievementId - Achievement identifier
   * @param {string} eventType - Event type
   * @param {Object} eventData - Event data
   * @returns {Promise<boolean>} Success status
   * @private
   */
  async recordAchievementEvent(achievementId, eventType, eventData) {
    const { error } = await supabase
      .from('achievement_events')
      .insert({
        achievement_id: achievementId,
        event_type: eventType,
        event_data: eventData,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error recording achievement event:', error);
      return false;
    }
    
    return true;
  }
  
  /**
   * Get an achievement by ID
   * @param {string} achievementId - Achievement identifier
   * @returns {Promise<Achievement>} Achievement
   */
  async getAchievement(achievementId) {
    // Check if achievement is in memory
    if (this.achievements.has(achievementId)) {
      return this.achievements.get(achievementId);
    }
    
    // Get achievement from database
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();
    
    if (error) throw error;
    
    // Transform to Achievement object
    const achievement = {
      id: data.id,
      type: data.type,
      title: data.title,
      description: data.description,
      recipientId: data.recipient_id,
      earnedAt: new Date(data.earned_at),
      transactionId: data.transaction_id,
      criteria: data.criteria,
      metadata: data.metadata
    };
    
    // Store in memory
    this.achievements.set(achievementId, achievement);
    
    return achievement;
  }
  
  /**
   * Get user achievements
   * @param {string} userId - User identifier
   * @returns {Promise<Array<Achievement>>} User achievements
   */
  async getUserAchievements(userId) {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('recipient_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform to Achievement objects
    const achievements = data.map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      recipientId: item.recipient_id,
      earnedAt: new Date(item.earned_at),
      transactionId: item.transaction_id,
      criteria: item.criteria,
      metadata: item.metadata
    }));
    
    // Store in memory
    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
    
    return achievements;
  }
  
  /**
   * Mint an achievement as an NFT
   * @param {string} achievementId - Achievement identifier
   * @returns {Promise<string>} Transaction identifier
   */
  async mintAchievementNFT(achievementId) {
    // Get achievement
    const achievement = await this.getAchievement(achievementId);
    
    // Check if achievement is already minted
    if (achievement.transactionId) {
      return achievement.transactionId;
    }
    
    // Get Solana context
    const solana = useSolana();
    
    // Check if wallet is connected
    if (!solana.connected) {
      throw new Error('Wallet not connected');
    }
    
    // Prepare achievement data for NFT
    const achievementData = {
      title: achievement.title,
      description: achievement.description,
      imageUrl: achievement.metadata.imageUrl || 'https://studybee.info/default-achievement.png',
      qualification: achievement.type,
      completedDate: achievement.earnedAt.toISOString()
    };
    
    // Mint NFT
    const txId = await solana.mintAchievementNFT(achievementData);
    
    if (!txId) {
      throw new Error('Failed to mint achievement NFT');
    }
    
    // Update achievement in database
    const { error } = await supabase
      .from('achievements')
      .update({
        transaction_id: txId,
        blockchain_data: {
          network: 'solana',
          tokenType: 'NFT',
          timestamp: new Date().toISOString()
        }
      })
      .eq('id', achievementId);
    
    if (error) throw error;
    
    // Update in memory
    achievement.transactionId = txId;
    achievement.blockchainData = {
      network: 'solana',
      tokenType: 'NFT',
      timestamp: new Date()
    };
    
    this.achievements.set(achievementId, achievement);
    
    // Record achievement NFT minting event
    await this.recordAchievementEvent(achievementId, 'nft_minted', {
      transactionId: txId,
      network: 'solana'
    });
    
    return txId;
  }
  
  /**
   * Get achievement progress for a user
   * @param {string} userId - User identifier
   * @param {string} achievementType - Achievement type
   * @returns {Promise<Object>} Achievement progress
   */
  async getAchievementProgress(userId, achievementType) {
    // Get achievement type definition
    const { data: typeData, error: typeError } = await supabase
      .from('achievement_types')
      .select('*')
      .eq('type', achievementType)
      .single();
    
    if (typeError) {
      console.error('Error getting achievement type:', typeError);
      return null;
    }
    
    // Get user's achievements of this type
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('recipient_id', userId)
      .eq('type', achievementType);
    
    if (achievementsError) {
      console.error('Error getting user achievements:', achievementsError);
      return null;
    }
    
    // Get progress data based on achievement type
    let progressData = {};
    
    if (achievementType === 'course_completion') {
      // Get user's completed courses
      const { data: courses, error: coursesError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed');
      
      if (coursesError) {
        console.error('Error getting user courses:', coursesError);
      } else {
        progressData = {
          completed: courses?.length || 0,
          total: typeData.criteria.requiredCount,
          percentage: courses ? (courses.length / typeData.criteria.requiredCount) * 100 : 0
        };
      }
    } else if (achievementType === 'study_streak') {
      // Get user's study streak
      const { data: streak, error: streakError } = await supabase
        .from('user_stats')
        .select('streak_days')
        .eq('user_id', userId)
        .single();
      
      if (streakError) {
        console.error('Error getting user streak:', streakError);
      } else {
        progressData = {
          current: streak?.streak_days || 0,
          target: typeData.criteria.requiredDays,
          percentage: streak ? (streak.streak_days / typeData.criteria.requiredDays) * 100 : 0
        };
      }
    }
    
    return {
      type: achievementType,
      name: typeData.name,
      description: typeData.description,
      earned: achievements?.length > 0,
      progress: progressData,
      criteria: typeData.criteria
    };
  }
  
  /**
   * Check if a user has earned an achievement
   * @param {string} userId - User identifier
   * @param {string} achievementType - Achievement type
   * @returns {Promise<boolean>} Whether the user has earned the achievement
   */
  async hasEarnedAchievement(userId, achievementType) {
    const { data, error } = await supabase
      .from('achievements')
      .select('id')
      .eq('recipient_id', userId)
      .eq('type', achievementType);
    
    if (error) {
      console.error('Error checking achievement:', error);
      return false;
    }
    
    return data && data.length > 0;
  }
  
  /**
   * Check achievement criteria and award if met
   * @param {string} userId - User identifier
   * @param {string} achievementType - Achievement type
   * @returns {Promise<Achievement|null>} Awarded achievement or null
   */
  async checkAndAwardAchievement(userId, achievementType) {
    // Check if user already has this achievement
    const hasAchievement = await this.hasEarnedAchievement(userId, achievementType);
    
    if (hasAchievement) {
      return null;
    }
    
    // Get achievement progress
    const progress = await this.getAchievementProgress(userId, achievementType);
    
    if (!progress) {
      return null;
    }
    
    // Check if criteria is met
    let criteriaMet = false;
    
    if (achievementType === 'course_completion') {
      criteriaMet = progress.progress.completed >= progress.criteria.requiredCount;
    } else if (achievementType === 'study_streak') {
      criteriaMet = progress.progress.current >= progress.criteria.requiredDays;
    }
    
    if (!criteriaMet) {
      return null;
    }
    
    // Award achievement
    const achievement = await this.awardAchievement({
      type: achievementType,
      title: progress.name,
      description: progress.description,
      recipientId: userId,
      criteria: progress.criteria,
      metadata: {
        progress: progress.progress
      }
    });
    
    return achievement;
  }
}

/**
 * Hook for using the Blockchain Credential System
 * @returns {Object} Blockchain Credential System methods
 */
export function useBlockchainCredentials() {
  const system = BlockchainCredentialSystem.getInstance();
  
  return {
    initialize: system.initialize.bind(system),
    issueCredential: system.issueCredential.bind(system),
    getCredential: system.getCredential.bind(system),
    getUserCredentials: system.getUserCredentials.bind(system),
    revokeCredential: system.revokeCredential.bind(system),
    verifyCredential: system.verifyCredential.bind(system),
    registerOnBlockchain: system.registerOnBlockchain.bind(system),
    awardAchievement: system.awardAchievement.bind(system),
    getAchievement: system.getAchievement.bind(system),
    getUserAchievements: system.getUserAchievements.bind(system),
    mintAchievementNFT: system.mintAchievementNFT.bind(system),
    getAchievementProgress: system.getAchievementProgress.bind(system),
    hasEarnedAchievement: system.hasEarnedAchievement.bind(system),
    checkAndAwardAchievement: system.checkAndAwardAchievement.bind(system)
  };
}
