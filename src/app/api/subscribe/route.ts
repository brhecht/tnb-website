import { NextResponse } from "next/server";

/**
 * Beehiiv subscribe proxy — keeps API key server-side.
 * Env vars required: BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID
 */
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      console.error("Beehiiv not configured — missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const body: Record<string, unknown> = {
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: "newbuilder-homepage",
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

    const data = await beehiivRes.json();

    if (!beehiivRes.ok) {
      console.error("Beehiiv error:", data);
      return NextResponse.json({ error: "Subscription failed" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
