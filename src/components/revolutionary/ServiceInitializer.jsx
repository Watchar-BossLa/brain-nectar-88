/**
 * Service Initializer Component
 * This component initializes all revolutionary services when the app loads
 */

import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';
import { initializeAllServices, runAllMigrations } from '@/services';

/**
 * Service Initializer Component
 * @returns {null} This component doesn't render anything
 */
const ServiceInitializer = () => {
  const { user } = useAuth();
  
  // Initialize services when user is available
  useEffect(() => {
    if (user) {
      const initialize = async () => {
        try {
          console.log('Initializing services for user:', user.id);
          
          // Run database migrations first
          await runAllMigrations(supabase);
          
          // Then initialize all services
          await initializeAllServices(user.id);
          
          console.log('Services initialized successfully');
        } catch (error) {
          console.error('Error initializing services:', error);
        }
      };
      
      initialize();
    }
  }, [user]);
  
  // This component doesn't render anything
  return null;
};

export default ServiceInitializer;
