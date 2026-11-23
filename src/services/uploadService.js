/**
 * FILE & IMAGE UPLOAD SERVICE (DEMO PLACEHOLDER)
 * --------------------------------------------------------------------------
 * Creates safe browser-local object URLs so users can preview selected
 * images in Quote Request, Staff Product Drafts, and Admin Portfolio forms.
 *
 * IMPORTANT:
 * Nothing is uploaded to permanent storage in demo mode.
 *
 * TODO (BACKEND INTEGRATION):
 * - Connect to a secure object storage provider (S3, Cloudflare R2, Supabase
 *   Storage, or Firebase Storage) via signed upload URLs issued by your backend.
 * - Validate MIME type (JPEG/PNG/WebP), file size limit (e.g. <= 5MB), and
 *   scan/strip EXIF metadata server-side.
 * - Enforce authentication & role authorization before generating upload URLs.
 */

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB preview limit

export function previewFile(file) {
  if (!file) {
    return { ok: false, error: 'No file selected.' };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      ok: false,
      error: 'Unsupported file type. Please choose a JPG, PNG, or WebP image.',
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: 'Image must be 5MB or smaller.' };
  }

  return {
    ok: true,
    previewUrl: URL.createObjectURL(file),
    fileName: file.name,
    fileSize: file.size,
    isDemoPreviewOnly: true,
  };
}

export async function uploadImage(file) {
  // TODO: Replace this demo stub with real signed-URL upload to cloud storage
  const preview = previewFile(file);
  if (!preview.ok) return preview;

  return {
    ok: true,
    isDemo: true,
    url: preview.previewUrl,
    message:
      'Demo preview only: file is visible in this browser session and has not been uploaded to permanent server storage.',
  };
}
