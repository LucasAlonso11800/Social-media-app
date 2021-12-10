/// <reference types="cypress" />

export let token: string = '';

export function login() {
    const query = `
        mutation login {
            login_user(username:"Finroddd", password:"pulqui123"){
                username
                id
                token
            }
      }`;

    cy.request({
        url: Cypress.env('serverURL'),
        body: { query },
        method: 'POST',
        failOnStatusCode: false
    }).then(response => token = response.body.data.login_user.token)
};

export function setToken() {
    cy.visit(Cypress.env('url'), {
        onBeforeLoad(window) {
            window.localStorage.setItem('token', token)
        },
    })
};

export function likePostOrComment() {
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
                });
        });
};

export function dislikePostOrComment() {
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
                });
        });
};

export const getBase64ImageSrc = (base64: string): string => `data:image/png;base64,${base64}`