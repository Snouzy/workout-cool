/// <reference types="cypress" />

describe('Account creation tests', function () {
  beforeEach(function () {
    //access test data for the user account from the fixture folder
    cy.fixture('accountInfo').then(function (data) {
      this.accountInfo = data
    })

    //navigate to the home page using "baseURL" from cypress.config.ts
    cy.visit("/")
  })
  it('TC_001 - Able to register a new user account', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signup"]', {timeout: 10000}).click()
    cy.get('[data-testid="signup-form-firstName"]').type(this.accountInfo.basic_user.first_name)
    cy.get('[data-testid="signup-form-lastName"]').type(this.accountInfo.basic_user.last_name)
    cy.get('[data-testid="signup-form-email"]').type(this.accountInfo.basic_user.email)
    cy.get('[data-testid="signup-form-password"]').type(this.accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-verifyPassword"]').type(this.accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-submit"]').click()

    cy.log('Checking for email:', this.accountInfo.basic_user.email)
    cy.task('findUserByEmail', this.accountInfo.basic_user.email).then(function (user) {
      const u = user as any
      expect(u).to.not.be.null
      expect(u.email).to.equal(this.accountInfo.basic_user.email)
    })
  })
})
