
import React, { useState } from 'react';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { RefreshCw, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Component that shows pending sync operations and allows manual sync
 * @returns {React.ReactElement|null} The component or null when no pending operations
 */
const OfflineSyncIndicator = () => {
  const { 
    pendingCount,
    failedCount, 
    isSyncing, 
    syncNow, 
    retryFailedOperations,
    clearFailedOperations
  } = useOfflineSync();
  const [showFailedDetails, setShowFailedDetails] = useState(false);
  
  // Don't show anything if no pending or failed operations
  if (pendingCount === 0 && failedCount === 0) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-16 right-4 z-50"
      >
        <div className="rounded-lg shadow-lg p-3 bg-amber-100 dark:bg-amber-900 flex flex-col">
          <div className="flex items-center gap-2">
            <div>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {pendingCount > 0 && (
                  <span>{pendingCount} {pendingCount === 1 ? 'change' : 'changes'} pending</span>
                )}
                
                {failedCount > 0 && pendingCount > 0 && (
                  <span>, </span>
                )}
                
                {failedCount > 0 && (
                  <span className="text-red-600 dark:text-red-400">
                    {failedCount} failed
                  </span>
                )}
              </span>
            </div>
            
            {navigator.onLine && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    aria-label="Sync options"
                  >
                    {isSyncing ? (
                      <RefreshCw className="h-4 w-4 text-amber-700 dark:text-amber-200 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-amber-700 dark:text-amber-200" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60" align="end">
                  <div className="grid gap-2">
                    <h4 className="font-medium">Sync Options</h4>
                    
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={syncNow}
                      disabled={isSyncing}
                      className="w-full"
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </Button>
                    
                    {failedCount > 0 && (
                      <>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={retryFailedOperations}
                          disabled={isSyncing}
                          className="w-full"
                        >
                          Retry Failed Operations
                        </Button>
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={clearFailedOperations}
                          disabled={isSyncing}
                          className="w-full"
                        >
                          Discard Failed Operations
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowFailedDetails(!showFailedDetails)}
                          className="w-full flex items-center justify-between"
                        >
                          <span>Show Failed Details</span>
                          {showFailedDetails ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {showFailedDetails && failedCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2"
                      >
                        <div className="border-t pt-2 mt-1">
                          <h5 className="text-sm font-medium flex items-center gap-1 mb-2">
                            <AlertTriangle className="h-3 w-3" />
                            Failed Operations
                          </h5>
                          
                          <div className="bg-red-50 dark:bg-red-950 p-2 rounded text-xs max-h-40 overflow-y-auto">
                            <p>
                              {failedCount} operation{failedCount !== 1 ? 's' : ''} failed.
                              Use the actions above to retry or discard.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </PopoverContent>
              </Popover>
            )}
            
            {!navigator.onLine && (
              <Badge variant="outline" className="bg-amber-200 dark:bg-amber-800 border-none">
                Offline
              </Badge>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineSyncIndicator;
