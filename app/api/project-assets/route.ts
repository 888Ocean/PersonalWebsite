import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const objectPath = new URL(request.url).searchParams.get("path") || "";
  if (!objectPath.startsWith("projects/") || objectPath.includes("..")) {
    return new Response("Invalid asset path.", { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !serviceRoleKey) return new Response("Asset storage is not configured.", { status: 503 });

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "project-assets";
  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.storage.from(bucket).download(objectPath);
  if (error || !data) return new Response("Asset not found.", { status: 404 });

  return new Response(await data.arrayBuffer(), {
    headers: {
      "Content-Type": data.type || "application/octet-stream",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
