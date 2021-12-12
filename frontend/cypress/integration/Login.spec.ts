/// <reference types="cypress" />


describe('Login', () => {
    const navbar = '[data-testid="navbar"]';
    const login = '[data-testid="login"]';
    const usernameInput = `${login} > .field > .input > input[name="username"]`;
    const passwordInput = `${login} > .field > .input > input[name="password"]`;
    const submitButton = `${login} > button[type="submit"]`;
    const errorMessage = `${login} > div.message > ul > li`;

    beforeEach(() => {
        cy.visit(Cypress.env('url'));
        cy.get(`${navbar} > div > a:nth-child(1)`).click();
        cy.contains('Login');
    });

    it('Should fail login due to empty fields in form', () => {
        cy.get(submitButton).click();
        cy.get(errorMessage).first().should('have.text', 'An username must be provided');
        cy.get(errorMessage).last().should('have.text', 'A password must be provided');
    });

    it('Should fail login due to fields being too short in form', () => {
        cy.get(usernameInput).type('1234');
        cy.get(passwordInput).type('1234');
        cy.get(submitButton).click();
        cy.get(errorMessage).first().should('have.text', 'The username must be at least 6 characters long');
        cy.get(errorMessage).last().should('have.text', 'The password must be at least 8 characters long');
    });

    it('Should fail login due to wrong username or password', () => {
        cy.get(usernameInput).type('someusername');
        cy.get(passwordInput).type('somepassword');
        cy.get(submitButton).click();

        cy.get('[data-testid="snackbar"]').should('have.class', 'open').should('have.text', 'Wrong username or password');
        cy.wait(5000);
        cy.get('[data-testid="snackbar"]').should('have.class', 'closed');
    });

    it.only('Should succesfully login the user', () => {
        cy.clearLocalStorage();
        cy.get(usernameInput).type('Finroddd');
        cy.get(passwordInput).type('pulqui123');
        
        cy.get(submitButton).click();
        cy.wait(1000);
        
        cy.get(`${navbar} > div > a:nth-child(1)`).should('exist').and('have.text', 'Logout');
        cy.get(`${navbar} > a:nth-child(2)`).should('have.text', 'Finroddd').should(() => {
            expect(localStorage.getItem('token')).to.not.undefined;
        });
    });
});