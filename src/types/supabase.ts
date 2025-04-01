
import type { User } from '@supabase/supabase-js';

export type { User }; // Re-export User type from supabase-js

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
