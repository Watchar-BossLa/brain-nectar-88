/**
 * @typedef {Object} AchievementData
 * @property {string} title - Achievement title
 * @property {string} description - Achievement description
 * @property {string} imageUrl - Achievement image URL
 * @property {string} qualification - Related qualification
 * @property {string} completedDate - Completion date
 */

/**
 * @typedef {Object} SolanaContextType
 * @property {boolean} connected - Whether wallet is connected
 * @property {import('@solana/web3.js').PublicKey|null} publicKey - Wallet public key
 * @property {number|null} balance - Wallet balance
 * @property {Function} connectWallet - Function to connect wallet
 * @property {boolean} isConnecting - Whether connecting is in progress
 * @property {Function} fetchBalance - Function to fetch balance
 * @property {Function} mintAchievementNFT - Function to mint achievement NFT
 * @property {Function} sendTokenReward - Function to send token reward
 * @property {Function} processPayment - Function to process payment
 */

export {};
