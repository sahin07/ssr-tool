import React from "react";
import { Link } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { useSeo } from "./useSeo";
import { ArrowRight } from "lucide-react";

const HUBS = [
  { flag: "🇺🇸", title: "United States", desc: "Social Security, SSDI, survivors, SSI, pre-1997", to: "/" },
  { flag: "🇨🇦", title: "Canada — CPP", desc: "Canada Pension Plan monthly dates", to: "/canada/cpp-payment-dates/" },
  { flag: "🇨🇦", title: "Canada — OAS", desc: "Old Age Security (and GIS) dates", to: "/canada/oas-payment-dates/" },
  { flag: "🇬🇧", title: "United Kingdom", desc: "State Pension — paid every 4 weeks", to: "/uk/state-pension-payment-dates/" },
  { flag: "🇦🇺", title: "Australia", desc: "Centrelink Age Pension — fortnightly", to: "/australia/centrelink-payment-dates/" },
  { flag: "🇿🇦", title: "South Africa", desc: "SASSA grants — Older Persons, Disability, Child", to: "/south-africa/sassa-payment-dates/" },
];

const YEAR = new Date().getFullYear();
const US_HUBS = [
  { title: `${YEAR} Full Schedule`, to: `/${YEAR}-social-security-payment-schedule` },
  { title: `${YEAR + 1} Full Schedule`, to: `/${YEAR + 1}-social-security-payment-schedule` },
  { title: "SSI Payment Schedule", to: "/ssi-payment-schedule" },
  { title: "SSDI Payment Dates", to: "/ssdi-payment-dates" },
  { title: "Retirement Payment Dates", to: "/social-security-retirement-payment-dates" },
  { title: "Survivors Benefits Dates", to: "/survivors-benefits-payment-dates" },
  { title: "Federal Holidays", to: "/federal-holidays" },
];

export default function CountryHub() {
  useSeo({
    title: "Payment Date Checkers — All Countries & Benefits | CheckPayDate.com",
    description: "Directory of government payment date checkers: US Social Security, Canada CPP/OAS, UK State Pension, Australia Centrelink, South Africa SASSA, plus US benefit and year schedules.",
    canonical: "https://checkpaydate.com/payment-date-checkers",
    jsonLd: [{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Payment Date Checkers", url: "https://checkpaydate.com/payment-date-checkers" }],
  });

  return (
    <LegalLayout title="Payment Date Checkers" lastUpdated="July 2026">
      <p>Find when recurring government benefit payments are scheduled to arrive. Choose your country below, or browse the US Social Security schedules.</p>

      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="country-hub-grid">
        {HUBS.map((h) => (
          <Link key={h.to + h.title} to={h.to} className="flex items-start gap-3 p-5 border-2 border-black rounded-2xl bg-white hover:bg-slate-50 transition-colors">
            <span className="text-2xl" aria-hidden="true">{h.flag}</span>
            <span>
              <span className="block font-headings font-bold text-lg text-slate-900">{h.title}</span>
              <span className="block text-sm text-slate-600">{h.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <h2 className="text-xl sm:text-2xl font-headings font-bold text-slate-900 pt-4">US Social Security schedules</h2>
      <div className="not-prose flex flex-wrap gap-2">
        {US_HUBS.map((u) => (
          <Link key={u.to} to={u.to} className="inline-flex items-center gap-1 px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-[#005EA2] hover:bg-slate-50 text-sm">
            {u.title} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ))}
      </div>
    </LegalLayout>
  );
}
