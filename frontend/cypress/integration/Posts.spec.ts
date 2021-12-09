/// <reference types="cypress" />

import { login, setToken } from "../utils/utils";

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

describe('Creating post and liking it', () => {
    const postBody: string = 'Just a normal post';

    it('Should create a post and display it', () => {
        cy.get('[data-testid="postBodyInput"]').type(postBody);
        cy.get('[data-testid="postFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="postBodyError"]').should('not.exist');
        cy.wait(5000);
        cy.get('[data-testid="postBody"]').first().should('have.text', postBody);
        cy.get('[data-testid="postData"]').first().should('have.text', `${Cypress.env('defaultUsername')} - a few seconds`)
    });

    it('Should create a post, like it and unlike it', () => {
        // Create post
        cy.get('[data-testid="postBodyInput"]').type(postBody);
        cy.get('[data-testid="postFormButton"]').should('be.enabled').click();
        cy.get('[data-testid="postBodyError"]').should('not.exist');
        cy.wait(5000);

        // Like said post
        cy.get('[data-testid="likeButton"]')
            .filter('div.ui.twitter.basic.button')
            .then(notLiked => {
                const listingCount = Cypress.$(notLiked).length;
                notLiked.first().trigger('click');
                cy.wait(5000);
                cy.get('[data-testid="likeButton"]')
                    .filter('div.ui.twitter.basic.button')
                    .then(newNotLiked => {
                        expect(listingCount).to.be.greaterThan(Cypress.$(newNotLiked).length);
                    })
            });

        // Unlike said post
        cy.get('[data-testid="likeButton"]')
            .not('div.basic')
            .then(liked => {
                const listingCount = Cypress.$(liked).length;
                liked.first().trigger('click');
                cy.wait(5000);
                cy.get('[data-testid="likeButton"]')
                    .not('div.basic')
                    .then(newLiked => {
                        expect(listingCount).to.be.greaterThan(Cypress.$(newLiked).length);
                    })
            });
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