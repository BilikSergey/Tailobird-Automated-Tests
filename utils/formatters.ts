import { Locator, Page, expect } from "@playwright/test";

export function formatNumberWithComma(value: string | number): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  return num.toLocaleString("en-US");
}

export function formatDateRange(startDate: string, endDate: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  };
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  const formattedStart = start.toLocaleDateString("en-US", options);
  const formattedEnd = end.toLocaleDateString("en-US", options);
  return `${formattedStart} -> ${formattedEnd}`;
}
export async function expectToBeScrollable(
  locator: Locator,
  price: string,
  convert: boolean
) {
  let formatted = price;
  if (convert) {
    formatted = "$" + formatNumberWithComma(price);
  }
  await expect(async () => {
    await locator.scrollIntoViewIfNeeded();
    const text = await locator.innerText();
    if (!text.includes(formatted)) {
      throw new Error(
        `Expected locator to contain "${formatted}", but got "${text}"`
      );
    }
  }).toPass({ timeout: 5000 });
}

export async function scrollByArrows(
  page: Page,
  locator: () => Locator,
  directionOfArrow: string,
  quantityOfArrowSteps: number
) {
  const element = locator();
  for (let i = 0; i < 1000; i++) {
    if (await element.isVisible()) {
      break;
    }
    for (let j = 0; j <= quantityOfArrowSteps; j++) {
      await page.keyboard.press(directionOfArrow);
    }
  }
}
