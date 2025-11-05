import { expect, Locator, Page } from "@playwright/test";

// Static locators
const buttonCapExAtSidebar =
  '//span[contains(text(), "CapEx")]/ancestor::a[@class]';
const inputCapExSearch = '//input[@placeholder="Search CapEx data..."]';
const inputSearchCapExData = '//input[@placeholder="Search CapEx data..."]';

// Dynamic locators
const capExRows = (label: string) =>
  `//div[@role="row" and @row-index=${label}]`;
const rowWithProjectName = (label: string) =>
  `//span[contains(text(), "${label}")]/ancestor::div[@role="row"]`;
const cellJobCategory = (label: string) =>
  `//span[contains(text(), "${label}")]/ancestor::div[@role="row"]/following-sibling::div[1]`;
const cellRevisedBudgetProject = (label: string) =>
  `//div[@row-index="${label}"]/descendant::div[@col-id="revisedBudget"]`;
const cellBudgetRemainingProject = (label: string) =>
  `//div[@row-index="${label}"]/descendant::div[@col-id="budgetRemaining"]`;
const cellOriginalContractProject = (label: string) =>
  `//div[@row-index="${label}"]/descendant::div[@col-id="originalContractValue"]`;
const cellCurrentContractProject = (label: string) =>
  `//div[@row-index="${label}"]/descendant::div[@col-id="contractValue"]`;
const cellRemainingContractProject = (label: string) =>
  `//div[@row-index="${label}"]/descendant::div[@col-id="remainingContract"]`;
const rowScope = (bidName: string) =>
  `//span[contains(text(), "${bidName}")]/ancestor::div[@role="row"]`;

export class CapExPage {
  constructor(private page: Page) {}

  // Getters
  get buttonCapExAtSidebar() {
    return this.page.locator(buttonCapExAtSidebar);
  }
  get inputCapExSearch() {
    return this.page.locator(inputCapExSearch);
  }
  get inputSearchCapExData() {
    return this.page.locator(inputSearchCapExData);
  }
  get countOfRows() {
    return this.page
      .locator('//div[@role="presentation"]')
      .first()
      .locator('[role="row"]');
  }

  // Dynamic locators
  capExRows(label: string) {
    return this.page.locator(capExRows(label));
  }
  rowWithProjectName(label: string) {
    return this.page.locator(rowWithProjectName(label));
  }
  cellJobCategory(label: string) {
    return this.page.locator(cellJobCategory(label));
  }
  cellRevisedBudgetProject(label: string) {
    return this.page.locator(cellRevisedBudgetProject(label));
  }
  cellBudgetRemainingProject(label: string) {
    return this.page.locator(cellBudgetRemainingProject(label));
  }
  cellOriginalContractProject(label: string) {
    return this.page.locator(cellOriginalContractProject(label));
  }
  cellCurrentContractProject(label: string) {
    return this.page.locator(cellCurrentContractProject(label));
  }

  cellRemainingContractProject(label: string) {
    return this.page.locator(cellRemainingContractProject(label));
  }
  rowScope(bidName: string) {
    return this.page.locator(rowScope(bidName));
  }

  // Methods
  async capEx(projectName: string) {
    await this.buttonCapExAtSidebar.click();
    await expect(this.inputCapExSearch).toBeVisible();
    let prevCount = await this.countOfRows.count();
    await this.inputSearchCapExData.fill(projectName);
    await expect
      .poll(async () => {
        const currentCount = await this.countOfRows.count();
        return currentCount;
      })
      .not.toBe(prevCount);
    await this.cellJobCategory(projectName).dblclick({ force: true });
  }

  async fillSearchInput(label: string) {
    await this.inputSearchCapExData.fill(label);
  }
}
