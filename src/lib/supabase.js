import { supabase } from '@/integrations/supabase/client';

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: import('@supabase/supabase-js').User, error: Error}>} User data and error
 */
export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user: data.user, error };
};

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{session: import('@supabase/supabase-js').Session, user: import('@supabase/supabase-js').User, error: Error}>} Session, user data and error
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { session: data.session, user: data.user, error };
};

/**
 * Sign out the current user
 * @returns {Promise<{error: Error}>} Error if any
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get the current user
 * @returns {Promise<{user: import('@supabase/supabase-js').User, error: Error}>} User data and error
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

/**
 * Get the current session
 * @returns {Promise<{session: import('@supabase/supabase-js').Session, error: Error}>} Session data and error
 */
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

export { supabase };
