import React from "react";
import { Link } from "react-router-dom";

export const COUNTRIES = [
  { flag: "🇺🇸", label: "United States", to: "/", testid: "country-nav-us" },
  { flag: "🇨🇦", label: "Canada (CPP & OAS)", to: "/canada/cpp-payment-dates/", testid: "country-nav-canada" },
  { flag: "🇬🇧", label: "United Kingdom", to: "/uk/state-pension-payment-dates/", testid: "country-nav-uk" },
  { flag: "🇦🇺", label: "Australia", to: "/australia/centrelink-payment-dates/", testid: "country-nav-australia" },
  { flag: "🇿🇦", label: "South Africa", to: "/south-africa/sassa-payment-dates/", testid: "country-nav-southafrica" },
];

export const CountryNav = ({ headingClass = "", linkClass = "" }) => {
  return (
    <div data-testid="country-nav">
      <span className={`block font-bold text-xs uppercase tracking-wider mb-3 ${headingClass}`}>
        Payment Date Checkers
      </span>
      <ul className="space-y-2">
        {COUNTRIES.map((c) => (
          <li key={c.to}>
            <Link
              to={c.to}
              data-testid={c.testid}
              className={`inline-flex items-center gap-2 ${linkClass}`}
            >
              <span aria-hidden="true">{c.flag}</span>
              <span>{c.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
