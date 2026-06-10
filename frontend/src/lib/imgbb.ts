// Uploads an image file to ImgBB and returns a hosted image URL.
// The upload key is read from env (see .env.example).
const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY ?? "";

// ImgBB free tier accepts images up to 32 MB.
export const IMGBB_MAX_BYTES = 32 * 1024 * 1024;

interface ImgbbResponse {
  success?: boolean;
  data?: { url?: string; display_url?: string };
  error?: { message?: string };
}

// Read a File as a bare base64 string (without the data: URI prefix), which is
// the form ImgBB's upload endpoint reliably accepts from the browser.
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadToImgbb(file: File): Promise<string> {
  const base64 = await fileToBase64(file);

  const form = new FormData();
  form.append("image", base64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });

  const json: ImgbbResponse = await res.json().catch(() => ({}) as ImgbbResponse);

  if (!res.ok || !json?.success) {
    throw new Error(json?.error?.message || `ImgBB upload failed (${res.status})`);
  }

  const url = json?.data?.url || json?.data?.display_url;
  if (!url) throw new Error("ImgBB upload returned no URL");

  return url;
}
