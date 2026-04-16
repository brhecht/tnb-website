import { NextResponse } from "next/server";

/**
 * Subscribe endpoint — tries Beehiiv first, falls back to a generic webhook.
 *
 * Env vars:
 *   BEEHIIV_API_KEY + BEEHIIV_PUBLICATION_ID  → sends to Beehiiv
 *   SUBSCRIBERS_WEBHOOK_URL                   → fallback (Google Sheets, n8n, etc.)
 *
 * Google Sheets setup (Apps Script):
 *   1. Create a Sheet with columns: Timestamp | Email | Name | Source
 *   2. Extensions → Apps Script → paste:
 *      function doPost(e) {
 *        const d = JSON.parse(e.postData.contents);
 *        SpreadsheetApp.getActiveSheet().appendRow([d.timestamp, d.email, d.name, d.source]);
 *        return ContentService.createTextOutput("ok");
 *      }
 *   3. Deploy → New deployment → Web app → Execute as: Me → Anyone
 *   4. Copy the URL → add as SUBSCRIBERS_WEBHOOK_URL in Vercel env vars
 */
export async function POST(request: Request) {
  try {
    const { email, name, source } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    // --- Beehiiv path ---
    if (apiKey && publicationId) {
      const body: Record<string, unknown> = {
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: source ?? "newbuilder-homepage",
      };
      if (name) {
        body.custom_fields = [{ name: "First Name", value: name }];
      }

      const beehiivRes = await fetch(
        `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!beehiivRes.ok) {
        const data = await beehiivRes.json();
        console.error("Beehiiv error:", data);
        return NextResponse.json({ error: "Subscription failed" }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    // --- Webhook fallback (Google Sheets, n8n, etc.) ---
    const webhookUrl = process.env.SUBSCRIBERS_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          redirect: "follow",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            email,
            name: name ?? "",
            source: source ?? "newbuilder-homepage",
          }),
        });
        console.log(`[subscribe] saved via webhook: ${email}`);
      } catch (webhookErr) {
        // Webhook failure doesn't block the user — log and continue
        console.error("[subscribe] webhook error (non-blocking):", webhookErr);
      }
      return NextResponse.json({ success: true });
    }

    // --- Neither configured: log and still return success ---
    console.warn(`[subscribe] no destination configured — submission: ${email} | ${name ?? ""}`);
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[subscribe] unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
