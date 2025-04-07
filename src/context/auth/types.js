/**
 * @typedef {Object} PlatformOwnerType
 * @property {string} email - Platform owner email
 * @property {string} name - Platform owner name
 */

/**
 * @typedef {Object} AuthContextType
 * @property {import('@supabase/supabase-js').Session|null} session - Current session
 * @property {import('@supabase/supabase-js').User|null} user - Current user
 * @property {boolean} loading - Loading state
 * @property {Function} signIn - Sign in function
 * @property {Function} signUp - Sign up function
 * @property {Function} signInWithGoogle - Sign in with Google function
 * @property {Function} signOut - Sign out function
 * @property {PlatformOwnerType} platformOwner - Platform owner
 * @property {boolean} isAdmin - Whether the user is an admin
 */

export {};
