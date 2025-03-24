
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const EnvCheckWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  
  useEffect(() => {
    // Check if Supabase env vars are properly set
    const hasSupabaseConfig = 
      import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-url.supabase.co' &&
      import.meta.env.VITE_SUPABASE_ANON_KEY &&
      import.meta.env.VITE_SUPABASE_ANON_KEY !== 'your-anon-key';
    
    setShowWarning(!hasSupabaseConfig);
  }, []);

  if (!showWarning) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Environment Configuration Required</AlertTitle>
      <AlertDescription>
        Supabase configuration is missing or using default values. This is fine for development, but you'll need to set proper environment variables for production use.
        See the .env.example file for required variables.
      </AlertDescription>
    </Alert>
  );
};
