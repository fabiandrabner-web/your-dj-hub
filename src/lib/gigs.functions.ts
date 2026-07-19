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
    .select("id, date, venue, city")
    .order("date", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Gig[];
});

const addSchema = z.object({
  password: z.string(),
  date: z.string().min(1),
  venue: z.string().min(1).max(200),
  city: z.string().min(1).max(120),
});

export const addGig = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => addSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.password !== ADMIN_PASSWORD) {
      throw new Error("Falsches Passwort.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("gigs")
      .insert({ date: data.date, venue: data.venue, city: data.city })
      .select("id, date, venue, city")
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