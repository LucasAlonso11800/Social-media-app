/// <reference types="cypress" />

import { getBase64ImageSrc, login, setToken } from "../utils/utils";

const postUser = '[data-testid="postCard"] > .content > .header';
const userImage = '[data-testid="userImage"]';
const followButton = '[data-testid="followButton"]';
const deleteButton = '[data-testid="deleteButton"]';
const editProfileButton = '[data-testid="editProfileButton"]';
const deleteUserButton = '[data-testid="deleteUserButton"]';
const blockUserButton = '[data-testid="blockUserButton"]';
const blockUserIcon = '[data-testid="blockUserIcon"]';
const profile = '[data-testid="profile"]';
const profileModal = '[data-testid="profileModal"]';
const profileModalInput = `${profileModal} > .container > .form > .field > .input > input`;
const profileModalError = `${profileModal} > .container > .form > .message > ul > li`;
const userModal = '[data-testid="userModal"]';

describe('User sees some profile while not being logged in', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('url'));
        cy.get(postUser).first().click();
        cy.url().should('contain', 'user');
    });

    it('Follow button should redirect to login', () => {
        cy.get(followButton).should('exist').should('have.text', 'Follow');
        cy.get(followButton).click();
        cy.url().should('contain', '/login');
    });

    it("User can't delete this user, block them, delete posts or edit the profile", () => {
        cy.get(blockUserButton).should('not.exist');
        cy.get(deleteUserButton).should('not.exist');
        cy.get(editProfileButton).should('not.exist');
        cy.get(deleteButton).should('not.exist');
    });
});

describe("User sees another user's profile while being logged in", () => {
    before(() => login());
    beforeEach(() => {
        setToken();
        cy.get(postUser).filter(`:not(:contains(${Cypress.env('defaultUsername')}))`).first().click();
        cy.url().should('include', '/user/');
        cy.wait(1000);
    });

    it("User can't delete posts, edit the profile or edit the user image", () => {
        cy.get(`${userImage} > .profile__change-user-image`).should('exist');
        cy.get(`${userImage} > .profile__actual-change-user-image`).should('not.exist');
        cy.get(deleteButton).should('not.exist');
        cy.get(editProfileButton).should('not.exist');
    });

    it('Follow button should toggle text on click', () => {
        cy.get(followButton).should('exist').then(button => {
            const buttonText = button.text();

            if (buttonText === 'Follow') /* Follow and then unfollow again */ {
                cy.get(followButton).click();
                cy.wait(1000);
                cy.get(followButton).should('have.text', 'Unfollow');
                cy.get(followButton).click();
                cy.wait(1000);
                cy.get(followButton).should('have.text', 'Follow');
            };

            if (buttonText === 'Unfollow') /* Unfollow and then follow again */ {
                cy.get(followButton).click();
                cy.wait(1000);
                cy.get(followButton).should('have.text', 'Follow');
                cy.get(followButton).click();
                cy.wait(1000);
                cy.get(followButton).should('have.text', 'Unfollow');
            };
        });
    });

    it('Follower number should change when user clicks on follow button', () => {
        cy.get(followButton).should('exist').then(button => {
            const buttonText = button.text();

            cy.get('[data-testid="followerNumber"]').then(number => {
                const followers = parseInt(number.text().substring(10));
                cy.get(followButton).click();
                cy.wait(1000);

                cy.get('[data-testid="followerNumber"]').then(number => {
                    const newFollowers = parseInt(number.text().substring(10));
                    if (buttonText === 'Follow') /* Should have an extra follower */ {
                        expect(followers).to.be.lessThan(newFollowers);
                    }
                    if (buttonText === 'Unfollow') /* Should have one follower less */ {
                        expect(followers).to.be.greaterThan(newFollowers);
                    }
                })
            });
        });
    });

    it('Block button should toggle icon on click', () => {
        cy.get(blockUserIcon).should('exist').then(icon => {
            const userIsBlocked = icon.hasClass('open');
            cy.get(blockUserButton).click();
            cy.wait(1000);

            if (userIsBlocked) /* Unblocks and then blocks again */ {
                cy.get(blockUserIcon).should('not.have.class', 'open')
                cy.get(blockUserButton).click();
                cy.get(blockUserIcon).should('have.class', 'open')
            };

            if (!userIsBlocked) /* Unblocks and then blocks again */ {
                cy.get(blockUserIcon).should('have.class', 'open')
                cy.get(blockUserButton).click();
                cy.get(blockUserIcon).should('not.have.class', 'open')
            }
        });
    });
});

