
import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

/**
 * Simple offline status indicator component
 * @returns {React.ReactElement|null} The offline status indicator or null when online
 */
const OfflineStatusIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-lg shadow-lg p-3 bg-red-100 dark:bg-red-900 flex items-center gap-2">
      <WifiOff className="h-5 w-5 text-red-600 dark:text-red-300" />
      <span className="text-sm font-medium">You are offline</span>
    </div>
  );
};

export default OfflineStatusIndicator;
