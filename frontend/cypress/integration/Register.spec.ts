/// <reference types="cypress" />

describe('Register', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('url'));
        cy.get('[data-testid="register"]').click();
        cy.contains('Register');
    });

    it('Should fail register due to empty fields in form', () => {
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="usernameError"]').should('have.text', 'An username must be provided');
        cy.get('[data-testid="emailError"]').should('have.text', 'An email must be provided');
        cy.get('[data-testid="passwordError"]').should('have.text', 'A password must be provided');
        cy.get('[data-testid="confirmPasswordError"]').should('have.text', 'A password must be provided');
        cy.get('[data-testid="cityError"]').should('have.text', 'Please provide a city');
    });

    it('Should fail register due to future birth date being selected', () => {
        cy.get('[data-testid="birthDate"]').type('2030-12-31');
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="birthDateError"]').should('have.text', "You weren't born in the future!");
    });

    it('Should fail register due to passwords not matching', () => {
        cy.get('[data-testid="password"]').type('Password1');
        cy.get('[data-testid="confirmPassword"]').type('Password2');
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="confirmPasswordError"]').should('have.text', "Passwords don't match");
    });

    it('Should fail register due to password length validation', () => {
        cy.get('[data-testid="password"]').type('pass');
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="passwordError"]').should('have.text', "The password must be at least 8 characters long");

        cy.get('[data-testid="password"]').type('superlongpasswordthatisnotgointtopass');
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="passwordError"]').should('have.text', "The password can't be longer than 20 characters long");
    });

    it('Should fail register due to username length validation', () => {
        cy.get('[data-testid="username"]').type('user');
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="usernameError"]').should('have.text', "The username must be at least 6 characters long");

        cy.get('[data-testid="username"]').type('superlongusernamethatisnotgointtopassthecurrenttest');
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="usernameError"]').should('have.text', "The username can't be longer than 40 characters long");
    });

    it('Should fail register due to invalid email', () => {
        cy.get('[data-testid="email"]').type('whatever');
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="emailError"]').should('have.text', 'Provide a valid email');
    });

    it('Should succesfully register the user', () => {
        const username = Math.floor(Math.random() * 10000000 + 10000000);
        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="username"]').type(username.toString())
        cy.get('[data-testid="email"]').type(`${username}@gmail.com`);
        cy.get('[data-testid="password"]').type('Password')
        cy.get('[data-testid="confirmPassword"]').type('Password')
        cy.get('[data-testid="city"]').type('New York')
        cy.get('[data-testid="birthDate"]').type('1997-05-16');

        cy.get('[data-testid="registerButton"]').click();
        cy.get('[data-testid="logout"]').should('exist');
        cy.get('[data-testid="navbarUsername"]').should('have.text', username.toString()).should(() => {
            expect(localStorage.getItem('token')).to.not.undefined;
        });
    });
});