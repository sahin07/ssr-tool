# CheckPayDate.com — Product & Context Doc

## 1. Original Problem Statement
Build a clean, modern, mobile-first, one-page **Social Security Payment Date Checker** for older adults (50+). Trustworthy, government-inspired aesthetic (blue/white/gray), large readable typography, generous spacing, rounded cards, high-contrast WCAG-friendly accessibility. Premium SaaS-quality design (Stripe/Linear/Notion/gov-portal inspired). Sections: hero, calculator card, result card (next date + countdown + explanation), upcoming payments table, action buttons (Add to Calendar, Download, Copy, Print, Share), "how it works" info cards, FAQ accordion, disclaimer + official resource section, sticky nav.

Domain: **CheckPayDate.com**

## 2. User Persona
- Primary: Social Security beneficiaries aged 50+ (retirement, SSDI, survivors, SSI, pre-1997 claimants).
- Needs: know exactly when the next benefit lands, plan budgets, set reminders, print/share schedules. Low tech tolerance → clarity, large text, high contrast.

## 3. Positioning (strict)
- Public **scheduling estimate** tool. NOT affiliated with SSA. NOT a people-search / background-check.
- No SSN, no account, no bank data collected. Only day-of-birth used for calculation.

## 4. Tech Stack (LOCKED — do not migrate)
- Frontend: **React 19** (Create React App via craco), TailwindCSS, Shadcn UI, lucide-react, sonner, react-router-dom v7.
- Backend: **FastAPI** (Python), Motor/MongoDB (logs calculation counts only).
- Decision: **Stay on React**. No Next.js migration. SEO via build-time static pre-rendering (react-snap) — DEFERRED to post-launch.

## 5. Payment Rules Implemented (SSA)
- **Standard** (post-May-1997 retirement/SSDI/survivors): Wednesday by birth day → 1–10 = 2nd Wed, 11–20 = 3rd Wed, 21–31 = 4th Wed.
- **SSI**: 1st of month.
- **Pre-1997** (claims before May 1997 / dual eligibility): 3rd of month.
- All: if date is weekend/federal holiday → move to prior business day. Federal holidays computed in backend for prev/current/next year.

## 6. Architecture / Key Files
```
/app/backend/server.py            # FastAPI: /api/calculate, /api/stats, date logic
/app/backend/tests/test_payment_checker.py
/app/frontend/src/App.js          # Homepage (tool) — hero, calculator, result, table, FAQ, disclaimer, footer
/app/frontend/src/App.css         # print styles (.no-print, .print-only, .print-header, .print-card)
/app/frontend/src/index.js        # BrowserRouter + routes
/app/frontend/src/pages/LegalLayout.jsx    # shared header/footer for legal pages
/app/frontend/src/pages/PrivacyPolicy.jsx  # /privacy-policy
/app/frontend/src/pages/Terms.jsx          # /terms-and-conditions
/app/frontend/src/pages/Contact.jsx        # /contact
/app/frontend/public/index.html   # SEO meta + JSON-LD (WebApplication, Organization, FAQPage)
```

### API Endpoints
- `POST /api/calculate` — body `{ birth_date: "YYYY-MM-DD", benefit_type: "standard"|"ssi"|"pre_1997" }` → next date, formatted date, countdown, explanation, benefit_name, 12-month schedule, stats_checked.
- `GET /api/stats` — total checks (baseline 142428 + db count).

### Routes (client-side)
- `/` tool homepage
- `/privacy-policy`, `/terms-and-conditions`, `/contact`

