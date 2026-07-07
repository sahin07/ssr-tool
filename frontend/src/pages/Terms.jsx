import React from "react";
import { LegalLayout } from "./LegalLayout";

const H2 = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-headings font-bold text-slate-900 pt-4">{children}</h2>
);

export default function Terms() {
  return (
    <LegalLayout title="Terms and Conditions" lastUpdated="June 2026">
      <p data-testid="terms-intro">
        By using CheckPayDate.com (&quot;the Site&quot;), you agree to these Terms and Conditions. Please read them
        carefully.
      </p>

      <H2>Estimates Only</H2>
      <p>
        The Site provides <strong>estimated</strong> Social Security payment dates calculated from published Social
        Security Administration (SSA) payment rules. Dates are for informational and planning purposes only and are
        not a guarantee of when funds will be deposited. Your actual deposit date may differ due to bank processing
        times, holidays, or administrative changes.
      </p>

      <H2>Not Affiliated With the Government</H2>
      <p>
        CheckPayDate.com is an independent tool and is <strong>not affiliated with, endorsed by, or connected to</strong>{" "}
        the Social Security Administration or any government agency. For official information about your benefits, use
        your &quot;my Social Security&quot; account at{" "}
        <a href="https://www.ssa.gov" target="_blank" rel="noopener noreferrer" className="text-[#005EA2] font-semibold hover:underline">ssa.gov</a>{" "}
        or call 1-800-772-1213.
      </p>

      <H2>Limitation of Liability</H2>
      <p>
        The Site is provided &quot;as is&quot; without warranties of any kind. To the fullest extent permitted by law,
        we are not liable for any loss, missed payment, financial decision, or damage arising from your use of, or
        reliance on, the estimates provided. Always verify your payment date with the SSA before making financial
        decisions.
      </p>

      <H2>Acceptable Use</H2>
      <p>
        You agree to use the Site for lawful, personal, informational purposes only and not to misuse, disrupt, or
        attempt to reverse-engineer the service.
      </p>

      <H2>Changes</H2>
      <p>
        We may update these Terms at any time. Continued use of the Site after changes are posted constitutes
        acceptance of the updated Terms.
      </p>

      <H2>Contact</H2>
      <p>
        Questions? Email{" "}
        <a href="mailto:contact@checkpaydate.com" className="text-[#005EA2] font-semibold hover:underline">
          contact@checkpaydate.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}
