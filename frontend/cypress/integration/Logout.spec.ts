/// <reference types="cypress" />

import { login, setToken } from "../utils/utils";

describe('Logout', () => {
    it("Logout button should'nt be displayed if user is not logged in", () => {
        cy.visit(Cypress.env('url'));
        cy.get('[data-testid="logout"]').should('not.exist');
    });

    it("Logout button should logout the user", () => {
        login();
        setToken();
        cy.get('[data-testid="logout"]').should('exist');
        cy.get('[data-testid="logout"]').click();
        cy.get('[data-testid="logout"]').should('not.exist');
        expect(localStorage.getItem('token')).to.be.null;
    });
});