// ***********************************************
// Custom commands for E-commerce app
// ***********************************************

// Login command (mock)
Cypress.Commands.add('loginAsAdmin', () => {
    cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'mock-admin-token');
        win.localStorage.setItem('auth_user', JSON.stringify({
            user_id: 1,
            email: 'admin@test.com',
            role_id: 1
        }));
    });
});

Cypress.Commands.add('loginAsUser', () => {
    cy.window().then((win) => {
        win.localStorage.setItem('auth_token', 'mock-user-token');
        win.localStorage.setItem('auth_user', JSON.stringify({
            user_id: 2,
            email: 'user@test.com',
            role_id: 2
        }));
    });
});

// Clear auth
Cypress.Commands.add('logout', () => {
    cy.window().then((win) => {
        win.localStorage.removeItem('auth_token');
        win.localStorage.removeItem('auth_user');
    });
});

// Wait for API calls to complete
Cypress.Commands.add('waitForApi', () => {
    cy.intercept('GET', '/api/**').as('apiCall');
    cy.wait('@apiCall', { timeout: 10000 });
});

// Check if element is visible
Cypress.Commands.add('isVisible', { prevSubject: true }, (subject) => {
    cy.wrap(subject).should('be.visible');
});

// Check if element exists but may not be visible
Cypress.Commands.add('exists', { prevSubject: true }, (subject) => {
    cy.wrap(subject).should('exist');
});

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })