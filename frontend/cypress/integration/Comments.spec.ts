/// <reference types="cypress" />

import { dislikePostOrComment, likePostOrComment, login, setToken } from "../utils/utils";

before(() => login());
beforeEach(() => {
    setToken();
    cy.get('[data-testid="postBody"]').first().click();
    cy.url().should('include', '/posts/');
    cy.contains('Comments');
});

describe('Failing at creating comments', () => {
    it('Should start with button being disabled', () => {
        cy.get('[data-testid="commentFormButton"]').should('be.disabled');
    });

    it('Should enable button when user starts typing in the input', () => {
        cy.get('[data-testid="commentBodyInput"]').type('Whatever');
        cy.get('[data-testid="commentFormButton"]').should('be.enabled');
    });

    it('Should throw error when user tries to submit a comment with a body longer than 140 characters', () => {
        cy.get('[data-testid="commentBodyInput"]').type('okaysothisisgoingtobeareallybutimeanreallyreallycommentbodythatiscompletelygoingtofailoratleastthatswhatihopeforotherwiseitwouldbeabitsadtoseeitpastasifnothinghappened');
        cy.get('[data-testid="commentFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="commentBodyError"]').should('have.text', 'It can not be longer than 140 characters');
    });
});

describe('Creating, liking, unliking and deleting comment', () => {
    const commentBody: string = 'Just a normal comment';

    it('Should create a comment and display it', () => {
        // Create comment
        cy.get('[data-testid="commentBodyInput"]').type(commentBody);
        cy.get('[data-testid="commentFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="commentBodyError"]').should('not.exist');
        cy.wait(5000);

        // Check if it exists
        cy.get('[data-testid="commentData"]').first().should('have.text', `a few seconds`)
        cy.get('[data-testid="commentBody"]').first().should('have.text', commentBody);
    });

    it('Should create a comment, like it and dislike it', () => {
        // Create comment
        cy.get('[data-testid="commentBodyInput"]').type(commentBody);
        cy.get('[data-testid="commentFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="commentBodyError"]').should('not.exist');
        cy.wait(5000);

        // Like said comment
        likePostOrComment();
        // dislike said comment
        dislikePostOrComment();
    });

    it('Should create a comment and delete it', () => {
        // Create comment
        cy.get('[data-testid="commentBodyInput"]').type(commentBody);
        cy.get('[data-testid="commentFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="commentBodyError"]').should('not.exist');
        cy.wait(5000);
        // Delete it
        cy.get('[data-testid="deleteButton"]').first().click();
        cy.wait(5000);
        cy.get('[data-testid="commentData"]').first().should('not.have.text', `a few seconds`);
    })
});