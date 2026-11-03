import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "text/markdown", "text/plain", "image/png", "image/jpeg", "image/webp", "image/gif"]);

function extensionFor(file: File) {
  const extension = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "");
  if (extension) return extension;
  if (file.type === "application/pdf") return ".pdf";
  if (file.type === "image/png") return ".png";
  if (file.type === "image/webp") return ".webp";
  if (file.type === "image/gif") return ".gif";
  if (file.type === "text/markdown" || file.type === "text/plain") return ".md";
  return ".jpg";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const kind = String(formData.get("kind") || "asset").replace(/[^a-z-]/g, "");

  if (!(file instanceof File)) return Response.json({ error: "No file received." }, { status: 400 });
  const isMarkdown = file.name.toLowerCase().endsWith(".md");
  if (!ALLOWED_TYPES.has(file.type) && !isMarkdown) return Response.json({ error: "Only PDF, MD, PNG, JPG, WEBP and GIF files are supported." }, { status: 415 });
  if (file.size > MAX_FILE_SIZE) return Response.json({ error: "File must be smaller than 15 MB." }, { status: 413 });

  const fileName = `${kind || "asset"}-${randomUUID()}${extensionFor(file)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (supabaseUrl && serviceRoleKey) {
    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "project-assets";
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) return Response.json({ error: listError.message }, { status: 500 });

    if (!buckets.some((item) => item.name === bucket)) {
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: false,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: [...ALLOWED_TYPES],
      });
      if (createError) return Response.json({ error: createError.message }, { status: 500 });
    } else {
      const { error: updateError } = await supabase.storage.updateBucket(bucket, {
        public: false,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: [...ALLOWED_TYPES],
      });
      if (updateError) return Response.json({ error: updateError.message }, { status: 500 });
    }

    const objectPath = `projects/${fileName}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, bytes, {
      contentType: isMarkdown ? "text/markdown" : file.type,
      upsert: false,
    });
    if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

    return Response.json({ url: `/api/project-assets?path=${encodeURIComponent(objectPath)}`, storage: "supabase" });
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads", "projects");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(uploadDirectory, fileName), bytes);

  return Response.json({ url: `/uploads/projects/${fileName}`, storage: "local" });
}
