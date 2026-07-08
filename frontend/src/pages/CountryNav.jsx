import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const COUNTRIES = [
  { flag: "🇺🇸", label: "United States", to: "/", testid: "country-nav-us" },
  { flag: "🇨🇦", label: "Canada (CPP & OAS)", to: "/canada/cpp-payment-dates/", testid: "country-nav-canada" },
  { flag: "🇬🇧", label: "United Kingdom", to: "/uk/state-pension-payment-dates/", testid: "country-nav-uk" },
  { flag: "🇦🇺", label: "Australia", to: "/australia/centrelink-payment-dates/", testid: "country-nav-australia" },
  { flag: "🇿🇦", label: "South Africa", to: "/south-africa/sassa-payment-dates/", testid: "country-nav-southafrica" },
];

export const HeaderCountryNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-testid="header-country-nav-trigger"
          className="inline-flex items-center gap-2 h-11 px-4 border-2 border-black rounded-lg bg-white font-bold text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#005EA2]"
          aria-label="Choose a country payment date checker"
        >
          <Globe className="h-4 w-4 text-[#005EA2]" />
          <span className="hidden sm:inline">Payment Date Checkers</span>
          <span className="sm:hidden">Countries</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white border-2 border-black">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-slate-500">
          Payment Date Checkers
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {COUNTRIES.map((c) => (
          <DropdownMenuItem key={c.to} asChild className="cursor-pointer py-3 text-base font-medium">
            <Link to={c.to} data-testid={`header-${c.testid}`} className="flex items-center gap-3">
              <span aria-hidden="true" className="text-lg">{c.flag}</span>
              <span>{c.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
