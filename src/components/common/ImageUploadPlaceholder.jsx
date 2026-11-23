/**
 * IMAGE UPLOAD PLACEHOLDER (FRONTEND PREVIEW ONLY)
 * --------------------------------------------------------------------------
 * Allows users, staff, and admin to pick local image files and preview
 * thumbnails inside the browser before backend cloud storage is connected.
 *
 * IMPORTANT:
 * Files selected here are NOT uploaded to any server or database yet.
 * Replace `uploadService.previewFile()` calls with signed cloud uploads
 * when connecting your backend.
 */

import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { previewFile } from '../../services/uploadService.js';

export default function ImageUploadPlaceholder({
  label = 'Attach Photos (Demo Preview Only)',
  multiple = true,
  files = [],
  onChange,
  helperText = 'JPG, PNG, or WebP up to 5MB. Preview stays in your browser until backend storage is connected.',
}) {
  const [error, setError] = useState('');

  const handleSelect = (e) => {
    setError('');
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const nextItems = [];
    for (const file of selected) {
      const result = previewFile(file);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      nextItems.push({
        name: result.fileName,
        url: result.previewUrl,
        size: result.fileSize,
      });
    }

    onChange(multiple ? [...files, ...nextItems] : nextItems.slice(0, 1));
    e.target.value = '';
  };

  const removeFile = (index) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <span className="rehoyah-label">{label}</span>
      <label className="mt-1 flex flex-col items-center justify-center gap-2 p-5 border border-dashed border-[#CED4DA] rounded-md bg-[#F8F9FA] hover:border-[#0B2545] cursor-pointer text-center transition-colors">
        <ImagePlus className="w-5 h-5 text-[#0B2545]" aria-hidden="true" />
        <span className="text-sm font-medium text-[#0B2545]">
          Select image{multiple ? 's' : ''} for local preview
        </span>
        <span className="text-xs text-[#6B7280]">{helperText}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleSelect}
          className="sr-only"
        />
      </label>

      {error && (
        <p className="mt-1.5 text-xs text-[#B91C1C]" role="alert">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {files.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="relative border border-[#DEE2E6] rounded overflow-hidden bg-white"
            >
              <img
                src={item.url}
                alt={`Local preview of ${item.name}`}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(idx)}
                aria-label={`Remove ${item.name}`}
                className="absolute top-1 right-1 p-1 rounded bg-[#0B2545]/80 text-white hover:bg-[#0B2545]"
              >
                <X className="w-3 h-3" />
              </button>
              <p className="px-2 py-1 text-[11px] text-[#4B5563] truncate">{item.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
