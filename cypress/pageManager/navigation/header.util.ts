export class HeaderNavigation {
    changeLog() {
        cy.get('[data-testid="header-nav-changelog"]').click()
    }
    swapThemeLightDark() {
        cy.get('[data-testid="header-nav-light/dark-mode"]').click()
    }
    languageDropdown() {
        cy.get('[data-testid="header-nav-language"]').click()
    }
    profileDropdown(option: string) {
        cy.get('[data-testid="header-nav-profile"]').click()
        if (option === "profile")
            cy.get('[data-testid="profile-dropdown-profile"]').click()
        if (option === "premium")
            cy.get('[data-testid="profile-dropdown-premium"]').click()
        if (option === "login")
            cy.get('[data-testid="profile-dropdown-login"]').click()
        if (option === "register")
            cy.get('[data-testid="profile-dropdown-signup"]').click()
    }
    checkWorkoutStreak() {
        cy.wait(5000)
        return cy.get('[data-testid^="workout-streak"]').then(elements => {
            let streakArr: Array<JQuery> = [];
            elements.each((_,element) => {
                const workoutStreakAttribute = Cypress.$(element).filter('[data-testid="workout-streak-true"]').attr('data-testid')
                if(workoutStreakAttribute === 'workout-streak-true') {
                    streakArr.push(Cypress.$(element))
                }
                
            })
            if (streakArr.length === 0) {
                cy.log('No workouts in current streak')
            } else {
                cy.log(`The current streak is ${streakArr.length} day${streakArr.length >= 1 ?"s":""}`)
            }
            return cy.wrap(streakArr.length)
        })
    }
}