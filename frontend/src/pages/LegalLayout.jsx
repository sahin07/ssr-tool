import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { HeaderCountryNav } from "./CountryNav";
import { SiteFooter } from "./SiteFooter";

export const LegalLayout = ({ title, lastUpdated, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-body">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#005EA2] focus:text-white focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
        <div className="max-w-3xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3" data-testid="legal-brand-home-link">
            <div className="p-2 bg-[#005EA2] text-white rounded-lg">
              <Calendar className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <span className="font-headings font-extrabold text-xl tracking-tight">CheckPayDate.com</span>
              <span className="block text-xs uppercase font-bold tracking-wider text-[#005EA2]">Informational Aid</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <HeaderCountryNav />
            <Link
              to="/"
              data-testid="legal-back-to-tool-link"
              className="hidden md:inline-flex items-center space-x-2 text-[#005EA2] font-semibold hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Checker</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <h1 className="text-3xl sm:text-4xl font-headings font-extrabold tracking-tight mb-2">{title}</h1>
        {lastUpdated && (
          <p className="text-sm text-slate-500 mb-8">Last updated: {lastUpdated}</p>
        )}
        <div className="prose-legal space-y-6 text-base sm:text-lg leading-relaxed text-slate-700">
          {children}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};
