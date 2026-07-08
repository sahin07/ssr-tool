import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { CountryNav } from "./CountryNav";

export const LegalLayout = ({ title, lastUpdated, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-body">
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
          <Link
            to="/"
            data-testid="legal-back-to-tool-link"
            className="inline-flex items-center space-x-2 text-[#005EA2] font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Checker</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <h1 className="text-3xl sm:text-4xl font-headings font-extrabold tracking-tight mb-2">{title}</h1>
        {lastUpdated && (
          <p className="text-sm text-slate-500 mb-8">Last updated: {lastUpdated}</p>
        )}
        <div className="prose-legal space-y-6 text-base sm:text-lg leading-relaxed text-slate-700">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-10">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <CountryNav headingClass="text-slate-400" linkClass="text-slate-300 hover:text-white hover:underline font-medium" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm border-t border-slate-700 pt-6">
            <span>© {new Date().getFullYear()} CheckPayDate.com. Not a Government Entity.</span>
            <div className="flex items-center space-x-4">
              <Link to="/privacy-policy" className="hover:text-white" data-testid="footer-privacy-link">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-white" data-testid="footer-terms-link">Terms</Link>
              <Link to="/contact" className="hover:text-white" data-testid="footer-contact-link">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