describe.only('User sees their own profile while being logged in', () => {
    before(() => login());
    beforeEach(() => {
        setToken();
        cy.get('[data-testid="navbar"] > a:nth-child(2)').click();
        cy.url().should('include', '/user/');
        cy.wait(5000);
    });

    it('Should display images, name, profile name, date and follower info', () => {
        cy.get(`${profile} > .content > div > h2`).should('exist');
        cy.get(`${profile} > div > div > div > img`).should('exist');
        cy.get(`${profile} > .content > .meta`).eq(0).should('exist');
        cy.get(`${profile} > .content > .meta`).eq(1).should('exist');
        cy.get(`${profile} > .content > .meta`).eq(2).should('exist');
        cy.get(`${userImage} > img`).should('exist');
        cy.get('[data-testid="followingNumber"]').should('exist');
        cy.get('[data-testid="followerNumber"]').should('exist');
        cy.get(`${userImage} > .profile__actual-change-user-image`).should('exist');

        cy.get(`${userImage} > .profile__change-user-image`).should('not.exist');
        cy.get('[data-testid="userImageModal"]').should('not.exist');
        cy.get(profileModal).should('not.exist');
    });

    it("User can't block or follow themselves but can edit and delete the profile", () => {
        cy.get(followButton).should('not.exist')
        cy.get(blockUserButton).should('not.exist');

        cy.get(deleteUserButton).should('exist');
        cy.get(editProfileButton).should('exist');
        cy.get(deleteButton).should('exist');
    });

    it("Edit profile modal opens and closes", () => {
        cy.get(editProfileButton).click();
        cy.get(profileModal).should('exist');
        cy.get(`${profileModal} > .container > .form > .buttons > button[type="button"]`).should('exist').click();
        cy.get(profileModal).should('not.exist');
    });

    it("Editing profile fails due to empty fields", () => {
        cy.get(editProfileButton).click();
        cy.get(profileModal).should('exist');

        cy.get(profileModalInput).eq(0).should('exist').clear()
        cy.get(profileModalInput).eq(1).should('exist').clear()
        cy.get(`${profileModal} > .container > .form > .buttons > button[type="submit"]`).should('exist').click();

        cy.get(profileModalError).eq(0).should('exist').should('have.text', "Profile name can't be empty");
        cy.get(profileModalError).eq(1).should('exist').should('have.text', "Profile description can't be empty");
    });

    it("Editing profile fails due to fields being too long", () => {
        cy.get(editProfileButton).click();
        cy.get(profileModal).should('exist');

        cy.get(profileModalInput).eq(0).should('exist').clear().type('okaysothisisgoingtobeareallybutimeanreallyreallypostbodythatiscompletelygoingtofailoratleastthatswhatihopeforotherwiseitwouldbeabitsadtoseeitpastasifnothinghappened')
        cy.get(profileModalInput).eq(1).should('exist').clear().type('okaysothisisgoingtobeareallybutimeanreallyreallypostbodythatiscompletelygoingtofailoratleastthatswhatihopeforotherwiseitwouldbeabitsadtoseeitpastasifnothinghappened')
        cy.get(`${profileModal} > .container > .form > .buttons > button[type="submit"]`).should('exist').click();

        cy.get(profileModalError).eq(0).should('exist').should('have.text', "Profile name can't be longer than 40 characters");
        cy.get(profileModalError).eq(1).should('exist').should('have.text', "Description can't be longer than 140 characters");
    });

    it("Edits profile name and description", () => {
        cy.get(editProfileButton).click();
        cy.get(profileModal).should('exist');

        const profileName: string = 'The account';
        const profileDescription: string = 'Just a regular account';

        cy.get(profileModalInput).eq(0).should('exist').clear().type(profileName);
        cy.get(profileModalInput).eq(1).should('exist').clear().type(profileDescription);
        cy.get(`${profileModal} > .container > .form > .buttons > button[type="submit"]`).should('exist').click();

        cy.get(profileModal).should('not.exist');
        cy.get(`${profile} > .content > div > h2`).should('exist').should('have.text', profileName);
        cy.get('[data-testid="profileDescription"]').should('exist').should('have.text', `About ${profileName}: ${profileDescription}`);
    });

    it("Edits profile image", () => {
        cy.get(editProfileButton).click();
        cy.get(profileModal).should('exist');

        cy.get(`${profileModal} > .container > .form > div > img`).should('exist').then(image => {
            const src = image.attr('src');

            if (src !== getBase64ImageSrc(Cypress.env('empireStateImageBase64'))) {
                cy.get(`${profileModal} > .container > .form > div > input`).should('exist').attachFile('EmpireState.jpg');
            }
            else {
                cy.get(`${profileModal} > .container > .form > div > input`).should('exist').attachFile('Statue.jpg');
            };

            cy.get(`${profileModal} > .container > .form > .buttons > button[type="submit"]`).should('exist').click();
            cy.get(profileModal).should('not.exist');

            cy.get(`${profile} > div > div > div > img`).should('exist').then(newImage => {
                const newSrc = newImage.attr('src');
                if (src !== getBase64ImageSrc(Cypress.env('empireStateImageBase64'))) {
                    expect(newSrc).to.be.equals(getBase64ImageSrc(Cypress.env('empireStateImageBase64')))
                }
                else {
                    expect(newSrc).to.be.equals(getBase64ImageSrc(Cypress.env('statueImageBase64')))
                };
            });
        });
    });

    it("User image model opens and closes", () => {
        cy.get(`${userImage} > .profile__actual-change-user-image`).should('exist').click({ force: true });
        cy.wait(500)
        cy.get(userModal).should('exist');
        cy.get(`${userModal} > .buttons > button`).eq(0).should('exist').click();
        cy.get(userModal).should('not.exist');
    });

    it.only("Edits user image", () => {
        cy.get(`${userImage} > .profile__actual-change-user-image`).should('exist').click({ force: true });
        cy.wait(2000)
        cy.get(userModal).should('exist');
        
        cy.get('[data-testid="userModal"] > div > img').should('exist').then(image => {
            const src = image.attr('src');
            
            if (src !== getBase64ImageSrc(Cypress.env('taylorLoverImageBase64'))) {
                cy.get('[data-testid="userModal"] > div > input').should('exist').attachFile('TaylorLover.jpg');
                cy.wait(500)
            }
            else {
                cy.get('[data-testid="userModal"] > div > input').should('exist').attachFile('Taylor.jpg');
                cy.wait(500)
            };

            cy.get(`${userModal} > .buttons > button`).eq(1).should('exist').click();
            cy.get(userModal).should('not.exist');

            cy.get(`${userImage} > img`).should('exist').then(newImage => {
                const newSrc = newImage.attr('src');
                if (src !== getBase64ImageSrc(Cypress.env('taylorLoverImageBase64'))) {
                    expect(newSrc).to.be.equals(getBase64ImageSrc(Cypress.env('taylorLoverImageBase64')))
                }
                else expect(newSrc).to.be.equals(getBase64ImageSrc(Cypress.env('taylor1989ImageBase64')))
            });
        });
    });
});