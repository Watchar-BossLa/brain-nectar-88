
import { SolanaProvider } from './SolanaProvider';
import { SolanaContextProvider } from './SolanaContextProvider';

// Re-export the Solana context components
export { SolanaProvider, SolanaContextProvider };

// Export the SolanaProvider's hook as default
export { useSolana } from './SolanaContextProvider';
