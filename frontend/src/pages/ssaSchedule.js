// JS mirror of the backend US Social Security date logic (server.py).
// Pure & synchronous so pages render real dates and can be static-prerendered.

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const MONTH_NAMES = MONTHS;

const firstWeekdayOnOrAfter = (year, month, day, weekday) => {
  const d = new Date(year, month, day);
  while (d.getDay() !== weekday) d.setDate(d.getDate() + 1);
  return d;
};

export function getFederalHolidays(year) {
  const set = new Set();
  const add = (d) => set.add(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime());

  add(new Date(year, 0, 1)); // New Year's Day
  // MLK — 3rd Monday Jan
  { const d = firstWeekdayOnOrAfter(year, 0, 1, 1); d.setDate(d.getDate() + 14); add(d); }
  // Presidents' Day — 3rd Monday Feb
  { const d = firstWeekdayOnOrAfter(year, 1, 1, 1); d.setDate(d.getDate() + 14); add(d); }
  // Memorial Day — last Monday May
  { const d = new Date(year, 4, 31); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); add(d); }
  add(new Date(year, 5, 19)); // Juneteenth
  add(new Date(year, 6, 4)); // Independence Day
  // Labor Day — 1st Monday Sep
  { const d = firstWeekdayOnOrAfter(year, 8, 1, 1); add(d); }
  // Columbus Day — 2nd Monday Oct
  { const d = firstWeekdayOnOrAfter(year, 9, 1, 1); d.setDate(d.getDate() + 7); add(d); }
  add(new Date(year, 10, 11)); // Veterans Day
  // Thanksgiving — 4th Thursday Nov
  { const d = firstWeekdayOnOrAfter(year, 10, 1, 4); d.setDate(d.getDate() + 21); add(d); }
  add(new Date(year, 11, 25)); // Christmas
  return set;
}

const holidaysForContext = (year) => {
  const merged = new Set();
  [year - 1, year, year + 1].forEach((y) => getFederalHolidays(y).forEach((t) => merged.add(t)));
  return merged;
};

const isBusinessDay = (d, holidays) => {
  const wd = d.getDay();
  if (wd === 0 || wd === 6) return false;
  if (holidays.has(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime())) return false;
  return true;
};

const adjustBackward = (d, holidays) => {
  const curr = new Date(d);
  while (!isBusinessDay(curr, holidays)) curr.setDate(curr.getDate() - 1);
  return curr;
};

// n-th Wednesday (weekday 3 in JS) of a month (month is 0-indexed)
const nthWednesday = (year, month, n) => {
  const d = new Date(year, month, 1);
  while (d.getDay() !== 3) d.setDate(d.getDate() + 1);
  d.setDate(d.getDate() + (n - 1) * 7);
  return d;
};

const fmt = (d) => `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

// Payment dates for one month (month 0-indexed). Returns adjusted dates for each stream.
export function getMonthPayments(year, month) {
  const holidays = holidaysForContext(year);
  const ssi = adjustBackward(new Date(year, month, 1), holidays);
  const pre1997 = adjustBackward(new Date(year, month, 3), holidays);
  const w2 = adjustBackward(nthWednesday(year, month, 2), holidays);
  const w3 = adjustBackward(nthWednesday(year, month, 3), holidays);
  const w4 = adjustBackward(nthWednesday(year, month, 4), holidays);
  return {
    monthName: MONTHS[month],
    year,
    ssi: fmt(ssi),
    pre1997: fmt(pre1997),
    birth_1_10: fmt(w2),
    birth_11_20: fmt(w3),
    birth_21_31: fmt(w4),
  };
}

export function getYearSchedule(year) {
  return Array.from({ length: 12 }, (_, m) => getMonthPayments(year, m));
}

export function getFederalHolidayList(year) {
  const defs = [
    ["New Year's Day", new Date(year, 0, 1)],
    ["Martin Luther King Jr. Day", (() => { const d = firstWeekdayOnOrAfter(year, 0, 1, 1); d.setDate(d.getDate() + 14); return d; })()],
    ["Presidents' Day", (() => { const d = firstWeekdayOnOrAfter(year, 1, 1, 1); d.setDate(d.getDate() + 14); return d; })()],
    ["Memorial Day", (() => { const d = new Date(year, 4, 31); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return d; })()],
    ["Juneteenth", new Date(year, 5, 19)],
    ["Independence Day", new Date(year, 6, 4)],
    ["Labor Day", firstWeekdayOnOrAfter(year, 8, 1, 1)],
    ["Columbus Day", (() => { const d = firstWeekdayOnOrAfter(year, 9, 1, 1); d.setDate(d.getDate() + 7); return d; })()],
    ["Veterans Day", new Date(year, 10, 11)],
    ["Thanksgiving Day", (() => { const d = firstWeekdayOnOrAfter(year, 10, 1, 4); d.setDate(d.getDate() + 21); return d; })()],
    ["Christmas Day", new Date(year, 11, 25)],
  ];
  return defs.map(([name, d]) => ({ name, date: fmt(d) }));
}

export const monthSlugToIndex = (slug) => MONTHS.findIndex((m) => m.toLowerCase() === slug.toLowerCase());