## 7. Features Implemented (chronological)
1. Core SSA date calculator (3 benefit types) + backend logic + 12 pytest cases (all pass).
2. Full responsive UI: hero, calculator card, live result card w/ countdown, 12-month schedule table, "how it works" cards, FAQ accordion, disclaimer + official SSA resources, footer.
3. Copy alignment: title "Social Security Payment Date Checker", subtitle "See when your benefit is scheduled — based on official SSA payment rules.", disclaimer "Schedule estimate only. Not affiliated with SSA...".
4. Benefit-type UX: birthday field shown/required for Standard only; hidden for SSI & Pre-1997 with contextual info notes (1st / 3rd of month). data-testids: ssi-info-note, pre-1997-info-note.
5. Hero image swapped to clean literal calendar+coin illustration (senior-friendly).
6. Header simplified: removed Larger Text / High Contrast toggle buttons; **high-contrast style ON by default**. Branding = CheckPayDate.com.
7. Action buttons (client-side, no backend):
   - **Add to Calendar + Reminder** → .ics with a `VALARM TRIGGER:-P2D` (2-day-before alert) on every event. Reminder delivered by user's own calendar app.
   - Download CSV, Copy Schedule, Print Page, Share.
   - Note under buttons: "Reminders are sent by your calendar app (Google, Apple, or Outlook), not by CheckPayDate."
8. Shareable/bookmarkable links: `?type=standard&day=15` (or `?type=ssi` / `?type=pre_1997`) auto-fills form and auto-calculates on load. Share button generates these links.
9. Print view: print-only header (brand + generated date); no-print classes hide UI chrome.
10. Expanded FAQ to 8 items (added: official-site clarification, no-SSN/privacy, reminder how-to).
11. Legal pages: Privacy Policy (required), Terms & Conditions, Contact (mailto contact@checkpaydate.com). Footer links added.
12. SEO: real <title>, meta description, canonical, Open Graph + Twitter tags. JSON-LD structured data: WebApplication + Organization + FAQPage (8 Qs). Verified present in served HTML.
13. Multi-country expansion (June 2026): "Payment Date Checkers" country nav (🇺🇸🇨🇦🇬🇧🇦🇺🇿🇦) in homepage + legal/country footers. Country pages with specific SEO URLs:
    - /canada/cpp-payment-dates/ and /canada/oas-payment-dates/ — 2026 monthly schedule table (identical dates). Source: canada.ca/en/services/benefits/calendar.html
    - /uk/state-pension-payment-dates/ — interactive NI-last-2-digits → payment weekday selector + table. Source: gov.uk/state-pension/when-youre-paid, nidirect
    - /australia/centrelink-payment-dates/ — descriptive (fortnightly, personalised via myGov; no fixed universal table by design for accuracy). Source: servicesaustralia.gov.au
    - /south-africa/sassa-payment-dates/ — 2026/27 grant schedule table by grant type + amounts. Source: sanews.gov.za, dsd.gov.za
    - Data lives in src/pages/countryData.js; generic renderer src/pages/CountryPage.jsx; nav src/pages/CountryNav.jsx. Each page cites official sources + disclaimer + link back to US checker.
    - US homepage remains the primary SEO target ("Social Security Payment Date Checker").

## 8. Testing Status
- iteration_1.json, iteration_2.json → backend 100% (12/12 pytest), frontend 100% (data-testid checks). All 3 benefit types verified against SSA rules incl. weekend/holiday backward-adjustment.
- No auth (stateless tool). No credentials needed.

## 9. Backlog / Next (prioritized)
- **P1 (post-launch):** Monthly SEO pages via react-snap static pre-rendering — routes like `/july-2026-social-security-payment-schedule` (static schedule table + link to checker).
- **P2:** robots.txt + sitemap.xml (quick, aids indexing).
- **P2:** Organization `logo` + BreadcrumbList schema once logo hosted / month pages exist.
- **P3:** Google Analytics wiring (privacy policy already discloses it).
- **P3:** Optional TypeScript adoption (no framework change).

## 10. Deployment Notes / Risks
- Client-side routing (BrowserRouter): production host MUST fall back to index.html for unknown paths, else deep links (e.g. /privacy-policy) 404. Verify after deploy.
- Env: frontend uses REACT_APP_BACKEND_URL; backend uses MONGO_URL + DB_NAME. All backend routes prefixed /api. Backend bind 0.0.0.0:8001, frontend 3000 (supervisor-managed).
- NOTE: current tool DOES use the FastAPI backend for calculation + stats. If a fully static/no-backend build is ever desired, calculation logic would need to be ported client-side.

## 11. Last Updated
June 2026 — v1 launch-ready (core checker, 3 benefit types, calendar+reminder, share links, print, legal pages, JSON-LD SEO).
