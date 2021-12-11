/// <reference types="cypress" />

describe('Search bar', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('url'));
        cy.get('[data-testid="navbarSearch"]').should('exist').click();
        cy.url().should('contain', 'search');
    });

    it.skip("Should fetch a user", () => {
        cy.get('[data-testid="searchInput"]').should('exist').type('Finroddd');
        cy.get('[data-testid="searchButton"]').should('exist').click();
        cy.wait(3000);
        cy.get('[data-testid="userCardUsername"]').first().should('exist').should('contain', Cypress.env('defaultUsername'));
        cy.get('[data-testid="userCardLocation"]').first().should('exist');
        cy.get('[data-testid="userCardAge"]').first().should('exist');
        cy.get('[data-testid="userCardFollowerData"]').first().should('exist');
        cy.get('[data-testid="userCardFollowingData"]').first().should('exist');
    });

    it.skip("Should fetch posts", () => {
        cy.get('[data-testid="searchInput"]').should('exist').type('Lorem');
        cy.get('[data-testid="searchButton"]').should('exist').click();
        cy.wait(3000);
        cy.get('[data-testid="postBody"]').first().should('exist');
        cy.get('[data-testid="postUser"]').first().should('exist');
    });

    it('Should fetch and keep the input poblated when going to another page and coming back', () => {
        cy.get('[data-testid="searchInput"]').should('exist').type(Cypress.env('defaultUsername'));
        cy.get('[data-testid="searchButton"]').should('exist').click();
        cy.wait(3000);
        cy.go('back')
        cy.go('forward')
        cy.wait(3000);
        cy.get('[data-testid="userCardUsername"]').first().should('exist').should('contain', Cypress.env('defaultUsername'));
    });
});