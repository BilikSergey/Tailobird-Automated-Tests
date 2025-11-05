import { expect, Locator, Page } from "@playwright/test";
import { formatNumberWithComma } from "../utils/formatters";

// Static locators
const buttonBudgetAtSidebar =
  '//span[contains(text(), "Budget")]/ancestor::a[@class]';
const hoveringButtonAddBudget = '//button[@data-testid="bt-add-row-menu"]';
const clickableButtonAddBudget =
  'button[role="menuitem"]:has-text("Add Budget")';
const cellsCategory = '//div[@role="gridcell" and @col-id="category_id"]';
const inputCategory = '//input[@data-testid="bird-table-select-search"]';
const inputRevisedBudget = '//input[@data-testid="bird-table-currency-input"]';
const cellOriginalBudget =
  '//div[@col-id="original_budget" and @role="gridcell"]';
const deleteBudgetButton =
  '//div[@role="gridcell" and @col-id="actions"]/descendant::button';
const buttonConfirmDelete =
  '//p[contains(text(),"Delete Row")]/ancestor::div/descendant::span[contains(text(), "Delete")]/ancestor::button';
const cellRevisedBudget =
  '//div[@role="gridcell" and @col-id="revised_budget"]';

// Allocation section
const buttonAllocation =
  '//span[contains(text(), "Allocation")]/ancestor::button';
const inputSearchBudgetAllocation =
  '//input[@placeholder="Search budget allocations..."]';
const tableContainer = '//div[@role="treegrid"]';
const buttonSyncData = '//span[contains(text(),"Sync Data")]/ancestor::button';
const categoryCells = '//div[@role="gridcell" and @col-id="category"]';
const inputJobCategory = '//input[@placeholder="Search options..."]';
const inputJobRevisedBudget =
  '//div[@role="presentation"]/descendant::input[@aria-label="Input Editor"]';

// Dynamic locators
const categoryOption = (label: string) =>
  `//div[@data-testid="bird-table-select-dropdown"]/descendant::p[contains(text(), "${label}")]`;
const rowWithProjectName = (label: string) =>
  `//span[contains(text(), "${label}")]/ancestor::div[@role="row"]`;
const cellJobCategory = (label: string) =>
  `//div[@row-index="${label}"]/descendant::div[@role="gridcell" and @col-id="category"]`;
const buttonJobCategory = (label: string) =>
  `//div[contains(text(), "${label}")]/ancestor::button`;
const cellJobRevisedBudget = (label: string) =>
  `//div[@row-index="${label}"]/descendant::div[@role="gridcell" and @col-id="revisedBudget"]`;
const finalBudget = (label: string) =>
  `(//p[contains(text(),"${label}")]/parent::div/parent::div)/descendant::p[contains(text(),"Budget")]/following-sibling::p`;
const usedFinalBudget = (label: string) =>
  `(//p[contains(text(),"${label}")]/parent::div/parent::div)/descendant::p[contains(text(),"Used")]/following-sibling::p`;
const remainingFinalBudget = (label: string) =>
  `(//p[contains(text(),"${label}")]/parent::div/parent::div)/descendant::p[contains(text(),"Remaining")]/following-sibling::p`;

export class BudgetPage {
  constructor(private page: Page) {}

  // Getters
  get buttonBudgetAtSidebar() {
    return this.page.locator(buttonBudgetAtSidebar);
  }
  get hoveringButtonAddBudget() {
    return this.page.locator(hoveringButtonAddBudget);
  }
  get clickableButtonAddBudget() {
    return this.page.locator(clickableButtonAddBudget);
  }
  get cellsCategory() {
    return this.page.locator(cellsCategory);
  }
  get inputCategory() {
    return this.page.locator(inputCategory);
  }
  get inputRevisedBudget() {
    return this.page.locator(inputRevisedBudget);
  }
  get cellOriginalBudget() {
    return this.page.locator(cellOriginalBudget);
  }
  get deleteBudgetButton() {
    return this.page.locator(deleteBudgetButton);
  }
  get buttonConfirmDelete() {
    return this.page.locator(buttonConfirmDelete);
  }
  get buttonAllocation() {
    return this.page.locator(buttonAllocation);
  }
  get inputSearchBudgetAllocation() {
    return this.page.locator(inputSearchBudgetAllocation);
  }
  get tableContainer() {
    return this.page.locator(tableContainer);
  }
  get buttonSyncData() {
    return this.page.locator(buttonSyncData);
  }
  get categoryCells() {
    return this.page.locator(categoryCells);
  }
  get inputJobCategory() {
    return this.page.locator(inputJobCategory);
  }
  get inputJobRevisedBudget() {
    return this.page.locator(inputJobRevisedBudget);
  }

  get cellRevisedBudget() {
    return this.page.locator(cellRevisedBudget);
  }

