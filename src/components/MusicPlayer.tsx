import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pause, Play, SkipBack, SkipForward, Trash2, Upload, Music2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  addTrack,
  createTrackUpload,
  deleteTrack,
  listTracks,
  type Track,
} from "@/lib/tracks.functions";

export const TRACK_GENRES = ["Uptempo", "Hardtechno", "Techno", "EDM", "Club", "Party"];

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function MusicPlayerBar() {
  const { data: tracks = [] } = useQuery({ queryKey: ["tracks"], queryFn: () => listTracks() });
  const [genre, setGenre] = useState<string>("Alle");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const genres = useMemo(
    () => ["Alle", ...Array.from(new Set(tracks.map((t) => t.genre)))],
    [tracks],
  );
  const list = genre === "Alle" ? tracks : tracks.filter((t) => t.genre === genre);
  const current: Track | undefined = list[index] ?? list[0];

  useEffect(() => {
    setIndex(0);
  }, [genre]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing, current?.id]);

  if (tracks.length === 0) return null;

  const go = (d: number) => {
    if (!list.length) return;
    setIndex((i) => (i + d + list.length) % list.length);
    setPlaying(true);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      {current && (
        <audio
          ref={audioRef}
          src={current.audio_url}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => go(1)}
        />
      )}
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
        <div className="flex items-center gap-3 sm:w-64">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/20 text-primary glow-indigo">
            <Music2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-foreground">
              {current?.title ?? "Keine Tracks"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {current ? `${current.artist || "DJ_Palme"} · ${current.genre}` : "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <button type="button" aria-label="Zurück" onClick={() => go(-1)} className="btn-fx rounded-full p-2 text-muted-foreground hover:text-foreground">
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Abspielen"}
            onClick={() => setPlaying((p) => !p)}
            className="btn-fx rounded-full bg-primary p-3 text-primary-foreground"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button type="button" aria-label="Weiter" onClick={() => go(1)} className="btn-fx rounded-full p-2 text-muted-foreground hover:text-foreground">
            <SkipForward className="h-4 w-4" />
          </button>
          <span className="hidden w-10 text-right font-display text-xs text-muted-foreground sm:block">{fmt(time)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (audioRef.current) audioRef.current.currentTime = v;
              setTime(v);
            }}
            className="flex-1 accent-primary"
            aria-label="Position"
          />
          <span className="hidden w-10 font-display text-xs text-muted-foreground sm:block">{fmt(duration)}</span>
        </div>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          aria-label="Genre"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
        >
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function TracksAdmin({ password }: { password: string }) {
  const qc = useQueryClient();
  const { data: tracks = [] } = useQuery({ queryKey: ["tracks"], queryFn: () => listTracks() });
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [genre, setGenre] = useState(TRACK_GENRES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const upload = useMutation({
    mutationFn: async () => {
      if (!file || !title.trim()) throw new Error("Titel und Audiodatei sind Pflicht.");
      const { path, token } = await createTrackUpload({ data: { password, filename: file.name } });
      const { error } = await supabase.storage.from("tracks").uploadToSignedUrl(path, token, file, {
        contentType: file.type || "audio/mpeg",
      });
      if (error) throw new Error(error.message);
      await addTrack({ data: { password, title, artist, genre, path } });
    },
    onSuccess: () => {
      setTitle("");
      setArtist("");
      setFile(null);
      setErr(null);
      qc.invalidateQueries({ queryKey: ["tracks"] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteTrack({ data: { password, id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tracks"] }),
    onError: (e: Error) => setErr(e.message),
  });

  const inputCls =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background/40 p-4">
      <h3 className="font-display text-lg font-bold text-foreground">Hörproben</h3>
      <div className="grid gap-2 sm:grid-cols-2">
        <input className={inputCls} placeholder="Songtitel *" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className={inputCls} placeholder="Artist (optional)" value={artist} onChange={(e) => setArtist(e.target.value)} />
        <select className={inputCls} value={genre} onChange={(e) => setGenre(e.target.value)}>
          {TRACK_GENRES.map((g) => <option key={g}>{g}</option>)}
        </select>
        <input
          className={inputCls}
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <button
        type="button"
        disabled={upload.isPending}
        onClick={() => upload.mutate()}
        className="btn-fx flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        <Upload className="h-4 w-4" />
        {upload.isPending ? "Lädt hoch…" : "Track hochladen"}
      </button>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <ul className="space-y-1">
        {tracks.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
            <span className="truncate text-foreground">
              {t.title} <span className="text-muted-foreground">· {t.genre}</span>
            </span>
            <button type="button" aria-label="Löschen" onClick={() => del.mutate(t.id)} className="btn-fx rounded p-1 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
