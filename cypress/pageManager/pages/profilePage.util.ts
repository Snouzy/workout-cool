export class ProfilePage {
    createNewAccount() {
        cy.get('a[href="auth/signup"]',).click()
    }
    login() {
        cy.get('a[href="auth/signin"]',).click()
    }
}