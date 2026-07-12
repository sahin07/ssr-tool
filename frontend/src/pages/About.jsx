import React from "react";
import { Link } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { useSeo } from "./useSeo";

const H2 = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-headings font-bold text-slate-900 pt-4">{children}</h2>
);

export default function About() {
  useSeo({
    title: "About CheckPayDate.com — Our Mission, Editorial & Accuracy Policies",
    description: "About CheckPayDate.com: an independent payment-date reference. Our editorial policy, accuracy policy, corrections policy, data sources, and independence disclaimer.",
    canonical: "https://checkpaydate.com/about",
  });

  return (
    <LegalLayout title="About CheckPayDate.com" lastUpdated="July 2026">
      <p>
        CheckPayDate.com is an independent reference that helps people find when their recurring government benefit
        payments are scheduled to arrive. We turn official, published payment rules into a simple, accessible tool —
        built especially for retirees, beneficiaries, and the families who help them plan.
      </p>

      <H2>Who it&apos;s for</H2>
      <p>
        Our primary audience is people aged 50+ receiving Social Security and related benefits, so we prioritise large
        type, high contrast, plain language, and speed over flashy design.
      </p>

      <H2>Editorial policy</H2>
      <p>
        Content is maintained by the <strong>CheckPayDate Editorial Team</strong>. Every schedule is derived from an
        official government source, and each page shows a &quot;Last updated&quot; date. We write in plain English and avoid
        jargon so information is easy to act on.
      </p>

      <H2>Accuracy policy</H2>
      <p>
        We calculate dates using each program&apos;s published rules and cross-check hardcoded schedules against official
        pages. Results are <strong>estimates for planning purposes</strong>. Bank processing times and administrative
        changes can vary, so we always encourage you to confirm your exact date with the relevant agency.
      </p>

      <H2>Corrections policy</H2>
      <p>
        If you believe a date or fact is incorrect, email{" "}
        <a href="mailto:contact@checkpaydate.com" className="text-[#005EA2] font-semibold hover:underline">contact@checkpaydate.com</a>.
        We verify reports against official sources and correct confirmed errors promptly, updating the page&apos;s
        &quot;Last updated&quot; date and our{" "}
        <Link to="/changelog" className="text-[#005EA2] font-semibold hover:underline">changelog</Link>.
      </p>

      <H2>Data sources</H2>
      <p>
        We rely only on primary, official sources — the Social Security Administration, Canada.ca (Service Canada),
        GOV.UK, Services Australia, and SASSA. Every country page lists the specific sources used. See our{" "}
        <Link to="/methodology" className="text-[#005EA2] font-semibold hover:underline">methodology</Link> for how the
        calculations work.
      </p>

      <H2>Independence &amp; disclaimer</H2>
      <p>
        CheckPayDate.com is <strong>not affiliated with, endorsed by, or connected to</strong> the Social Security
        Administration or any government agency. We do not collect Social Security numbers, bank details, or personal
        records. For official information, use your official account with the relevant agency or call them directly.
      </p>

      <H2>Contact</H2>
      <p>
        General enquiries and corrections:{" "}
        <a href="mailto:contact@checkpaydate.com" className="text-[#005EA2] font-semibold hover:underline">contact@checkpaydate.com</a>{" "}
        — see our <Link to="/contact" className="text-[#005EA2] font-semibold hover:underline">Contact page</Link>.
      </p>
    </LegalLayout>
  );
}
