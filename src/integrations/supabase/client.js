// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';

/**
 * @typedef {import('./types').Database} Database
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://szhvqvtkdfsfrxrkdvsr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6aHZxdnRrZGZzZnJ4cmtkdnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3ODQ2NjAsImV4cCI6MjA1ODM2MDY2MH0.UsvV9LrMGS-O0QkwFbHrANfgtLSVHsOQOQs1Z7OhgOw";

const isBrowser = () => typeof window !== 'undefined';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

/**
 * Supabase client instance
 * @type {import('@supabase/supabase-js').SupabaseClient<Database>}
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    detectSessionInUrl: true,
    storage: isBrowser() ? window.localStorage : undefined,
  }
});
