/// <reference types="cypress" />

describe('Login', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('url'));
        cy.get('[data-testid="login"]').click();
        cy.contains('Login');
    });

    it('Should fail login due to empty fields in form', () => {
        cy.get('[data-testid="loginButton"]').click();
        cy.get('[data-testid="usernameError"]').should('have.text', 'An username must be provided');
        cy.get('[data-testid="passwordError"]').should('have.text', 'A password must be provided');
    });

    it('Should fail login due to fields being too short in form', () => {
        cy.get('[data-testid="username"]').type('1234');
        cy.get('[data-testid="password"]').type('1234');
        cy.get('[data-testid="loginButton"]').click();
        cy.get('[data-testid="usernameError"]').should('have.text', 'The username must be at least 6 characters long');
        cy.get('[data-testid="passwordError"]').should('have.text', 'The password must be at least 8 characters long');
    });


    it('Should fail login due to wrong username or password', () => {
        cy.get('[data-testid="username"]').type('someusername');
        cy.get('[data-testid="password"]').type('somepassword');
        cy.get('[data-testid="loginButton"]').click();

        cy.get('[data-testid="snackbar"]').should('have.class', 'open').should('have.text', 'Wrong username or password');
        cy.wait(5000);
        cy.get('[data-testid="snackbar"]').should('have.class', 'closed');
    });

    it('Should succesfully login the user', () => {
        cy.clearLocalStorage();

        cy.get('[data-testid="username"]').type('Finroddd');
        cy.get('[data-testid="password"]').type('pulqui123');
        cy.get('[data-testid="loginButton"]').click();

        cy.get('[data-testid="logout"]').should('exist');
        cy.get('[data-testid="navbarUsername"]').should('have.text', 'Finroddd').should(() => {
            expect(localStorage.getItem('token')).to.not.undefined;
        });
    });
});