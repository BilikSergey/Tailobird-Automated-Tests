import { expect, Locator, Page } from "@playwright/test";
import userData from "../data/userData.json";
import properties from "../data/properties.json";
import links from "../data/links.json";
import { formatNumberWithComma } from "../utils/formatters";

export class CapExPage {
  page: Page;
  capExRows: (label: string) => Locator;
  buttonCapExAtSidebar: Locator;
  inputCapExSearch: Locator;
  rowWithProjectName: (label: string) => Locator;
  cellJobCategory: (label: string) => Locator;
  inputSearchCapExData: Locator;

  //Verification of Project Row
  cellRevisedBudgetProject: (label: string) => Locator;
  cellBudgetRemainingProject: (label: string) => Locator;
  cellOriginalContractProject: (label: string) => Locator;
  cellCurrentContractProject: (label: string) => Locator;
  cellRemainingContractProject: (label: string) => Locator;
  rowScope: (bidName: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.capExRows = (label: string) =>
      this.page.locator(`//div[@role="row" and @row-index=${label}]`);
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
    this.inputSearchCapExData = this.page.locator(
      '//input[@placeholder="Search CapEx data..."]'
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
    this.rowScope = (bidName: string) =>
      this.page.locator(
        `//span[contains(text(), "${bidName}")]/ancestor::div[@role="row"]`
      );
  }

  async capEx(projectName: string) {
    await this.buttonCapExAtSidebar.click();
    await expect(this.inputCapExSearch).toBeVisible();
    await this.capExRows("0").first().click();
    await this.inputSearchCapExData.fill(projectName);
    await this.cellJobCategory(projectName).dblclick();
  }

  async fillSearchInput(label: string) {
    await this.inputSearchCapExData.fill(label);
  }
}
