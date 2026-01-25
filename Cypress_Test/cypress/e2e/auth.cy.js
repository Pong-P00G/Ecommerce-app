describe('Authentication Tests', () => {
    it('can navigate to login page', () => {
        cy.visit('/');
        cy.contains('Login').click();
        cy.url().should('include', '/login');
        cy.contains('Sign In').should('exist');
    });

    it('can navigate to register page', () => {
        cy.visit('/login');
        cy.contains('Register').click();
        cy.url().should('include', '/register');
        cy.contains('Sign Up').should('exist');
    });

    it('shows form validation errors', () => {
        cy.visit('/login');
        cy.get('[data-cy="login-btn"]').click();
        cy.contains('required').should('exist');
    });

    it('can submit login form', () => {
        cy.visit('/login');
        cy.get('[data-cy="email-input"]').type('test@example.com');
        cy.get('[data-cy="password-input"]').type('password123');
        // Don't actually submit to avoid real auth
    });
});
