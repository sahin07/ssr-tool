// Country payment-date data. Sources cited per entry for review.
// Schedules reflect officially published 2026 dates at time of writing (June 2026).

const CA_2026 = [
  ["January", "January 28, 2026"],
  ["February", "February 25, 2026"],
  ["March", "March 27, 2026"],
  ["April", "April 28, 2026"],
  ["May", "May 27, 2026"],
  ["June", "June 26, 2026"],
  ["July", "July 29, 2026"],
  ["August", "August 27, 2026"],
  ["September", "September 25, 2026"],
  ["October", "October 28, 2026"],
  ["November", "November 26, 2026"],
  ["December", "December 22, 2026"],
];

const SASSA_2026 = [
  ["April 2026", "2 April", "7 April", "8 April"],
  ["May 2026", "5 May", "6 May", "7 May"],
  ["June 2026", "2 June", "3 June", "4 June"],
  ["July 2026", "2 July", "3 July", "6 July"],
  ["August 2026", "4 August", "5 August", "6 August"],
  ["September 2026", "2 September", "3 September", "4 September"],
  ["October 2026", "2 October", "5 October", "6 October"],
  ["November 2026", "3 November", "4 November", "5 November"],
  ["December 2026", "2 December", "3 December", "4 December"],
];

export const COUNTRY_DATA = {
  "canada-cpp": {
    flag: "🇨🇦",
    country: "Canada",
    title: "Canada CPP Payment Dates 2026 | CheckPayDate.com",
    heading: "Canada CPP Payment Dates 2026",
    canonical: "https://checkpaydate.com/canada/cpp-payment-dates/",
    intro:
      "Canada Pension Plan (CPP) retirement, disability, and survivor benefits are paid once a month by Service Canada. CPP and Old Age Security (OAS) share the same payment dates each month.",
    scheduleTitle: "CPP Payment Dates — 2026",
    scheduleColumns: ["Month", "Payment Date"],
    scheduleRows: CA_2026,
    howItWorks: [
      "CPP is paid monthly, usually on the third-to-last business day of the month.",
      "With direct deposit, funds are generally available on the payment date; paper cheques can take a few extra days.",
      "If a payment date falls on a weekend or federal holiday, the payment is issued on the preceding business day.",
      "CPP and OAS are deposited on the same date each month.",
    ],
    official: {
      name: "Service Canada — Benefits payment dates",
      url: "https://www.canada.ca/en/services/benefits/calendar.html",
      phone: "1-800-277-9914",
    },
    sources: [
      { label: "Canada.ca — Benefits payment dates", url: "https://www.canada.ca/en/services/benefits/calendar.html" },
      { label: "Canada.ca — CPP payment amounts", url: "https://www.canada.ca/en/services/benefits/publicpensions/cpp/payment-amounts.html" },
    ],
    related: { to: "/canada/oas-payment-dates/", label: "See Canada OAS Payment Dates 2026" },
  },

  "canada-oas": {
    flag: "🇨🇦",
    country: "Canada",
    title: "Canada OAS Payment Dates 2026 | CheckPayDate.com",
    heading: "Canada OAS Payment Dates 2026",
    canonical: "https://checkpaydate.com/canada/oas-payment-dates/",
    intro:
      "Old Age Security (OAS), including the Guaranteed Income Supplement (GIS), is paid once a month by Service Canada. OAS is deposited on the same date as Canada Pension Plan (CPP) benefits.",
    scheduleTitle: "OAS Payment Dates — 2026",
    scheduleColumns: ["Month", "Payment Date"],
    scheduleRows: CA_2026,
    howItWorks: [
      "OAS is paid monthly, usually on the third-to-last business day of the month.",
      "With direct deposit, funds are generally available on the payment date.",
      "If a payment date falls on a weekend or federal holiday, the payment is issued on the preceding business day.",
      "OAS and CPP are deposited on the same date each month.",
    ],
    official: {
      name: "Service Canada — Benefits payment dates",
      url: "https://www.canada.ca/en/services/benefits/calendar.html",
      phone: "1-800-277-9914",
    },
    sources: [
      { label: "Canada.ca — Benefits payment dates", url: "https://www.canada.ca/en/services/benefits/calendar.html" },
    ],
    related: { to: "/canada/cpp-payment-dates/", label: "See Canada CPP Payment Dates 2026" },
  },

  "uk-state-pension": {
    flag: "🇬🇧",
    country: "United Kingdom",
    title: "UK State Pension Payment Dates 2026 | CheckPayDate.com",
    heading: "UK State Pension Payment Dates 2026",
    canonical: "https://checkpaydate.com/uk/state-pension-payment-dates/",
    intro:
      "The UK State Pension is paid every 4 weeks in arrears. Your payment day of the week is set by the last two digits of your National Insurance (NI) number — not by a fixed date of the month.",
    interactive: "uk",
    scheduleTitle: "Payment Day by National Insurance Number",
    scheduleColumns: ["Last 2 digits of NI number", "Payment day"],
    scheduleRows: [
      ["00 to 19", "Monday"],
      ["20 to 39", "Tuesday"],
      ["40 to 59", "Wednesday"],
      ["60 to 79", "Thursday"],
      ["80 to 99", "Friday"],
    ],
    howItWorks: [
      "Paid every 4 weeks in arrears — 13 payments per year, always on the same weekday.",
      "If your payment day is a UK bank holiday, you are usually paid earlier, on the previous working day.",
      "New claimants receive their first full payment within 5 weeks of their chosen start date.",
    ],
    amounts: [
      { label: "Full new State Pension (2026/27)", value: "£241.30 per week" },
      { label: "Qualifying years for full amount", value: "35 years of NI contributions" },
      { label: "Minimum for any new State Pension", value: "10 qualifying years" },
    ],
    official: {
      name: "GOV.UK — State Pension: when you're paid",
      url: "https://www.gov.uk/state-pension/when-youre-paid",
      phone: "0800 731 0469 (Pension Service)",
    },
    sources: [
      { label: "GOV.UK — State Pension: when you're paid", url: "https://www.gov.uk/state-pension/when-youre-paid" },
      { label: "nidirect — Understanding the new State Pension", url: "https://www.nidirect.gov.uk/articles/understanding-and-qualifying-new-state-pension" },
    ],
  },

  "australia-centrelink": {
    flag: "🇦🇺",
    country: "Australia",
    title: "Australia Centrelink Age Pension Payment Dates 2026 | CheckPayDate.com",
    heading: "Australia Centrelink Payment Dates 2026",
    canonical: "https://checkpaydate.com/australia/centrelink-payment-dates/",
    intro:
      "Centrelink Age Pension and most other Centrelink payments are made fortnightly (every 14 days). Each recipient has their own entitlement and reporting cycle, so exact payment dates are personalised — the most reliable place to see yours is your myGov-linked Centrelink account.",
    howItWorks: [
      "Age Pension is paid fortnightly (every 14 days) on a date assigned to you by Services Australia.",
      "You can view your next 12 weeks of payment and reporting dates in myGov or the Express Plus Centrelink app.",
      "Banks may deposit funds 1–2 days before the official payday.",
      "If you live outside Australia permanently, payments are usually made every 4 weeks instead of fortnightly.",
      "Public holidays can shift payment/reporting dates — Services Australia may pay early in those cases.",
      "Age Pension rates are indexed in March and September each year (next update 20 September 2026).",
    ],
    official: {
      name: "Services Australia — Centrelink",
      url: "https://www.servicesaustralia.gov.au/",
      phone: "132 300 (Older Australians line)",
    },
    sources: [
      { label: "Services Australia — When to report your income", url: "https://www.servicesaustralia.gov.au/when-to-report-your-income-to-centrelink?context=22526" },
      { label: "Services Australia — Public holiday reporting and payment dates", url: "https://www.servicesaustralia.gov.au/public-holiday-reporting-and-payment-dates?context=64107" },
    ],
  },

  "southafrica-sassa": {
    flag: "🇿🇦",
    country: "South Africa",
    title: "South Africa SASSA Payment Dates 2026 | CheckPayDate.com",
    heading: "South Africa SASSA Payment Dates 2026",
    canonical: "https://checkpaydate.com/south-africa/sassa-payment-dates/",
    intro:
      "The South African Social Security Agency (SASSA) pays social grants early each month, staggered over three days by grant type to reduce congestion. Once paid, money stays in your account — there is no need to withdraw it all on payday.",
    scheduleTitle: "SASSA Grant Payment Dates — 2026/27",
    scheduleColumns: ["Month", "Older Persons", "Disability", "Child Support"],
    scheduleRows: SASSA_2026,
    howItWorks: [
      "Older Persons grant is generally paid on the 2nd of the month.",
      "Disability grant is generally paid on the 3rd of the month.",
      "Child Support grant is generally paid on the 4th of the month.",
      "Dates shift if they fall on a Monday, the 1st of the month, or a public holiday.",
      "The SRD (Social Relief of Distress) grant is paid later in the month, typically between the 24th and 30th.",
    ],
    amounts: [
      { label: "Older Persons Grant (60–74)", value: "R2,400" },
      { label: "Older Persons Grant (75+)", value: "R2,420" },
      { label: "Disability Grant", value: "R2,400" },
      { label: "Child Support Grant", value: "R580 per child" },
    ],
    official: {
      name: "SASSA",
      url: "https://www.sassa.gov.za/",
      phone: "0800 60 10 11 (toll-free)",
    },
    sources: [
      { label: "SAnews.gov.za — 2026/27 social grant payment dates", url: "https://www.sanews.gov.za/south-africa/sassa-announces-202627-social-grant-payment-dates" },
      { label: "Department of Social Development — 2026/27 schedule", url: "https://www.dsd.gov.za/index.php/latest-news/21-latest-news/680-sassa-confirms-2026-2027-social-grant-payment-schedule-and-increases" },
    ],
  },
};
