describe('Home page', () => {
    it('loads the app', () => {
        cy.visit('/');
        cy.contains('Welcome').should('exist');
    });
});
