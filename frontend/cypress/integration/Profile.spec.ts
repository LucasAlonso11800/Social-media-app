/// <reference types="cypress" />

import { getBase64ImageSrc, login, setToken } from "../utils/utils";

describe('User sees some profile while not being logged in', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('url'));
        cy.get('[data-testid="postUser"]').first().click();
        cy.url().should('contain', 'user');
    });

    it('Follow button should redirect to login', () => {
        cy.get('[data-testid="followButton"]').should('exist').should('have.text', 'Follow');
        cy.get('[data-testid="followButton"]').click();
        cy.url().should('contain', '/login');
    });

    it("User can't delete this user, block them, delete posts or edit the profile", () => {
        cy.get('[data-testid="blockUserButton"]').should('not.exist');
        cy.get('[data-testid="deleteUserButton"]').should('not.exist');
        cy.get('[data-testid="editProfileButton"]').should('not.exist');
        cy.get('[data-testid="deleteButton"]').should('not.exist');
    });
});

describe("User sees another user's profile while being logged in", () => {
    before(() => login());
    beforeEach(() => {
        setToken();
        cy.get('[data-testid="postUser"]').filter(`:not(:contains(${Cypress.env('defaultUsername')}))`).first().click();
        cy.url().should('include', '/user/');
        cy.wait(1000);
    });

    it("User can't delete posts, edit the profile or edit the user image", () => {
        cy.get('[data-testid="changeUserImage"]').should('exist');
        cy.get('[data-testid="actualChangeUserImage"]').should('not.exist');
        cy.get('[data-testid="deleteButton"]').should('not.exist');
        cy.get('[data-testid="editProfileButton"]').should('not.exist');
    });

    it('Follow button should toggle text on click', () => {
        cy.get('[data-testid="followButton"]').should('exist').then(button => {
            const buttonText = button.text();

            if (buttonText === 'Follow') /* Follow and then unfollow again */ {
                cy.get('[data-testid="followButton"]').click();
                cy.wait(1000);
                cy.get('[data-testid="followButton"]').should('have.text', 'Unfollow');
                cy.get('[data-testid="followButton"]').click();
                cy.wait(1000);
                cy.get('[data-testid="followButton"]').should('have.text', 'Follow');
            };

            if (buttonText === 'Unfollow') /* Unfollow and then follow again */ {
                cy.get('[data-testid="followButton"]').click();
                cy.wait(1000);
                cy.get('[data-testid="followButton"]').should('have.text', 'Follow');
                cy.get('[data-testid="followButton"]').click();
                cy.wait(1000);
                cy.get('[data-testid="followButton"]').should('have.text', 'Unfollow');
            };
        });
    });

    it('Follower number should change when user clicks on follow button', () => {
        cy.get('[data-testid="followButton"]').should('exist').then(button => {
            const buttonText = button.text();

            cy.get('[data-testid="followerNumber"]').then(number => {
                const followers = parseInt(number.text().substring(10));
                cy.get('[data-testid="followButton"]').click();
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
        cy.get('[data-testid="blockUserIcon"]').should('exist').then(icon => {
            const userIsBlocked = icon.hasClass('open');
            cy.get('[data-testid="blockUserButton"]').click();
            cy.wait(1000);

            if (userIsBlocked) /* Unblocks and then blocks again */ {
                cy.get('[data-testid="blockUserIcon"]').should('not.have.class', 'open')
                cy.get('[data-testid="blockUserButton"]').click();
                cy.get('[data-testid="blockUserIcon"]').should('have.class', 'open')
            };

            if (!userIsBlocked) /* Unblocks and then blocks again */ {
                cy.get('[data-testid="blockUserIcon"]').should('have.class', 'open')
                cy.get('[data-testid="blockUserButton"]').click();
                cy.get('[data-testid="blockUserIcon"]').should('not.have.class', 'open')
            }
        });
    });
});

describe('User sees their own profile while being logged in', () => {
    before(() => login());
    beforeEach(() => {
        setToken();
        cy.get('[data-testid="navbarUsername"]').click();
        cy.url().should('include', '/user/');
        cy.wait(5000);
    });

    it('Should display images, name, profile name, date and follower info', () => {
        cy.get('[data-testid="username"]').should('exist');
        cy.get('[data-testid="profileName"]').should('exist');
        cy.get('[data-testid="profileImage"]').should('exist');
        cy.get('[data-testid="userLocation"]').should('exist');
        cy.get('[data-testid="userAge"]').should('exist');
        cy.get('[data-testid="userImage"]').should('exist');
        cy.get('[data-testid="followingNumber"]').should('exist');
        cy.get('[data-testid="followerNumber"]').should('exist');
        cy.get('[data-testid="actualChangeUserImage"]').should('exist');

        cy.get('[data-testid="changeUserImage"]').should('not.exist');
        cy.get('[data-testid="userImageModal"]').should('not.exist');
        cy.get('[data-testid="profileModal"]').should('not.exist');
    });

    it("User can't block or follow themselves but can edit and delete the profile", () => {
        cy.get('[data-testid="followButton"]').should('not.exist')
        cy.get('[data-testid="blockUserButton"]').should('not.exist');

        cy.get('[data-testid="deleteUserButton"]').should('exist');
        cy.get('[data-testid="editProfileButton"]').should('exist');
        cy.get('[data-testid="deleteButton"]').should('exist');
    });

    it("Edit profile modal opens and closes", () => {
        cy.get('[data-testid="editProfileButton"]').click();
        cy.get('[data-testid="profileModal"]').should('exist');
        cy.get('[data-testid="profileModalCloseButton"]').should('exist').click();
        cy.get('[data-testid="profileModal"]').should('not.exist');
    });

    it("Editing profile fails due to empty fields", () => {
        cy.get('[data-testid="editProfileButton"]').click();
        cy.get('[data-testid="profileModal"]').should('exist');

        cy.get('[data-testid="profileNameInput"]').should('exist').clear()
        cy.get('[data-testid="profileDescriptionInput"]').should('exist').clear()
        cy.get('[data-testid="profileModalSubmitButton"]').should('exist').click();

        cy.get('[data-testid="profileNameInputError"]').should('exist').should('have.text', "Profile name can't be empty");
        cy.get('[data-testid="profileDescriptionInputError"]').should('exist').should('have.text', "Profile description can't be empty");
    });

    it("Editing profile fails due to fields being too long", () => {
        cy.get('[data-testid="editProfileButton"]').click();
        cy.get('[data-testid="profileModal"]').should('exist');

        cy.get('[data-testid="profileNameInput"]').should('exist').clear().type('okaysothisisgoingtobeareallybutimeanreallyreallypostbodythatiscompletelygoingtofailoratleastthatswhatihopeforotherwiseitwouldbeabitsadtoseeitpastasifnothinghappened')
        cy.get('[data-testid="profileDescriptionInput"]').should('exist').clear().type('okaysothisisgoingtobeareallybutimeanreallyreallypostbodythatiscompletelygoingtofailoratleastthatswhatihopeforotherwiseitwouldbeabitsadtoseeitpastasifnothinghappened')
        cy.get('[data-testid="profileModalSubmitButton"]').should('exist').click();

        cy.get('[data-testid="profileNameInputError"]').should('exist').should('have.text', "Profile name can't be longer than 40 characters");
        cy.get('[data-testid="profileDescriptionInputError"]').should('exist').should('have.text', "Description can't be longer than 140 characters");
    });

    it("Edits profile name and description", () => {
        cy.get('[data-testid="editProfileButton"]').click();
        cy.get('[data-testid="profileModal"]').should('exist');

        const profileName: string = 'New York City';
        const profileDescription: string = 'Just a web dev';

        cy.get('[data-testid="profileNameInput"]').should('exist').clear().type(profileName);
        cy.get('[data-testid="profileDescriptionInput"]').should('exist').clear().type(profileDescription);
        cy.get('[data-testid="profileModalSubmitButton"]').should('exist').click();

        cy.get('[data-testid="profileModal"]').should('not.exist');
        cy.get('[data-testid="profileName"]').should('exist').should('have.text', profileName);
        cy.get('[data-testid="profileDescription"]').should('exist').should('have.text', `About ${profileName}: ${profileDescription}`);
    });

    it("Edits profile image", () => {
        cy.get('[data-testid="editProfileButton"]').click();
        cy.get('[data-testid="profileModal"]').should('exist');

        cy.get('[data-testid="profileModalImage"]').should('exist').then(image => {
            const src = image.attr('src');

            if (src !== getBase64ImageSrc(Cypress.env('empireStateImageBase64'))) {
                cy.get('[data-testid="profileModalImageInput"]').should('exist').attachFile('EmpireState.jpg');
            }
            else {
                cy.get('[data-testid="profileModalImageInput"]').should('exist').attachFile('Statue.jpg');
            };

            cy.get('[data-testid="profileModalSubmitButton"]').should('exist').click();
            cy.get('[data-testid="profileModal"]').should('not.exist');

            cy.get('[data-testid="profileImage"]').should('exist').then(newImage => {
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
        cy.get('[data-testid="actualChangeUserImage"]').should('exist').click({ force: true });
        cy.wait(500)
        cy.get('[data-testid="userModal"]').should('exist');
        cy.get('[data-testid="userModalCloseButton"]').should('exist').click();
        cy.get('[data-testid="userModal"]').should('not.exist');
    });

    it("Edits user image", () => {
        cy.get('[data-testid="actualChangeUserImage"]').should('exist').click({ force: true });
        cy.wait(2000)
        cy.get('[data-testid="userModal"]').should('exist');
        
        cy.get('[data-testid="userModalImage"]').should('exist').then(image => {
            const src = image.attr('src');
            
            if (src !== getBase64ImageSrc(Cypress.env('taylorLoverImageBase64'))) {
                cy.get('[data-testid="userModalImageInput"]').should('exist').attachFile('TaylorLover.jpg');
                cy.wait(500)
            }
            else {
                cy.get('[data-testid="userModalImageInput"]').should('exist').attachFile('Taylor.jpg');
                cy.wait(500)
            };

            cy.get('[data-testid="userModalSubmitButton"]').should('exist').click();
            cy.get('[data-testid="userModal"]').should('not.exist');

            cy.get('[data-testid="userImage"]').should('exist').then(newImage => {
                const newSrc = newImage.attr('src');
                if (src !== getBase64ImageSrc(Cypress.env('taylorLoverImageBase64'))) {
                    expect(newSrc).to.be.equals(getBase64ImageSrc(Cypress.env('taylorLoverImageBase64')))
                }
                else expect(newSrc).to.be.equals(getBase64ImageSrc(Cypress.env('taylor1989ImageBase64')))
            });
        });
    });
});