import { NextResponse } from "next/server";

/**
 * POST /api/suggest-term
 *
 * Receives a glossary term suggestion from the public form and emails it to
 * admin@thenewbuilder.ai via the brain-inbox /api/send-email endpoint
 * (Gmail SMTP under the hood).
 *
 * Body: { term: string, context?: string }
 *
 * Idea #2 (May 2026). Wires to existing brain-inbox infrastructure rather than
 * standing up a new mail/Slack integration. If admin@thenewbuilder.ai stops
 * working, fallback is to flip the recipient to brhnyc1970@gmail.com (To) +
 * nico@humbleconviction.com (CC).
 */

// Fallback wiring (May 2 2026): admin@thenewbuilder.ai didn't deliver during initial test,
// presumably because no mailbox/forwarding is set up on the .ai domain yet. Sending direct
// to Brian's gmail with Nico CC'd, matching the Notification Routing Rules in the master
// handoff. If admin@thenewbuilder.ai gets configured later, flip RECIPIENT back.
const RECIPIENT = "brhnyc1970@gmail.com";
const RECIPIENT_CC = "nico@humbleconviction.com";
const SEND_EMAIL_ENDPOINT = "https://brain-inbox-six.vercel.app/api/send-email";

// Allow up to ~500 chars of context — reasonable submission size, prevents abuse.
const MAX_TERM_LENGTH = 120;
const MAX_CONTEXT_LENGTH = 1000;

interface Body {
  term?: string;
  context?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const term = String(body.term || "").trim().slice(0, MAX_TERM_LENGTH);
  const context = String(body.context || "").trim().slice(0, MAX_CONTEXT_LENGTH);

  if (!term) {
    return NextResponse.json({ ok: false, error: "Term is required" }, { status: 400 });
  }

  // Plain-text email body. Lines deliberately short so it reads cleanly in any
  // mail client and is filterable via the subject prefix.
  const lines = [`Term: ${term}`];
  if (context) {
    lines.push("");
    lines.push(`Context: ${context}`);
  }
  lines.push("");
  lines.push("—");
  lines.push("");
  lines.push(`To add: tell Claude in any session, "add ${term} to glossary".`);
  lines.push("Goes through scripts/manual-terms.txt → committed → next weekly cron picks it up.");
  lines.push("");
  lines.push(`Submitted from thenewbuilder.ai/glossary`);
  const emailBody = lines.join("\n");

  const subject = `TNB Glossary suggestion: ${term}`;

  // Optional secret if SEND_EMAIL_SECRET is configured on either side.
  const secret = process.env.SEND_EMAIL_SECRET;

  try {
    const res = await fetch(SEND_EMAIL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: RECIPIENT,
        cc: RECIPIENT_CC,
        subject,
        body: emailBody,
        ...(secret ? { secret } : {}),
      }),
    });

    if (!res.ok) {
      let detail = "";
      try {
        const data = await res.json();
        detail = data?.error || JSON.stringify(data);
      } catch {
        detail = `${res.status} ${res.statusText}`;
      }
      console.error("[suggest-term] send-email upstream error:", detail);
      return NextResponse.json({ ok: false, error: "Could not deliver suggestion" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[suggest-term] fetch failed:", msg);
    return NextResponse.json({ ok: false, error: "Network error" }, { status: 500 });
  }
}
