import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { AboutContentRecord } from "@/types/about-content";

const ABOUT_KEY = "about_me";

const DEFAULT_ABOUT_CONTENT = `My name is Tyler Jinsoo "진수" Kim.

I'm a freshman studying Computer Science at Cal Poly.

I'm from Southern California.

I'm currently building GTM pipelines and AI automation systems at Hemut.

I'm also developing full-stack solutions for organizations at H4I - Cal Poly.

I really enjoy expressing myself through many different mediums.`;

export async function getAboutContent() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("key, title, content, updated_at")
    .eq("key", ABOUT_KEY)
    .single();

  if (error) {
    if (error.code === "PGRST116" || error.code === "PGRST205") {
      return {
        key: ABOUT_KEY,
        title: "who i am.",
        content: DEFAULT_ABOUT_CONTENT,
        updated_at: new Date(0).toISOString(),
      } satisfies AboutContentRecord;
    }

    throw new Error(error.message);
  }

  return data as AboutContentRecord;
}

export async function upsertAboutContent(input: {
  title: string;
  content: string;
}) {
  const supabase = createSupabaseServerClient();
  const payload = {
    key: ABOUT_KEY,
    title: input.title,
    content: input.content,
  };

  const { data, error } = await supabase
    .from("site_content")
    .upsert(payload, { onConflict: "key" })
    .select("key, title, content, updated_at")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as AboutContentRecord;
}
