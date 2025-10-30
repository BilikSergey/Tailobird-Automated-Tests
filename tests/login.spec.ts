import { test, expect } from "@playwright/test";
import { LoginUser } from "../pages/loginPage";
import { MainPage } from "../pages/mainPage";
import { faker } from "@faker-js/faker";
import userData from "../data/userData.json";
import properties from "../data/properties.json";
import { formatNumberWithComma } from '../utils/formatters';

test.describe("First flow", () => {
  let login: LoginUser;
  let mainPage: MainPage;

  test("Create a project", async ({page}) => {
    login = new LoginUser(page);
    mainPage = new MainPage(page);

    await login.toNavigate();
    await login.login();

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
    const totalCostNumber1 = faker.number.int({ min: 1000, max: 12000 });
    const totalCostString1 = totalCostNumber1.toString();
    const totalCostNumber2 = faker.number.int({ min: 1000, max: 12000 });
    const totalCostString2 = totalCostNumber2.toString();
    const sumOfTotalCostString= (totalCostNumber1 + totalCostNumber2).toString();
    await mainPage.editOnBehalfOfVendor(
      bid1Name,
      bid2Name,
      totalCostString1,
      totalCostString2
    );

    //Verification of Edition of Bids
    await mainPage.cellEditedBidAmount.nth(1).scrollIntoViewIfNeeded();
    await expect(mainPage.cellEditedBidAmount.nth(1)).toHaveText(
      "$" + formatNumberWithComma(sumOfTotalCostString) 
    );
  });
});
