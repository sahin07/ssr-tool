import React from "react";
import { useParams, Link } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { useSeo } from "./useSeo";
import { getYearSchedule, getMonthPayments, getFederalHolidayList, MONTH_NAMES, monthSlugToIndex } from "./ssaSchedule";
import { ArrowRight, CalendarDays } from "lucide-react";

const H2 = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-headings font-bold text-slate-900 pt-4">{children}</h2>
);

const ScheduleTable = ({ rows }) => (
  <div className="not-prose overflow-x-auto border-2 border-black rounded-2xl bg-white" data-testid="seo-schedule-table">
    <table className="w-full text-left border-collapse text-sm md:text-base">
      <thead>
        <tr className="bg-slate-100 border-b-2 border-black">
          <th className="p-3 font-bold text-slate-900">Month</th>
          <th className="p-3 font-bold text-slate-900">Born 1–10</th>
          <th className="p-3 font-bold text-slate-900">Born 11–20</th>
          <th className="p-3 font-bold text-slate-900">Born 21–31</th>
          <th className="p-3 font-bold text-slate-900">SSI</th>
          <th className="p-3 font-bold text-slate-900">Pre-1997</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-slate-50">
            <td className="p-3 font-bold text-slate-900">{r.monthName}</td>
            <td className="p-3 text-slate-700">{r.birth_1_10.replace(/^\w+, /, "")}</td>
            <td className="p-3 text-slate-700">{r.birth_11_20.replace(/^\w+, /, "")}</td>
            <td className="p-3 text-slate-700">{r.birth_21_31.replace(/^\w+, /, "")}</td>
            <td className="p-3 text-slate-700">{r.ssi.replace(/^\w+, /, "")}</td>
            <td className="p-3 text-slate-700">{r.pre1997.replace(/^\w+, /, "")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PeopleAlsoCheck = ({ links }) => (
  <div className="not-prose pt-2">
    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">People also check</h3>
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <Link key={l.to} to={l.to} className="inline-flex items-center gap-1 px-3 py-2 border-2 border-black rounded-lg bg-white font-semibold text-slate-900 hover:bg-slate-100 text-sm">
          {l.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ))}
    </div>
  </div>
);

const NotFound = () => (
  <LegalLayout title="Page not found" lastUpdated={null}>
    <p>Sorry, that schedule page doesn&apos;t exist.</p>
    <Link to="/" className="text-[#005EA2] font-semibold hover:underline">Back to the checker</Link>
  </LegalLayout>
);

// ---- Renderers ----

const YearHub = ({ year }) => {
  const rows = getYearSchedule(year);
  useSeo({
    title: `${year} Social Security Payment Schedule (All Months) | CheckPayDate.com`,
    description: `Complete ${year} Social Security payment calendar — every monthly deposit date for retirement, SSDI, survivors, SSI and pre-1997 claims.`,
    canonical: `https://checkpaydate.com/${year}-social-security-payment-schedule`,
    jsonLd: [{ "@context": "https://schema.org", "@type": "WebPage", name: `${year} Social Security Payment Schedule`, url: `https://checkpaydate.com/${year}-social-security-payment-schedule` }],
  });
  return (
    <LegalLayout title={`${year} Social Security Payment Schedule`} lastUpdated="July 2026">
      <p>Here is the full {year} Social Security payment calendar. Dates are based on the official SSA schedule and adjusted backward to the prior business day for weekends and federal holidays.</p>
      <ScheduleTable rows={rows} />
      <H2>Jump to a month</H2>
      <div className="not-prose flex flex-wrap gap-2">
        {MONTH_NAMES.map((m) => (
          <Link key={m} to={`/${m.toLowerCase()}-${year}-social-security-payment-schedule`} className="px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-[#005EA2] hover:bg-slate-50 text-sm">
            {m} {year}
          </Link>
        ))}
      </div>
      <H2>Other years</H2>
      <div className="not-prose flex flex-wrap gap-2">
        {[year - 1, year + 1, year + 2].map((y) => (
          <Link key={y} to={`/${y}-social-security-payment-schedule`} className="px-3 py-2 border-2 border-black rounded-lg bg-white font-semibold text-slate-900 hover:bg-slate-100 text-sm">{y} Schedule</Link>
        ))}
      </div>
      <PeopleAlsoCheck links={[
        { to: "/ssi-payment-schedule", label: "SSI Schedule" },
        { to: "/ssdi-payment-dates", label: "SSDI Dates" },
        { to: "/federal-holidays", label: "Federal Holidays" },
        { to: "/", label: "Check my exact date" },
      ]} />
    </LegalLayout>
  );
};

