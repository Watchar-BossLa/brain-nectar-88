
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth';
import { supabase } from '@/integrations/supabase/client';

const WelcomeHeader = () => {
  const { user, platformOwner } = useAuth();
  const [firstName, setFirstName] = useState<string>("Kelvin"); // Default to platform owner
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          // Try to get user's profile from the profiles table
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
            
          if (data && data.first_name) {
            setFirstName(data.first_name);
          } else if (user.email === platformOwner.email) {
            // If it's the admin, use their name from the platform owner constant
            setFirstName(platformOwner.name.split(' ')[0]);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user, platformOwner]);

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-semibold">Welcome back, {firstName}</h1>
      <p className="text-muted-foreground mt-1">
        Continue your learning journey where you left off.
      </p>
    </motion.div>
  );
};

export default WelcomeHeader;
