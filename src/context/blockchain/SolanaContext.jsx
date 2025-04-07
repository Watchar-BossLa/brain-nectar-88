import { createContext } from 'react';

/**
 * @typedef {import('./types').SolanaContextType} SolanaContextType
 */

/**
 * Solana context
 * @type {React.Context<SolanaContextType|undefined>}
 */
export const SolanaContext = createContext(undefined);
