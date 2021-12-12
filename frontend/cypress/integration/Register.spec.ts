/// <reference types="cypress" />

describe('Register', () => {
    const navbar = '[data-testid="navbar"]';
    const register = '[data-testid="register"]';
    const submitButton = `${register} > button[type="submit"]`;
    const errorMessage = `${register} > div.message > ul > li`;
    const getInput = (name: string) => `${register} > .field > .input > input[name=${name}]`;

    beforeEach(() => {
        cy.visit(Cypress.env('url'));
        cy.get(`${navbar} > div > a:nth-child(2)`).click();
        cy.contains('Register');
    });

    it('Should fail register due to empty fields in form', () => {
        cy.get(submitButton).click();
        cy.get(errorMessage).eq(0).should('have.text', 'An username must be provided');
        cy.get(errorMessage).eq(1).should('have.text', 'An email must be provided');
        cy.get(errorMessage).eq(2).should('have.text', 'A password must be provided');
        cy.get(errorMessage).eq(3).should('have.text', 'A password must be provided');
        cy.get(errorMessage).eq(4).should('have.text', 'Please provide a city');
    });

    it('Should fail register due to future birth date being selected', () => {
        cy.get(getInput('birthDate')).type('2030-12-31');
        cy.get(submitButton).click();
        cy.get(errorMessage).eq(5).should('have.text', "You weren't born in the future!");
    });

    it('Should fail register due to passwords not matching', () => {
        cy.get(getInput("password")).type('Password1');
        cy.get(getInput("confirmPassword")).type('Password2');
        cy.get(submitButton).click();
        cy.get(errorMessage).eq(2).should('have.text', "Passwords don't match");
    });

    it('Should fail register due to password length validation', () => {
        cy.get(getInput("password")).type('pass');
        cy.get(submitButton).click();
        cy.get(errorMessage).eq(2).should('have.text', "The password must be at least 8 characters long");

        cy.get(getInput("password")).type('superlongpasswordthatisnotgointtopass');
        cy.get(submitButton).click();
        cy.get(errorMessage).eq(2).should('have.text', "The password can't be longer than 20 characters long");
    });

    it('Should fail register due to username length validation', () => {
        cy.get(getInput("username")).type('user');
        cy.get(submitButton).click();
        cy.get(errorMessage).eq(0).should('have.text', "The username must be at least 6 characters long");

        cy.get(getInput("username")).type('superlongusernamethatisnotgointtopassthecurrenttest');
        cy.get(submitButton).click();
        cy.get(errorMessage).eq(0).should('have.text', "The username can't be longer than 40 characters long");
    });

    it('Should fail register due to invalid email', () => {
        cy.get(getInput("email")).type('whatever');
        cy.get(submitButton).click();
        cy.get(errorMessage).eq(1).should('have.text', 'Provide a valid email');
    });

    it('Should succesfully register the user', () => {
        const username = Math.floor(Math.random() * 10000000 + 10000000);
        cy.get(submitButton).click();
        cy.get(getInput("username")).type(username.toString())
        cy.get(getInput("email")).type(`${username}@gmail.com`);
        cy.get(getInput("password")).type('Password')
        cy.get(getInput("confirmPassword")).type('Password')
        cy.get(getInput("city")).type('New York')
        cy.get(getInput("birthDate")).type('1997-05-16');

        cy.get(submitButton).click();
        cy.wait(1000);
        
        cy.get(`${navbar} > div > a:nth-child(1)`).should('exist').and('have.text', 'Logout');
        cy.get(`${navbar} > a:nth-child(2)`).should('have.text', username.toString()).should(() => {
            expect(localStorage.getItem('token')).to.not.undefined;
        });
    });
});