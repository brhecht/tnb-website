import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getAllSlugs,
  getAllTerms,
  getTermBySlug,
  addedLabel,
  getRelatedTerms,
} from "@/lib/glossary";
import { linkifyParagraph } from "@/lib/glossary-autolink";
import SearchAutocomplete from "../_components/SearchAutocomplete";
import SuggestPanel from "../_components/SuggestPanel";

const YT_CHANNEL = "https://www.youtube.com/@the_new_builder";
const LINKEDIN = "https://www.linkedin.com/in/brianhecht/";
const CONTACT = "mailto:brian@thenewbuilder.ai";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** SSG: pre-render every term page at build time. */
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/** Per-term metadata for clean Slack/newsletter unfurls. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) {
    return { title: "Term not found — The New Builder" };
  }
  const description = term.shortDef.length > 160
    ? term.shortDef.slice(0, 157) + "..."
    : term.shortDef;
  return {
    title: `${term.term} — The New Builder Glossary`,
    description,
    openGraph: {
      title: `${term.term} — The New Builder Glossary`,
      description,
      type: "article",
      url: `https://thenewbuilder.ai/glossary/${term.slug}`,
    },
  };
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getTermBySlug(slug);
  if (!term) notFound();

  const allTerms = getAllTerms();
  const related = getRelatedTerms(term.related);
  // Trim down to what SearchAutocomplete actually needs — keeps the client bundle lean.
  const searchTerms = allTerms.map((t) => ({
    slug: t.slug,
    term: t.term,
    type: t.type,
    aliases: t.aliases,
  }));

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, width: "100%", maxWidth: 1060, margin: "0 auto", padding: "48px 8% 64px" }}>
        {/* Nav */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 56 }}>
          <a href="/" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#000" }}>
            The New Builder
          </a>
          <div className="nav-links" style={{ display: "flex", gap: 24 }}>
            <a href="/glossary" style={{ fontSize: 14, fontWeight: 600, color: "#000" }}>
              Glossary
            </a>
            <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer" className="nav-link-muted" style={{ fontSize: 14, fontWeight: 500, color: "#9ca3af" }}>
              YouTube
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="nav-link-muted" style={{ fontSize: 14, fontWeight: 500, color: "#9ca3af" }}>
              LinkedIn
            </a>
            <a href={CONTACT} className="nav-link-muted" style={{ fontSize: 14, fontWeight: 500, color: "#9ca3af" }}>
              Contact
            </a>
          </div>
        </nav>

        {/* Article controls — section-level interactions visible from every per-term page.
            Outside the 720px article max-width so the Suggest form (when open) can use the
            full content column when revealed. flexWrap allows the form to break to its own row. */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 22, flexWrap: "wrap" }}>
          <Link
            href="/glossary"
            className="g-back-top"
            style={{ fontSize: 13, color: "#6b7280", textDecoration: "none", flexShrink: 0 }}
          >
            ← Back to glossary
          </Link>
          <SearchAutocomplete terms={searchTerms} widthPx={240} />
          <div style={{ flex: "1 1 0", minWidth: 0 }} />
          <SuggestPanel />
        </div>

        <article style={{ maxWidth: 720 }}>
          {/* Meta strip — topic is clickable, lands on /glossary filtered to that topic */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, whiteSpace: "nowrap", lineHeight: 1.4 }}>
              {term.type}
            </span>
            <span style={{ color: "#d1d5db", fontSize: 11 }}>·</span>
            <Link
              href={`/glossary?topic=${encodeURIComponent(term.topic)}`}
              className="g-topic-link"
              style={{ fontSize: 12, color: "#6b7280", textDecoration: "none" }}
            >
              {term.topic}
            </Link>
            <span style={{ color: "#d1d5db", fontSize: 11 }}>·</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>Added {addedLabel(term.dateAdded)}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 8 }}>
            {term.term}
          </h1>

          {/* Aliases */}
          {term.aliases.length > 0 && (
            <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24, fontStyle: "italic" }}>
              Also known as: {term.aliases.join(", ")}
            </p>
          )}

          {/* Short def callout */}
          <div style={{ fontSize: 16, color: "#1f2937", lineHeight: 1.6, padding: "16px 20px", background: "#fafafa", borderRadius: 8, borderLeft: "2px solid #e5e7eb", marginBottom: 28 }}>
            {term.shortDef}
          </div>

          {/* Long-form, with auto-linking */}
          <div className="g-long" style={{ fontSize: 15, color: "#1f2937", lineHeight: 1.75 }}>
            {term.longDef.map((paragraph, i) => {
              const segments = linkifyParagraph(paragraph, term.slug, allTerms);
              return (
                <p key={i} style={{ marginBottom: 16 }}>
                  {segments.map((seg, j) => {
                    if (seg.type === "link") {
                      return (
                        <Link
                          key={j}
                          href={`/glossary/${seg.slug}`}
                          className="g-inline-link"
                          style={{ color: "inherit", borderBottom: "1px dotted #9ca3af", textDecoration: "none" }}
                        >
                          {seg.value}
                        </Link>
                      );
                    }
                    return <span key={j}>{seg.value}</span>;
                  })}
                </p>
              );
            })}
          </div>

          {/* AI disclaimer */}
          <div style={{ fontSize: 12, color: "#6b7280", padding: "12px 16px", background: "#fafafa", border: "0.5px solid #e5e7eb", borderRadius: 6, marginTop: 24, lineHeight: 1.55 }}>
            This definition is AI-generated and refreshed weekly. It may contain inaccuracies. Use your own judgment, especially for production decisions.
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: 36, paddingTop: 24, borderTop: "0.5px solid #e5e7eb" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>
                Related terms
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/glossary/${r.slug}`}
                    className="g-related"
                    style={{ fontSize: 13, padding: "6px 12px", border: "0.5px solid #e5e7eb", borderRadius: 6, color: "#000", background: "#fff", textDecoration: "none" }}
                  >
                    {r.term}
                  </Link>
                ))}
              </div>
            </div>
          )}

        </article>
      </main>

      {/* Footer */}
      <footer style={{ width: "100%", borderTop: "1px solid #e5e7eb", padding: "24px 8%" }}>
        <div className="footer-inner" style={{ maxWidth: 1060, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
            &copy; 2026 The New Builder
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="/glossary" className="footer-link" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
              Glossary
            </a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
              LinkedIn
            </a>
            <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
              YouTube
            </a>
            <a href={CONTACT} className="footer-link" style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af" }}>
              Email
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        .g-inline-link:hover { color: #000 !important; border-bottom-color: #000 !important; border-bottom-style: solid !important; }
        .g-related:hover { border-color: #6b7280 !important; }
        .g-back-top:hover { color: #000 !important; }
        .g-topic-link:hover { color: #000 !important; text-decoration: underline !important; }
        .nav-link-muted:hover { color: #000 !important; }
        .footer-link:hover { color: #000 !important; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .footer-inner { flex-direction: column !important; gap: 12px !important; text-align: center !important; }
        }
        @media (max-width: 480px) {
          main { padding: 32px 6% 48px !important; }
        }
      `}</style>
    </div>
  );
}
