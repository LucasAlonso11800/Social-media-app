/// <reference types="cypress" />

import { dislikePostOrComment, likePostOrComment, login, setToken } from "../utils/utils";

before(() => login());
beforeEach(() => {
    setToken();
    cy.get('[data-testid="navbarUsername"]').click();
    cy.url().should('include', '/user/');
    cy.wait(5000);
});

describe('Failing at creating posts', () => {
    it('Should start with button being disabled', () => {
        cy.get('[data-testid="postFormButton"]').should('be.disabled');
    });

    it('Should enable button when user starts typing in the input', () => {
        cy.get('[data-testid="postBodyInput"]').type('Whatever');
        cy.get('[data-testid="postFormButton"]').should('be.enabled');
    });

    it('Should throw error when user tries to submit a post with a body longer than 140 characters', () => {
        cy.get('[data-testid="postBodyInput"]').type('okaysothisisgoingtobeareallybutimeanreallyreallypostbodythatiscompletelygoingtofailoratleastthatswhatihopeforotherwiseitwouldbeabitsadtoseeitpastasifnothinghappened');
        cy.get('[data-testid="postFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="postBodyError"]').should('have.text', 'It can not be longer than 140 characters');
    });
});

describe('Creating, liking, unliking and deleting post', () => {
    const postBody: string = 'Just a normal post';

    it('Should create a post and display it', () => {
        // Create comment                
        cy.get('[data-testid="postBodyInput"]').type(postBody);
        cy.get('[data-testid="postFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="postBodyError"]').should('not.exist');
        cy.wait(5000);
        
        // Check if it exists
        cy.get('[data-testid="postBody"]').first().should('have.text', postBody);
        cy.get('[data-testid="postData"]').first().should('have.text', `${Cypress.env('defaultUsername')} - a few seconds`)
    });

    it('Should create a post, like it and dislike it', () => {
        // Create post
        cy.get('[data-testid="postBodyInput"]').type(postBody);
        cy.get('[data-testid="postFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="postBodyError"]').should('not.exist');
        cy.wait(5000);

        // Like said post
        likePostOrComment();
        // Dislike said post
        dislikePostOrComment();
    });

    it('Should create a post and delete it', () => {
        // Create post
        cy.get('[data-testid="postBodyInput"]').type(postBody);
        cy.get('[data-testid="postFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="postBodyError"]').should('not.exist');
        cy.wait(5000);
        // Delete it
        cy.get('[data-testid="deleteButton"]').first().click();
        cy.wait(5000);
        cy.get('[data-testid="postData"]').first().should('not.have.text', `${Cypress.env('defaultUsername')} - a few seconds`);
    })
});