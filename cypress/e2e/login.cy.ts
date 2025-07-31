/// <reference types="cypress" />

import { BottomNavigation } from "cypress/pageManager/navigation/bottomNavigation.util";
import { LoginForm } from "cypress/pageManager/pages/loginPage.util";
import { ProfilePage } from "cypress/pageManager/pages/profilePage.util";
import { SignupForm } from "cypress/pageManager/pages/signupPage.util";

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
  const signupForm = new SignupForm();
  const profilePage = new ProfilePage();
  const loginForm = new LoginForm();
  const bottomNavigation = new BottomNavigation();

  //Creates a new user and sets up access for fixture data
  before(() => {
    cy.fixture('accountInfo').then((data: AccountInfo) => {
      accountInfo = data
    });

  })
  beforeEach(function () {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
    //navigate to the home page using "baseURL" from cypress.config.ts
    cy.visit("/");
    bottomNavigation.profile()
  })

  //Cleans up prep user data
  after(() => {
    cy.task('deleteUserByEmail', accountInfo.basic_user.email.toLocaleLowerCase());
  })

  it("Test prep", function () {
    profilePage.createNewAccount();
    signupForm.fill(accountInfo.basic_user);
    signupForm.submit();

    //Wait for signup flow to complete
    cy.intercept('/profile').as('profile')
    cy.wait('@profile')
  })
  
  // it('TC_005 - Able to login to user account', function () {
  //   profilePage.login()
  //   loginForm.fill(accountInfo.basic_user)
  //   loginForm.submit()

  //   //Ensure login has been processed
  //   cy.intercept('/?signin=true').as('signin')
  //   cy.wait('@signin')
  // })

  // it('TC_006 - Unable to login with incorrect password', function () {
  //   profilePage.login()
  //   loginForm.fill({
  //     email: accountInfo.basic_user.email,
  //     password: accountInfo.basic_user.password + '1',
  //   })
  //   loginForm.submit()

  //   //Ensure login has been processed
  //   cy.wait(5000)

  //   expect(cy.contains("Invalid credentials or account does not exist")).to.exist
  // })

  // it('TC_007 - Unable to login with incorrect email', function () {
  //   profilePage.login()
  //   loginForm.fill({
  //     email: accountInfo.registered_user.email,
  //     password: accountInfo.basic_user.password,
  //   })
  //   loginForm.submit()

  //   //Ensure login has been processed
  //   cy.wait(5000)

  //   expect(cy.contains("Invalid credentials or account does not exist")).to.exist
  // })

  it('TC_008 - Able to login to a premium user account', function () {
    cy.task('makePremium', accountInfo.basic_user.email.toLocaleLowerCase())
    profilePage.login()
    loginForm.fill(accountInfo.basic_user)
    loginForm.submit()

    //Ensure login has been processed
    cy.intercept('/?signin=true').as('signin')
    cy.wait('@signin')
  })
})