
// Platform constants

export const platformOwner = {
  name: 'Kelvin',
  email: 'admin@studybee.io',
};

export const platformInfo = {
  name: 'Study Bee',
  description: 'Adaptive learning platform for accounting qualifications',
  version: '1.0.0',
};

// Feature flags
export const featureFlags = {
  enableAgentSystem: true,
  enableBlockchainFeatures: false,
  enableAdvancedAnalytics: true,
};

// Environment specific configuration
export const isProd = process.env.NODE_ENV === 'production';
export const apiBaseUrl = isProd ? 'https://api.studybee.io' : 'http://localhost:3001';
