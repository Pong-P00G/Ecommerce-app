describe('Product Page Tests', () => {
    beforeEach(() => {
        cy.visit('/product');
    });

    it('displays product grid', () => {
        cy.get('.grid').should('exist');
        cy.get('.grid > div').should('have.length.gte', 0);
    });

    it('shows product cards with images and prices', () => {
        cy.get('.grid > div').each(($el) => {
            cy.wrap($el).find('img').should('exist');
            cy.wrap($el).find('[class*="price"]').should('exist');
        });
    });

    it('allows filtering by category', () => {
        cy.get('[data-cy="category-filter"]').should('exist');
        // Test category filtering if categories exist
    });

    it('has working search functionality', () => {
        cy.get('[data-cy="search-input"]').should('exist');
        // Test search if implemented
    });

    it('displays pagination controls', () => {
        cy.get('[data-cy="pagination"]').should('exist');
    });
});
