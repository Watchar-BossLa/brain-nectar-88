/// <reference types="cypress" />

describe('Cross-Feature Integration Tests', () => {
  beforeEach(() => {
    // Mock authentication to bypass login
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'test-token');
      win.localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com'
      }));
    });
  });

  it('should test knowledge map to flashcard integration', () => {
    // Visit knowledge visualization
    cy.visit('/knowledge-visualization-system');
    
    // Select a knowledge map (or create one if none exist)
    cy.get('body').then(($body) => {
      if ($body.find('.knowledge-map-card').length > 0) {
        cy.get('.knowledge-map-card').first().click();
      } else {
        cy.contains('button', 'Create Map').click();
        cy.get('input[name="title"]').type('Integration Test Map');
        cy.get('textarea[name="description"]').type('Map for integration testing');
        cy.contains('button', 'Create').click();
      }
    });
    
    // Add a concept
    cy.contains('button', 'Add Concept').click();
    cy.get('input[name="title"]').type('Test Concept');
    cy.get('textarea[name="description"]').type('This is a test concept');
    cy.contains('button', 'Save').click();
    
    // Navigate to spaced repetition
    cy.visit('/adaptive-spaced-repetition');
    
    // Create flashcards from knowledge map
    cy.contains('button', 'Create').click();
    cy.contains('Knowledge Maps').click();
    
    // Select the map we just created/used
    cy.contains('Integration Test Map').click();
    
    // Generate flashcards
    cy.contains('button', 'Generate Flashcards').click();
    
    // Verify flashcards were created
    cy.contains('Flashcards generated successfully').should('be.visible');
  });

  it('should test visual recognition to knowledge map integration', () => {
    // Visit visual recognition
    cy.visit('/visual-recognition');
    
    // Upload a test image (mock this part)
    cy.get('input[type="file"]').attachFile('test-image.jpg');
    
    // Process the image
    cy.contains('button', 'Process Image').click();
    
    // Extract concepts
    cy.contains('button', 'Extract Concepts').click();
    
    // Add to knowledge map
    cy.contains('button', 'Add to Knowledge Map').click();
    
    // Select a map
    cy.get('.map-selector').click();
    cy.contains('Integration Test Map').click();
    
    // Save to map
    cy.contains('button', 'Save to Map').click();
    
    // Verify concepts were added
    cy.contains('Concepts added to map').should('be.visible');
  });

  it('should test AI coach to study plan integration', () => {
    // Visit AI coach
    cy.visit('/ai-study-coach');
    
    // Start a coaching session
    cy.contains('Chat with Your Coach').should('be.visible');
    
    // Ask about creating a study plan
    cy.get('.chat-input').type('Help me create a study plan');
    cy.get('.send-button').click();
    
    // Wait for response and click on suggested action
    cy.contains('Create Study Plan').click();
    
    // Fill in study plan details
    cy.get('input[name="title"]').type('Integration Test Plan');
    cy.get('textarea[name="description"]').type('Study plan from AI coach');
    
    // Save the plan
    cy.contains('button', 'Save Plan').click();
    
    // Verify plan was created
    cy.contains('Study plan created').should('be.visible');
  });
});
