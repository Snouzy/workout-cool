export class SessionPage {
    quitWorkout() {
        cy.get('[data-testid="session-page-quit"]').click()
    }
    quitWorkoutConfirm() {
        cy.get('[data-testid="session-page-quit-no-save"]').click()
    }
    continueWorkout() {
        cy.get('[data-testid="session-page-continue-workout"]').click()
    }
    finishWorkoutSession() {
        cy.get('[data-testid="session-page-finish-session"]').click()
    }
    closeDonationModal() {
        cy.get('[data-testid="donation-modal-close"]').click()
    }
}