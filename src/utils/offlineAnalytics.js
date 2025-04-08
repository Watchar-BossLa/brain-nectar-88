
/**
 * @fileoverview Offline analytics tracking
 */
import { useOfflineMode } from '@/hooks/useOfflineMode';

/**
 * Singleton class for tracking analytics events with offline support
 */
class OfflineAnalytics {
  constructor() {
    if (OfflineAnalytics.instance) {
      return OfflineAnalytics.instance;
    }
    
    this.initialized = false;
    this.trackEvent = null;
    this.isOnline = true;
    this.eventQueue = [];
    
    OfflineAnalytics.instance = this;
  }
  
  /**
   * Initializes the analytics with the offline hook
   * @param {Function} trackEventFn - Function from useOfflineMode to track events
   * @param {boolean} isOnlineStatus - Current online status
   */
  init(trackEventFn, isOnlineStatus) {
    this.trackEvent = trackEventFn;
    this.isOnline = isOnlineStatus;
    this.initialized = true;
    
    // Process any queued events
    if (this.eventQueue.length > 0) {
      this.processQueue();
    }
  }
  
  /**
   * Tracks an event, queueing it if offline
   * @param {string} eventName - Name of the event
   * @param {Object} eventData - Event data
   */
  track(eventName, eventData = {}) {
    // Add timestamp if not provided
    if (!eventData.timestamp) {
      eventData.timestamp = Date.now();
    }
    
    // If not initialized, queue the event
    if (!this.initialized) {
      this.eventQueue.push({ eventName, eventData });
      return;
    }
    
    // Track the event using the hook's method
    this.trackEvent(eventName, eventData);
  }
  
  /**
   * Updates the online status
   * @param {boolean} isOnlineStatus - New online status
   */
  updateOnlineStatus(isOnlineStatus) {
    this.isOnline = isOnlineStatus;
  }
  
  /**
   * Processes queued events
   */
  processQueue() {
    if (!this.initialized) return;
    
    while (this.eventQueue.length > 0) {
      const { eventName, eventData } = this.eventQueue.shift();
      this.trackEvent(eventName, eventData);
    }
  }
}

// Create and export the singleton instance
export const analytics = new OfflineAnalytics();

/**
 * Hook for using offline analytics
 * @returns {Object} Analytics methods
 */
export function useOfflineAnalytics() {
  const { trackEvent, isOnline } = useOfflineMode();
  
  // Initialize analytics with the hook's methods
  if (!analytics.initialized) {
    analytics.init(trackEvent, isOnline);
  } else {
    analytics.updateOnlineStatus(isOnline);
  }
  
  return {
    /**
     * Tracks an analytics event with offline support
     * @param {string} eventName - Name of the event
     * @param {Object} eventData - Event data
     */
    trackEvent: (eventName, eventData = {}) => {
      analytics.track(eventName, eventData);
    }
  };
}
