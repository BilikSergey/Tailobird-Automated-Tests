import { Locator, Page } from "@playwright/test";
import links from "../data/links.json";

const inputEmailSelector = 'input[name="email"]';
const submitButtonSelector = 'button[type="submit"]';
const inputPasswordSelector = 'input[name="password"]';
const buttonLoginSelector =
  '//button[@name="intent"]/descendant::span[contains(text(), "Sign in")]';
const navLabelSelector = "span.mantine-NavLink-label";

export class LoginUser {
  constructor(private page: Page) {}

  get inputEmail(): Locator {
    return this.page.locator(inputEmailSelector);
  }
  get buttonSubmit(): Locator {
    return this.page.locator(submitButtonSelector);
  }
  get inputPassword(): Locator {
    return this.page.locator(inputPasswordSelector);
  }
  get buttonLogin(): Locator {
    return this.page.locator(buttonLoginSelector);
  }
  navLabel(label: string) {
    return this.page.locator(navLabelSelector, { hasText: label });
  }

  // Methods
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
