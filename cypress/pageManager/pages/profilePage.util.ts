export class ProfilePage {
    createNewAccount() {
        cy.get('[data-testid="profile-page-signup"]').click()
    }
    login() {
        cy.get('[data-testid="profile-page-login"]').click()
    }
}