import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LegalLayout } from "./LegalLayout";
import { COUNTRY_DATA } from "./countryData";
import { AlertTriangle, Phone, ExternalLink, ArrowRight, Info } from "lucide-react";

const UK_MAP = [
  { range: "00 to 19", day: "Monday" },
  { range: "20 to 39", day: "Tuesday" },
  { range: "40 to 59", day: "Wednesday" },
  { range: "60 to 79", day: "Thursday" },
  { range: "80 to 99", day: "Friday" },
];

const UkSelector = () => {
  const [digits, setDigits] = useState("");
  const n = parseInt(digits, 10);
  const match =
    digits.length === 2 && !isNaN(n)
      ? UK_MAP[Math.min(4, Math.floor(n / 20))]
      : null;

  return (
    <div className="p-6 border-2 border-black rounded-2xl bg-slate-50 not-prose" data-testid="uk-ni-selector">
      <label htmlFor="ni-digits" className="block text-base font-bold text-slate-900 mb-2">
        Enter the last 2 digits of your National Insurance number
      </label>
      <input
        id="ni-digits"
        data-testid="uk-ni-input"
        inputMode="numeric"
        maxLength={2}
        value={digits}
        onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 2))}
        placeholder="e.g. 42"
        className="h-12 w-32 text-lg font-semibold border border-slate-400 rounded-lg px-3 bg-white focus:ring-2 focus:ring-[#005EA2] outline-none"
      />
      {match && (
        <p data-testid="uk-ni-result" className="mt-4 text-lg text-slate-900">
          Your State Pension is paid on a{" "}
          <strong className="text-[#005EA2]">{match.day}</strong>, every 4 weeks.
        </p>
      )}
    </div>
  );
};

const H2 = ({ children }) => (
  <h2 className="text-xl sm:text-2xl font-headings font-bold text-slate-900 pt-4">{children}</h2>
);

export default function CountryPage({ slug }) {
  const data = COUNTRY_DATA[slug];

  useEffect(() => {
    if (data) document.title = data.title;
    return () => {
      document.title = "Social Security Payment Date Checker — CheckPayDate.com";
    };
  }, [data]);

  if (!data) {
    return (
      <LegalLayout title="Page not found" lastUpdated={null}>
        <p>Sorry, we couldn&apos;t find that payment schedule.</p>
        <Link to="/" className="text-[#005EA2] font-semibold hover:underline">Back to the checker</Link>
      </LegalLayout>
    );
  }

  return (
    <LegalLayout title={`${data.flag} ${data.heading}`} lastUpdated="June 2026">
      <p data-testid="country-intro">{data.intro}</p>

      {data.interactive === "uk" && <UkSelector />}

      {/* Schedule table */}
      {data.scheduleRows && (
        <>
          <H2>{data.scheduleTitle}</H2>
          <div className="not-prose overflow-x-auto border-2 border-black rounded-2xl bg-white" data-testid="country-schedule-table">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-black">
                  {data.scheduleColumns.map((col) => (
                    <th key={col} className="p-4 font-bold text-slate-900 text-sm md:text-base">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.scheduleRows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {row.map((cell, j) => (
                      <td key={j} className={`p-4 text-sm md:text-base ${j === 0 ? "font-bold text-slate-900" : "text-slate-700"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* How it works */}
      <H2>How payment dates work</H2>
      <ul className="list-disc pl-5 space-y-2">
        {data.howItWorks.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      {/* Amounts */}
      {data.amounts && (
        <>
          <H2>Current amounts</H2>
          <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="country-amounts">
            {data.amounts.map((a, i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-xl bg-white">
                <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">{a.label}</p>
                <p className="text-lg font-bold text-slate-900">{a.value}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Official resource */}
      <div className="not-prose p-6 border border-slate-200 rounded-2xl bg-slate-50 space-y-2">
        <h3 className="text-lg font-headings font-bold text-slate-900">Official source</h3>
        <a href={data.official.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-[#005EA2] font-semibold hover:underline">
          {data.official.name} <ExternalLink className="h-4 w-4 ml-1" />
        </a>
        {data.official.phone && (
          <p className="flex items-center gap-2 text-slate-900 font-bold">
            <Phone className="h-4 w-4 text-[#005EA2]" /> {data.official.phone}
          </p>
        )}
      </div>

      {/* Related link */}
      {data.related && (
        <Link to={data.related.to} data-testid="country-related-link" className="not-prose inline-flex items-center text-[#005EA2] font-semibold hover:underline">
          {data.related.label} <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      )}

      {/* Disclaimer */}
      <div className="not-prose flex items-start gap-3 p-5 border-l-4 border-amber-500 bg-amber-50 rounded-r-xl">
        <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-900">
          Schedule estimate only. CheckPayDate.com is an independent tool and is not affiliated with {data.official.name.split(" —")[0]} or any government agency. For your exact payment, check your official account or contact {data.official.name.split(" —")[0]} directly.
        </p>
      </div>

      {/* Sources */}
      <div className="not-prose">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" /> Sources
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {data.sources.map((s, i) => (
            <li key={i}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#005EA2] hover:underline">{s.label}</a>
            </li>
          ))}
        </ul>
      </div>

      <Link to="/" data-testid="country-us-checker-link" className="not-prose inline-flex items-center text-[#005EA2] font-semibold hover:underline">
        🇺🇸 Try the US Social Security Payment Date Checker <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
    </LegalLayout>
  );
}
