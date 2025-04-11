
import { useState, useCallback } from 'react';
import localforage from 'localforage';

/**
 * Hook for tracking analytics events while offline
 * @returns {Object} Offline analytics methods
 */
export function useOfflineAnalytics() {
  const [eventsQueue, setEventsQueue] = useState([]);
  
  /**
   * Track an analytics event, storing it offline if needed
   * @param {string} eventName - Name of the event
   * @param {Object} eventProperties - Properties of the event
   */
  const trackEvent = useCallback(async (eventName, eventProperties = {}) => {
    const timestamp = new Date().toISOString();
    const event = {
      name: eventName,
      properties: eventProperties,
      timestamp
    };
    
    // If online, we would normally send this to an analytics service
    // For now, we'll just store it locally for later upload
    try {
      const storedEvents = await localforage.getItem('analyticsEvents') || [];
      const updatedEvents = [...storedEvents, event];
      await localforage.setItem('analyticsEvents', updatedEvents);
      setEventsQueue(updatedEvents);
      console.log(`Event tracked: ${eventName}`, eventProperties);
    } catch (error) {
      console.error('Error storing analytics event:', error);
    }
  }, []);
  
  /**
   * Flush stored analytics events when back online
   * @returns {Promise<boolean>} Success status
   */
  const flushEvents = useCallback(async () => {
    try {
      // In a real implementation, this would upload events to an analytics service
      const events = await localforage.getItem('analyticsEvents') || [];
      if (events.length === 0) return true;
      
      console.log(`Flushing ${events.length} analytics events`);
      
      // Here we would send the events to a server
      // For now, we'll just clear them
      await localforage.setItem('analyticsEvents', []);
      setEventsQueue([]);
      
      return true;
    } catch (error) {
      console.error('Error flushing analytics events:', error);
      return false;
    }
  }, []);
  
  return {
    trackEvent,
    flushEvents,
    pendingEventsCount: eventsQueue.length
  };
}
