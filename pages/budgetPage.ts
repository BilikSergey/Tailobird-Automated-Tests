import { expect, Locator, Page } from "@playwright/test";
import userData from "../data/userData.json";
import properties from "../data/properties.json";
import links from "../data/links.json";
import { formatNumberWithComma } from "../utils/formatters";

const cellRevisedBudget =
  '//div[@role="gridcell" and @col-id="revised_budget"]';
export class BudgetPage {
  page: Page;
  buttonBudgetAtSidebar: Locator;
  hoveringButtonAddBudget: Locator;
  clickableButtonAddBudget: Locator;
  cellsCategory: Locator;
  inputCategory: Locator;
  categoryOption: (label: string) => Locator;
  inputRevisedBudget: Locator;
  cellOriginalBudget: Locator;
  deleteBudgetButton: Locator;
  buttonConfirmDelete: Locator;

  //Allocation
  buttonAllocation: Locator;
  inputSearchBudgetAllocation: Locator;
  tableContainer: Locator;
  buttonSyncData: Locator;
  categoryCells: Locator;
  rowWithProjectName: (label: string) => Locator;
  cellJobCategory: (label: string) => Locator;
  inputJobCategory: Locator;
  buttonJobCategory: (label: string) => Locator;
  cellJobRevisedBudget: (label: string) => Locator;
  inputJobRevisedBudget: Locator;

  //Allocation verification
  finalBudget: (label: string) => Locator;
  usedFinalBudget: (label: string) => Locator;
  remainingFinalBudget: (label: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonBudgetAtSidebar = this.page.locator(
      '//span[contains(text(), "Budget")]/ancestor::a[@class]'
    );
    this.hoveringButtonAddBudget = this.page.locator(
      '//button[@data-testid="bt-add-row-menu"]'
    );
    this.clickableButtonAddBudget = this.page.getByRole("menuitem", {
      name: "Add Budget",
    });
    this.cellsCategory = this.page.locator(
      '//div[@role="gridcell" and @col-id="category_id"]'
    );
    this.inputCategory = this.page.locator(
      '//input[@data-testid="bird-table-select-search"]'
    );
    this.categoryOption = (label: string) =>
      this.page.locator(
        `//div[@data-testid="bird-table-select-dropdown"]/descendant::p[contains(text(), "${label}")]`
      );
    this.inputRevisedBudget = this.page.locator(
      '//input[@data-testid="bird-table-currency-input"]'
    );
    this.cellOriginalBudget = this.page.locator(
      '//div[@col-id="original_budget" and @role="gridcell"]'
    );
    this.deleteBudgetButton = this.page.locator(
      '//div[@role="gridcell" and @col-id="actions"]/descendant::button'
    );
    this.buttonConfirmDelete = this.page.locator(
      '//p[contains(text(),"Delete Row")]/ancestor::div/descendant::span[contains(text(), "Delete")]/ancestor::button'
    );

    //Allocation
    this.buttonAllocation = this.page.locator(
      '//span[contains(text(), "Allocation")]/ancestor::button'
    );
    this.inputSearchBudgetAllocation = this.page.locator(
      '//input[@placeholder="Search budget allocations..."]'
    );
    this.tableContainer = this.page.locator('//div[@role="treegrid"]');
    this.buttonSyncData = this.page.locator(
      '//span[contains(text(),"Sync Data")]/ancestor::button'
    );
    this.categoryCells = this.page.locator(
      '//div[@role="gridcell" and @col-id="category"]'
    );
    this.rowWithProjectName = (label: string) =>
      this.page.locator(
        `//span[contains(text(), "${label}")]/ancestor::div[@role="row"]`
      );
    this.cellJobCategory = (label: string) =>
      this.page.locator(
        `//div[@row-index="${label}"]/descendant::div[@role="gridcell" and @col-id="category"]`
      );
    this.inputJobCategory = this.page.locator(
      '//input[@placeholder="Search options..."]'
    );
    this.buttonJobCategory = (label: string) =>
      this.page.locator(`//div[contains(text(), "${label}")]/ancestor::button`);
    this.cellJobRevisedBudget = (label: string) =>
      this.page.locator(
        `//div[@row-index="${label}"]/descendant::div[@role="gridcell" and @col-id="revisedBudget"]`
      );
    this.inputJobRevisedBudget = this.page.locator(
      '//div[@role="presentation"]/descendant::input[@aria-label="Input Editor"]'
    );

    //Allocation verification
    this.finalBudget = (label: string) =>
      this.page.locator(
        `(//p[contains(text(),"${label}")]/parent::div/parent::div)/descendant::p[contains(text(),"Budget")]/following-sibling::p`
      );
    this.usedFinalBudget = (label: string) =>
      this.page.locator(
        `(//p[contains(text(),"${label}")]/parent::div/parent::div)/descendant::p[contains(text(),"Used")]/following-sibling::p`
      );
    this.remainingFinalBudget = (label: string) =>
      this.page.locator(
        `(//p[contains(text(),"${label}")]/parent::div/parent::div)/descendant::p[contains(text(),"Remaining")]/following-sibling::p`
      );
  }

