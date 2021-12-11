/// <reference types="cypress" />

import { login, setToken } from "../utils/utils";

describe('Logout button', () => {
    const logoutButton = `[data-testid="navbar"] > div > a:nth-child(1)`;

    it("Shouldn't be displayed if user is not logged in", () => {
        cy.visit(Cypress.env('url'));
        cy.get(logoutButton).should('have.text', 'Login');
    });

    it("Should logout the user", () => {
        login();
        setToken();
        cy.get(logoutButton).should('have.text', 'Logout');
        cy.get(logoutButton).click();
        cy.get(logoutButton).should('have.text', 'Login');
        expect(localStorage.getItem('token')).to.be.null;
    });
});