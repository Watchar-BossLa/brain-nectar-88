
// This file is kept for backward compatibility
// It re-exports all the Solana context functionality from the new location
export * from './blockchain/SolanaContext';
// Export with alias to avoid naming conflicts
export { useSolana as useSolanaHook } from './blockchain/useSolana';
export * from './blockchain/SolanaContextProvider';
export * from './blockchain/types';
