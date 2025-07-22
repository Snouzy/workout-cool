import { BottomNavigation } from "../navigation/bottomNavigation.util";
import { HeaderNavigation } from "../navigation/header.util";
import { ProfilePage } from "../pages/profilePage.util";

const randomNumber = Math.floor(Math.random() * 2)

export class AccountFlow {
    private bottomNavigation = new BottomNavigation();
    private headerNavigation = new HeaderNavigation();
    private profilePage = new ProfilePage();

    login() {
        if (randomNumber === 0) 
            this.bottomNavigation.profile();
            this.profilePage.login();
        if (randomNumber === 1)
            this.headerNavigation.profileDropdown("login")
    }
    createNewAccount() {
        if (randomNumber === 0) 
            this.bottomNavigation.profile();
            this.profilePage.createNewAccount();
        if (randomNumber === 1)
            this.headerNavigation.profileDropdown("register")
    }
}