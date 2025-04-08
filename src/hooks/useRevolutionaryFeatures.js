/**
 * Hook for accessing all revolutionary features
 * This hook provides a unified interface to all the revolutionary features
 * of the StudyBee platform.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useAdaptiveLearning } from '@/services/ai';
import { useImmersiveLearning } from '@/services/immersive';
import { useCollaborativeKnowledge } from '@/services/collaborative';
import { useCognitiveOptimization } from '@/services/cognitive';
import { useBlockchainCredentials } from '@/services/credentials';
import { useMultiAgentSystem } from '@/services/agents';
import { initializeAllServices } from '@/services/index';

/**
 * Hook for accessing all revolutionary features
 * @returns {Object} Revolutionary features
 */
export function useRevolutionaryFeatures() {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState(null);
  
  // Get all feature hooks
  const adaptiveLearning = useAdaptiveLearning();
  const immersiveLearning = useImmersiveLearning();
  const collaborativeKnowledge = useCollaborativeKnowledge();
  const cognitiveOptimization = useCognitiveOptimization();
  const blockchainCredentials = useBlockchainCredentials();
  const multiAgentSystem = useMultiAgentSystem();
  
  // Initialize all services when user is available
  useEffect(() => {
    if (user && !initialized && !initializing) {
      const initializeServices = async () => {
        setInitializing(true);
        try {
          const success = await initializeAllServices(user.id);
          setInitialized(success);
          if (!success) {
            setError(new Error('Failed to initialize all services'));
          }
        } catch (err) {
          console.error('Error initializing services:', err);
          setError(err);
        } finally {
          setInitializing(false);
        }
      };
      
      initializeServices();
    }
  }, [user, initialized, initializing]);
  
  /**
   * Get personalized learning recommendations
   * @param {number} [count=3] - Number of recommendations to get
   * @returns {Promise<Array>} Learning recommendations
   */
  const getPersonalizedRecommendations = async (count = 3) => {
    if (!user) return [];
    
    try {
      return await adaptiveLearning.getRecommendedActivities(user.id, count);
    } catch (err) {
      console.error('Error getting personalized recommendations:', err);
      return [];
    }
  };
  
  /**
   * Launch an immersive learning experience
   * @param {string} environmentId - Environment identifier
   * @param {HTMLElement} container - DOM element to contain the experience
   * @param {Object} [options] - Launch options
   * @returns {Promise<string>} Session identifier
   */
  const launchImmersiveExperience = async (environmentId, container, options = {}) => {
    if (!user) throw new Error('User not authenticated');
    
    return await immersiveLearning.launchEnvironment(environmentId, user.id, container, options);
  };
  
  /**
   * Create a collaborative study group
   * @param {Object} groupData - Group data
   * @returns {Promise<Object>} Created group
   */
  const createCollaborativeGroup = async (groupData) => {
    if (!user) throw new Error('User not authenticated');
    
    return await collaborativeKnowledge.createCollaboration({
      ...groupData,
      creatorId: user.id
    });
  };
  
  /**
   * Get cognitive performance insights
   * @returns {Promise<Object>} Cognitive insights
   */
  const getCognitiveInsights = async () => {
    if (!user) throw new Error('User not authenticated');
    
    return await cognitiveOptimization.getCognitiveInsights(user.id);
  };
  
  /**
   * Mint an achievement as an NFT
   * @param {string} achievementId - Achievement identifier
   * @returns {Promise<string>} Transaction identifier
   */
  const mintAchievementAsNFT = async (achievementId) => {
    if (!user) throw new Error('User not authenticated');
    
    return await blockchainCredentials.mintAchievementNFT(achievementId);
  };
  
  /**
   * Check for new achievements
   * @returns {Promise<Array>} Newly awarded achievements
   */
  const checkForNewAchievements = async () => {
    if (!user) return [];
    
    const achievementTypes = [
      'course_completion',
      'study_streak',
      'knowledge_contribution',
      'quiz_master',
      'immersive_explorer'
    ];
    
    const newAchievements = [];
    
    for (const type of achievementTypes) {
      const achievement = await blockchainCredentials.checkAndAwardAchievement(user.id, type);
      if (achievement) {
        newAchievements.push(achievement);
      }
    }
    
    return newAchievements;
  };
  
  return {
    // Status
    initialized,
    initializing,
    error,
    
    // Feature hooks
    adaptiveLearning,
    immersiveLearning,
    collaborativeKnowledge,
    cognitiveOptimization,
    blockchainCredentials,
    multiAgentSystem,
    
    // Convenience methods
    getPersonalizedRecommendations,
    launchImmersiveExperience,
    createCollaborativeGroup,
    getCognitiveInsights,
    mintAchievementAsNFT,
    checkForNewAchievements
  };
}
