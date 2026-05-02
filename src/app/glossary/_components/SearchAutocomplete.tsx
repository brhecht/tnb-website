"use client";

/**
 * Search input with autocomplete dropdown for navigating to glossary term pages.
 *
 * Distinct from the GlossaryControls search (which filters cards in place).
 * This one shows a dropdown of matches and navigates to the term page on click.
 *
 * Used in: per-term page article-controls row (Idea #1, May 2026).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface MinimalTerm {
  slug: string;
  term: string;
  type: string;
  aliases: string[];
}

interface Props {
  terms: MinimalTerm[];
  placeholder?: string;
  widthPx?: number;
}

const SEARCH_ICON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      width: 13,
      height: 13,
      position: "absolute",
      left: 9,
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      pointerEvents: "none",
    }}
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16.65" y2="16.65" />
  </svg>
);

export default function SearchAutocomplete({
  terms,
  placeholder = "Search terms...",
  widthPx = 240,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return terms
      .filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.aliases.some((a) => a.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [query, terms]);

  // Reset active index when matches change.
  useEffect(() => {
    setActiveIdx(0);
  }, [matches.length, query]);

  // Close dropdown when clicking outside.
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || matches.length === 0) {
      if (e.key === "Escape") {
        (e.target as HTMLInputElement).blur();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = matches[activeIdx];
      if (target) {
        setOpen(false);
        setQuery("");
        router.push(`/glossary/${target.slug}`);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: widthPx, maxWidth: "100%", flexShrink: 0 }}>
      {SEARCH_ICON}
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
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
      {open && matches.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "0.5px solid #d1d5db",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {matches.map((m, i) => (
            <a
              key={m.slug}
              href={`/glossary/${m.slug}`}
              onMouseDown={(e) => {
                // Prevent input blur firing before click registers
                e.preventDefault();
                setOpen(false);
                setQuery("");
                router.push(`/glossary/${m.slug}`);
              }}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                padding: "7px 12px",
                fontSize: 12.5,
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
                background: i === activeIdx ? "#fafafa" : "#fff",
                color: "#000",
                textDecoration: "none",
              }}
            >
              <span>{m.term}</span>
              <span
                style={{
                  fontSize: 9,
                  padding: "2px 5px",
                  borderRadius: 3,
                  background: "#f3f4f6",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {m.type}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
