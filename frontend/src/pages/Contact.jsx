import React, { useState } from "react";
import axios from "axios";
import { LegalLayout } from "./LegalLayout";
import { useSeo } from "./useSeo";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Contact() {
  useSeo({
    title: "Contact Us | CheckPayDate.com",
    description: "Contact CheckPayDate.com via our form or by email, plus official Social Security Administration contact details for benefit questions.",
    canonical: "https://checkpaydate.com/contact",
  });

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const canSubmit =
    form.name.trim() && isValidEmail(form.email.trim()) && form.subject.trim() && form.message.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please complete all fields with a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(`${API}/contact`, form);
      if (res.data?.success) {
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
        toast.success("Message sent!", { description: res.data.message });
      }
    } catch (err) {
      const detail = err?.response?.data?.detail || "Could not send your message. Please email contact@checkpaydate.com.";
      toast.error("Something went wrong", { description: detail });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full h-12 border-2 border-slate-300 rounded-lg px-3 text-base bg-white focus:border-[#005EA2] focus:ring-2 focus:ring-[#005EA2] outline-none";

  return (
    <LegalLayout title="Contact Us" lastUpdated="July 2026">
      <p data-testid="contact-intro">
        Have a question, correction, or feedback about CheckPayDate.com? Send us a message below — we&apos;d love to hear
        from you. This is an independent scheduling tool, so we cannot access your benefits or account; for anything
        official, please contact the Social Security Administration directly.
      </p>

      {/* Contact form */}
      <div className="not-prose p-6 border-2 border-black rounded-2xl bg-white" data-testid="contact-form-card">
        {sent ? (
          <div className="text-center py-6" data-testid="contact-success">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-headings font-bold text-slate-900 mt-3">Thank you!</h2>
            <p className="text-slate-600 mt-1">
              Your message has been received. We typically reply within a few business days.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              data-testid="contact-send-another"
              className="mt-4 inline-flex items-center gap-2 h-11 px-5 rounded-lg border-2 border-black bg-white font-bold text-slate-900 hover:bg-slate-100"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="c-name" className="block text-sm font-bold text-slate-900 mb-1">Your name</label>
                <input id="c-name" data-testid="contact-name-input" className={inputClass} value={form.name} onChange={update("name")} maxLength={120} required />
              </div>
              <div>
                <label htmlFor="c-email" className="block text-sm font-bold text-slate-900 mb-1">Email</label>
                <input id="c-email" type="email" data-testid="contact-email-input" className={inputClass} value={form.email} onChange={update("email")} maxLength={200} required />
              </div>
            </div>
            <div>
              <label htmlFor="c-subject" className="block text-sm font-bold text-slate-900 mb-1">Subject</label>
              <input id="c-subject" data-testid="contact-subject-input" className={inputClass} value={form.subject} onChange={update("subject")} maxLength={200} required />
            </div>
            <div>
              <label htmlFor="c-message" className="block text-sm font-bold text-slate-900 mb-1">Message</label>
              <textarea id="c-message" data-testid="contact-message-input" rows={5} className={`${inputClass} h-auto py-3`} value={form.message} onChange={update("message")} maxLength={4000} required />
            </div>
            <p className="text-xs text-slate-500">
              Please do not include sensitive personal information such as your Social Security number or bank details.
            </p>
            <button
              type="submit"
              disabled={submitting}
              data-testid="contact-submit-button"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-[#005EA2] text-white font-bold hover:bg-[#00477c] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" /> {submitting ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>

      {/* Email alternative */}
      <div className="not-prose p-6 border border-slate-200 rounded-2xl bg-slate-50">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#005EA2] text-white rounded-xl">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase font-bold text-slate-500 tracking-wider">Prefer email?</p>
            <a href="mailto:contact@checkpaydate.com" data-testid="contact-email-link" className="text-lg sm:text-xl font-bold text-[#005EA2] hover:underline">
              contact@checkpaydate.com
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 border border-slate-200 rounded-2xl bg-white">
        <h2 className="text-xl font-headings font-bold text-slate-900">Need official help?</h2>
        <p className="mt-2">For questions about your actual benefits or deposits, contact the Social Security Administration:</p>
        <ul className="list-disc pl-5 mt-3 space-y-1">
          <li>
            Website:{" "}
            <a href="https://www.ssa.gov" target="_blank" rel="noopener noreferrer" className="text-[#005EA2] font-semibold hover:underline">ssa.gov</a>
          </li>
          <li>Phone: 1-800-772-1213 (TTY 1-800-325-0778), Mon–Fri, 8:00 AM–7:00 PM local time</li>
        </ul>
      </div>
    </LegalLayout>
  );
}
