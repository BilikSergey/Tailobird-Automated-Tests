import { Locator, Page } from "@playwright/test";

export function formatNumberWithComma(str: string) {
  if (str.length === 5) {
    return str.slice(0, 2) + "," + str.slice(2);
  } else if (str.length === 4) {
    return str.slice(0, 1) + "," + str.slice(1);
  }
  return str;
}
export function formatDateRange(startDate: string, endDate: string): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  const start = new Date(startDate);
  const end = new Date(endDate);

  const formattedStart = start.toLocaleDateString("en-US", options);
  const formattedEnd = end.toLocaleDateString("en-US", options);

  return `${formattedStart} -> ${formattedEnd}`;
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
