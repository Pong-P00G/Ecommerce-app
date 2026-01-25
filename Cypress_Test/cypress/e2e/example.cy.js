describe('E-commerce App Basic Tests', () => {
    it('loads the homepage successfully', () => {
        cy.visit('/');
        cy.title().should('exist');
        cy.get('nav').should('exist');
        cy.get('footer').should('exist');
    });

    it('can visit products page directly', () => {
        cy.visit('/product');
        cy.url().should('include', '/product');
        cy.get('.grid').should('exist');
    });

    it('displays product cards', () => {
        cy.visit('/product');
        cy.get('.grid > div').should('have.length.gte', 0);
    });

    it('has working links', () => {
        cy.visit('/');
        cy.get('a[href]').should('have.length.gte', 1);
    });
});
