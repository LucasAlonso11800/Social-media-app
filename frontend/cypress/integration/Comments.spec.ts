/// <reference types="cypress" />

import { dislikePostOrComment, likePostOrComment, login, setToken } from "../utils/utils";

before(() => login());
beforeEach(() => {
    setToken();
    cy.get('[data-testid="postCard"] > .content > .description').first().click();
    cy.url().should('include', '/posts/');
    cy.contains('Comments');
});

const commentFormId = '[data-testid="commentForm"]';
const submitCommentButton = `${commentFormId} > .fields > button[type="submit"]`;
const commentBodyInput = `${commentFormId} > .fields > .field > .field > .ui.input > input`;
const commentErrorMessage = `${commentFormId} > div.message > ul > li`;
const commentId = '[data-testid="comment"]';

describe('Failing at creating comments', () => {
    it('Should start with button being disabled', () => {
        cy.get(submitCommentButton).should('be.disabled');
    });

    it('Should enable button when user starts typing in the input', () => {
        cy.get(commentBodyInput).type('Whatever');
        cy.get(submitCommentButton).should('be.enabled');
    });

    it('Should throw error when user tries to submit a comment with a body longer than 140 characters', () => {
        cy.get(commentBodyInput).type('okaysothisisgoingtobeareallybutimeanreallyreallycommentbodythatiscompletelygoingtofailoratleastthatswhatihopeforotherwiseitwouldbeabitsadtoseeitpastasifnothinghappened');
        cy.get(submitCommentButton).should('be.enabled').click();
        cy.get(commentErrorMessage).should('have.text', 'It can not be longer than 140 characters');
    });
});

describe.only('Creating, liking, unliking and deleting comment', () => {
    const commentBody: string = 'Just a normal comment';

    it('Should create a comment and display it', () => {
        // Create comment
        cy.get(commentBodyInput).type(commentBody);
        cy.get(submitCommentButton).should('be.enabled').click();
        cy.get(commentErrorMessage).should('not.exist');
        cy.wait(5000);

        // Check if it exists
        cy.get(`${commentId} > .content > .meta` ).first().should('have.text', `a few seconds`)
        cy.get(`${commentId} > .content > .description` ).first().should('have.text', commentBody);
    });

    it('Should create a comment, like it and dislike it', () => {
        // Create comment
        cy.get(commentBodyInput).type(commentBody);
        cy.get(submitCommentButton).should('be.enabled').click();
        cy.get(commentErrorMessage).should('not.exist');
        cy.wait(5000);

        // Like said comment
        likePostOrComment();
        // dislike said comment
        dislikePostOrComment();
    });

    it('Should create a comment and delete it', () => {
        // Create comment
        cy.get(commentBodyInput).type(commentBody);
        cy.get(submitCommentButton).should('be.enabled').click();
        cy.get(commentErrorMessage).should('not.exist');
        cy.wait(5000);
        // Delete it
        cy.get('[data-testid="deleteButton"]').first().click();
        cy.wait(5000);
        cy.get(`${commentId} > .content > .meta` ).first().should('not.have.text', `a few seconds`);
    })
});