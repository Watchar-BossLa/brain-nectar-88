/**
 * ImmersiveLearningService - Provides AR/VR immersive learning experiences
 * This service integrates with WebXR and other immersive technologies to
 * create engaging, interactive learning environments.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * @typedef {Object} ImmersiveEnvironment
 * @property {string} id - Environment identifier
 * @property {string} name - Environment name
 * @property {string} description - Environment description
 * @property {string} type - Environment type (AR, VR, MR)
 * @property {Object} assets - Environment assets
 * @property {Object} interactions - Available interactions
 * @property {Object} metadata - Additional metadata
 */

/**
 * @typedef {Object} ImmersiveSession
 * @property {string} id - Session identifier
 * @property {string} userId - User identifier
 * @property {string} environmentId - Environment identifier
 * @property {Date} startTime - Session start time
 * @property {Date} [endTime] - Session end time
 * @property {Object} interactions - User interactions during session
 * @property {Object} progress - Learning progress during session
 * @property {Object} analytics - Session analytics
 */

export class ImmersiveLearningService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.environments = new Map();
    this.activeSessions = new Map();
    this.deviceCapabilities = null;
    
    // Initialize WebXR API if available
    this.initializeWebXR();
  }
  
  /**
   * Get the ImmersiveLearningService singleton instance
   * @returns {ImmersiveLearningService} The singleton instance
   */
  static getInstance() {
    if (!ImmersiveLearningService.instance) {
      ImmersiveLearningService.instance = new ImmersiveLearningService();
    }
    return ImmersiveLearningService.instance;
  }
  
  /**
   * Initialize WebXR API if available
   * @private
   */
  initializeWebXR() {
    if (typeof navigator !== 'undefined' && navigator.xr) {
      console.log('WebXR API available');
      this.xrSupported = true;
      
      // Check device capabilities
      this.checkDeviceCapabilities();
    } else {
      console.log('WebXR API not available');
      this.xrSupported = false;
    }
  }
  
  /**
   * Check device capabilities for immersive experiences
   * @private
   */
  async checkDeviceCapabilities() {
    if (!this.xrSupported) return;
    
    try {
      // Check for AR support
      const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
      
      // Check for VR support
      const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
      
      this.deviceCapabilities = {
        arSupported,
        vrSupported,
        motionSensors: typeof DeviceMotionEvent !== 'undefined',
        touchScreen: typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0,
        webGLVersion: this.getWebGLVersion()
      };
      
      console.log('Device capabilities:', this.deviceCapabilities);
    } catch (error) {
      console.error('Error checking XR capabilities:', error);
      this.deviceCapabilities = {
        arSupported: false,
        vrSupported: false,
        motionSensors: typeof DeviceMotionEvent !== 'undefined',
        touchScreen: typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0,
        webGLVersion: this.getWebGLVersion()
      };
    }
  }
  
  /**
   * Get WebGL version supported by the device
   * @returns {number} WebGL version (0 if not supported, 1 for WebGL 1.0, 2 for WebGL 2.0)
   * @private
   */
  getWebGLVersion() {
    if (typeof document === 'undefined') return 0;
    
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    
    if (gl2) return 2;
    
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (gl1) return 1;
    
    return 0;
  }
  
  /**
   * Initialize the service
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      console.log('Initializing Immersive Learning Service');
      
      // Load available environments
      await this.loadEnvironments();
      
      this.initialized = true;
      console.log('Immersive Learning Service initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Immersive Learning Service:', error);
      return false;
    }
  }
  
  /**
   * Load available immersive environments
   * @returns {Promise<Map<string, ImmersiveEnvironment>>} Available environments
   * @private
   */
  async loadEnvironments() {
    try {
      const { data, error } = await supabase
        .from('immersive_environments')
        .select('*');
        
      if (error) throw error;
      
      // Store environments in memory
      data.forEach(env => {
        this.environments.set(env.id, env);
      });
      
      return this.environments;
    } catch (error) {
      console.error('Error loading immersive environments:', error);
      return new Map();
    }
  }
  
  /**
   * Get available immersive environments
   * @param {Object} [filters] - Optional filters
   * @returns {Promise<Array<ImmersiveEnvironment>>} Available environments
   */
  async getAvailableEnvironments(filters = {}) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    let environments = Array.from(this.environments.values());
    
    // Apply filters
    if (filters.type) {
      environments = environments.filter(env => env.type === filters.type);
    }
    
    if (filters.subject) {
      environments = environments.filter(env => 
        env.metadata.subjects && env.metadata.subjects.includes(filters.subject)
      );
    }
    
    // Filter based on device capabilities
    if (this.deviceCapabilities) {
      environments = environments.filter(env => {
        if (env.type === 'AR' && !this.deviceCapabilities.arSupported) return false;
        if (env.type === 'VR' && !this.deviceCapabilities.vrSupported) return false;
        return true;
      });
    }
    
    return environments;
  }
  
  /**
   * Launch an immersive learning environment
   * @param {string} environmentId - Environment identifier
   * @param {string} userId - User identifier
   * @param {HTMLElement} container - DOM element to contain the experience
   * @param {Object} [options] - Launch options
   * @returns {Promise<string>} Session identifier
   */
  async launchEnvironment(environmentId, userId, container, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const environment = this.environments.get(environmentId);
    
    if (!environment) {
      throw new Error(`Environment ${environmentId} not found`);
    }
    
    console.log(`Launching immersive environment: ${environment.name}`);
    
    // Create a new session
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      userId,
      environmentId,
      startTime: new Date(),
      interactions: {},
      progress: {},
      analytics: {
        viewDuration: 0,
        interactionCount: 0,
        completedObjectives: [],
        attentionHotspots: []
      }
    };
    
    this.activeSessions.set(sessionId, session);
    
    // Store session in database
    await supabase
      .from('immersive_sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        environment_id: environmentId,
        start_time: session.startTime.toISOString(),
        options
      });
    
    // Initialize the appropriate renderer based on environment type
    if (environment.type === 'AR') {
      await this.initializeARExperience(environment, session, container, options);
    } else if (environment.type === 'VR') {
      await this.initializeVRExperience(environment, session, container, options);
    } else {
      await this.initialize3DExperience(environment, session, container, options);
    }
    
    return sessionId;
  }
  
  /**
   * Initialize an AR experience
   * @param {ImmersiveEnvironment} environment - Environment to launch
   * @param {ImmersiveSession} session - Session information
   * @param {HTMLElement} container - DOM element to contain the experience
   * @param {Object} options - Launch options
   * @returns {Promise<void>}
   * @private
   */
  async initializeARExperience(environment, session, container, options) {
    if (!this.xrSupported || !this.deviceCapabilities.arSupported) {
      throw new Error('AR not supported on this device');
    }
    
    console.log('Initializing AR experience');
    
    // In a real implementation, this would initialize Three.js or A-Frame
    // with AR capabilities using WebXR
    
    // For now, we'll create a placeholder
    container.innerHTML = `
      <div class="ar-experience">
        <h2>AR Experience: ${environment.name}</h2>
        <p>This is a placeholder for the AR experience.</p>
        <button id="start-ar">Start AR</button>
      </div>
    `;
    
    // Add event listener for the start button
    const startButton = container.querySelector('#start-ar');
    startButton.addEventListener('click', async () => {
      try {
        // Request an AR session
        const xrSession = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test', 'dom-overlay'],
          domOverlay: { root: container }
        });
        
        console.log('AR session started');
        
        // In a real implementation, this would set up the AR session
        // with Three.js or A-Frame
        
        // End the session after a timeout (for demo purposes)
        setTimeout(() => {
          xrSession.end();
          console.log('AR session ended');
        }, 30000);
      } catch (error) {
        console.error('Error starting AR session:', error);
      }
    });
  }
  
  /**
   * Initialize a VR experience
   * @param {ImmersiveEnvironment} environment - Environment to launch
   * @param {ImmersiveSession} session - Session information
   * @param {HTMLElement} container - DOM element to contain the experience
   * @param {Object} options - Launch options
   * @returns {Promise<void>}
   * @private
   */
  async initializeVRExperience(environment, session, container, options) {
    if (!this.xrSupported || !this.deviceCapabilities.vrSupported) {
      throw new Error('VR not supported on this device');
    }
    
    console.log('Initializing VR experience');
    
    // In a real implementation, this would initialize Three.js or A-Frame
    // with VR capabilities using WebXR
    
    // For now, we'll create a placeholder
    container.innerHTML = `
      <div class="vr-experience">
        <h2>VR Experience: ${environment.name}</h2>
        <p>This is a placeholder for the VR experience.</p>
        <button id="start-vr">Start VR</button>
      </div>
    `;
    
    // Add event listener for the start button
    const startButton = container.querySelector('#start-vr');
    startButton.addEventListener('click', async () => {
      try {
        // Request a VR session
        const xrSession = await navigator.xr.requestSession('immersive-vr', {
          requiredFeatures: ['local-floor']
        });
        
        console.log('VR session started');
        
        // In a real implementation, this would set up the VR session
        // with Three.js or A-Frame
        
        // End the session after a timeout (for demo purposes)
        setTimeout(() => {
          xrSession.end();
          console.log('VR session ended');
        }, 30000);
      } catch (error) {
        console.error('Error starting VR session:', error);
      }
    });
  }
  
  /**
   * Initialize a 3D experience (non-immersive)
   * @param {ImmersiveEnvironment} environment - Environment to launch
   * @param {ImmersiveSession} session - Session information
   * @param {HTMLElement} container - DOM element to contain the experience
   * @param {Object} options - Launch options
   * @returns {Promise<void>}
   * @private
   */
  async initialize3DExperience(environment, session, container, options) {
    console.log('Initializing 3D experience');
    
    // In a real implementation, this would initialize Three.js or A-Frame
    // for a non-immersive 3D experience
    
    // For now, we'll create a placeholder
    container.innerHTML = `
      <div class="3d-experience">
        <h2>3D Experience: ${environment.name}</h2>
        <p>This is a placeholder for the 3D experience.</p>
        <canvas id="3d-canvas" width="800" height="600"></canvas>
      </div>
    `;
    
    // In a real implementation, this would initialize a WebGL renderer
    // and set up the 3D scene
  }
  
  /**
   * End an immersive learning session
   * @param {string} sessionId - Session identifier
   * @returns {Promise<ImmersiveSession>} Session information
   */
  async endSession(sessionId) {
    const session = this.activeSessions.get(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    console.log(`Ending immersive session: ${sessionId}`);
    
    // Update session end time
    session.endTime = new Date();
    
    // Calculate session duration
    const duration = (session.endTime.getTime() - session.startTime.getTime()) / 1000;
    session.analytics.viewDuration = duration;
    
    // Remove from active sessions
    this.activeSessions.delete(sessionId);
    
    // Update session in database
    await supabase
      .from('immersive_sessions')
      .update({
        end_time: session.endTime.toISOString(),
        interactions: session.interactions,
        progress: session.progress,
        analytics: session.analytics
      })
      .eq('id', sessionId);
    
    return session;
  }
  
  /**
   * Record an interaction in an immersive session
   * @param {string} sessionId - Session identifier
   * @param {string} interactionType - Type of interaction
   * @param {Object} interactionData - Interaction data
   * @returns {Promise<boolean>} Success status
   */
  async recordInteraction(sessionId, interactionType, interactionData) {
    const session = this.activeSessions.get(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    
    // Add interaction to session
    if (!session.interactions[interactionType]) {
      session.interactions[interactionType] = [];
    }
    
    session.interactions[interactionType].push({
      timestamp: new Date().toISOString(),
      ...interactionData
    });
    
    // Update analytics
    session.analytics.interactionCount++;
    
    // If this is an objective completion
    if (interactionType === 'objective_complete') {
      session.analytics.completedObjectives.push(interactionData.objectiveId);
    }
    
    // Update session in memory
    this.activeSessions.set(sessionId, session);
    
    return true;
  }
  
  /**
   * Get device capabilities for immersive experiences
   * @returns {Object} Device capabilities
   */
  getDeviceCapabilities() {
    if (!this.deviceCapabilities) {
      this.checkDeviceCapabilities();
    }
    
    return this.deviceCapabilities;
  }
  
  /**
   * Get session analytics
   * @param {string} userId - User identifier
   * @param {Object} [filters] - Optional filters
   * @returns {Promise<Array>} Session analytics
   */
  async getSessionAnalytics(userId, filters = {}) {
    try {
      let query = supabase
        .from('immersive_sessions')
        .select('*')
        .eq('user_id', userId);
      
      if (filters.environmentId) {
        query = query.eq('environment_id', filters.environmentId);
      }
      
      if (filters.startDate) {
        query = query.gte('start_time', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        query = query.lte('start_time', filters.endDate.toISOString());
      }
      
      const { data, error } = await query.order('start_time', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error getting session analytics:', error);
      return [];
    }
  }
}

/**
 * Hook for using the Immersive Learning Service
 * @returns {Object} Immersive Learning Service methods
 */
export function useImmersiveLearning() {
  const service = ImmersiveLearningService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    getAvailableEnvironments: service.getAvailableEnvironments.bind(service),
    launchEnvironment: service.launchEnvironment.bind(service),
    endSession: service.endSession.bind(service),
    recordInteraction: service.recordInteraction.bind(service),
    getDeviceCapabilities: service.getDeviceCapabilities.bind(service),
    getSessionAnalytics: service.getSessionAnalytics.bind(service)
  };
}
