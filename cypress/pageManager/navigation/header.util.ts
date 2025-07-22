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
}