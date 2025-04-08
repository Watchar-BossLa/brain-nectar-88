
/**
 * @fileoverview Offline status indicator component
 */
import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, Check, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { useOfflineMode } from '@/hooks/useOfflineMode';

/**
 * Component that displays the current online/offline status and sync information
 * @returns {React.ReactElement} The offline status indicator component
 */
const OfflineStatusIndicator = () => {
  const { isOnline, isSyncing, pendingChanges, syncData } = useOfflineMode();
  const [expanded, setExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Total pending changes across all categories
  const totalPending = Object.values(pendingChanges).reduce((sum, count) => sum + count, 0);
  
  // Show a toast notification on first load if there are pending changes
  useEffect(() => {
    if (isOnline && totalPending > 0) {
      toast.info(`You have ${totalPending} changes that need to be synchronized.`);
    }
  }, []);
  
  const handleSync = (e) => {
    e.stopPropagation();
    syncData();
    toast.info('Synchronizing your offline changes...');
  };
  
  const toggleExpanded = () => {
    setExpanded(prev => !prev);
  };
  
  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 rounded-lg shadow-lg ${isOnline ? 'bg-green-50' : 'bg-amber-50'} transition-all duration-300 ${expanded ? 'w-64' : 'w-auto'}`}
      onClick={toggleExpanded}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Main indicator button */}
      <div className={`flex items-center ${expanded ? 'justify-between p-4' : 'justify-center p-3'} cursor-pointer`}>
        {expanded ? (
          <>
            <span className="font-medium">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {isOnline ? (
              <Wifi size={20} className="text-green-500" />
            ) : (
              <WifiOff size={20} className="text-amber-500" />
            )}
          </>
        ) : (
          <div className="relative">
            {isOnline ? (
              <Wifi size={24} className="text-green-500" />
            ) : (
              <WifiOff size={24} className="text-amber-500" />
            )}
            
            {totalPending > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalPending > 9 ? '9+' : totalPending}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Tooltip */}
      {showTooltip && !expanded && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-white rounded shadow-md text-xs w-48">
          {isOnline ? 'You are online!' : 'You are offline. Changes will be saved locally.'}
          {totalPending > 0 && isOnline && (
            <div className="mt-1 text-amber-600">
              {totalPending} {totalPending === 1 ? 'change' : 'changes'} pending sync
            </div>
          )}
        </div>
      )}
      
      {/* Expanded details */}
      {expanded && (
        <div className="p-4 pt-0 border-t border-gray-200">
          {/* Sync status */}
          <div className="mb-3">
            <div className="font-medium text-sm mb-1">Sync Status</div>
            <div className="flex items-center justify-between text-sm">
              <span>Data Synchronization</span>
              {isSyncing ? (
                <Loader size={16} className="animate-spin text-blue-500" />
              ) : isOnline && totalPending === 0 ? (
                <Check size={16} className="text-green-500" />
              ) : isOnline ? (
                <button 
                  onClick={handleSync} 
                  className="text-blue-500 hover:text-blue-700 text-xs px-2 py-1 bg-blue-50 rounded"
                >
                  Sync Now
                </button>
              ) : (
                <CloudOff size={16} className="text-amber-500" />
              )}
            </div>
          </div>
          
          {/* Pending changes */}
          {totalPending > 0 && (
            <div className="mb-3">
              <div className="font-medium text-sm mb-1">Pending Changes</div>
              <div className="space-y-1 text-xs">
                {pendingChanges.flashcards > 0 && (
                  <div className="flex justify-between">
                    <span>Flashcards</span>
                    <span>{pendingChanges.flashcards}</span>
                  </div>
                )}
                {pendingChanges.quiz > 0 && (
                  <div className="flex justify-between">
                    <span>Quiz Progress</span>
                    <span>{pendingChanges.quiz}</span>
                  </div>
                )}
                {pendingChanges.progress > 0 && (
                  <div className="flex justify-between">
                    <span>Study Progress</span>
                    <span>{pendingChanges.progress}</span>
                  </div>
                )}
                {pendingChanges.analytics > 0 && (
                  <div className="flex justify-between">
                    <span>Analytics Events</span>
                    <span>{pendingChanges.analytics}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Offline mode guidance */}
          <div className="text-xs text-gray-500 mt-2">
            {isOnline ? (
              <p>All features are available in online mode.</p>
            ) : (
              <p>Limited features available in offline mode. Your changes will sync when you reconnect.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineStatusIndicator;
