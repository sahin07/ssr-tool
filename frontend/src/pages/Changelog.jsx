import React from "react";
import { LegalLayout } from "./LegalLayout";
import { useSeo } from "./useSeo";
import { CheckCircle2 } from "lucide-react";

const RELEASES = [
  {
    version: "v1.0",
    date: "July 2026",
    items: [
      "Launched the US Social Security Payment Date Checker (retirement, SSDI, survivors, SSI, and pre-1997 claims).",
      "Automatic weekend and federal-holiday adjustments to the prior business day.",
      "Next-payment result with live countdown and a 12-month schedule.",
      "Add to Calendar + 2-day reminder (.ics), CSV download, copy, print, and shareable/bookmarkable result links.",
      "Country payment-date pages: Canada (CPP & OAS), UK State Pension, Australia Centrelink, South Africa SASSA.",
      "Trust & EEAT: Last updated dates, Sources section, Methodology, About, and per-page FAQs.",
      "Full on-page SEO (titles, meta, canonical, Open Graph/Twitter, JSON-LD WebApplication + FAQPage), robots.txt and sitemap.xml.",
      "Accessibility: skip-to-content, labeled inputs, high-contrast default, large readable type.",
    ],
  },
];

export default function Changelog() {
  useSeo({
    title: "Changelog & Version History | CheckPayDate.com",
    description: "Version history and changelog for CheckPayDate.com — what we've added and updated over time.",
    canonical: "https://checkpaydate.com/changelog",
  });

  return (
    <LegalLayout title="Changelog" lastUpdated="July 2026">
      <p>A running history of what we&apos;ve shipped and updated. Newest first.</p>

      <div className="not-prose space-y-8 pt-2" data-testid="changelog-list">
        {RELEASES.map((r) => (
          <div key={r.version} className="border-2 border-black rounded-2xl bg-white p-6">
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xl font-headings font-extrabold text-[#005EA2]">{r.version}</span>
              <span className="text-sm font-semibold text-slate-500">{r.date}</span>
            </div>
            <ul className="space-y-2">
              {r.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </LegalLayout>
  );
}
