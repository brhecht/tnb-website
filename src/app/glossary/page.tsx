import type { Metadata } from "next";
import { getAllTerms, addedLabel } from "@/lib/glossary";
import { TOPICS } from "@/types/glossary";
import GlossaryControls from "./GlossaryControls";

export const metadata: Metadata = {
  title: "Glossary — The New Builder",
  description:
    "Plain-English definitions of the terms builders are using right now. Updated weekly. AI-generated.",
  openGraph: {
    title: "Glossary — The New Builder",
    description:
      "Plain-English definitions of the terms builders are using right now. Updated weekly. AI-generated.",
    type: "website",
    url: "https://thenewbuilder.ai/glossary",
  },
};

const YT_CHANNEL = "https://www.youtube.com/@the_new_builder";
const LINKEDIN = "https://www.linkedin.com/in/brianhecht/";
const CONTACT = "mailto:brian@thenewbuilder.ai";

export default function GlossaryIndexPage() {
  const terms = getAllTerms();
  // Pre-compute "Added X" labels at build time so the client doesn't need a date library.
  const cardData = terms.map((t) => ({
    slug: t.slug,
    term: t.term,
    type: t.type,
    topic: t.topic,
    familiarity: t.familiarity,
    aliases: t.aliases,
    shortDef: t.shortDef,
    addedLabel: addedLabel(t.dateAdded),
    daysSinceAdded: Math.floor(
      (Date.now() - new Date(t.dateAdded + "T00:00:00Z").getTime()) /
        (1000 * 60 * 60 * 24),
    ),
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

        {/* Header */}
        <header style={{ marginBottom: 32, maxWidth: 720 }}>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Glossary
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#6b7280", maxWidth: 600 }}>
            Plain-English definitions of the terms builders are using right now. Updated weekly. AI-generated.
          </p>
        </header>

        <GlossaryControls terms={cardData} topics={TOPICS} />

        {terms.length === 0 && (
          <div style={{ marginTop: 48, padding: "48px 24px", textAlign: "center", color: "#9ca3af", fontSize: 15, border: "0.5px solid #e5e7eb", borderRadius: 12 }}>
            <p style={{ marginBottom: 8 }}>The glossary is being built.</p>
            <p style={{ fontSize: 13 }}>Check back shortly — the first terms are about to land.</p>
          </div>
        )}
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
