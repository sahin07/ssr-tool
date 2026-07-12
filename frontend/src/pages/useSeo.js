import { useEffect } from "react";

// Per-page SEO: title, description, canonical, OG/Twitter, and JSON-LD.
// Snapshots any tag it changes and restores it on unmount so client-side
// navigation back to the homepage does not leave stale meta values.
// Works client-side now and is picked up by react-snap prerender later.
export function useSeo({ title, description, canonical, jsonLd }) {
  useEffect(() => {
    const prevTitle = document.title;
    const restores = [];

    const setMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      restores.push({ el, prev: created ? null : el.getAttribute("content"), created });
      el.setAttribute("content", content);
    };

    if (title) {
      document.title = title;
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }

    let canonEl = null;
    let canonPrev = null;
    let canonCreated = false;
    if (canonical) {
      canonEl = document.head.querySelector('link[rel="canonical"]');
      if (!canonEl) {
        canonCreated = true;
        canonEl = document.createElement("link");
        canonEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonEl);
      } else {
        canonPrev = canonEl.getAttribute("href");
      }
      canonEl.setAttribute("href", canonical);
      setMeta("property", "og:url", canonical);
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
      restores.forEach(({ el, prev, created }) => {
        if (created) el.remove();
        else if (prev !== null) el.setAttribute("content", prev);
      });
      if (canonEl) {
        if (canonCreated) canonEl.remove();
        else if (canonPrev !== null) canonEl.setAttribute("href", canonPrev);
      }
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, canonical, JSON.stringify(jsonLd)]);
}
