module.exports = {
  ci: {
    collect: {
      // Add URLs to test
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/knowledge-visualization-system',
        'http://localhost:3000/adaptive-spaced-repetition',
        'http://localhost:3000/visual-recognition',
        'http://localhost:3000/ai-study-coach',
      ],
      // Use desktop configuration
      settings: {
        preset: 'desktop',
      },
      // Start the development server before collecting
      startServerCommand: 'npm run preview',
      // Wait for the server to be ready
      startServerReadyPattern: 'ready in',
    },
    upload: {
      // Upload to temporary public storage
      target: 'temporary-public-storage',
    },
    assert: {
      // Performance assertions
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
        'categories:pwa': 'off',
        
        // Specific assertions
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'interactive': ['warn', { maxNumericValue: 3500 }],
        'max-potential-fid': ['warn', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        
        // Accessibility assertions
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'aria-required-children': 'error',
        'aria-required-parent': 'error',
        'aria-roles': 'error',
        'aria-valid-attr-value': 'error',
        'aria-valid-attr': 'error',
        'button-name': 'error',
        'document-title': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'meta-viewport': 'error',
        
        // Best practices assertions
        'no-document-write': 'error',
        'no-vulnerable-libraries': 'error',
        'password-inputs-can-be-pasted-into': 'error',
      },
    },
  },
};
