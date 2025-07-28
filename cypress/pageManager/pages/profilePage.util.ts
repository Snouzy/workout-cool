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
    deleteWorkout() {
        cy.get('[data-testid="profile-page-workout-history-delete"]').click()
    }
    repeatWorkout() {
        cy.get('[data-testid="profile-page-workout-history-repeat"]').click()
    }
}