const MonthHub = ({ year, monthIndex }) => {
  const p = getMonthPayments(year, monthIndex);
  const m = MONTH_NAMES[monthIndex];
  const prev = monthIndex === 0 ? { m: 11, y: year - 1 } : { m: monthIndex - 1, y: year };
  const next = monthIndex === 11 ? { m: 0, y: year + 1 } : { m: monthIndex + 1, y: year };
  useSeo({
    title: `${m} ${year} Social Security Payment Dates | CheckPayDate.com`,
    description: `${m} ${year} Social Security payment dates: retirement & SSDI by birth date, SSI on the 1st, pre-1997 on the 3rd, adjusted for weekends and holidays.`,
    canonical: `https://checkpaydate.com/${m.toLowerCase()}-${year}-social-security-payment-schedule`,
    jsonLd: [{ "@context": "https://schema.org", "@type": "WebPage", name: `${m} ${year} Social Security Payment Dates`, url: `https://checkpaydate.com/${m.toLowerCase()}-${year}-social-security-payment-schedule` }],
  });
  return (
    <LegalLayout title={`${m} ${year} Social Security Payment Dates`} lastUpdated="July 2026">
      <p>These are the Social Security payment dates for <strong>{m} {year}</strong>, based on the official SSA schedule. If a date falls on a weekend or federal holiday, payment moves to the prior business day.</p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["Born 1st–10th (2nd Wednesday)", p.birth_1_10],
          ["Born 11th–20th (3rd Wednesday)", p.birth_11_20],
          ["Born 21st–31st (4th Wednesday)", p.birth_21_31],
          ["SSI", p.ssi],
          ["Claims before May 1997", p.pre1997],
        ].map(([label, val]) => (
          <div key={label} className="p-4 border-2 border-black rounded-xl bg-white">
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">{label}</p>
            <p className="text-lg font-bold text-slate-900 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-[#005EA2]" />{val}</p>
          </div>
        ))}
      </div>
      <H2>Nearby months</H2>
      <div className="not-prose flex flex-wrap gap-2">
        <Link to={`/${MONTH_NAMES[prev.m].toLowerCase()}-${prev.y}-social-security-payment-schedule`} className="px-3 py-2 border-2 border-black rounded-lg bg-white font-semibold text-slate-900 hover:bg-slate-100 text-sm">← {MONTH_NAMES[prev.m]} {prev.y}</Link>
        <Link to={`/${year}-social-security-payment-schedule`} className="px-3 py-2 border-2 border-black rounded-lg bg-white font-semibold text-slate-900 hover:bg-slate-100 text-sm">Full {year} Schedule</Link>
        <Link to={`/${MONTH_NAMES[next.m].toLowerCase()}-${next.y}-social-security-payment-schedule`} className="px-3 py-2 border-2 border-black rounded-lg bg-white font-semibold text-slate-900 hover:bg-slate-100 text-sm">{MONTH_NAMES[next.m]} {next.y} →</Link>
      </div>
      <PeopleAlsoCheck links={[
        { to: "/ssi-payment-schedule", label: "SSI Schedule" },
        { to: "/social-security-retirement-payment-dates", label: "Retirement Dates" },
        { to: "/federal-holidays", label: "Federal Holidays" },
        { to: "/", label: "Check my exact date" },
      ]} />
    </LegalLayout>
  );
};

const BENEFIT_HUBS = {
  "ssi-payment-schedule": {
    title: "SSI Payment Schedule — When SSI Is Paid | CheckPayDate.com",
    heading: "SSI Payment Schedule",
    description: "Supplemental Security Income (SSI) is paid on the 1st of each month, moved earlier for weekends and holidays. See upcoming SSI payment dates.",
    intro: "Supplemental Security Income (SSI) is paid on the 1st of each month. When the 1st falls on a weekend or federal holiday, the payment is issued on the preceding business day.",
    stream: "ssi",
  },
  "ssdi-payment-dates": {
    title: "SSDI Payment Dates — Social Security Disability Schedule | CheckPayDate.com",
    heading: "SSDI Payment Dates",
    description: "Social Security Disability Insurance (SSDI) is paid on a Wednesday based on your date of birth (for claims after May 1997). See the schedule.",
    intro: "Social Security Disability Insurance (SSDI) follows the same birth-date Wednesday rule as retirement benefits for claims filed after May 1997: born 1–10 = 2nd Wednesday, 11–20 = 3rd, 21–31 = 4th.",
    stream: "wednesday",
  },
  "social-security-retirement-payment-dates": {
    title: "Social Security Retirement Payment Dates | CheckPayDate.com",
    heading: "Social Security Retirement Payment Dates",
    description: "Social Security retirement benefits are paid on a Wednesday set by your birth date. See how the schedule works and upcoming dates.",
    intro: "Social Security retirement benefits (claims after May 1997) are paid on a Wednesday determined by your day of birth: born 1–10 = 2nd Wednesday, 11–20 = 3rd Wednesday, 21–31 = 4th Wednesday.",
    stream: "wednesday",
  },
  "survivors-benefits-payment-dates": {
    title: "Survivors Benefits Payment Dates | CheckPayDate.com",
    heading: "Survivors Benefits Payment Dates",
    description: "Social Security survivors benefits follow the same birth-date Wednesday schedule as retirement benefits. See upcoming payment dates.",
    intro: "Social Security survivors benefits follow the same rules as retirement benefits for claims after May 1997 — a Wednesday based on the beneficiary's day of birth.",
    stream: "wednesday",
  },
};

