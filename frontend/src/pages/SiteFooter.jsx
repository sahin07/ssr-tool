import React from "react";
import { Link } from "react-router-dom";
import { CountryNav } from "./CountryNav";

export const SiteFooter = () => (
  <footer className="bg-white text-black border-t-2 border-black py-12 no-print" data-testid="site-footer">
    <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
      <div className="space-y-3">
        <span className="font-headings font-extrabold text-lg tracking-tight">CheckPayDate.com</span>
        <p className="text-slate-600">
          An independent, privacy-secure utility helping retirees, beneficiaries, and families plan budgets easily and clearly.
        </p>
        <ul className="space-y-2 pt-1">
          <li><Link to="/about" data-testid="footer-about-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">About</Link></li>
          <li><Link to="/methodology" data-testid="footer-methodology-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Methodology</Link></li>
          <li><Link to="/changelog" data-testid="footer-changelog-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-medium">Changelog</Link></li>
        </ul>
      </div>

      <div className="space-y-3">
        <CountryNav headingClass="text-slate-500" linkClass="text-slate-700 hover:text-[#005EA2] hover:underline font-medium" />
      </div>

      <div className="space-y-3">
        <span className="block font-bold text-xs uppercase tracking-wider text-slate-500">Privacy &amp; Terms</span>
        <ul className="space-y-2">
          <li>
            <Link to="/privacy-policy" data-testid="footer-privacy-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-semibold">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms-and-conditions" data-testid="footer-terms-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-semibold">Terms &amp; Conditions</Link>
          </li>
          <li>
            <Link to="/contact" data-testid="footer-contact-link" className="text-slate-700 hover:text-[#005EA2] hover:underline font-semibold">Contact Us</Link>
          </li>
        </ul>
        <p className="text-slate-500 pt-1">
          No accounts and no payment data collected. This is a scheduling estimate tool, not a government portal.
        </p>
        <p className="text-xs text-slate-500 pt-2">
          © {new Date().getFullYear()} CheckPayDate.com. All Rights Reserved. Not a Government Entity.
        </p>
      </div>
    </div>
  </footer>
);
