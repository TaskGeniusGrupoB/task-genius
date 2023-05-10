export function getDatesInMonth(year: number, month: number) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const dates = [];

  for (
    let date = startDate;
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    dates.push(date.toLocaleDateString("pt-BR"));
  }

  return dates;
}

export function getDayFromDate(date: string) {
  const [day] = date.split("/");

  return day;
}

export function formatMonthYear(month: number, year: number): string {
  const date = new Date(year, month - 1);

  const monthName = date.toLocaleDateString("pt-BR", {
    month: "long",
  });

  return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}, ${year}`;
}

export function getNextMonthYear(month: number, year: number): number[] {
  if (month === 11) {
    return [0, year + 1];
  } else {
    return [month + 1, year];
  }
}

export function getPreviousMonthYear(month: number, year: number): number[] {
  if (month === 0) {
    return [11, year - 1];
  } else {
    return [month - 1, year];
  }
}
