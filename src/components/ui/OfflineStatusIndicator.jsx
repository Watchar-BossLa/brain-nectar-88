
import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * Offline status indicator component
 * @returns {React.ReactElement} The offline status indicator component
 */
const OfflineStatusIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // Update network status
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('You are back online!');
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.warning('You are offline. Some features may be limited.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!isOffline) return null;
  
  return (
    <div className="fixed bottom-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg flex items-center shadow-lg z-50">
      <WifiOff className="h-5 w-5 mr-2" />
      <span>Offline Mode</span>
    </div>
  );
};

export default OfflineStatusIndicator;
