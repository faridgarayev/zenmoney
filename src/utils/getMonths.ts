const AZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "İyun",
  "İyul",
  "Avqust",
  "Sentyabr",
  "Oktyabr",
  "Noyabr",
  "Dekabr",
];

export function getCurrentMonthName(): string {
  return AZ_MONTHS[new Date().getMonth()];
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getCurrentMonthLabel(): string {
  return `${getCurrentMonthName()} ${getCurrentYear()}`;
}

export function getMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getExpenseMonthKey(dateStr: string): string {
  // dateStr format: "DD.MM.YYYY" or "YYYY-MM-DD"
  if (dateStr.includes(".")) {
    const parts = dateStr.split(".");
    return `${parts[2]}-${parts[1]}`;
  }
  const parts = dateStr.split("-");
  return `${parts[0]}-${parts[1]}`;
}

export { AZ_MONTHS };
