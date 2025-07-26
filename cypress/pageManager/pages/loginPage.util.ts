export class LoginForm {
    fill({
        email,
        password,
    }: {
        email?: string;
        password?: string;
    }) {
        if (email !== undefined)
            cy.get('[data-testid="login-form-email"]').type(email)
        if (password !== undefined)
            cy.get('[data-testid="login-form-password"]').type(password)
    }
    submit(){
        cy.get('[data-testid="login-form-submit"]').click()
    }

}