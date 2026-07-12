// Standalone policy pages (EEAT / trust). Rendered by PolicyPage.jsx.
// Each section: { h: heading, p: [paragraphs], ul: [bullet strings] }

const contactLine = "Questions? Email contact@checkpaydate.com.";

export const POLICY_DATA = {
  "editorial-policy": {
    heading: "Editorial Policy",
    title: "Editorial Policy | CheckPayDate.com",
    description: "How CheckPayDate.com researches, writes, reviews and maintains its payment-date content, and how we stay independent.",
    canonical: "https://checkpaydate.com/editorial-policy",
    lastUpdated: "July 2026",
    sections: [
      { h: "Our goal", p: ["CheckPayDate.com exists to make official government payment schedules easy to find and understand. Every page is written in plain English for a general audience, with a focus on clarity and accuracy over marketing."] },
      { h: "Who writes and reviews content", p: ["Content is created and maintained by the CheckPayDate Editorial Team. Each schedule and rule is checked against a primary official source before publication, and every page shows a \"Last updated\" and review line."] },
      { h: "Sourcing standards", ul: ["We use primary, official government sources only (e.g. SSA, Service Canada, GOV.UK, Services Australia, SASSA).", "Calculated dates follow each program's published rules; see our Methodology page.", "Where dates are personalised (not a fixed public schedule), we say so instead of inventing a date."] },
      { h: "Independence", p: ["We are not affiliated with any government agency. Editorial decisions are made independently. If we ever introduce advertising or sponsorships, they will never influence the accuracy of our schedules.", contactLine] },
    ],
  },

  "accuracy-policy": {
    heading: "Accuracy Policy",
    title: "Accuracy Policy | CheckPayDate.com",
    description: "How CheckPayDate.com keeps payment dates accurate, why results are estimates, and how often we review them.",
    canonical: "https://checkpaydate.com/accuracy-policy",
    lastUpdated: "July 2026",
    sections: [
      { h: "Estimates for planning", p: ["The dates we show are estimates based on published payment rules and schedules. They are intended for budgeting and planning, not as a guarantee of when funds will appear in your account."] },
      { h: "How we verify", ul: ["Hardcoded schedules (e.g. Canada, SASSA) are cross-checked against the official government page.", "Rule-based dates (e.g. US Social Security) are computed from the published rules and validated with automated tests.", "Federal holidays are calculated for the previous, current and next year so weekend/holiday adjustments are correct across year boundaries."] },
      { h: "Why your actual date may differ", ul: ["Bank processing times vary.", "Agencies occasionally revise schedules.", "Individual circumstances (e.g. dual eligibility, overseas residency) can change your date."] },
      { h: "Always confirm officially", p: ["For your exact deposit date, use your official government account or contact the agency directly. " + contactLine] },
    ],
  },

  "corrections-policy": {
    heading: "Corrections Policy",
    title: "Corrections Policy | CheckPayDate.com",
    description: "How to report an error on CheckPayDate.com and how we investigate and correct confirmed mistakes.",
    canonical: "https://checkpaydate.com/corrections-policy",
    lastUpdated: "July 2026",
    sections: [
      { h: "Reporting an error", p: ["If you believe a date, amount or fact is incorrect, please tell us. Use our Contact form or email contact@checkpaydate.com with the page and the detail you think is wrong."] },
      { h: "How we handle reports", ul: ["We verify the report against the official source.", "Confirmed errors are corrected promptly.", "We update the page's \"Last updated\" date and record notable fixes in our Changelog."] },
      { h: "Transparency", p: ["We do not silently change facts without noting them where it matters. Significant corrections are reflected in the Changelog so the update history is visible."] },
    ],
  },

  "data-sources-policy": {
    heading: "Data Sources Policy",
    title: "Data Sources Policy | CheckPayDate.com",
    description: "The official sources CheckPayDate.com uses for payment dates, and how we cite them.",
    canonical: "https://checkpaydate.com/data-sources-policy",
    lastUpdated: "July 2026",
    sections: [
      { h: "Primary sources only", p: ["We rely exclusively on primary, official government sources. We do not scrape personal records or use unofficial aggregators for our schedules."] },
      { h: "Sources we use", ul: ["United States — Social Security Administration (ssa.gov)", "Canada — Service Canada (canada.ca)", "United Kingdom — GOV.UK", "Australia — Services Australia", "South Africa — SASSA"] },
      { h: "How we cite", p: ["Each country page lists the specific official pages used, with links, so you can verify any date yourself. Our Methodology page explains how the calculations are derived from these sources.", contactLine] },
    ],
  },

  "cookie-policy": {
    heading: "Cookie Policy",
    title: "Cookie Policy | CheckPayDate.com",
    description: "How CheckPayDate.com uses cookies, including analytics, and how you can control them.",
    canonical: "https://checkpaydate.com/cookie-policy",
    lastUpdated: "July 2026",
    sections: [
      { h: "What cookies are", p: ["Cookies are small text files stored by your browser. They help websites remember preferences and understand aggregate usage."] },
      { h: "How we use them", ul: ["Essential: basic functionality of the site.", "Analytics: privacy-conscious, aggregate usage measurement (e.g. Google Analytics) to help us improve the site.", "We do not currently use advertising cookies. If that changes, this policy and our consent options will be updated."] },
      { h: "Managing cookies", p: ["You can block or delete cookies at any time in your browser settings. Disabling analytics cookies will not affect your ability to use the payment-date tools."] },
      { h: "More information", p: ["See our Privacy Policy for how we handle data overall. " + contactLine] },
    ],
  },

  "accessibility": {
    heading: "Accessibility Statement",
    title: "Accessibility Statement | CheckPayDate.com",
    description: "CheckPayDate.com's commitment to accessibility, the features we provide, and how to give feedback.",
    canonical: "https://checkpaydate.com/accessibility",
    lastUpdated: "July 2026",
    sections: [
      { h: "Our commitment", p: ["CheckPayDate.com is built for a 50+ audience, so accessibility is a core priority. We aim to meet WCAG 2.1 AA guidelines."] },
      { h: "Features we provide", ul: ["High-contrast colour scheme by default.", "Large, readable typography and generous spacing.", "A \"Skip to main content\" link for keyboard and screen-reader users.", "Semantic headings, labelled form fields, and visible focus states.", "Fully responsive layouts for desktop, tablet and mobile."] },
      { h: "Known limitations", p: ["Some third-party embedded content may not fully meet our standards. We are continually improving and welcome reports of any barriers you encounter."] },
      { h: "Feedback", p: ["If you have trouble using any part of the site, please tell us so we can help and improve. " + contactLine] },
    ],
  },

  "disclaimer": {
    heading: "Disclaimer",
    title: "Disclaimer | CheckPayDate.com",
    description: "Important disclaimer: CheckPayDate.com provides estimates only and is not affiliated with any government agency.",
    canonical: "https://checkpaydate.com/disclaimer",
    lastUpdated: "July 2026",
    sections: [
      { h: "Not a government website", p: ["CheckPayDate.com is an independent tool and is not affiliated with, endorsed by, or connected to the Social Security Administration or any government agency."] },
      { h: "Estimates only", p: ["All payment dates are estimates based on published rules and schedules. They are not a guarantee of deposit timing. Your actual date may differ due to bank processing, holidays, or administrative changes."] },
      { h: "No professional advice", p: ["Nothing on this site constitutes financial, legal or benefits advice. For decisions about your benefits, consult the relevant agency or a qualified professional."] },
      { h: "Limitation of liability", p: ["To the fullest extent permitted by law, CheckPayDate.com is not liable for any loss or damage arising from reliance on the information provided. Always verify your exact payment date with the relevant agency. " + contactLine] },
    ],
  },
};

// For footer / navigation
export const POLICY_LINKS = [
  { to: "/editorial-policy", label: "Editorial Policy" },
  { to: "/accuracy-policy", label: "Accuracy Policy" },
  { to: "/corrections-policy", label: "Corrections Policy" },
  { to: "/data-sources-policy", label: "Data Sources Policy" },
  { to: "/cookie-policy", label: "Cookie Policy" },
  { to: "/accessibility", label: "Accessibility Statement" },
  { to: "/disclaimer", label: "Disclaimer" },
];
