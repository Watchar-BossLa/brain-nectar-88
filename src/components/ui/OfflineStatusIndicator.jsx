
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Offline status indicator component
 * Shows network status and transitions smoothly between states
 * @returns {React.ReactElement|null} The offline status indicator or null when online
 */
const OfflineStatusIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnline, setShowOnline] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Show the "online" indicator briefly
      setShowOnline(true);
      // Hide it after 3 seconds
      setTimeout(() => setShowOnline(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      setShowOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isOffline && (
        <motion.div
          key="offline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 rounded-lg shadow-lg p-3 bg-red-100 dark:bg-red-900 flex items-center gap-2"
        >
          <WifiOff className="h-5 w-5 text-red-600 dark:text-red-300" />
          <span className="text-sm font-medium text-red-800 dark:text-red-200">You are offline</span>
        </motion.div>
      )}
      
      {showOnline && !isOffline && (
        <motion.div
          key="online"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 rounded-lg shadow-lg p-3 bg-green-100 dark:bg-green-900 flex items-center gap-2"
        >
          <Wifi className="h-5 w-5 text-green-600 dark:text-green-300" />
          <span className="text-sm font-medium text-green-800 dark:text-green-200">Online again</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OfflineStatusIndicator;
