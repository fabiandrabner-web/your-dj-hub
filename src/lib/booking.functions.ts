import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(1).max(50),
  date: z.string().trim().min(1).max(50),
  time: z.string().trim().min(1).max(50),
  location: z.string().trim().min(1).max(200),
  eventType: z.string().trim().min(1).max(100),
  guests: z.string().trim().min(1).max(50),
  message: z.string().trim().max(2000).optional().default(""),
});

export type BookingInput = z.infer<typeof bookingSchema>;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const sendBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("E-Mail-Versand ist aktuell nicht konfiguriert.");
    }

    const rows: Array<[string, string]> = [
      ["Name", data.name],
      ["E-Mail", data.email],
      ["Telefon", data.phone],
      ["Datum", data.date],
      ["Uhrzeit", data.time],
      ["Veranstaltungsort", data.location],
      ["Art des Events", data.eventType],
      ["Gästeanzahl", data.guests],
      ["Nachricht", data.message || "—"],
    ];

    const html = `
      <div style="font-family:Arial,sans-serif;background:#0a0a1a;color:#eee;padding:24px;border-radius:12px;">
        <h2 style="color:#a5b4fc;margin-top:0;">Neue Buchungsanfrage — DJ_Palme</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${rows
            .map(
              ([k, v]) =>
                `<tr><td style="padding:6px 8px;color:#9ca3af;vertical-align:top;width:180px;">${escapeHtml(
                  k,
                )}</td><td style="padding:6px 8px;color:#f3f4f6;white-space:pre-wrap;">${escapeHtml(
                  v,
                )}</td></tr>`,
            )
            .join("")}
        </table>
      </div>
    `;

    const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "DJ_Palme Booking <onboarding@resend.dev>",
        to: ["fabian@drabner.de"],
        reply_to: data.email,
        subject: `Neue Buchungsanfrage: ${data.name} (${data.date})`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend error", res.status, body);
      throw new Error("Die Anfrage konnte nicht gesendet werden. Bitte später erneut versuchen.");
    }

    return { ok: true as const };
  });