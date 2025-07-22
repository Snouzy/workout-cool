/// <reference types="cypress" />
import { SignupForm } from "cypress/pageManager/pages/signup.util";
import { AccountFlow } from "cypress/pageManager/utils/accountFlow.util";

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
  const signupForm = new SignupForm();
  const accountFlow = new AccountFlow();

  // Creates a new user and sets up access for fixture data
  before(() => {
    cy.task('createUser');
    cy.fixture('accountInfo').then((data: AccountInfo) => {
      accountInfo = data
    });
  });

  // Navigate to the home page using "baseURL" from cypress.config.ts
  // then to the account creation page
  beforeEach(function () {
    cy.visit("/");
    accountFlow.createNewAccount()
  });

  //Cleans up prep user data
  after(() => {
    cy.task('deleteUserByEmail', accountInfo.registered_user.email.toLocaleLowerCase())
  });

  it('TC_001 - Able to register a new user account', function () {
    signupForm.fill(accountInfo.basic_user);
    signupForm.submit();

    //Wait for signup flow to complete
    cy.intercept('/profile').as('profile');
    cy.wait('@profile');

    //Cypres task to find the user information in the prisma database
    //and confirm the user has been created
    cy.task('findUserByEmail', accountInfo.basic_user.email.toLocaleLowerCase()).then(function (user) {
      const prismaUser = user as any;
      expect(prismaUser).to.not.be.null
      expect(prismaUser.email).to.equal(accountInfo.basic_user.email.toLocaleLowerCase())
    });
    //Test cleanup
    cy.task('deleteUserByEmail', accountInfo.basic_user.email.toLocaleLowerCase());
  })

  it('TC_002 - Unable to register an account with a used email', function () {
    signupForm.fill(accountInfo.registered_user);
    signupForm.submit();

    cy.contains("Email already exists").should('exist')
  })

  it('TC_003 - Unable to register an account with missing information', function () {
    signupForm.fill({
      first_name: accountInfo.basic_user.first_name,
      email: accountInfo.basic_user.email,
      password: accountInfo.basic_user.password
    });
    signupForm.submit();

    cy.contains("Required").should('exist')
  })

  it('TC_004 - Unable to register an account mismatching passwords', function () {
    signupForm.fill({
      ...accountInfo.basic_user,
      verifyPassword: accountInfo.basic_user.password + '1',
    });
    signupForm.submit();

    cy.contains("Password does not match").should('exist')
  })
  it('TC_005 - Unable to register an account with incorrect password length', function () {
    signupForm.fill({
      ...accountInfo.basic_user,
      password: 'Pass',
      verifyPassword: 'Pass',
    });
    signupForm.submit();

    cy.contains("String must contain at least 8 character(s)").should('exist')
  })
})
