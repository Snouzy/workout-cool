export class FinishedWorkoutPage {
    confirmWorkoutFinished() {
        cy.get('[data-testid="workout-finished"]').contains('workout finished')
    }
    gotToProfile() {
        cy.get('[data-testid="workout-finished-profile"]').click()
    }
}