import React from "react";
import { LegalLayout } from "./LegalLayout";
import { useSeo } from "./useSeo";

const H2 = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-headings font-bold text-slate-900 pt-4">{children}</h2>
);

export default function PrivacyPolicy() {
  useSeo({
    title: "Privacy Policy | CheckPayDate.com",
    description: "How CheckPayDate.com handles your data: no accounts, no SSN or bank details collected, and how analytics and cookies are used.",
    canonical: "https://checkpaydate.com/privacy-policy",
  });
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="June 2026">
      <p data-testid="privacy-intro">
        CheckPayDate.com (&quot;we,&quot; &quot;us,&quot; or &quot;the Site&quot;) respects your privacy. This tool
        provides estimated Social Security payment dates based on published Social Security Administration (SSA)
        payment rules. This policy explains what we do and do not collect.
      </p>

      <H2>No Accounts and No Sensitive Data</H2>
      <p>
        We do <strong>not</strong> require you to create an account. We do <strong>not</strong> ask for or collect
        your name, Social Security number, bank account details, or any payment information. This is a public
        scheduling calculator — not a people search, background check, or government portal.
      </p>

      <H2>Information You Enter Stays in Your Browser</H2>
      <p>
        The only input the tool uses is your <strong>day of birth</strong> (and your selected benefit type), which is
        used solely to determine which payment date applies to you. Calculations are performed for your session and
        are not tied to your identity. We do not sell or share any information you enter with third parties.
      </p>

      <H2>Analytics</H2>
      <p>
        We may use privacy-conscious analytics tools (such as Google Analytics) to understand aggregate,
        non-identifying usage — for example, how many people visit a page or which features are used. Analytics
        providers may set cookies and collect standard technical data such as browser type, device type, and general
        location (country/region). This helps us improve the Site.
      </p>

      <H2>Cookies</H2>
      <p>
        The Site may use cookies for analytics as described above. If we introduce advertising in the future, ad
        partners may also use cookies to serve or measure ads. You can control or disable cookies through your browser
        settings at any time.
      </p>

      <H2>Children&apos;s Privacy</H2>
      <p>
        This Site is intended for adults and is not directed at children under 13. We do not knowingly collect
        information from children.
      </p>

      <H2>Changes to This Policy</H2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated
        &quot;Last updated&quot; date.
      </p>

      <H2>Contact</H2>
      <p>
        Questions about this policy? Email us at{" "}
        <a href="mailto:contact@checkpaydate.com" className="text-[#005EA2] font-semibold hover:underline">
          contact@checkpaydate.com
        </a>
        .
      </p>
    </LegalLayout>
  );
}
