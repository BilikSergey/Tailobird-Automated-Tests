export function formatNumberWithComma(str: string) {
  if (str.length === 5) {
    return str.slice(0, 2) + "," + str.slice(2);
  } else if (str.length === 4) {
    return str.slice(0, 1) + "," + str.slice(1);
  }
  return str;
}
