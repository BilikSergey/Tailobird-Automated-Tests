import { expect, Locator, Page } from "@playwright/test";
import userData from "../data/userData.json";
import properties from "../data/properties.json";
import links from "../data/links.json";
import { formatNumberWithComma } from "../utils/formatters";

export class CapExPage {
  page: Page;
  buttonCapExAtSidebar: Locator;
  inputCapExSearch: Locator;
  rowWithProjectName: (label: string) => Locator;
  cellJobCategory: (label: string) => Locator;

  //Verification of Project Row
  cellRevisedBudgetProject: (label: string) => Locator;
  cellBudgetRemainingProject: (label: string) => Locator;
  cellOriginalContractProject: (label: string) => Locator;
  cellCurrentContractProject: (label: string) => Locator;
  cellRemainingContractProject: (label: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonCapExAtSidebar = this.page.locator(
      '//span[contains(text(), "CapEx")]/ancestor::a[@class]'
    );
    this.inputCapExSearch = this.page.locator(
      '//input[@placeholder="Search CapEx data..."]'
    );
    this.rowWithProjectName = (label: string) =>
      this.page.locator(
        `//span[contains(text(), "${label}")]/ancestor::div[@role="row"]`
      );
    this.cellJobCategory = (label: string) =>
      this.page.locator(
        `//span[contains(text(), "${label}")]/ancestor::div[@role="row"]/following-sibling::div[1]`
      );

    //Verification of Rows
    this.cellRevisedBudgetProject = (label: string) =>
      this.page.locator(
        `//div[@row-index="${label}"]/descendant::div[@col-id="revisedBudget"]`
      );
    this.cellBudgetRemainingProject = (label: string) =>
      this.page.locator(
        `//div[@row-index="${label}"]/descendant::div[@col-id="budgetRemaining"]`
      );
    this.cellOriginalContractProject = (label: string) =>
      this.page.locator(
        `//div[@row-index="${label}"]/descendant::div[@col-id="originalContractValue"]`
      );
    this.cellCurrentContractProject = (label: string) =>
      this.page.locator(
        `//div[@row-index="${label}"]/descendant::div[@col-id="contractValue"]`
      );
    this.cellRemainingContractProject = (label: string) =>
      this.page.locator(
        `//div[@row-index="${label}"]/descendant::div[@col-id="remainingContract"]`
      );
  }

  async budget(projectName: string) {
    await this.buttonCapExAtSidebar.click();
    await expect(this.inputCapExSearch).toBeVisible();
    await this.rowWithProjectName(projectName).scrollIntoViewIfNeeded();
    await this.cellJobCategory(projectName).dblclick();
  }
}
