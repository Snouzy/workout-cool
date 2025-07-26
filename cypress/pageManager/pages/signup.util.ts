export class SignupForm {
    fill({
        first_name,
        last_name,
        email,
        password,
        verifyPassword = password,

    }: {
        first_name?: string;
        last_name?: string;
        email?: string;
        password?: string;
        verifyPassword?: string;
    }) {
        if (first_name !== undefined)
            cy.get('[data-testid="signup-form-firstName"]').type(first_name);
        if (last_name !== undefined)
            cy.get('[data-testid="signup-form-lastName"]').type(last_name);
        if (email !== undefined)
            cy.get('[data-testid="signup-form-email"]').type(email);
        if (password !== undefined)
            cy.get('[data-testid="signup-form-password"]').type(password);
        if (verifyPassword !== undefined)
            cy.get('[data-testid="signup-form-verifyPassword"]').type(verifyPassword);
    }

    submit() {
        cy.get('[data-testid="signup-form-submit"]').click();
    }
}

