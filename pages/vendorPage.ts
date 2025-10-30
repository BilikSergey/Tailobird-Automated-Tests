import { expect, Locator, Page } from "@playwright/test";
import { formatNumberWithComma } from "../utils/formatters";

export class VendorPage {
  page: Page;
  buttonSideBarBidContracts: Locator;
  searchInput: Locator;
  buttonViewDetails: Locator;
  buttonAcceptBid: Locator;
  cellTotalCost: (label: string) => Locator;
  inputTotalCostCell: Locator;
  buttonSubmitBid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonSideBarBidContracts = this.page.locator(
      '//a[@class]/descendant::span[contains(text(), "Bids & Contracts")]'
    );
    this.searchInput = this.page.locator(
      '//input[@placeholder="Search..." and @data-variant="default"]'
    );
    this.buttonViewDetails = this.page.locator(
      '//button/ancestor::div[@role="gridcell" and @col-id="actions"]'
    );
    this.buttonAcceptBid = this.page.locator(
      '//span[contains(text(), "Accept Bid")]/ancestor::button'
    );
    this.cellTotalCost = (label: string) =>
      this.page.locator(
        `//p[contains(text(), "${label}")]/ancestor::div[@role="row"]//div[@role="gridcell" and @col-id="total_cost"]`
      );
    this.inputTotalCostCell = this.page.locator(
      '//input[@data-testid="bird-table-currency-input"]'
    );
    this.buttonSubmitBid = this.page.locator(
      '//button/descendant::span[contains(text(), "Submit Bid")]'
    );
  }

  async addTotalCost(
    projectName: string,
    bid1Name: string,
    bid2Name: string,
    totalCostString1: string,
    totalCostString2: string
  ) {
    await this.buttonSideBarBidContracts.click();
    await this.searchInput.fill(projectName);
    await expect(this.buttonViewDetails).toHaveCount(1, { timeout: 5000 });
    await this.buttonViewDetails.click();
    await this.buttonAcceptBid.waitFor({ state: "visible" });
    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    await this.buttonAcceptBid.click();
    await this.cellTotalCost(bid1Name).dblclick();
    await this.inputTotalCostCell.fill(totalCostString1);
    await this.inputTotalCostCell.press("Enter");
    await expect(this.cellTotalCost(bid1Name)).toHaveText(
      "$" + formatNumberWithComma(totalCostString1),
      { timeout: 5000 }
    );
    await this.cellTotalCost(bid2Name).dblclick();
    await this.inputTotalCostCell.fill(totalCostString2);
    await this.inputTotalCostCell.press("Enter");
    await expect(this.cellTotalCost(bid2Name)).toHaveText(
      "$" + formatNumberWithComma(totalCostString2),
      { timeout: 5000 }
    );
    this.page.once("dialog", async (dialog) => {
      await dialog.accept();
    });
    await this.buttonSubmitBid.click();
  }
}
