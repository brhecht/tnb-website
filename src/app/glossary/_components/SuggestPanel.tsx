"use client";

/**
 * "Suggest a term" UI: pill button + inline-revealed form.
 *
 * Renders the button always; renders the form below when open. Form submits
 * to /api/suggest-term which forwards to brain-inbox/api/send-email.
 *
 * Single component — owns its open state, form input state, and submit lifecycle.
 * Parent supplies a `formContainerRef` if it wants the form rendered into a specific
 * DOM location below the controls row. Otherwise the form renders directly under the
 * button (default).
 *
 * Idea #2 (May 2026).
 */

import { useState } from "react";

interface Props {
  /** When true, the form renders inline beneath the button. When false, returns just the button. */
  inlineForm?: boolean;
}

type SubmitState = "idle" | "sending" | "success" | "error";

export default function SuggestPanel({ inlineForm = true }: Props) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [context, setContext] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function reset() {
    setTerm("");
    setContext("");
    setState("idle");
    setErrorMsg("");
  }

  function handleClose() {
    setOpen(false);
    reset();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!term.trim()) return;
    setState("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/suggest-term", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: term.trim(),
          context: context.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setState("success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      setState("error");
    }
  }

  const button = (
    <span
      role="button"
      tabIndex={0}
      onClick={() => {
        if (open) handleClose();
        else setOpen(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (open) handleClose();
          else setOpen(true);
        }
      }}
      className="g-suggest-btn"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11,
        padding: "4px 10px",
        border: "0.5px solid #d1d5db",
        borderRadius: 14,
        cursor: "pointer",
        background: "#fff",
        color: "#6b7280",
        fontFamily: "inherit",
        lineHeight: 1.4,
        height: 26,
        userSelect: "none",
        flexShrink: 0,
        boxSizing: "border-box",
      }}
    >
      <span style={{ fontWeight: 500, fontSize: 13, lineHeight: 1 }}>+</span>
      <span>Suggest a term</span>
    </span>
  );

  if (!inlineForm || !open) {
    return (
      <>
        {button}
        <style>{`
          .g-suggest-btn:hover { border-color: #9ca3af !important; color: #000 !important; }
        `}</style>
      </>
    );
  }

  return (
    <>
      {button}
      <div
        style={{
          margin: "14px 0 0",
          padding: "14px 16px",
          background: "#fafafa",
          border: "0.5px solid #e5e7eb",
          borderRadius: 8,
          flexBasis: "100%",
        }}
      >
        {state === "success" ? (
          <div>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, fontWeight: 500 }}>
              Thanks
            </div>
            <p style={{ fontSize: 13, color: "#1f2937", lineHeight: 1.55, margin: 0 }}>
              Suggestion sent. If approved, the term will appear in the glossary on the next weekly update.
            </p>
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                onClick={handleClose}
                style={{ fontSize: 11, color: "#fff", background: "#000", border: "0.5px solid #000", borderRadius: 5, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit", lineHeight: 1.5, height: 26, boxSizing: "border-box" }}
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, fontWeight: 500 }}>
              Suggest a term
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 8 }}>
              <div style={{ flex: "0 0 240px", minWidth: 200 }}>
                <label style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3, display: "block" }}>
                  Term
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g. Notebook LM"
                  required
                  autoFocus
                  disabled={state === "sending"}
                  className="g-suggest-input"
                  style={{ width: "100%", padding: "4px 9px", border: "0.5px solid #d1d5db", borderRadius: 5, fontSize: 12.5, fontFamily: "inherit", color: "#000", background: "#fff", outline: "none", lineHeight: 1.5, height: 26, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ flex: "1 1 auto", minWidth: 200 }}>
                <label style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3, display: "block" }}>
                  Why? (optional)
                </label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Where you saw it / why it matters"
                  disabled={state === "sending"}
                  className="g-suggest-input"
                  style={{ width: "100%", padding: "4px 9px", border: "0.5px solid #d1d5db", borderRadius: 5, fontSize: 12.5, fontFamily: "inherit", color: "#000", background: "#fff", outline: "none", lineHeight: 1.5, height: 26, boxSizing: "border-box" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={!term.trim() || state === "sending"}
                style={{
                  fontSize: 11,
                  color: "#fff",
                  background: !term.trim() || state === "sending" ? "#9ca3af" : "#000",
                  border: "0.5px solid",
                  borderColor: !term.trim() || state === "sending" ? "#9ca3af" : "#000",
                  borderRadius: 5,
                  padding: "4px 12px",
                  cursor: !term.trim() || state === "sending" ? "default" : "pointer",
                  fontFamily: "inherit",
                  lineHeight: 1.5,
                  height: 26,
                  boxSizing: "border-box",
                }}
              >
                {state === "sending" ? "Sending..." : "Send →"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={state === "sending"}
                style={{ fontSize: 11, color: "#6b7280", cursor: "pointer", padding: "4px 10px", background: "none", border: "none", fontFamily: "inherit" }}
              >
                Cancel
              </button>
              <span style={{ fontSize: 10.5, color: "#9ca3af", marginLeft: "auto" }}>
                Goes to Brian + Nico. Reviewed and added if approved.
              </span>
            </div>
            {state === "error" && (
              <p style={{ fontSize: 11.5, color: "#b91c1c", marginTop: 8 }}>
                Couldn&apos;t send: {errorMsg}. Try again, or paste the term to Brian directly.
              </p>
            )}
          </form>
        )}
      </div>
      <style>{`
        .g-suggest-btn:hover { border-color: #9ca3af !important; color: #000 !important; }
        .g-suggest-input:focus { border-color: #6b7280 !important; }
      `}</style>
    </>
  );
}
