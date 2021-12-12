/// <reference types="cypress" />

import { dislikePostOrComment, likePostOrComment, login, setToken } from "../utils/utils";

before(() => login());
beforeEach(() => {
    setToken();
    cy.get('[data-testid="navbar"] > a:nth-child(2)').click();
    cy.url().should('include', '/user/');
    cy.wait(5000);
});

const postForm = '[data-testid="postForm"]';
const submitPostButton = `${postForm} > .fields > button[type="submit"]`;
const postBodyInput = `${postForm} > .fields > .field > .field > .ui.input > input`;
const postErrorMessage = `${postForm} > div.message > ul > li`;
const postCard = '[data-testid="postCard"]';

describe('Failing at creating posts', () => {
    it('Should start with button being disabled', () => {
        cy.get(submitPostButton).should('be.disabled');
    });

    it('Should enable button when user starts typing in the input', () => {
        cy.get(postBodyInput).type('Whatever');
        cy.get(submitPostButton).should('be.enabled');
    });

    it('Should throw error when user tries to submit a post with a body longer than 140 characters', () => {
        cy.get(postBodyInput).type('okaysothisisgoingtobeareallybutimeanreallyreallypostbodythatiscompletelygoingtofailoratleastthatswhatihopeforotherwiseitwouldbeabitsadtoseeitpastasifnothinghappened');
        cy.get(submitPostButton).should('be.enabled').click();
        cy.get(postErrorMessage).should('have.text', 'It can not be longer than 140 characters');
    });
});

describe.only('Creating, liking, unliking and deleting post', () => {
    const postBody: string = 'Just a normal post';

    it('Should create a post and display it', () => {
        // Create comment                
        cy.get(postBodyInput).type(postBody);
        cy.get(submitPostButton).should('be.enabled').click();
        cy.get(postErrorMessage).should('not.exist');
        cy.wait(5000);
        
        // Check if it exists
        cy.get(`${postCard} > .content > .meta`).first().should('have.text', `${Cypress.env('defaultUsername')} - a few seconds`)
        cy.get(`${postCard} > .content > .description`).first().should('have.text', postBody);
    });

    it('Should create a post, like it and dislike it', () => {
        // Create post
        cy.get(postBodyInput).type(postBody);
        cy.get(submitPostButton).should('be.enabled').click();
        cy.get(postErrorMessage).should('not.exist');
        cy.wait(5000);

        // Like said post
        likePostOrComment();
        // Dislike said post
        dislikePostOrComment();
    });

    it('Should create a post and delete it', () => {
        // Create post
        cy.get(postBodyInput).type(postBody);
        cy.get(submitPostButton).should('be.enabled').click();
        cy.get(postErrorMessage).should('not.exist');
        cy.wait(5000);
        // Delete it
        cy.get('[data-testid="deleteButton"]').first().click();
        cy.wait(5000);
        cy.get(`${postCard} > .content > .meta`).first().should('not.have.text', `${Cypress.env('defaultUsername')} - a few seconds`);
    })
});