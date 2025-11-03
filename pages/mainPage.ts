import { expect, Locator, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import properties from "../data/properties.json";
import userData from "../data/userData.json";
import { formatNumberWithComma } from "../utils/formatters";
export class MainPage {
  page: Page;
  buttonSideBarProjects: Locator;

  //Create project from
  entireProjectForm: Locator;
  buttonCreateProject: Locator;
  inputProjectName: Locator;
  inputProjectProperty: Locator;
  buttonFirstProjectProperty: Locator;
  inputStartDate: Locator;
  inputEndDate: Locator;
  buttonAddProject: Locator;
  searchInput: Locator;

  //Verify created project
  projectOverviewForm: Locator;
  createdProjectName: (label: string) => Locator;
  createdProjectDateDuration: (label: string) => Locator;
  createdProjectProperty: (label: string) => Locator;

  //Create job form
  jobsTab: Locator;
  buttonCreateJob: Locator;
  inputTitleJob: Locator;
  inputJobType: Locator;
  buttonAddJob: Locator;

  hoveringButtonAddJob: Locator;
  clickableButtonAddJob: Locator;
  cellTitleJob: Locator;

  cellJobType: Locator;
  capexOptionJobType: Locator;
  cellStartDate: Locator;
  buttonCalendarNextMonth: Locator;
  buttonCalendarDay: (label: string) => Locator;
  cellEndDate: Locator;
  buttonViewDetails: Locator;

  //Verify created job
  inputCreatedJobName: Locator;
  inputCreatedJobStartDate: Locator;
  inputCreatedJobEndDate: Locator;

  //Create bid
  bidsTab: Locator;
  hoveringButtonAddBid: Locator;
  clickableButtonAddBid: Locator;
  cellScope: Locator;
  inputScope: Locator;

  //Invite Vendors
  dropDownInviteVendorsMenu: Locator;
  buttonInviteVendors: Locator;
  buttonInviteNewVendor: Locator;
  inputVendorOrganization: Locator;
  inputContactName: Locator;
  inputContactEmail: Locator;
  buttonInviteNewVendorSubmit: Locator;
  formOfNeededVendor: Locator;
  checkBoxVendor: Locator;
  buttonInviteSelectedVendor: Locator;

  //Verify if vendor is invited
  notificationInvitedNewVendor: Locator;
  notificationInvitedVendor: Locator;
  cellCreatedVendorOrganizationName: (name: string) => Locator;

  //Edit on Behalf of Vendor
  vendorMenuAction: Locator;
  buttonEditOnBehalfOfVendor: Locator;
  entireEditSection: Locator;
  cellTotalCost: (label: string) => Locator;
  inputTotalCost: Locator;
  crossButton: Locator;

  //Verify if edition is applied
  cellEditedBidAmount: Locator;
  cellEditedAppliedBidAmount: (label: string) => Locator;

  //Verify Level Bid
  buttonBidLevelling: Locator;
  columnHeadersOfBidLevelling: (label: string) => Locator;
  columnFooterOfBidLevelling: Locator;

  //Award
  buttonAward: Locator;
  buttonConfirmAwarding: Locator;
  cellStatusAwarded: Locator;

  //Finalize
  buttonHideOverview: Locator;
  buttonContract: Locator;
  clickableButtonAddContract: Locator;
  cellsScope: Locator;
  cellFilledScope: (label: string) => Locator;
  cellTotalCostFinalizeSection: Locator;
  buttonFinalizeContract: Locator;
  buttonDialogFinalizeContract: Locator;

  //Bulk Update Status
  checkBox: Locator;
  buttonBulkUpdateStatus: Locator;
  optionInProgress: Locator;
  buttonUpdateStatus: Locator;
  cellStatus: (label: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.buttonSideBarProjects = this.page.locator(
      "span.mantine-NavLink-label",
      { hasText: "Projects & Jobs" }
    );

    //Create project from
    this.entireProjectForm = this.page.locator("div.mantine-SimpleGrid-root");
    this.buttonCreateProject = this.page.locator("button", {
      hasText: "Create Project",
    });
    this.inputProjectName = this.page.locator(
      'input[placeholder="Enter name"]'
    );
    this.inputProjectProperty = this.page.locator(
      'input[placeholder="Select property"]'
    );
    this.buttonFirstProjectProperty = this.page.getByRole("option", {
      name: properties.properties.property1,
    });
    this.inputStartDate = this.page.locator(
      'input[placeholder="Enter start date (YYYY-MM-DD)"]'
    );
    this.inputEndDate = this.page.locator(
      'input[placeholder="Enter end date (YYYY-MM-DD)"]'
    );
    this.buttonAddProject = this.page.getByRole("button", {
      name: "add project",
    });
    this.searchInput = this.page.locator(
      '//p[contains(text(), "Invite Vendors to Bid")]/ancestor::section//input[@placeholder="Search..."]'
    );

    //Verify created project
    this.projectOverviewForm = this.page.locator(
      '//div/descendant::p[contains(text(), "Project Overview")]'
    );
    this.createdProjectName = (label: string) =>
      this.page.locator('p[data-size="md"]', { hasText: label });
    this.createdProjectDateDuration = (label: string) =>
      this.page.locator('p[data-size="md"]', {
        hasText: label,
      });
    this.createdProjectProperty = (label: string) =>
      this.page.locator('p[data-size="md"]', {
        hasText: label,
      });

    //Create job form
    this.jobsTab = this.page.getByRole("tab", { name: "Jobs" });
    this.buttonCreateJob = this.page.locator(
      '//span[contains(text(),"Create Job")]/ancestor::button'
    );
    this.inputTitleJob = this.page.locator(
      '//label[contains(text(),"Title")]/ancestor::div[1]/descendant::input'
    );
    this.inputJobType = this.page.locator(
      '//label[contains(text(),"Job Type")]/ancestor::div[1]/descendant::input'
    );
    this.buttonAddJob = this.page.locator(
      '//span[contains(text(), "add")]/ancestor::button'
    );

    this.hoveringButtonAddJob = this.page
      .getByTestId("bt-add-row-menu")
      .filter({ visible: true });
    this.clickableButtonAddJob = this.page.getByRole("menuitem", {
      name: "Add Job",
    });
    this.cellTitleJob = this.page
      .locator('[role="gridcell"][col-id="title"]')
      .last();

    this.cellJobType = this.page
      .locator('div[col-id="job_type"]:has-text("Unit Interior")')
      .last();
    this.capexOptionJobType = this.page.locator(
      '//p[contains(text(),"Capex")]/ancestor::div[1]'
    );
    this.cellStartDate = this.page
      .locator('[role="gridcell"][col-id="start_date"]')
      .last();
    this.buttonCalendarNextMonth = this.page.locator(
      'button[data-direction="next"]'
    );
    this.buttonCalendarDay = (label: string) =>
      this.page.locator(`button[aria-label*="${label}"]`);
    this.cellEndDate = this.page
      .locator('[role="gridcell"][col-id="end_date"]')
      .last();
    this.buttonViewDetails = this.page
      .locator('button[title="View Details"]')
      .last();

    //Verify created job
    this.inputCreatedJobName = this.page.locator(
      'input[placeholder="Enter job name"]'
    );
    this.inputCreatedJobStartDate = this.page.locator(
      'div:has-text("Start Date:") button[aria-label]'
    );
    this.inputCreatedJobEndDate = this.page.locator(
      'div:has-text("End Date:") button[aria-label]'
    );

    //create bid
    this.bidsTab = this.page.locator(
      'button.mantine-Tabs-tab:has-text("Bids")'
    );
    this.hoveringButtonAddBid = this.page.locator(
      '//p[contains(text(), "Bid Book")]/ancestor::div[contains(@class, "mantine-Card-root")]//button[@data-testid="bt-add-row-menu"]'
    );
    this.clickableButtonAddBid = this.page.getByRole("menuitem", {
      name: "Add Bid",
    });
    this.cellScope = page.locator('div[role="gridcell"][col-id="scope"]');
    this.inputScope = this.page.getByTestId("bird-table-select-search");

    //Invite Vendors
    this.dropDownInviteVendorsMenu = page.locator(
      'p:has-text("Manage Vendors")'
    );
    this.buttonInviteVendors = page.getByRole("button", {
      name: "Invite Vendors To Bid",
    });
    this.buttonInviteNewVendor = page.getByRole("button", {
      name: "+ Invite a New Vendor to Bid",
    });
    this.inputVendorOrganization = page.getByPlaceholder(
      "Enter Vendor Organization Name"
    );
    this.inputContactName = page.getByPlaceholder("Enter Contact Name");
    this.inputContactEmail = page.getByPlaceholder("Enter Contact Email");
    this.buttonInviteNewVendorSubmit = this.page.locator(
      '//p[@class]/ancestor::section//button/descendant::span[contains(text(), "Invite Vendor")]'
    );
    this.formOfNeededVendor = page.locator('div[role="row"]', {
      hasText: "Luxe Quality",
    });
    this.checkBoxVendor = this.formOfNeededVendor.locator(
      'input[type="checkbox"]'
    );
    this.buttonInviteSelectedVendor = page.getByRole("button", {
      name: "Invite Selected Vendors to Bid",
    });

    //Verify if vendor is invited
    this.notificationInvitedNewVendor = this.page.locator(
      'div.mantine-Notifications-root:has-text("is now invited to the bid")'
    );
    this.notificationInvitedVendor = this.page.locator(
      'div.mantine-Notifications-root:has-text("vendor has been added to this job")'
    );
    this.cellCreatedVendorOrganizationName = (name: string) =>
      this.page.locator(`div[col-id="vendor_name"] p`, { hasText: name });

    //Edit on Behalf of Vendor
    this.vendorMenuAction = this.page.locator(
      '//div[@role="gridcell" and @col-id="actions"]/descendant::button[@aria-haspopup="menu"]'
    );
    this.buttonEditOnBehalfOfVendor = this.page.locator(
      'button[role="menuitem"]:has-text("Edit On Behalf of Vendor")'
    );
    this.entireEditSection = this.page.locator(
      '//h2[contains(text(), "Edit Bid On Behalf of Vendor")]/ancestor::section'
    );
    this.cellTotalCost = (label: string) =>
      this.page
        .locator(
          '//h2[contains(text(), "Edit Bid On Behalf of Vendor")]/ancestor::section//div[@role="row"]'
        )
        .filter({
          has: this.page.locator(`div[col-id="scope"] >> text="${label}"`),
        })
        .locator('div[col-id="total_price"]');

    this.inputTotalCost = this.page.locator(
      'input[data-testid="bird-table-currency-input"]'
    );
    this.crossButton = this.page.locator(
      "//h2[contains(text(), 'Edit Bid On Behalf of Vendor')]/ancestor::header//button"
    );

    //Verify if edition is applied
    this.cellEditedBidAmount = this.page.locator(
      '[role="gridcell"][col-id="bid_cost"]'
    );
    this.cellEditedAppliedBidAmount = (label: string) =>
      this.page.locator(
        `//p[contains(text(), "${label}")]/ancestor::div[@role="row"]/div[@col-id="status" and @role="gridcell"]/descendant::p[contains (text(), "Accepted")]`
      );

    //Verify Level Bid
    this.buttonBidLevelling = this.page
      .locator(
        '//p[contains(text(), "Bid Book")]/ancestor::div[contains(@class, "mantine-Card-root")]//button[@class]'
      )
      .nth(6);
    this.columnHeadersOfBidLevelling = (label: string) =>
      this.page.locator(
        `(//p[contains (text(), "${label}")]/ancestor::div[@role="row"])[2]/descendant::div[@role="columnheader"]`
      );
    this.columnFooterOfBidLevelling = this.page.locator(
      `(//span[contains(text(), "Total")]/ancestor::div[@role="row"])/descendant::div[@role="gridcell"]`
    );

    //Award
    this.buttonAward = this.page.locator(
      '//div[contains (text(), "Award Bid")]/ancestor::button'
    );
    this.buttonConfirmAwarding = this.page.locator(
      '//h2[contains(text(), "Award Bid | ")]/ancestor::section[@role="dialog"]//button/descendant::span[contains(text(), "Award")]'
    );
    this.cellStatusAwarded = this.page.locator(
      '//div[@role="gridcell" and @col-id="status"]/descendant::p[contains(text(), "Awarded")]'
    );

    //Finalize
    this.buttonHideOverview = this.page.locator(
      '//span[contains(text(), "Finalize Contract")]/ancestor::div//p[normalize-space(text()) = "Overview"]'
    );
    this.buttonContract = this.page.locator(
      '//span[contains(text(), "Contracts")]/ancestor::button'
    );
    this.clickableButtonAddContract = this.page.getByRole("menuitem", {
      name: "Add Contract",
    });
    this.cellsScope = this.page.locator(
      '//span[contains(text(), "Finalize Contract")]/ancestor::div[contains(@class, "mantine-Stack-root")]//div[@col-id="scope" and @role="gridcell"]'
    );
    this.cellFilledScope = (label: string) =>
      this.page.locator(
        `//p[contains(text(), "${label}")]/ancestor::div[@role="gridcell" and @col-id="scope"]`
      );
    this.cellTotalCostFinalizeSection = this.page.locator(
      '//div[@col-id="total_cost" and @role="gridcell"]'
    );
    this.buttonFinalizeContract = this.page.locator(
      '//span[contains(text(), "Finalize Contract")]/ancestor::button'
    );
    this.buttonDialogFinalizeContract = this.page.locator(
      '//h2[contains(text(), "Finalize Contract")]/ancestor::section[@role="dialog"]//span[contains(text(), "Finalize Contract")]/ancestor::button'
    );

    //Bulk Update Status
    this.checkBox = this.page.locator(
      '//div[@data-ref="eCheckbox" and @role="presentation"]'
    );
    this.buttonBulkUpdateStatus = this.page.locator(
      '//span[contains(text(), "Bulk Update Status")]/ancestor::button'
    );
    this.optionInProgress = this.page.locator(
      '//div[contains(text(), "In Progress")]/ancestor::button'
    );
    this.buttonUpdateStatus = this.page.locator(
      '//h2[contains(text(), "Update Contract Status")]/ancestor::section[@role="dialog"]//span[contains(text(), "Update Status")]/ancestor::button'
    );
    this.cellStatus = (label: string) =>
      this.page.locator(
        `//p[contains(text(), "${label}")]/ancestor::div[@role="row"]//div[@role="gridcell" and @col-id="status"]`
      );
  }

  async bulkUpdateStatus() {
    await this.checkBox.nth(2).click();
    await this.buttonBulkUpdateStatus.click();
    await this.optionInProgress.click();
    await this.buttonUpdateStatus.click();
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

  async award() {
    const box = await this.vendorMenuAction.nth(1).boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.page.waitForTimeout(1000);
    await this.vendorMenuAction.nth(1).click({ trial: false });
    // await this.vendorMenuAction.nth(0).click();
    await this.buttonAward.click();
    await this.buttonConfirmAwarding.click();
  }

  async clickButtonLevellingBid() {
    await this.buttonBidLevelling.click();
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
    await this.cellTotalCost(bid1Name).dblclick();
    await this.inputTotalCost.fill(totalCostString1);
    await this.inputTotalCost.press("Enter");
    await expect(this.cellTotalCost(bid1Name)).toHaveText(
      "$" + formatNumberWithComma(totalCostString1),
      { timeout: 5000 }
    );

    await this.cellTotalCost(bid2Name).dblclick();
    await this.inputTotalCost.fill(totalCostString2);
    await this.inputTotalCost.press("Enter");
    await expect(this.cellTotalCost(bid2Name)).toHaveText(
      "$" + formatNumberWithComma(totalCostString2),
      { timeout: 5000 }
    );

    await this.crossButton.click();
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
    await this.searchInput.fill("Luxe Quality");
    await this.checkBoxVendor.check();
    await this.buttonInviteSelectedVendor.click();
    await this.notificationInvitedVendor.waitFor({ state: "visible" });
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

  async createJob(jobTitle: string) {
    await this.jobsTab.click();
    const box = await this.buttonCreateJob.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }
    await this.page.waitForTimeout(1000);
    await this.buttonCreateJob.click({ trial: false });
    // await this.buttonCreateJob.click();
    await this.inputTitleJob.fill(jobTitle);
    await this.inputJobType.fill("Capex");
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
    await this.buttonAddJob.click();

    // await this.hoveringButtonAddJob.hover();
    // await this.clickableButtonAddJob.click();
    // await this.cellTitleJob.dblclick();
    // await this.inputTitleJob.fill(jobTitle);
    // await this.cellJobType.scrollIntoViewIfNeeded();
    // await this.cellJobType.hover();
    // await this.cellJobType.dblclick();
    // await this.capexOptionJobType.click();
    // await this.buttonViewDetails.click();
    // await this.inputCreatedJobName.waitFor({ state: "visible" });
  }

  async createProject(projectName: string) {
    await this.buttonSideBarProjects.click();
    await this.entireProjectForm.waitFor({ state: "visible" });
    await this.buttonCreateProject.click();
    await this.inputProjectName.fill(projectName);
    await this.inputProjectProperty.fill(properties.properties.property1);
    await this.buttonFirstProjectProperty.click();
    await this.inputStartDate.fill(userData.date.startDate);
    await this.inputEndDate.fill(userData.date.endDate);
    await this.buttonAddProject.click();
    await this.projectOverviewForm.waitFor({ state: "visible" });
  }
}
