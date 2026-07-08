import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { HeaderCountryNav } from "./CountryNav";

export const SiteHeader = () => (
  <header className="sticky top-0 z-50 bg-white border-b-2 border-black no-print" data-testid="site-header">
    <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-3" data-testid="site-header-brand">
        <div className="p-2 bg-[#005EA2] text-white rounded-lg">
          <Calendar className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <span className="font-headings font-extrabold text-lg sm:text-xl tracking-tight text-black">
            CheckPayDate.com
          </span>
          <span className="hidden sm:block text-xs uppercase font-bold tracking-wider text-[#005EA2]">
            Informational Aid
          </span>
        </div>
      </Link>
      <HeaderCountryNav />
    </div>
  </header>
);
