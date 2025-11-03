import { Locator, Page } from "@playwright/test";

export function formatNumberWithComma(str: string) {
  if (str.length === 5) {
    return str.slice(0, 2) + "," + str.slice(2);
  } else if (str.length === 4) {
    return str.slice(0, 1) + "," + str.slice(1);
  }
  return str;
}

export async function scrollByArrows(
  page: Page,
  locator: Locator,
  directionOfArrow: string,
  quantityOfArrowSteps: number
) {
  for (let i = 0; i < 50; i++) {
    for (let i = 0; i < 50; i++) {
      if (await locator.isVisible()) {
        break;
      }
      for (let j = 0; j < quantityOfArrowSteps; j++) {
        await page.keyboard.press("directionOfArrow");
      }
    }
  }
}