  // Dynamic locators
  categoryOption(label: string) {
    return this.page.locator(categoryOption(label));
  }
  rowWithProjectName(label: string) {
    return this.page.locator(rowWithProjectName(label));
  }
  cellJobCategory(label: string) {
    return this.page.locator(cellJobCategory(label));
  }
  buttonJobCategory(label: string) {
    return this.page.locator(buttonJobCategory(label));
  }
  cellJobRevisedBudget(label: string) {
    return this.page.locator(cellJobRevisedBudget(label));
  }
  finalBudget(label: string) {
    return this.page.locator(finalBudget(label));
  }
  usedFinalBudget(label: string) {
    return this.page.locator(usedFinalBudget(label));
  }
  remainingFinalBudget(label: string) {
    return this.page.locator(remainingFinalBudget(label));
  }

  //Methods
  async budget(certainOption: string, originalBudget: string) {
    await this.buttonBudgetAtSidebar.click();
    await this.hoveringButtonAddBudget.waitFor({ state: "visible" });
    const quantityOfRows = await this.cellsCategory.count();
    await this.hoveringButtonAddBudget.hover();
    await this.clickableButtonAddBudget.click();
    await expect(this.cellsCategory).toHaveCount(quantityOfRows + 1);
    await this.cellsCategory.first().dblclick();
    await this.inputCategory.fill(certainOption);
    await this.categoryOption(certainOption).click();
    await expect(this.cellsCategory.first()).toContainText(certainOption);
    const box = await this.cellRevisedBudget.last().boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.page.waitForTimeout(1000);
    await this.cellRevisedBudget.last().dblclick({ trial: false });
    await this.inputRevisedBudget.fill(originalBudget);
    await this.inputRevisedBudget.press("Enter");
  }

  async deleteBudget(projectName: string) {
    await this.buttonBudgetAtSidebar.click();
    await this.hoveringButtonAddBudget.waitFor({ state: "visible" });
    const quantityOfRowsBefore = await this.cellsCategory.count();
    await this.deleteBudgetButton.last().click();
    await this.buttonConfirmDelete.click();
    const deleteToast = this.page.locator(
      '//div[contains(text(), "Row deleted successfully")]'
    );
    await expect(deleteToast).toBeVisible();
    await expect(deleteToast).not.toBeVisible();
    const quantityOfRowsAfter = await this.cellsCategory.count();
    expect(quantityOfRowsAfter).toBe(quantityOfRowsBefore - 1);

    // Allocation cleanup
    await this.buttonAllocation.click();
    await expect(this.tableContainer).toBeVisible();
    await this.buttonSyncData.click();
    await expect(this.tableContainer).not.toBeVisible();
    await expect(this.tableContainer).toBeVisible();
    await this.inputSearchBudgetAllocation.fill(projectName);
    await expect(this.rowWithProjectName(projectName)).toBeVisible();
    let projectRowIndex = await this.rowWithProjectName(
      projectName
    ).getAttribute("row-index");
    projectRowIndex = (Number(projectRowIndex) + 1).toString();
    const box = await this.cellJobRevisedBudget(projectRowIndex)
      .first()
      .boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.cellJobRevisedBudget(projectRowIndex)
      .first()
      .dblclick({ trial: false });
    await this.inputJobRevisedBudget.fill("0");
    await this.inputJobRevisedBudget.press("Enter");
    await expect(this.cellJobRevisedBudget(projectRowIndex).first()).toHaveText(
      "$0"
    );
  }

  async allocation(
    projectName: string,
    certainOption: string,
    totalPrice: string
  ) {
    await this.buttonAllocation.click();
    await expect(this.tableContainer).toBeVisible();
    await this.buttonSyncData.click();
    await expect(this.tableContainer).not.toBeVisible();
    await expect(this.tableContainer).toBeVisible();
    await this.inputSearchBudgetAllocation.fill(projectName);
    await expect(this.rowWithProjectName(projectName)).toBeVisible();
    let projectRowIndex = await this.rowWithProjectName(
      projectName
    ).getAttribute("row-index");
    projectRowIndex = (Number(projectRowIndex) + 1).toString();
    let box = await this.cellJobCategory(projectRowIndex).first().boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.page.waitForTimeout(500);
    await this.cellJobCategory(projectRowIndex).first().click({ trial: false });
    await this.inputJobCategory.fill(certainOption);
    await this.buttonJobCategory(certainOption).click();
    await expect(this.cellJobCategory(projectRowIndex).first()).toHaveText(
      certainOption
    );
    box = await this.cellJobRevisedBudget(projectRowIndex).boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.page.waitForTimeout(500);
    await this.cellJobRevisedBudget(projectRowIndex).dblclick({ trial: false });
    await this.inputJobRevisedBudget.fill(totalPrice);
    await this.inputJobRevisedBudget.press("Enter");
    await expect(this.cellJobRevisedBudget(projectRowIndex)).toHaveText(
      "$" + formatNumberWithComma(totalPrice)
    );
  }
}
