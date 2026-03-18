const BR_NATIONAL_HOLIDAYS_2025 = [
  '2025-01-01', '2025-03-03', '2025-03-04', '2025-04-18', '2025-04-21',
  '2025-05-01', '2025-06-19', '2025-09-07', '2025-10-12', '2025-11-02',
  '2025-11-15', '2025-11-20', '2025-12-25',
];

const BR_NATIONAL_HOLIDAYS_2026 = [
  '2026-01-01', '2026-02-16', '2026-02-17', '2026-04-03', '2026-04-21',
  '2026-05-01', '2026-06-04', '2026-09-07', '2026-10-12', '2026-11-02',
  '2026-11-15', '2026-11-20', '2026-12-25',
];

/**
 * Adds the specified number of business days to the start date,
 * excluding weekends and Brazilian national holidays for 2025/2026.
 */
export function addBusinessDays(startDate: Date, days: number): Date {
  const holidays = [...BR_NATIONAL_HOLIDAYS_2025, ...BR_NATIONAL_HOLIDAYS_2026];
  let current = new Date(startDate);
  let added = 0;
  while (added < days) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    const dateStr = current.toISOString().split('T')[0];
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(dateStr)) {
      added++;
    }
  }
  return current;
}

/**
 * Returns true if the given date is a business day (not a weekend,
 * and not a Brazilian national holiday for 2025/2026).
 */
export function isBusinessDay(date: Date): boolean {
  const holidays = [...BR_NATIONAL_HOLIDAYS_2025, ...BR_NATIONAL_HOLIDAYS_2026];
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().split('T')[0];
  return dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(dateStr);
}
