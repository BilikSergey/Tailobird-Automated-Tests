import { test, expect } from "@playwright/test";
import { LoginUser } from "../pages/loginPage";
import { MainPage } from "../pages/mainPage";
import { VendorPage } from "../pages/vendorPage";
import { BudgetPage } from "../pages/budgetPage";
import { CapExPage } from "../pages/capExPage";
import { faker } from "@faker-js/faker";
import userData from "../data/userData.json";
import properties from "../data/properties.json";
import { formatNumberWithComma } from "../utils/formatters";
import { formatDateRange } from "../utils/formatters";
import { scrollByArrows } from "../utils/formatters";
import { expectToBeScrollable } from "../utils/formatters";

test.describe.serial("Tailobird-Automated-Tests", () => {
  let login: LoginUser;
  let mainPage: MainPage;
  let vendorPage: VendorPage;
  let budgetPage: BudgetPage;
  let capExPage: CapExPage;
  const startProjectDate = faker.date.future().toISOString().split("T")[0];
  const endProjectDate = faker.date.future().toISOString().split("T")[0];
  const bid1Name = faker.commerce.productName();
  const bid2Name = faker.commerce.productName();
  const bid3Name = faker.commerce.productName();
  const firstNumberBidPrice = faker.number.int({ min: 10000, max: 12000 });
  const secondNumberBidPrice = faker.number.int({ min: 10000, max: 12000 });
  const thirdNumberBidPrice = faker.number.int({ min: 10000, max: 12000 });
  const firstStringBidPrice = firstNumberBidPrice.toString();
  const secondStringBidPrice = secondNumberBidPrice.toString();
  const thirdStringBidPrice = thirdNumberBidPrice.toString();
  const projectName = faker.commerce.productName() + firstStringBidPrice;
  const jobTitle = faker.commerce.product() + secondNumberBidPrice;
  const totalNumberPrice =
    firstNumberBidPrice + secondNumberBidPrice + thirdNumberBidPrice;
  const totalPrice = totalNumberPrice.toString();

  test("First Flow", async ({ browser }) => {
    //log in
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
    const items = ["Properties", "Category", "Budget", "CapEx"];
    for (const item of items) {
      await login.navLabel(item).first().waitFor({ state: "visible" });
    }
    //create a project
    await mainPage.createProject(projectName, startProjectDate, endProjectDate);
    await expect(mainPage.createdProjectName(projectName)).toBeVisible();
    await expect(
      mainPage.createdProjectDateDuration(
        formatDateRange(startProjectDate, endProjectDate)
      )
    ).toBeVisible();
    await expect(
      mainPage.createdProjectProperty(properties.properties.property1)
    ).toBeVisible();
    //create a job
    await mainPage.createJob(jobTitle);
    await expect(mainPage.inputCreatedJobName(jobTitle)).toBeVisible();
    //create a bid
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
    const totalCostNumber1 = faker.number.int({ min: 10000, max: 12000 });
    const totalCostString1 = totalCostNumber1.toString();
    const totalCostNumber2 = faker.number.int({ min: 1000, max: 9000 });
    const totalCostString2 = totalCostNumber2.toString();
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
    await expect(mainPage.hoveringButtonAddBid).toBeVisible();
    await expectToBeScrollable(
      mainPage.cellEditedBidAmount.nth(1),
      sumOfTotalCostString1,
      true
    );
    //Vendor Account Log in
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    login = new LoginUser(page2);
    vendorPage = new VendorPage(page2);
    await login.toNavigate();
    await login.login(userData.vendorUser.email, userData.vendorUser.password);
    //Edit Bid
    const sumOfTotalCostString2 = (
      firstNumberBidPrice + secondNumberBidPrice
    ).toString();
    await vendorPage.addTotalCost(
      projectName,
      bid1Name,
      bid2Name,
      firstStringBidPrice,
      secondStringBidPrice
    );
    const session1 = await page1.context().newCDPSession(page1);
    await session1.send("Page.bringToFront");
    //Verification of Edition
    await page1.reload({ waitUntil: "networkidle" });
    await expect(mainPage.hoveringButtonAddBid).toBeVisible();
    await expectToBeScrollable(
      mainPage
        .cellEditedAppliedBidAmount(
          formatNumberWithComma(sumOfTotalCostString2)
        )
        .first(),
      sumOfTotalCostString2,
      true
    );
    //Level Bids
    await mainPage.clickButtonLevellingBid();
    await expectToBeScrollable(
      mainPage
        .columnHeadersOfBidLevelling(userData.existingUser.organization)
        .nth(4),
      userData.existingUser.organization,
      false
    );
    await expectToBeScrollable(
      mainPage.columnFooterOfBidLevelling.nth(4),
      sumOfTotalCostString2,
      true
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
    await mainPage.finalize(bid3Name, thirdStringBidPrice);
    //Bulk Update Status
    await mainPage.bulkUpdateStatus();
    await expect(mainPage.cellStatus(bid1Name)).toContainText("In Progress");
    //Verify if Contract is Awarded on Vednor's Side
    const session2 = await page2.context().newCDPSession(page2);
    await session2.send("Page.bringToFront");
    await page2.reload({ waitUntil: "networkidle" });
    await expect(vendorPage.formContractAwarded).toBeVisible();
  });

  test("Second Flow", async ({ page }) => {
    //log in
    login = new LoginUser(page);
    budgetPage = new BudgetPage(page);
    capExPage = new CapExPage(page);

    await login.toNavigate();
    await login.login(
      userData.existingUser.email,
      userData.existingUser.password
    );
    //verify whether page displays
    const items = ["Properties", "Category", "Budget", "CapEx"];
    for (const item of items) {
      await login.navLabel(item).first().waitFor({ state: "visible" });
    }
    //Budget
    const originalBudgetNumber = faker.number.int({ min: 120000, max: 150000 });
    const originalBudget = originalBudgetNumber.toString();
    await budgetPage.budget(
      properties.categoryBudget.securitySystem,
      originalBudget
    );
    //budget verification
    await expect((budgetPage.cellRevisedBudget).last()).toHaveText(
      "$" + formatNumberWithComma(originalBudget)
    );
    await expect(budgetPage.cellOriginalBudget.last()).toHaveText(
      "$" + formatNumberWithComma(originalBudget)
    );
    //Allocation
    await budgetPage.allocation(
      projectName,
      properties.categoryBudget.securitySystem,
      totalPrice
    );
    //allocation verification
    const remainingBudget = (
      originalBudgetNumber - totalNumberPrice
    ).toString();
    await expect(
      budgetPage.finalBudget(properties.categoryBudget.securitySystem)
    ).toHaveText("$" + formatNumberWithComma(originalBudget));
    await expect(
      budgetPage.usedFinalBudget(properties.categoryBudget.securitySystem)
    ).toHaveText("$" + formatNumberWithComma(totalPrice));
    await expect(
      budgetPage.remainingFinalBudget(properties.categoryBudget.securitySystem)
    ).toHaveText("$" + formatNumberWithComma(remainingBudget));
    //CapEx Verification
    //Project row
    await capExPage.capEx(projectName);
    const projectRowIndex = await capExPage
      .rowWithProjectName(projectName)
      .getAttribute("row-index");
    await expect(
      capExPage.cellRevisedBudgetProject(projectRowIndex!).first()
    ).toBeVisible();
    await expectToBeScrollable(
      capExPage.cellRevisedBudgetProject(projectRowIndex!).first(),
      totalPrice,
      true
    );
    await expectToBeScrollable(
      capExPage.cellBudgetRemainingProject(projectRowIndex!),
      totalPrice,
      true
    );
    await expectToBeScrollable(
      capExPage.cellOriginalContractProject(projectRowIndex!),
      totalPrice,
      true
    );
    await expectToBeScrollable(
      capExPage.cellCurrentContractProject(projectRowIndex!),
      totalPrice,
      true
    );
    await expectToBeScrollable(
      capExPage.cellRemainingContractProject(projectRowIndex!),
      totalPrice,
      true
    );
    //Job row
    await expectToBeScrollable(
      capExPage.cellJobCategory(projectName),
      jobTitle,
      false
    );
    const jobRowIndex = await capExPage
      .cellJobCategory(projectName)
      .getAttribute("row-index");
    await scrollByArrows(
      page,
      () => capExPage.cellRevisedBudgetProject(jobRowIndex!),
      "ArrowRight",
      1
    );
    await expect(
      capExPage.cellRevisedBudgetProject(jobRowIndex!)
    ).toContainText("$" + formatNumberWithComma(totalPrice));
    await expectToBeScrollable(
      capExPage.cellBudgetRemainingProject(jobRowIndex!),
      totalPrice,
      true
    );
    await expectToBeScrollable(
      capExPage.cellOriginalContractProject(jobRowIndex!),
      totalPrice,
      true
    );
    await expectToBeScrollable(
      capExPage.cellCurrentContractProject(jobRowIndex!),
      totalPrice,
      true
    );
    await expectToBeScrollable(
      capExPage.cellRemainingContractProject(jobRowIndex!),
      totalPrice,
      true
    );
    //scope 1 row
    const bidArray = ["", bid1Name, bid2Name, bid3Name];
    const priceArray = [
      "",
      firstStringBidPrice,
      secondStringBidPrice,
      thirdStringBidPrice,
    ];
    for (let i = 1; i <= 3; i++) {
      let scopeIndex = await capExPage
        .rowScope(bidArray[i])
        .getAttribute("row-index");
      await scrollByArrows(
        page,
        () => capExPage.cellRemainingContractProject(scopeIndex!),
        "ArrowRight",
        1
      );
      await expectToBeScrollable(
        capExPage.cellBudgetRemainingProject(scopeIndex!),
        priceArray[i],
        true
      );
    }
    //delete option budget
    await budgetPage.deleteBudget(projectName);
  });
});
