import React from "react";
import { Link } from "react-router-dom";
import { CountryNav } from "./CountryNav";

export const SiteFooter = () => (
  <footer className="bg-white text-black border-t-2 border-black py-12 no-print" data-testid="site-footer">
    <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      <div className="space-y-3">
        <span className="font-headings font-extrabold text-lg tracking-tight">CheckPayDate.com</span>
        <p className="text-slate-600">
          An independent, privacy-secure utility helping retirees, beneficiaries, and families plan budgets easily and clearly.
        </p>
        <ul className="space-y-2 pt-1">
          <li><Link to="/about" data-testid="footer-about-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">About</Link></li>
          <li><Link to="/methodology" data-testid="footer-methodology-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Methodology</Link></li>
          <li><Link to="/changelog" data-testid="footer-changelog-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Changelog</Link></li>
          <li><Link to="/contact" data-testid="footer-contact-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Contact Us</Link></li>
        </ul>
      </div>

      <div className="space-y-3">
        <CountryNav headingClass="text-slate-500" linkClass="text-slate-700 hover:text-[#005EA2] hover:underline font-medium" />
      </div>

      <div className="space-y-3">
        <span className="block font-bold text-xs uppercase tracking-wider text-slate-500">Legal</span>
        <ul className="space-y-2">
          <li><Link to="/privacy-policy" data-testid="footer-privacy-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Privacy Policy</Link></li>
          <li><Link to="/terms-and-conditions" data-testid="footer-terms-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Terms &amp; Conditions</Link></li>
          <li><Link to="/cookie-policy" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Cookie Policy</Link></li>
          <li><Link to="/disclaimer" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Disclaimer</Link></li>
          <li><Link to="/accessibility" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Accessibility Statement</Link></li>
        </ul>
      </div>

      <div className="space-y-3">
        <span className="block font-bold text-xs uppercase tracking-wider text-slate-500">Policies</span>
        <ul className="space-y-2">
          <li><Link to="/editorial-policy" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Editorial Policy</Link></li>
          <li><Link to="/accuracy-policy" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Accuracy Policy</Link></li>
          <li><Link to="/corrections-policy" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Corrections Policy</Link></li>
          <li><Link to="/data-sources-policy" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Data Sources Policy</Link></li>
        </ul>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 space-y-1">
      <p>No accounts and no payment data collected. This is a scheduling estimate tool, not a government portal.</p>
      <p>© {new Date().getFullYear()} CheckPayDate.com. All Rights Reserved. Not a Government Entity.</p>
    </div>
  </footer>
);
