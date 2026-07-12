import React from "react";
import { Link } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { useSeo } from "./useSeo";
import { POLICY_DATA } from "./policyData";

const H2 = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-headings font-bold text-slate-900 pt-4">{children}</h2>
);

export default function PolicyPage({ slug }) {
  const data = POLICY_DATA[slug];

  useSeo({
    title: data?.title,
    description: data?.description,
    canonical: data?.canonical,
  });

  if (!data) {
    return (
      <LegalLayout title="Page not found" lastUpdated={null}>
        <p>Sorry, we couldn&apos;t find that policy.</p>
        <Link to="/" className="text-[#005EA2] font-semibold hover:underline">Back to the checker</Link>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title={data.heading} lastUpdated={data.lastUpdated}>
      {data.sections.map((s, i) => (
        <div key={i} className="space-y-3">
          <H2>{s.h}</H2>
          {s.p && s.p.map((para, j) => <p key={j}>{para}</p>)}
          {s.ul && (
            <ul className="list-disc pl-5 space-y-2">
              {s.ul.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </LegalLayout>
  );
}
