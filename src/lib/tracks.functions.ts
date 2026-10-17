import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Track = {
  id: string;
  title: string;
  artist: string | null;
  genre: string;
  audio_url: string;
};

function checkAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("Admin-Passwort ist serverseitig nicht konfiguriert.");
  if (input !== expected) throw new Error("Falsches Passwort.");
}

export const listTracks = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("tracks")
    .select("id, title, artist, genre, storage_path, audio_url")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const paths = rows.map((r) => r.storage_path).filter((p): p is string => !!p);
  const signed = paths.length
    ? (await supabaseAdmin.storage.from("tracks").createSignedUrls(paths, 60 * 60 * 12)).data ?? []
    : [];
  const map = new Map(signed.map((s) => [s.path, s.signedUrl]));
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    artist: r.artist,
    genre: r.genre,
    audio_url: (r.storage_path && map.get(r.storage_path)) || r.audio_url,
  })) as Track[];
});

export const createTrackUpload = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ password: z.string(), filename: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    checkAdminPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ext = (data.filename.split(".").pop() || "mp3").replace(/[^a-z0-9]/gi, "").slice(0, 5);
    const path = `${crypto.randomUUID()}.${ext}`;
    const { data: up, error } = await supabaseAdmin.storage
      .from("tracks")
      .createSignedUploadUrl(path);
    if (error || !up) throw new Error(error?.message ?? "Upload fehlgeschlagen.");
    return { path, token: up.token };
  });

export const addTrack = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        password: z.string(),
        title: z.string().min(1).max(200),
        artist: z.string().max(200).optional().nullable(),
        genre: z.string().min(1).max(60),
        path: z.string().min(1).max(300),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    checkAdminPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("tracks").insert({
      title: data.title.trim(),
      artist: data.artist?.trim() || null,
      genre: data.genre,
      storage_path: data.path,
      audio_url: data.path,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTrack = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ password: z.string(), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    checkAdminPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("tracks")
      .select("storage_path")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.storage_path) await supabaseAdmin.storage.from("tracks").remove([row.storage_path]);
    const { error } = await supabaseAdmin.from("tracks").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
