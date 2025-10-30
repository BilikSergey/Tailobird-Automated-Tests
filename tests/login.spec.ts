import { test, expect } from "@playwright/test";
import { LoginUser } from "../pages/loginPage";
import { MainPage } from "../pages/mainPage";
import { VendorPage } from "../pages/vendorPage";
import { faker } from "@faker-js/faker";
import userData from "../data/userData.json";
import properties from "../data/properties.json";
import { formatNumberWithComma } from "../utils/formatters";
import { chromium } from "playwright";

test.describe("First flow", () => {
  let login: LoginUser;
  let mainPage: MainPage;
  let vendorPage: VendorPage;

  test("Create a project", async () => {
    //log in
    const browser = await chromium.launch({ headless: false });
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    login = new LoginUser(page1);
    mainPage = new MainPage(page1);

    await login.toNavigate();
    await login.login(
      userData.existingUser.email,
      userData.existingUser.password
    );

    //verify whether page displays
    const items = [
      "Properties",
      "Tasks",
      "Packages",
      "Category",
      "Budget",
      "CapEx",
    ];
    for (const item of items) {
      await login.navLabel(item).first().waitFor({ state: "visible" });
    }

    //create a project
    const projectName = faker.commerce.productName();
    await mainPage.createProject(projectName);
    await expect(mainPage.createdProjectName(projectName)).toBeVisible();
    await expect(
      mainPage.createdProjectDateDuration(
        userData.dateHumanReadableFormat.duration
      )
    ).toBeVisible();
    await expect(
      mainPage.createdProjectProperty(properties.properties.property1)
    ).toBeVisible();

    //create a job
    const jobTitle = faker.commerce.product();
    await mainPage.createJob(jobTitle);
    await expect(mainPage.inputCreatedJobName).toHaveValue(jobTitle);

    //create a bid
    const bid1Name = faker.commerce.productName();
    const bid2Name = faker.commerce.productName();
    await mainPage.createBid(bid1Name, bid2Name);

    //invite vendors
    const organizationName = faker.company.name();
    await mainPage.inviteVendors(organizationName);
    await mainPage
      .cellCreatedVendorOrganizationName(userData.existingUser.organization)
      .waitFor({ state: "visible" });
    await mainPage
      .cellCreatedVendorOrganizationName(organizationName)
      .waitFor({ state: "visible" });

    //Edit Bid On Behalf of Vendor
    let totalCostNumber1 = faker.number.int({ min: 10000, max: 12000 });
    let totalCostString1 = totalCostNumber1.toString();
    let totalCostNumber2 = faker.number.int({ min: 1000, max: 9000 });
    let totalCostString2 = totalCostNumber2.toString();
    const sumOfTotalCostString1 = (
      totalCostNumber1 + totalCostNumber2
    ).toString();
    await mainPage.editOnBehalfOfVendor(
      bid1Name,
      bid2Name,
      totalCostString1,
      totalCostString2
    );

    //Verification of Edition of Bids
    await mainPage.cellEditedBidAmount.nth(1).scrollIntoViewIfNeeded();
    await expect(mainPage.cellEditedBidAmount.nth(1)).toHaveText(
      "$" + formatNumberWithComma(sumOfTotalCostString1)
    );

    //Vendor Account Log in
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    login = new LoginUser(page2);
    vendorPage = new VendorPage(page2);
    await login.toNavigate();
    await login.login(userData.vendorUser.email, userData.vendorUser.password);

    //Edit Bid
    totalCostNumber1 = faker.number.int({ min: 10000, max: 12000 });
    totalCostString1 = totalCostNumber1.toString();
    totalCostNumber2 = faker.number.int({ min: 1000, max: 9000 });
    totalCostString2 = totalCostNumber2.toString();
    const sumOfTotalCostString2 = (
      totalCostNumber1 + totalCostNumber2
    ).toString();
    await vendorPage.addTotalCost(
      projectName,
      bid1Name,
      bid2Name,
      totalCostString1,
      totalCostString2
    );
    await page2.close();

    //Verification of Edition
    await page1.reload({ waitUntil: "networkidle" });
    await expect(
      mainPage.cellEditedAppliedBidAmount(
        formatNumberWithComma(sumOfTotalCostString2)
      )
    ).toBeVisible();

    //Level Bids
    await mainPage.clickButtonLevellingBid();
    await mainPage
      .columnHeadersOfBidLevelling(userData.existingUser.organization)
      .nth(4)
      .scrollIntoViewIfNeeded();
    await expect(
      mainPage
        .columnHeadersOfBidLevelling(userData.existingUser.organization)
        .nth(4)
    ).toHaveText(userData.existingUser.organization);
    await mainPage.columnFooterOfBidLevelling.nth(4).scrollIntoViewIfNeeded();
    await expect(mainPage.columnFooterOfBidLevelling.nth(4)).toHaveText(
      "$" + formatNumberWithComma(sumOfTotalCostString2)
    );
    await expect(
      mainPage.columnHeadersOfBidLevelling(organizationName).nth(5)
    ).toHaveText(organizationName);
    await expect(mainPage.columnFooterOfBidLevelling.nth(5)).toHaveText(
      "$" + formatNumberWithComma(sumOfTotalCostString1)
    );

    //Award
    await mainPage.award();
    await expect(mainPage.cellStatusAwarded).toBeVisible();

    //Finalize
  });
});
