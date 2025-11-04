import { expect, Locator, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import properties from "../data/properties.json";
import userData from "../data/userData.json";
import { formatNumberWithComma } from "../utils/formatters";

// Sidebar
const sidebarProjects =
  'span.mantine-NavLink-label:has-text("Projects & Jobs")';

// Create Project
const entireProjectForm = "div.mantine-SimpleGrid-root";
const buttonCreateProject = 'button:has-text("Create Project")';
const inputProjectName = 'input[placeholder="Enter name"]';
const inputProjectProperty = 'input[placeholder="Select property"]';
const buttonFirstProjectProperty = properties.properties.property1;
const inputStartDate = 'input[placeholder="Enter start date (YYYY-MM-DD)"]';
const inputEndDate = 'input[placeholder="Enter end date (YYYY-MM-DD)"]';
const buttonAddProject = 'button:has-text("add project")';
const searchInput =
  '//p[contains(text(), "Invite Vendors to Bid")]/ancestor::section//input[@placeholder="Search..."]';

// Verify created project
const projectOverviewForm =
  '//div/descendant::p[contains(text(), "Project Overview")]';

// Create Job
const jobsTab = 'role=tab[name="Jobs"]';
const buttonCreateJob =
  '//span[contains(text(),"Create Job")]/ancestor::button';
const inputTitleJob =
  '//label[contains(text(),"Title")]/ancestor::div[1]/descendant::input';
const inputJobType =
  '//label[contains(text(),"Job Type")]/ancestor::div[1]/descendant::input';
const buttonAddJob = '//span[contains(text(), "add")]/ancestor::button';
const hoveringButtonAddJob = '[data-testid="bt-add-row-menu"]';
const clickableButtonAddJob = "Add Job";
const cellTitleJob = '[role="gridcell"][col-id="title"]';
const cellJobType = 'div[col-id="job_type"]:has-text("Unit Interior")';
const capexOptionJobType = '//p[contains(text(),"Capex")]/ancestor::div[1]';
const cellStartDate = '[role="gridcell"][col-id="start_date"]';
const buttonCalendarNextMonth = 'button[data-direction="next"]';
const cellEndDate = '[role="gridcell"][col-id="end_date"]';
const buttonViewDetails = 'button[title="View Details"]';
const inputCreatedJobName = 'input[placeholder="Enter job name"]';
const inputCreatedJobStartDate =
  'div:has-text("Start Date:") button[aria-label]';
const inputCreatedJobEndDate = 'div:has-text("End Date:") button[aria-label]';
const columnHeadersOfBidLevelling = (label: string) =>
  `(//p[contains(text(), "${label}")]/ancestor::div[@role="row"])[2]/descendant::div[@role="columnheader"]`;

// Create Bid
const bidsTab = 'button.mantine-Tabs-tab:has-text("Bids")';
const hoveringButtonAddBid =
  '//p[contains(text(), "Bid Book")]/ancestor::div[contains(@class, "mantine-Card-root")]//button[@data-testid="bt-add-row-menu"]';
const clickableButtonAddBid = "Add Bid";
const cellScope = 'div[role="gridcell"][col-id="scope"]';
const inputScope = '[data-testid="bird-table-select-search"]';

// Invite Vendors
const dropDownInviteVendorsMenu = 'p:has-text("Manage Vendors")';
const buttonInviteVendors = "Invite Vendors To Bid";
const buttonInviteNewVendor = "+ Invite a New Vendor to Bid";
const inputVendorOrganization =
  '[placeholder="Enter Vendor Organization Name"]';
const inputContactName = '[placeholder="Enter Contact Name"]';
const inputContactEmail = '[placeholder="Enter Contact Email"]';
const buttonInviteNewVendorSubmit =
  '//p[@class]/ancestor::section//button/descendant::span[contains(text(), "Invite Vendor")]';
const formOfNeededVendor = 'div[role="row"]:has-text("Luxe Quality")';
const buttonInviteSelectedVendor = "Invite Selected Vendors to Bid";

// Notifications
const notificationInvitedNewVendor =
  'div.mantine-Notifications-root:has-text("is now invited to the bid")';
const notificationInvitedVendor =
  'div.mantine-Notifications-root:has-text("vendor has been added to this job")';

// Edit On Behalf of Vendor
const vendorMenuAction =
  '//div[@role="gridcell" and @col-id="actions"]/descendant::button[@aria-haspopup="menu"]';
const buttonEditOnBehalfOfVendor =
  'button[role="menuitem"]:has-text("Edit On Behalf of Vendor")';
const entireEditSection =
  '//h2[contains(text(), "Edit Bid On Behalf of Vendor")]/ancestor::section';
const inputTotalCost = 'input[data-testid="bird-table-currency-input"]';
const crossButton =
  "//h2[contains(text(), 'Edit Bid On Behalf of Vendor')]/ancestor::header//button";

// Level Bid
const buttonBidLevelling =
  '(//p[contains(text(), "Bid Book")]/ancestor::div[contains(@class, "mantine-Card-root")]//button[@class])[7]';
const columnFooterOfBidLevelling =
  '(//span[contains(text(), "Total")]/ancestor::div[@role="row"])/descendant::div[@role="gridcell"]';

// Award
const buttonAward = '//div[contains (text(), "Award Bid")]/ancestor::button';
const buttonConfirmAwarding =
  '//h2[contains(text(), "Award Bid | ")]/ancestor::section[@role="dialog"]//button/descendant::span[contains(text(), "Award")]';
const cellStatusAwarded =
  '//div[@role="gridcell" and @col-id="status"]/descendant::p[contains(text(), "Awarded")]';

// Finalize
const buttonHideOverview =
  '//span[contains(text(), "Finalize Contract")]/ancestor::div//p[normalize-space(text()) = "Overview"]';
const buttonContract = '//span[contains(text(), "Contracts")]/ancestor::button';
const clickableButtonAddContract = "Add Contract";
const cellsScope =
  '//span[contains(text(), "Finalize Contract")]/ancestor::div[contains(@class, "mantine-Stack-root")]//div[@col-id="scope" and @role="gridcell"]';
const cellTotalCostFinalizeSection =
  '//div[@col-id="total_cost" and @role="gridcell"]';
const buttonFinalizeContract =
  '//span[contains(text(), "Finalize Contract")]/ancestor::button';
const buttonDialogFinalizeContract =
  '//h2[contains(text(), "Finalize Contract")]/ancestor::section[@role="dialog"]//span[contains(text(), "Finalize Contract")]/ancestor::button';

// Bulk Update
const checkBox = '//div[@data-ref="eCheckbox" and @role="presentation"]';
const buttonBulkUpdateStatus =
  '//span[contains(text(), "Bulk Update Status")]/ancestor::button';
const optionInProgress =
  '//div[contains(text(), "In Progress")]/ancestor::button';
const buttonUpdateStatus =
  '//h2[contains(text(), "Update Contract Status")]/ancestor::section[@role="dialog"]//span[contains(text(), "Update Status")]/ancestor::button';

//Dynamic Locators
const createdProjectName = 'p[data-size="md"]';
const createdProjectDateDuration = 'p[data-size="md"]';
const createdProjectProperty = 'p[data-size="md"]';
const cellCreatedVendorOrganizationName = `div[col-id="vendor_name"] p`;
const checkBoxVendor = (label: string) =>
  `(//p[contains(text(),"${label}")]/ancestor::div[@role="row"])/descendant::input`;
const cellFilledScope = (label: string) =>
  `//p[contains(text(), "${label}")]/ancestor::div[@role="gridcell" and @col-id="scope"]`;
const cellStatus = (label: string) =>
  `//p[contains(text(), "${label}")]/ancestor::div[@role="row"]//div[@role="gridcell" and @col-id="status"]`;
const baseBidSection =
  '//h2[contains(text(), "Edit Bid On Behalf of Vendor")]/ancestor::section//div[@role="row"]';
const scopeCell = (label: string) => `div[col-id="scope"] >> text="${label}"`;
const cellTotalCost = 'div[col-id="total_price"]';

export class MainPage {
  constructor(private page: Page) {}

  // Getters for static locators
  get buttonSideBarProjects() {
    return this.page.locator(sidebarProjects);
  }
  get entireProjectForm() {
    return this.page.locator(entireProjectForm);
  }
  get buttonCreateProject() {
    return this.page.locator(buttonCreateProject);
  }
  get inputProjectName() {
    return this.page.locator(inputProjectName);
  }
  get inputProjectProperty() {
    return this.page.locator(inputProjectProperty);
  }
  get buttonFirstProjectProperty() {
    return this.page.getByRole("option", { name: buttonFirstProjectProperty });
  }
  get inputStartDate() {
    return this.page.locator(inputStartDate);
  }
  get inputEndDate() {
    return this.page.locator(inputEndDate);
  }
  get buttonAddProject() {
    return this.page.locator(buttonAddProject);
  }
  get searchInput() {
    return this.page.locator(searchInput);
  }
  get projectOverviewForm() {
    return this.page.locator(projectOverviewForm);
  }
  get jobsTab() {
    return this.page.locator(jobsTab);
  }
  get buttonCreateJob() {
    return this.page.locator(buttonCreateJob);
  }
  get inputTitleJob() {
    return this.page.locator(inputTitleJob);
  }
  get inputJobType() {
    return this.page.locator(inputJobType);
  }
  get buttonAddJob() {
    return this.page.locator(buttonAddJob);
  }
  get hoveringButtonAddJob() {
    return this.page.locator(hoveringButtonAddJob).filter({ visible: true });
  }
  get clickableButtonAddJob() {
    return this.page.getByRole("menuitem", { name: clickableButtonAddJob });
  }
  get cellTitleJob() {
    return this.page.locator(cellTitleJob).last();
  }
  get cellJobType() {
    return this.page.locator(cellJobType).last();
  }
  get capexOptionJobType() {
    return this.page.locator(capexOptionJobType);
  }
  get cellStartDate() {
    return this.page.locator(cellStartDate).last();
  }
  get buttonCalendarNextMonth() {
    return this.page.locator(buttonCalendarNextMonth);
  }
  get cellEndDate() {
    return this.page.locator(cellEndDate).last();
  }
  get buttonViewDetails() {
    return this.page.locator(buttonViewDetails).last();
  }
  get inputCreatedJobName() {
    return this.page.locator(inputCreatedJobName);
  }
  get inputCreatedJobStartDate() {
    return this.page.locator(inputCreatedJobStartDate);
  }
  get inputCreatedJobEndDate() {
    return this.page.locator(inputCreatedJobEndDate);
  }
  columnHeadersOfBidLevelling(label: string) {
    return this.page.locator(columnHeadersOfBidLevelling(label));
  }
  get columnFooterOfBidLevelling() {
    return this.page.locator(columnFooterOfBidLevelling);
  }
  get bidsTab() {
    return this.page.locator(bidsTab);
  }
  get hoveringButtonAddBid() {
    return this.page.locator(hoveringButtonAddBid);
  }
  get clickableButtonAddBid() {
    return this.page.getByRole("menuitem", { name: clickableButtonAddBid });
  }
  get cellScope() {
    return this.page.locator(cellScope);
  }
  get inputScope() {
    return this.page.locator(inputScope);
  }
  get dropDownInviteVendorsMenu() {
    return this.page.locator(dropDownInviteVendorsMenu);
  }
  get buttonInviteVendors() {
    return this.page.getByRole("button", { name: buttonInviteVendors });
  }
  get buttonInviteNewVendor() {
    return this.page.getByRole("button", {
      name: buttonInviteNewVendor,
    });
  }
  get inputVendorOrganization() {
    return this.page.locator(inputVendorOrganization);
  }
  get inputContactName() {
    return this.page.locator(inputContactName);
  }
  get inputContactEmail() {
    return this.page.locator(inputContactEmail);
  }
  get buttonInviteNewVendorSubmit() {
    return this.page.locator(buttonInviteNewVendorSubmit);
  }
  get formOfNeededVendor() {
    return this.page.locator(formOfNeededVendor);
  }
  get buttonInviteSelectedVendor() {
    return this.page.getByRole("button", {
      name: buttonInviteSelectedVendor,
    });
  }
  get notificationInvitedNewVendor() {
    return this.page.locator(notificationInvitedNewVendor);
  }
  get notificationInvitedVendor() {
    return this.page.locator(notificationInvitedVendor);
  }
  get vendorMenuAction() {
    return this.page.locator(vendorMenuAction);
  }
  get buttonEditOnBehalfOfVendor() {
    return this.page.locator(buttonEditOnBehalfOfVendor);
  }
  get entireEditSection() {
    return this.page.locator(entireEditSection);
  }
  get inputTotalCost() {
    return this.page.locator(inputTotalCost);
  }
  get crossButton() {
    return this.page.locator(crossButton);
  }
  get buttonBidLevelling() {
    return this.page.locator(buttonBidLevelling);
  }
  get buttonAward() {
    return this.page.locator(buttonAward);
  }
  get buttonConfirmAwarding() {
    return this.page.locator(buttonConfirmAwarding);
  }
  get cellStatusAwarded() {
    return this.page.locator(cellStatusAwarded);
  }
  get buttonHideOverview() {
    return this.page.locator(buttonHideOverview);
  }
  get buttonContract() {
    return this.page.locator(buttonContract);
  }
  get clickableButtonAddContract() {
    return this.page.getByRole("menuitem", {
      name: clickableButtonAddContract,
    });
  }
  get cellsScope() {
    return this.page.locator(cellsScope);
  }
  get cellTotalCostFinalizeSection() {
    return this.page.locator(cellTotalCostFinalizeSection);
  }
  get buttonFinalizeContract() {
    return this.page.locator(buttonFinalizeContract);
  }
  get buttonDialogFinalizeContract() {
    return this.page.locator(buttonDialogFinalizeContract);
  }
  get checkBox() {
    return this.page.locator(checkBox);
  }
  get buttonBulkUpdateStatus() {
    return this.page.locator(buttonBulkUpdateStatus);
  }
  get optionInProgress() {
    return this.page.locator(optionInProgress);
  }
  get buttonUpdateStatus() {
    return this.page.locator(buttonUpdateStatus);
  }

  // Dynamic locators
  createdProjectName(label: string) {
    return this.page.locator(createdProjectName, { hasText: label });
  }
  createdProjectDateDuration(label: string) {
    return this.page.locator(createdProjectDateDuration, { hasText: label });
  }
  createdProjectProperty(label: string) {
    return this.page.locator(createdProjectProperty, { hasText: label });
  }
  cellCreatedVendorOrganizationName(name: string) {
    return this.page.locator(cellCreatedVendorOrganizationName, {
      hasText: name,
    });
  }
  checkBoxVendor(label: string) {
    return this.page.locator(checkBoxVendor(label));
  }
  cellTotalCost(label: string) {
    return this.page
      .locator(baseBidSection)
      .filter({
        has: this.page.locator(scopeCell(label)),
      })
      .locator(cellTotalCost);
  }
  cellFilledScope(label: string) {
    return this.page.locator(cellFilledScope(label));
  }
  cellStatus(label: string) {
    return this.page.locator(cellStatus(label));
  }

  // Methods
  async createProject(
    projectName: string,
    startProjectDate: string,
    endProjectDate: string
  ) {
    await this.buttonSideBarProjects.click();
    await this.entireProjectForm.waitFor({ state: "visible" });
    await this.buttonCreateProject.click();
    await this.inputProjectName.fill(projectName);
    await this.inputProjectProperty.fill(properties.properties.property1);
    await this.buttonFirstProjectProperty.click();
    await this.inputStartDate.fill(startProjectDate);
    await this.inputEndDate.fill(endProjectDate);
    await this.buttonAddProject.click();
    await this.projectOverviewForm.waitFor({ state: "visible" });
  }

  async createJob(jobTitle: string) {
    await this.jobsTab.click();
    const box = await this.buttonCreateJob.boundingBox();
    if (box)
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.waitForTimeout(500);
    await this.buttonCreateJob.click({ trial: false });
    await this.inputTitleJob.fill(jobTitle);
    await this.inputJobType.fill("Capex");
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
    await this.buttonAddJob.click();
  }

  async createBid(bid1Name: string, bid2Name: string) {
    await this.bidsTab.click();
    await this.hoveringButtonAddBid.hover();
    await this.clickableButtonAddBid.click();
    await this.cellScope.first().dblclick();
    await this.inputScope.fill(bid2Name);
    await this.inputScope.press("Enter");
    await this.hoveringButtonAddBid.hover();
    await this.clickableButtonAddBid.click();
    await this.cellScope.nth(2).dblclick();
    await this.inputScope.fill(bid1Name);
    await this.inputScope.press("Enter");
  }

  async inviteVendors(organizationName: string) {
    await this.dropDownInviteVendorsMenu.click();
    await this.buttonInviteVendors.click();
    await this.buttonInviteNewVendor.click();
    await this.inputVendorOrganization.fill(organizationName);
    await this.inputContactName.fill(faker.person.fullName());
    await this.inputContactEmail.fill(faker.internet.email());
    await this.buttonInviteNewVendorSubmit.click();
    await this.notificationInvitedNewVendor.waitFor({ state: "visible" });
    await this.buttonInviteVendors.click();
    await this.searchInput.fill(userData.existingUser.organization);
    await this.checkBoxVendor(userData.existingUser.organization).check();
    await this.buttonInviteSelectedVendor.click();
    await this.notificationInvitedVendor.waitFor({ state: "visible" });
  }

  async editOnBehalfOfVendor(
    bid1Name: string,
    bid2Name: string,
    totalCostString1: string,
    totalCostString2: string
  ) {
    await this.vendorMenuAction.nth(1).click();
    await this.buttonEditOnBehalfOfVendor.click();
    await expect(this.entireEditSection).toBeVisible();

    for (const [bid, cost] of [
      [bid1Name, totalCostString1],
      [bid2Name, totalCostString2],
    ]) {
      await this.cellTotalCost(bid).dblclick();
      await this.inputTotalCost.fill(cost);
      await this.inputTotalCost.press("Enter");
      await expect(this.cellTotalCost(bid)).toHaveText(
        "$" + formatNumberWithComma(cost),
        { timeout: 5000 }
      );
    }

    await this.crossButton.click();
  }

  async clickButtonLevellingBid() {
    await this.buttonBidLevelling.click();
  }

  async award() {
    const box = await this.vendorMenuAction.nth(1).boundingBox();
    if (box)
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.waitForTimeout(500);
    await this.vendorMenuAction.nth(1).click({ trial: false });
    await this.buttonAward.click();
    await this.buttonConfirmAwarding.click();
  }

  async finalize(bid3Name: string, totalCostString3: string) {
    await this.buttonContract.click();
    await this.buttonHideOverview.click();
    await this.hoveringButtonAddJob.hover();
    await this.clickableButtonAddContract.click();
    await expect(this.cellsScope).toHaveCount(3, { timeout: 5000 });
    await this.cellsScope.nth(2).scrollIntoViewIfNeeded();
    await this.cellsScope.nth(2).dblclick();
    await this.inputScope.fill(bid3Name);
    await this.inputScope.press("Enter");
    await this.cellFilledScope(bid3Name).waitFor({ state: "visible" });
    await this.cellTotalCostFinalizeSection.nth(2).scrollIntoViewIfNeeded();
    await this.cellTotalCostFinalizeSection.nth(2).dblclick();
    await this.inputTotalCost.fill(totalCostString3);
    await this.inputTotalCost.press("Enter");
    await expect(this.cellTotalCostFinalizeSection.nth(2)).toHaveText(
      "$" + formatNumberWithComma(totalCostString3)
    );
    await this.buttonFinalizeContract.click();
    await this.buttonDialogFinalizeContract.click();
  }

  async bulkUpdateStatus() {
    await this.checkBox.nth(2).click();
    await this.buttonBulkUpdateStatus.click();
    await this.optionInProgress.click();
    await this.buttonUpdateStatus.click();
  }
}
