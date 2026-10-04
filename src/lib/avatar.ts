import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { demoAuth, useProfile } from "@/lib/demo-auth";

/** Uploads a profile photo to the user's private folder and saves its path on the account. */
export async function uploadAvatar(file: File): Promise<string | null> {
  const uid = demoAuth.userId();
  if (!uid) return "Please log in again.";
  if (!file.type.startsWith("image/")) return "Choose a photo (JPG or PNG).";
  if (file.size > 5 * 1024 * 1024) return "Photo must be smaller than 5 MB.";
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${uid}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    contentType: file.type,
    upsert: true,
  });
  if (error) return error.message;
  const { error: e2 } = await supabase.auth.updateUser({ data: { avatar_path: path } });
  return e2 ? e2.message : null;
}

export async function removeAvatar(): Promise<string | null> {
  const { error } = await supabase.auth.updateUser({ data: { avatar_path: null } });
  return error ? error.message : null;
}

export function useAvatarUrl(): string | null {
  const p = useProfile() as { avatar_path?: string | null } | null;
  const path = p?.avatar_path ?? null;
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    if (!path) {
      setUrl(null);
      return;
    }
    void supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60 * 24)
      .then(({ data }) => {
        if (live) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      live = false;
    };
  }, [path]);
  return url;
}
