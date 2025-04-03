
/**
 * Central location for all shared types, interfaces, and enums
 * This helps maintain consistency across the codebase
 */

// Re-export all enums from enums.ts for backwards compatibility
export * from './enums';

// Re-export component interfaces
export * from './components';

// Re-export Supabase types
// Note: Json type is now properly imported from the generated Supabase types
import type { Json } from './supabase';
export type { Json };

// Import Database type only if it exists
// This line will be modified once Database type is properly defined
// export type { Database } from './supabase';

// Re-export Flashcard types
export * from './flashcard';

// Define shared interfaces that don't fit in the categories above
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOptions {
  field: string;
  value: string | number | boolean;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains';
}
