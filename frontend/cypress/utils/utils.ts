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
}