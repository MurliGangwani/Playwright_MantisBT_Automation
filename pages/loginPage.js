const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signupForNewAccount = page.getByText('Signup for a new account');
    this.loginAnonymously = page.getByText('Login Anonymously');
    this.loginButton = page.locator('input[type="submit"]');
    this.keepMeLoggedIn = page.locator("input[id='remember-login']");
    this.allowSessionToBeUsed = page.locator("input[id='secure-session']");
    this.lostYourPassword = page.getByText('Lost your password?');
  }

  async navigate() {
    await this.page.goto('https://mantisbt.org/bugs/login_page.php');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
    await expect(this.page).toHaveURL('https://mantisbt.org/bugs/login_password_page.php');
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
