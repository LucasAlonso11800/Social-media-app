/// <reference types="cypress" />

describe('Search bar', () => {
    const searchBarId = "[data-testid='searchBar']";
    const userCardId = "[data-testid='userCard'] > .extra.content";
    const postCardId = "[data-testid='postCard'] > .content";

    beforeEach(() => {
        cy.visit(Cypress.env('url'));
        cy.get(`[data-testid="navbar"] > a:nth-child(2)`).should('have.text', 'Search').click();
        cy.url().should('contain', 'search');
    });

    it("Should fetch a user", () => {
        cy.get(`${searchBarId} > .input > input`).should('exist').type(Cypress.env('defaultUsername'));
        cy.get(`${searchBarId} > .button`).should('exist').click();
        cy.wait(3000);
        cy.get(`${userCardId} > .description:nth-child(1) > p`).first().should('exist').should('contain', Cypress.env('defaultUsername'));
        cy.get(`${userCardId} > .description:nth-child(2) > p`).first().should('exist');
        cy.get(`${userCardId} > .description:nth-child(3) > p`).first().should('exist');
        cy.get(`${userCardId} > .description:nth-child(4) > p`).first().should('exist');
        cy.get(`${userCardId} > .description:nth-child(5) > p`).first().should('exist');
    });

    it.only("Should fetch posts", () => {
        cy.get(`${searchBarId} > .input > input`).should('exist').type('Lorem');
        cy.get(`${searchBarId} > .button`).should('exist').click();
        cy.wait(3000);
        cy.get(`${postCardId} > .header`).first().should('exist');
        cy.get(`${postCardId} > .description`).first().should('exist');
    });

    it('Should fetch and keep the input poblated when going to another page and coming back', () => {
        cy.get(`${searchBarId} > .input > input`).should('exist').type(Cypress.env('defaultUsername'));
        cy.get(`${searchBarId} > .button`).should('exist').click();
        cy.wait(3000);
        cy.go('back')
        cy.go('forward')
        cy.wait(3000);
        cy.get(`${userCardId} > .description:nth-child(1) > p`).first().should('exist').should('contain', Cypress.env('defaultUsername'));
    });
});