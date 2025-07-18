/// <reference types="cypress" />

interface BasicUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface AccountInfo {
  basic_user: BasicUser;
  registered_user: BasicUser;
}

describe('Account login tests', function () {
  let accountInfo: AccountInfo;

  //Creates a new user and sets up access for fixture data
  before(() => {
    cy.fixture('accountInfo').then((data: AccountInfo) => {
      accountInfo = data
    });

  })
  beforeEach(function () {
    //navigate to the home page using "baseURL" from cypress.config.ts
    cy.visit("/");
  })

  //Cleans up prep user data
  after(() => {
    cy.task('deleteUserByEmail', accountInfo.basic_user.email.toLocaleLowerCase());
  })

  it("Test prep", function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signup"]',).click()
    cy.get('[data-testid="signup-form-firstName"]').type(accountInfo.basic_user.first_name)
    cy.get('[data-testid="signup-form-lastName"]').type(accountInfo.basic_user.last_name)
    cy.get('[data-testid="signup-form-email"]').type(accountInfo.basic_user.email)
    cy.get('[data-testid="signup-form-password"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-verifyPassword"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-submit"]').click()

    //Wait for signup flow to complete
    cy.intercept('/profile').as('profile')
    cy.wait('@profile')
  })
  
  it('TC_005 - Able to login to user account', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signin"]',).click()
    cy.get('[data-testid="login-form-email"]').type(accountInfo.basic_user.email)
    cy.get('[data-testid="login-form-password"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="login-form-submit"]').click()

    //Enusre login has been processed
    cy.intercept('/?signin=true').as('signin')
    cy.wait('@signin')
  })

  it('TC_006 - Unable to login with incorrect password', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signin"]',).click()
    cy.get('[data-testid="login-form-email"]').type(accountInfo.basic_user.email)
    cy.get('[data-testid="login-form-password"]').type(accountInfo.basic_user.password+1)
    cy.get('[data-testid="login-form-submit"]').click()

    //Enusre login has been processed
    cy.wait(5000)

    expect(cy.contains("Invalid credentials or account does not exist")).to.exist
  })

  it('TC_007 - Unable to login with incorrect email', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signin"]',).click()
    cy.get('[data-testid="login-form-email"]').type(accountInfo.registered_user.email)
    cy.get('[data-testid="login-form-password"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="login-form-submit"]').click()

    //Enusre login has been processed
    cy.wait(5000)

    expect(cy.contains("Invalid credentials or account does not exist")).to.exist
  })

})