
// This file is now deprecated and serves as a re-export for backward compatibility
// Import and re-export from the new location
import { AuthProvider, useAuth, PLATFORM_OWNER } from './auth';
import type { AuthContextType, PlatformOwnerType } from './auth';

export { AuthProvider, useAuth, PLATFORM_OWNER };
export type { AuthContextType, PlatformOwnerType };

// This file can be safely deleted once all imports are updated to use @/context/auth