  async getCellRevisedBudget() {
    return this.page.locator(cellRevisedBudget);
  }

  async budget(certainOption: string, originalBudget: string) {
    await this.buttonBudgetAtSidebar.click();
    await this.hoveringButtonAddBudget.waitFor({ state: "visible" });
    const quantityOfRows = await this.cellsCategory.count();
    await this.hoveringButtonAddBudget.hover();
    await this.clickableButtonAddBudget.click();
    await expect(this.cellsCategory).toHaveCount(quantityOfRows + 1);
    await this.cellsCategory.last().dblclick();
    await this.inputCategory.fill(certainOption);
    await this.categoryOption(certainOption).click();
    await expect(this.cellsCategory.last()).toContainText(certainOption);

    const box = await (await this.getCellRevisedBudget()).last().boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.page.waitForTimeout(1000);
    await (await this.getCellRevisedBudget()).last().dblclick({ trial: false });
    await this.inputRevisedBudget.fill(originalBudget);
    await this.inputRevisedBudget.press("Enter");
  }

  async deleteBudget(projectName: string) {
    await this.buttonBudgetAtSidebar.click();
    await this.hoveringButtonAddBudget.waitFor({ state: "visible" });
    const quantityOfRowsBefore = await this.cellsCategory.count();
    await this.deleteBudgetButton.last().click();
    await this.buttonConfirmDelete.click();
    await expect(
      this.page.locator('//div[contains(text(), "Row deleted successfully")]')
    ).toBeVisible();
    await expect(
      this.page.locator('//div[contains(text(), "Row deleted successfully")]')
    ).not.toBeVisible();
    const quantityOfRowsAfter = await this.cellsCategory.count();
    expect(quantityOfRowsAfter).toBe(quantityOfRowsBefore - 1);

    //delete at allocation
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
    const box = await this.cellJobRevisedBudget(projectRowIndex).first().boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.page.waitForTimeout(1000);
    await this.cellJobRevisedBudget(projectRowIndex).dblclick({ trial: false });
    await this.inputJobRevisedBudget.fill("0");
    await this.inputJobRevisedBudget.press("Enter");
    await expect(this.cellJobRevisedBudget(projectRowIndex!)).toHaveText("$0");
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
    await this.cellJobCategory(projectRowIndex!).first().click();
    await this.inputJobCategory.fill(certainOption);
    await this.buttonJobCategory(certainOption).click();
    await expect(this.cellJobCategory(projectRowIndex!)).toHaveText(
      certainOption
    );
    const box = await this.cellJobRevisedBudget(projectRowIndex).boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.page.waitForTimeout(1000);
    await this.cellJobRevisedBudget(projectRowIndex).dblclick({ trial: false });
    await this.inputJobRevisedBudget.fill(totalPrice);
    await this.inputJobRevisedBudget.press("Enter");
    await expect(this.cellJobRevisedBudget(projectRowIndex!)).toHaveText(
      "$" + formatNumberWithComma(totalPrice)
    );
  }
}
