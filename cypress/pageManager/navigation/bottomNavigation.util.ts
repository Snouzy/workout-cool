export class BottomNavigation {
    workouts() {
        cy.get('[data-testid="bottom-nav-workout-builder"]').click()
    }
    programs() {
        cy.get('[data-testid="bottom-nav-programs"]').click()
    }
    premium() {
        cy.get('[data-testid="bottom-nav-premium"]').click()
    }
    tools() {
        cy.get('[data-testid="bottom-nav-tools"]').click()
    }
    profile() {
        cy.get('[data-testid="bottom-nav-profile"]').click()
    }
}