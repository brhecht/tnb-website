"use client";

/**
 * Client-side filter / search / sort controls + results grid for /glossary.
 *
 * Receives pre-computed card data from the server component (terms + addedLabel).
 * Owns: search state, active topic filter, sort order. Filtering is in-memory —
 * fine at v1 scale (~30-50 terms, growing to a few hundred).
 *
 * URL state: filters and search reflected in `?topic=...&q=...&sort=...` so
 * shareable filtered links work in newsletter / Slack pastes (D3.3).
 */

import { useEffect, useMemo, useState, useCallback } from "react";
import type { Topic, TermType } from "@/types/glossary";
import SuggestPanel from "./_components/SuggestPanel";

interface CardData {
  slug: string;
  term: string;
  type: TermType;
  topic: Topic;
  aliases: string[];
  shortDef: string;
  addedLabel: string;
  daysSinceAdded: number;
}

interface Props {
  terms: CardData[];
  topics: readonly Topic[];
}

type SortBy = "recency" | "alpha";

const SEARCH_ICON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 14, height: 14, position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16.65" y2="16.65" />
  </svg>
);

export default function GlossaryControls({ terms, topics }: Props) {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recency");

  // Hydrate from URL on mount (shareable filtered links).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get("topic");
    if (t && (topics as readonly string[]).includes(t)) setActiveTopic(t as Topic);
    const q = sp.get("q");
    if (q) setSearchQuery(q);
    const s = sp.get("sort");
    if (s === "alpha" || s === "recency") setSortBy(s);
  }, [topics]);

  // Reflect state to URL (replaceState — no history pollution on every keystroke).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams();
    if (activeTopic) sp.set("topic", activeTopic);
    if (searchQuery) sp.set("q", searchQuery);
    if (sortBy !== "recency") sp.set("sort", sortBy);
    const qs = sp.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    if (newUrl !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [activeTopic, searchQuery, sortBy]);

  const filtered = useMemo(() => {
    let out = terms;
    if (activeTopic) out = out.filter((t) => t.topic === activeTopic);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      out = out.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.aliases.some((a) => a.toLowerCase().includes(q)),
      );
    }
    const sorted = [...out];
    if (sortBy === "recency") {
      sorted.sort((a, b) => a.daysSinceAdded - b.daysSinceAdded);
    } else {
      sorted.sort((a, b) => a.term.localeCompare(b.term));
    }
    return sorted;
  }, [terms, activeTopic, searchQuery, sortBy]);

  const hasActiveFilter = activeTopic !== null || searchQuery.length > 0;
  const clearAll = useCallback(() => {
    setActiveTopic(null);
    setSearchQuery("");
  }, []);

  return (
    <div>
      {/* Controls row: search + sort + suggest. flexWrap allows the SuggestPanel form
          to wrap onto its own row below the controls when open (form has flexBasis: 100%). */}
      <div className="g-search-row" style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 280, maxWidth: "100%", flexShrink: 0 }}>
          {SEARCH_ICON}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search terms..."
            aria-label="Search glossary terms"
            style={{
              width: "100%",
              padding: "4px 10px 4px 28px",
              border: "0.5px solid #d1d5db",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "inherit",
              color: "#000",
              background: "#fff",
              outline: "none",
              lineHeight: 1.5,
              height: 26,
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, fontSize: 11.5 }}>
          <span style={{ color: "#9ca3af" }}>Sort</span>
          <button
            type="button"
            onClick={() => setSortBy("recency")}
            className="g-sort-link"
            data-active={sortBy === "recency"}
            style={{ background: "none", border: "none", padding: "2px 4px", borderRadius: 3, cursor: "pointer", fontFamily: "inherit", fontSize: 11.5, color: sortBy === "recency" ? "#000" : "#6b7280", fontWeight: sortBy === "recency" ? 600 : 400 }}
          >
            Recency
          </button>
          <span style={{ color: "#d1d5db" }}>·</span>
          <button
            type="button"
            onClick={() => setSortBy("alpha")}
            className="g-sort-link"
            data-active={sortBy === "alpha"}
            style={{ background: "none", border: "none", padding: "2px 4px", borderRadius: 3, cursor: "pointer", fontFamily: "inherit", fontSize: 11.5, color: sortBy === "alpha" ? "#000" : "#6b7280", fontWeight: sortBy === "alpha" ? 600 : 400 }}
          >
            A–Z
          </button>
        </div>
        <div style={{ flex: "1 1 0", minWidth: 0 }} />
        <SuggestPanel />
      </div>

      {/* Topic filter row */}
      <div className="g-filter-row" style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 9.5, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginRight: 4, flexShrink: 0 }}>
          Topic
        </span>
        {topics.map((t) => {
          const active = activeTopic === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTopic(active ? null : t)}
              className="g-chip"
              data-active={active}
              style={{
                fontSize: 11,
                padding: "3px 9px",
                border: "0.5px solid",
                borderColor: active ? "#000" : "#d1d5db",
                borderRadius: 12,
                cursor: "pointer",
                background: active ? "#000" : "#fff",
                color: active ? "#fff" : "#6b7280",
                whiteSpace: "nowrap",
                lineHeight: 1.4,
                userSelect: "none",
                fontFamily: "inherit",
              }}
            >
              {t}
            </button>
          );
        })}
        {hasActiveFilter && (
          <button
            type="button"
            onClick={clearAll}
            style={{ background: "none", border: "none", padding: "4px 6px", marginLeft: 6, fontSize: 11, color: "#6b7280", textDecoration: "underline", cursor: "pointer", flexShrink: 0, fontFamily: "inherit" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Results count */}
      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 16 }}>
        {filtered.length} {filtered.length === 1 ? "term" : "terms"}
      </div>

      {/* Card grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center", color: "#9ca3af", fontSize: 14, border: "0.5px solid #e5e7eb", borderRadius: 12 }}>
          <p style={{ marginBottom: 12 }}>No matches found.</p>
          <button
            type="button"
            onClick={clearAll}
            style={{ padding: "6px 14px", border: "0.5px solid #9ca3af", borderRadius: 6, cursor: "pointer", fontSize: 12, color: "#000", background: "#fff", fontFamily: "inherit" }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="g-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {filtered.map((t) => (
            <a
              key={t.slug}
              href={`/glossary/${t.slug}`}
              className="g-card"
              style={{
                border: "0.5px solid #e5e7eb",
                borderRadius: 10,
                padding: "16px 18px",
                background: "#fff",
                display: "flex",
                flexDirection: "column",
                color: "inherit",
                textDecoration: "none",
                cursor: "pointer",
                transition: "border-color 120ms ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: "#000" }}>{t.term}</div>
                <div style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, background: "#f3f4f6", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, whiteSpace: "nowrap", lineHeight: 1.4, flexShrink: 0 }}>
                  {t.type}
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.55, margin: "4px 0 12px", flex: 1 }}>
                {t.shortDef}
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>
                Added {t.addedLabel}
              </div>
              <div style={{ fontSize: 11.5, color: "#000", fontWeight: 600 }}>
                Read more →
              </div>
            </a>
          ))}
        </div>
      )}

      <style>{`
        .g-card:hover { border-color: #6b7280 !important; }
        .g-chip:hover[data-active="false"] { border-color: #9ca3af !important; color: #000 !important; }
        .g-sort-link:hover { color: #000 !important; }
        @media (max-width: 600px) {
          .g-search-row { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
          .g-search-row > div:first-child { width: 100% !important; }
          .g-filter-row { flex-wrap: nowrap !important; overflow-x: auto !important; padding-bottom: 4px !important; }
          .g-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