const BenefitHub = ({ slug }) => {
  const cfg = BENEFIT_HUBS[slug];
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    return getMonthPayments(d.getFullYear(), d.getMonth());
  });
  useSeo({
    title: cfg.title,
    description: cfg.description,
    canonical: `https://checkpaydate.com/${slug}`,
    jsonLd: [{ "@context": "https://schema.org", "@type": "WebPage", name: cfg.heading, url: `https://checkpaydate.com/${slug}` }],
  });
  return (
    <LegalLayout title={cfg.heading} lastUpdated="July 2026">
      <p>{cfg.intro}</p>
      <H2>Upcoming payment dates</H2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {months.map((p, i) => {
          let val;
          if (cfg.stream === "ssi") val = p.ssi;
          else val = null;
          return (
            <div key={i} className="p-4 border-2 border-black rounded-xl bg-white">
              <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">{p.monthName} {p.year}</p>
              {cfg.stream === "ssi" ? (
                <p className="text-lg font-bold text-slate-900">{val}</p>
              ) : (
                <ul className="text-sm text-slate-700 mt-1 space-y-0.5">
                  <li>Born 1–10: <strong>{p.birth_1_10.replace(/^\w+, /, "")}</strong></li>
                  <li>Born 11–20: <strong>{p.birth_11_20.replace(/^\w+, /, "")}</strong></li>
                  <li>Born 21–31: <strong>{p.birth_21_31.replace(/^\w+, /, "")}</strong></li>
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <PeopleAlsoCheck links={[
        { to: `/${now.getFullYear()}-social-security-payment-schedule`, label: `${now.getFullYear()} Schedule` },
        { to: "/ssi-payment-schedule", label: "SSI Schedule" },
        { to: "/ssdi-payment-dates", label: "SSDI Dates" },
        { to: "/federal-holidays", label: "Federal Holidays" },
        { to: "/", label: "Check my exact date" },
      ]} />
    </LegalLayout>
  );
};

const HolidayHub = () => {
  const year = new Date().getFullYear();
  const list = getFederalHolidayList(year);
  useSeo({
    title: `${year} Federal Holidays & Social Security Payments | CheckPayDate.com`,
    description: `US federal holidays in ${year} and how they shift Social Security payment dates to the prior business day.`,
    canonical: "https://checkpaydate.com/federal-holidays",
    jsonLd: [{ "@context": "https://schema.org", "@type": "WebPage", name: `${year} Federal Holidays`, url: "https://checkpaydate.com/federal-holidays" }],
  });
  return (
    <LegalLayout title={`Federal Holidays & Payment Dates (${year})`} lastUpdated="July 2026">
      <p>When a Social Security payment date lands on a weekend or one of these US federal holidays, the payment is issued on the <strong>preceding business day</strong>. Here are the {year} federal holidays.</p>
      <div className="not-prose overflow-x-auto border-2 border-black rounded-2xl bg-white">
        <table className="w-full text-left border-collapse">
          <thead><tr className="bg-slate-100 border-b-2 border-black"><th className="p-3 font-bold">Holiday</th><th className="p-3 font-bold">Date</th></tr></thead>
          <tbody className="divide-y divide-slate-200">
            {list.map((h) => (
              <tr key={h.name}><td className="p-3 font-semibold text-slate-900">{h.name}</td><td className="p-3 text-slate-700">{h.date}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <PeopleAlsoCheck links={[
        { to: `/${year}-social-security-payment-schedule`, label: `${year} Schedule` },
        { to: "/ssi-payment-schedule", label: "SSI Schedule" },
        { to: "/", label: "Check my exact date" },
      ]} />
    </LegalLayout>
  );
};

// ---- Resolver ----
export default function SeoLanding() {
  const { seoSlug } = useParams();
  const slug = (seoSlug || "").toLowerCase();

  if (slug === "federal-holidays") return <HolidayHub />;
  if (BENEFIT_HUBS[slug]) return <BenefitHub slug={slug} />;

  const monthMatch = slug.match(/^([a-z]+)-(\d{4})-social-security-payment-schedule$/);
  if (monthMatch) {
    const mi = monthSlugToIndex(monthMatch[1]);
    const yr = parseInt(monthMatch[2], 10);
    if (mi >= 0 && yr >= 2020 && yr <= 2100) return <MonthHub year={yr} monthIndex={mi} />;
  }

  const yearMatch = slug.match(/^(\d{4})-social-security-payment-schedule$/);
  if (yearMatch) {
    const yr = parseInt(yearMatch[1], 10);
    if (yr >= 2020 && yr <= 2100) return <YearHub year={yr} />;
  }

  return <NotFound />;
}
