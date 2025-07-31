export class ProfilePage {
    createNewAccount() {
        cy.get('[data-testid="profile-page-signup"]').click()
    }
    login() {
        cy.get('[data-testid="profile-page-login"]').click()
    }
    newWorkout() {
        cy.get('[data-testid="profile-page-new-workout"]').click()
    }
    deleteWorkout(exerciseName: string) {
        cy.get('[data-testid="profile-page-workout-history"]')
            .children()
            .then(elements => {
                elements.each((_,element) => {
                    cy.get('[data-testid="profile-page-workout-history-exercise-name"]')
                            .invoke('text')
                            .then( text => {
                                if (text.toLowerCase() === exerciseName.toLowerCase()) {
                                    cy.get('[data-testid="profile-page-workout-history-delete"]').click()
                                    cy.on('window:confirm', () => {return true})
                                }
                        })
                })
            })
    }
    repeatWorkout(exerciseName: string) {
        cy.get('[data-testid="profile-page-workout-history"]')
            .children()
            .then(elements => {
                elements.each((_,element) => {
                    cy.get('[data-testid="profile-page-workout-history-exercise-name"]')
                            .invoke('text')
                            .then( text => {
                                if (text.toLowerCase() === exerciseName.toLowerCase()) {
                                    cy.get('[data-testid="profile-page-workout-history-repeat"]').click()
                                }
                        })
                })
            })
    }
    getWorkoutSessionExercises(): Cypress.Chainable<string[]> {
        return cy.get('[data-testid="profile-page-workout-history"]')
            .find('[data-testid="profile-page-workout-history-exercise-name"]')
            .then($els => {
                // $els is a jQuery collection of all exercise name elements
                // Map each element's text, lowercased, into an array
                return Cypress._.map($els, el => el.innerText.trim().toLowerCase());
            });
    }
}