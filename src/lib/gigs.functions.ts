import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const ADMIN_PASSWORD = "23699.DJ_Palmeweb";

export type Gig = {
  id: string;
  date: string;
  venue: string;
  city: string;
  time: string | null;
  address: string | null;
  description: string | null;
  location_info: string | null;
  location_link: string | null;
  image_url: string | null;
  status: "upcoming" | "past";
};

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}

export const listGigs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("gigs")
    .select("id, date, venue, city, time, address, description, location_info, location_link, image_url, status")
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Gig[];
});

const addSchema = z.object({
  password: z.string(),
  date: z.string().min(1),
  venue: z.string().min(1).max(200),
  city: z.string().min(1).max(120),
  time: z.string().max(20).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  location_info: z.string().max(1000).optional().nullable(),
  location_link: z.string().url().max(500).optional().nullable().or(z.literal("")),
  image_url: z.string().url().max(1000).optional().nullable().or(z.literal("")),
  status: z.enum(["upcoming", "past"]).default("upcoming"),
});

export const addGig = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => addSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) {
      throw new Error("Falsches Passwort.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const emptyToNull = (v: string | null | undefined) =>
      v && v.trim().length > 0 ? v.trim() : null;
    const { data: row, error } = await supabaseAdmin
      .from("gigs")
      .insert({
        date: data.date,
        venue: data.venue,
        city: data.city,
        time: emptyToNull(data.time ?? null),
        address: emptyToNull(data.address ?? null),
        description: emptyToNull(data.description ?? null),
        location_info: emptyToNull(data.location_info ?? null),
        location_link: emptyToNull(data.location_link ?? null),
        image_url: emptyToNull(data.image_url ?? null),
        status: data.status,
      })
      .select("id, date, venue, city, time, address, description, location_info, location_link, image_url, status")
      .single();
    if (error) throw new Error(error.message);
    return row as Gig;
  });

const deleteSchema = z.object({
  password: z.string(),
  id: z.string().uuid(),
});

export const deleteGig = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => deleteSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) {
      throw new Error("Falsches Passwort.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("gigs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });