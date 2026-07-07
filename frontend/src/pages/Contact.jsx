import React from "react";
import { LegalLayout } from "./LegalLayout";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <LegalLayout title="Contact Us" lastUpdated={null}>
      <p data-testid="contact-intro">
        Have a question, correction, or feedback about CheckPayDate.com? We&apos;d love to hear from you. This is an
        independent scheduling tool, so we cannot access your benefits or account — for anything official, please
        contact the Social Security Administration directly.
      </p>

      <div className="p-6 border-2 border-black rounded-2xl bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#005EA2] text-white rounded-xl">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Email us</p>
            <a
              href="mailto:contact@checkpaydate.com"
              data-testid="contact-email-link"
              className="text-lg sm:text-xl font-bold text-[#005EA2] hover:underline"
            >
              contact@checkpaydate.com
            </a>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          We typically reply within a few business days. Please do not send sensitive personal information such as your
          Social Security number or bank details.
        </p>
      </div>

      <div className="p-6 border border-slate-200 rounded-2xl bg-white">
        <h2 className="text-xl font-headings font-bold text-slate-900">Need official help?</h2>
        <p className="mt-2">
          For questions about your actual benefits or deposits, contact the Social Security Administration:
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>
            Website:{" "}
            <a href="https://www.ssa.gov" target="_blank" rel="noopener noreferrer" className="text-[#005EA2] font-semibold hover:underline">
              ssa.gov
            </a>
          </li>
          <li>Phone: 1-800-772-1213 (TTY 1-800-325-0778), Mon–Fri, 8:00 AM–7:00 PM local time</li>
        </ul>
      </div>
    </LegalLayout>
  );
}
