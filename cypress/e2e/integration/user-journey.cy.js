/// <reference types="cypress" />

describe('User Journey Tests', () => {
  beforeEach(() => {
    // Mock authentication to bypass login
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'test-token');
      win.localStorage.setItem('user', JSON.stringify({
        id: 'test-user-id',
        email: 'test@example.com'
      }));
    });
    
    // Visit the dashboard
    cy.visit('/');
  });

  it('should navigate through main features', () => {
    // Check dashboard loads
    cy.contains('h1', 'Welcome back').should('be.visible');
    
    // Navigate to Knowledge Visualization
    cy.contains('Knowledge Graph').click();
    cy.url().should('include', '/knowledge-visualization');
    cy.contains('Knowledge Visualization System').should('be.visible');
    
    // Navigate to Learning Recommendations
    cy.contains('Learning Recommendations').click();
    cy.url().should('include', '/learning-recommendations');
    
    // Navigate to Adaptive Spaced Repetition
    cy.contains('Spaced Repetition').click();
    cy.url().should('include', '/adaptive-spaced-repetition');
    
    // Navigate to Visual Recognition
    cy.contains('Visual Recognition').click();
    cy.url().should('include', '/visual-recognition');
    
    // Navigate to AI Study Coach
    cy.contains('AI Coach').click();
    cy.url().should('include', '/ai-study-coach');
  });

  it('should test knowledge map creation flow', () => {
    // Navigate to Knowledge Visualization
    cy.contains('Knowledge Graph').click();
    
    // Click create new map button
    cy.contains('button', 'Create Map').click();
    
    // Fill in map details
    cy.get('input[name="title"]').type('Test Knowledge Map');
    cy.get('textarea[name="description"]').type('This is a test knowledge map');
    
    // Submit the form
    cy.contains('button', 'Create').click();
    
    // Verify map was created
    cy.contains('Test Knowledge Map').should('be.visible');
  });

  it('should test flashcard review flow', () => {
    // Navigate to Adaptive Spaced Repetition
    cy.contains('Spaced Repetition').click();
    
    // Start a review session
    cy.contains('button', 'Start Review Session').click();
    
    // If there are cards to review, test the review flow
    cy.get('body').then(($body) => {
      if ($body.find('.flashcard').length > 0) {
        // Interact with flashcard
        cy.get('.flashcard').click();
        
        // Rate difficulty
        cy.contains('button', 'Easy').click();
        
        // Continue to next card or end session
        cy.get('body').then(($newBody) => {
          if ($newBody.find('.flashcard').length > 0) {
            cy.get('.flashcard').should('be.visible');
          } else {
            cy.contains('Session Complete').should('be.visible');
          }
        });
      }
    });
  });
});
