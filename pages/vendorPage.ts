import { expect, Locator, Page } from "@playwright/test";
import { formatNumberWithComma } from "../utils/formatters";

const buttonSideBarBidContracts =
  '//a[@class]/descendant::span[contains(text(), "Bids & Contracts")]';
const searchInput =
  '//input[@placeholder="Search..." and @data-variant="default"]';
const buttonViewDetails =
  '//button/ancestor::div[@role="gridcell" and @col-id="actions"]';
const buttonAcceptBid =
  '//span[contains(text(), "Accept Bid")]/ancestor::button';
const inputTotalCostCell = '//input[@data-testid="bird-table-currency-input"]';
const buttonSubmitBid =
  '//button/descendant::span[contains(text(), "Submit Bid")]';
const formContractAwarded =
  '//span[contains(text(), "Contract Already Awarded")]/ancestor::div[@role="alert"]';
const cellTotalCost = (label: string) =>
  `//p[contains(text(), "${label}")]/ancestor::div[@role="row"]//div[@role="gridcell" and @col-id="total_price"]`;

export class VendorPage {
  constructor(private page: Page) {}

  // Getters for static locators
  get buttonSideBarBidContracts(): Locator {
    return this.page.locator(buttonSideBarBidContracts);
  }
  get searchInput(): Locator {
    return this.page.locator(searchInput);
  }
  get buttonViewDetails(): Locator {
    return this.page.locator(buttonViewDetails);
  }
  get buttonAcceptBid(): Locator {
    return this.page.locator(buttonAcceptBid);
  }
  get inputTotalCostCell(): Locator {
    return this.page.locator(inputTotalCostCell);
  }
  get buttonSubmitBid(): Locator {
    return this.page.locator(buttonSubmitBid);
  }
  get formContractAwarded(): Locator {
    return this.page.locator(formContractAwarded);
  }

  // Dynamic locator
  cellTotalCost(label: string) {
    return this.page.locator(cellTotalCost(label));
  }

  // Method
  async addTotalCost(
    projectName: string,
    bid1Name: string,
    bid2Name: string,
    totalCostString1: string,
    totalCostString2: string
  ) {
    await this.buttonSideBarBidContracts.click();
    await expect(this.searchInput).toBeVisible();
    let prevCount = await this.buttonViewDetails.count();
    await this.searchInput.fill(projectName);
    await expect
      .poll(async () => {
        const currentCount = await this.buttonViewDetails.count();
        return currentCount;
      })
      .not.toBe(prevCount);
    await this.buttonViewDetails.last().click();
    await this.buttonAcceptBid.waitFor({ state: "visible" });
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.buttonAcceptBid.click();
    // Fill first bid
    await expect(this.buttonSubmitBid).toBeVisible();
    await this.cellTotalCost(bid1Name).dblclick();
    await this.inputTotalCostCell.fill(totalCostString1);
    await this.inputTotalCostCell.press("Enter");
    await expect(this.cellTotalCost(bid1Name)).toHaveText(
      "$" + formatNumberWithComma(totalCostString1),
      { timeout: 5000 }
    );
    // Fill second bid
    await this.cellTotalCost(bid2Name).dblclick();
    await this.inputTotalCostCell.fill(totalCostString2);
    await this.inputTotalCostCell.press("Enter");
    await expect(this.cellTotalCost(bid2Name)).toHaveText(
      "$" + formatNumberWithComma(totalCostString2),
      { timeout: 5000 }
    );
    // Submit
    this.page.once("dialog", (dialog) => dialog.accept());
    await this.buttonSubmitBid.click();
  }
}
