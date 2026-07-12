import React from "react";
import { LegalLayout } from "./LegalLayout";
import { useSeo } from "./useSeo";

const H2 = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-headings font-bold text-slate-900 pt-4">{children}</h2>
);

export default function Methodology() {
  useSeo({
    title: "Methodology — How We Calculate Payment Dates | CheckPayDate.com",
    description: "How CheckPayDate.com calculates payment dates: the SSA Wednesday rule, SSI and pre-1997 rules, weekend/holiday business-day adjustments, and our official sources.",
    canonical: "https://checkpaydate.com/methodology",
  });

  return (
    <LegalLayout title="Methodology" lastUpdated="July 2026">
      <p>
        CheckPayDate.com estimates payment dates using the official, published rules of each benefit program. We do not
        access any personal records — every result is produced from a public rule set and a calendar of federal
        holidays. Here is exactly how it works.
      </p>

      <H2>US Social Security — the Wednesday rule</H2>
      <p>For benefits based on a recipient&apos;s date of birth (retirement, SSDI, and survivors claims filed after May 1997):</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Born on the <strong>1st–10th</strong> → paid on the <strong>second Wednesday</strong> of the month.</li>
        <li>Born on the <strong>11th–20th</strong> → paid on the <strong>third Wednesday</strong>.</li>
        <li>Born on the <strong>21st–31st</strong> → paid on the <strong>fourth Wednesday</strong>.</li>
      </ul>

      <H2>SSI and pre-May-1997 claims</H2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Supplemental Security Income (SSI):</strong> paid on the <strong>1st</strong> of each month.</li>
        <li><strong>Claims that began before May 1997</strong> (and SSI + Social Security dual eligibility): paid on the <strong>3rd</strong> of each month.</li>
      </ul>

      <H2>Weekend &amp; holiday adjustments</H2>
      <p>
        If a scheduled date falls on a Saturday, Sunday, or a federal holiday, the payment is moved <strong>backward</strong>{" "}
        to the nearest preceding business day. Our calculator computes federal holidays (including observed dates) for the
        previous, current, and next year so the adjustment is always correct across year boundaries.
      </p>

      <H2>Business-day logic</H2>
      <p>
        A &quot;business day&quot; is Monday–Friday excluding federal holidays. When adjusting, we step backward one day at a
        time until we reach a valid business day — never forward — matching how the Social Security Administration issues
        payments.
      </p>

      <H2>International schedules</H2>
      <p>
        For Canada (CPP/OAS), the UK (State Pension), Australia (Centrelink), and South Africa (SASSA), we publish the
        official government schedule or rule for each program and cite the source on every page. Where a program pays on
        personalised dates (e.g. Australian Centrelink), we say so rather than inventing a fixed date.
      </p>

      <H2>Sources</H2>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li><a href="https://www.ssa.gov/pubs/EN-05-10031.pdf" target="_blank" rel="noopener noreferrer" className="text-[#005EA2] hover:underline">SSA — Schedule of Social Security Payments</a></li>
        <li><a href="https://www.canada.ca/en/services/benefits/calendar.html" target="_blank" rel="noopener noreferrer" className="text-[#005EA2] hover:underline">Canada.ca — Benefits payment dates</a></li>
        <li><a href="https://www.gov.uk/state-pension/when-youre-paid" target="_blank" rel="noopener noreferrer" className="text-[#005EA2] hover:underline">GOV.UK — State Pension</a></li>
        <li><a href="https://www.servicesaustralia.gov.au/" target="_blank" rel="noopener noreferrer" className="text-[#005EA2] hover:underline">Services Australia</a></li>
        <li><a href="https://www.sassa.gov.za/" target="_blank" rel="noopener noreferrer" className="text-[#005EA2] hover:underline">SASSA</a></li>
      </ul>

      <H2>Accuracy &amp; corrections</H2>
      <p>
        We review schedules against official sources and date every page. If you spot something that looks wrong, please
        email{" "}
        <a href="mailto:contact@checkpaydate.com" className="text-[#005EA2] font-semibold hover:underline">contact@checkpaydate.com</a>{" "}
        and we will verify and correct it promptly. Results are estimates for planning — always confirm your exact date with
        the relevant agency.
      </p>
    </LegalLayout>
  );
}
