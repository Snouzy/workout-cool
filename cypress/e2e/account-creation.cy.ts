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

describe('Account creation tests', function () {
  let accountInfo: AccountInfo;

  //Creates a new user and sets up access for fixture data
  before(() => {
    cy.task('createUser');
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
    cy.task('deleteUserByEmail', accountInfo.registered_user.email.toLocaleLowerCase())
  })

  it('TC_001 - Able to register a new user account', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signup"]',).click()
    cy.get('[data-testid="signup-form-firstName"]').type(accountInfo.basic_user.first_name)
    cy.get('[data-testid="signup-form-lastName"]').type(accountInfo.basic_user.last_name)
    cy.get('[data-testid="signup-form-email"]').type(accountInfo.basic_user.email)
    cy.get('[data-testid="signup-form-password"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-verifyPassword"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-submit"]').click()

    //Wait for signup flow to complete
    cy.wait(5000)

    //Cypres task to find the user information in the prisma database
    //and confirm the user has been created
    cy.task('findUserByEmail', accountInfo.basic_user.email.toLocaleLowerCase()).then(function (user) {
      const prismaUser = user as any
      expect(prismaUser).to.not.be.null
      expect(prismaUser.email).to.equal(accountInfo.basic_user.email.toLocaleLowerCase())
    })
    //Test cleanup
    cy.task('deleteUserByEmail', accountInfo.basic_user.email.toLocaleLowerCase())
  })

  it('TC_002 - Unable to register an account with a used email', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signup"]',).click()
    cy.get('[data-testid="signup-form-firstName"]').type(accountInfo.registered_user.first_name)
    cy.get('[data-testid="signup-form-lastName"]').type(accountInfo.registered_user.last_name)
    cy.get('[data-testid="signup-form-email"]').type(accountInfo.registered_user.email)
    cy.get('[data-testid="signup-form-password"]').type(accountInfo.registered_user.password)
    cy.get('[data-testid="signup-form-verifyPassword"]').type(accountInfo.registered_user.password)
    cy.get('[data-testid="signup-form-submit"]').click()
    expect(cy.contains("Email already exists")).to.exist
  })

  it('TC_003 - Unable to register an account with missing information', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signup"]',).click()
    cy.get('[data-testid="signup-form-firstName"]').type(accountInfo.basic_user.first_name)
    cy.get('[data-testid="signup-form-email"]').type(accountInfo.basic_user.email)
    cy.get('[data-testid="signup-form-password"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-verifyPassword"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-submit"]').click()
    expect(cy.contains("Required")).to.exist
  })

  it('TC_004 - Unable to register an account mismatching passwords', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signup"]',).click()
    cy.get('[data-testid="signup-form-firstName"]').type(accountInfo.basic_user.first_name)
    cy.get('[data-testid="signup-form-lastName"]').type(accountInfo.basic_user.last_name)
    cy.get('[data-testid="signup-form-email"]').type(accountInfo.basic_user.email)
    cy.get('[data-testid="signup-form-password"]').type(accountInfo.basic_user.password)
    cy.get('[data-testid="signup-form-verifyPassword"]').type(accountInfo.basic_user.password+1)
    cy.get('[data-testid="signup-form-submit"]').click()
    expect(cy.contains("Password does not match")).to.exist
  })
  it('TC_005 - Unable to register an account with incorrect password length', function () {
    cy.get('[data-testid="bottom-nav-profile"]').click()
    cy.get('a[href="auth/signup"]',).click()
    cy.get('[data-testid="signup-form-firstName"]').type(accountInfo.basic_user.first_name)
    cy.get('[data-testid="signup-form-lastName"]').type(accountInfo.basic_user.last_name)
    cy.get('[data-testid="signup-form-email"]').type(accountInfo.basic_user.email)
    cy.get('[data-testid="signup-form-password"]').type("Pass")
    cy.get('[data-testid="signup-form-verifyPassword"]').type("Pass")
    cy.get('[data-testid="signup-form-submit"]').click()
    expect(cy.contains("String must contain at least 8 character(s)")).to.exist
  })
})
