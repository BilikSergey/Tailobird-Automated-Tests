import { Locator, Page } from "@playwright/test";
import userData from "../data/userData.json";
import links from "../data/links.json";

export class LoginUser {
  page: Page;
  inputEmail: Locator;
  buttonSubmit: Locator;
  inputPassword: Locator;
  buttonLogin: Locator;
  navLabel: (label: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputEmail = this.page.locator('input[name="email"]');
    this.buttonSubmit = this.page.locator('button[type="submit"]');
    this.inputPassword = this.page.locator('input[name="password"]');
    this.buttonLogin = this.page.locator(
      '//button[@name="intent"]/descendant::span[contains(text(), "Sign in")]'
    );
    this.navLabel = (label: string) =>
      this.page.locator("span.mantine-NavLink-label", { hasText: label });
  }

  async toNavigate() {
    await this.page.goto(links.login.stagingURL);
  }

  async login(email: string, password: string) {
    await this.inputEmail.fill(email);
    await this.buttonSubmit.click();
    await this.inputPassword.fill(password);
    await this.buttonLogin.click();
  }
}
