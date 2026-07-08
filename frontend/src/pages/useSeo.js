import { useEffect } from "react";

const HOME_CANONICAL = "https://checkpaydate.com/";

const upsertMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

// Per-page SEO: title, description, canonical, OG/Twitter, and JSON-LD.
// Works client-side now and is picked up by react-snap prerender later.
export function useSeo({ title, description, canonical, jsonLd }) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) {
      document.title = title;
      upsertMeta("property", "og:title", title);
      upsertMeta("name", "twitter:title", title);
    }
    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
      upsertMeta("name", "twitter:description", description);
    }
    let canonEl = document.head.querySelector('link[rel="canonical"]');
    if (canonical) {
      if (!canonEl) {
        canonEl = document.createElement("link");
        canonEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonEl);
      }
      canonEl.setAttribute("href", canonical);
      upsertMeta("property", "og:url", canonical);
    }

    const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    const scripts = blocks.map((obj) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-page-seo", "true");
      s.text = JSON.stringify(obj);
      document.head.appendChild(s);
      return s;
    });

    return () => {
      document.title = prevTitle;
      scripts.forEach((s) => s.remove());
      if (canonEl) canonEl.setAttribute("href", HOME_CANONICAL);
    };
  }, [title, description, canonical, JSON.stringify(jsonLd)]);
}
