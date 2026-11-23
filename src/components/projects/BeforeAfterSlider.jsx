/**
 * INTERACTIVE BEFORE / AFTER COMPARISON SLIDER
 * --------------------------------------------------------------------------
 * Supports mouse drag, touch drag, and keyboard Left/Right arrow keys for
 * full accessibility.
 *
 * ASSET REPLACEMENT NOTE:
 * Pass real project photos via `beforeImage` and `afterImage` props once
 * uploaded in Admin > Portfolio. Current defaults use local demo SVG rooms.
 */

import { useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage = '/assets/placeholders/before-room.svg',
  afterImage = '/assets/placeholders/after-room.svg',
  beforeLabel = 'Before (Demo)',
  afterLabel = 'After (Demo)',
  caption = 'Drag or use Left/Right arrow keys to compare surface preparation vs finished room.',
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const draggingRef = useRef(false);

  const updateFromClientX = (clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(5, Math.min(95, Math.round(pct))));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(5, p - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(95, p + 5));
    }
  };

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] rounded-md overflow-hidden border border-[#DEE2E6] select-none bg-[#E9ECEF] touch-pan-y"
        onPointerDown={(e) => {
          draggingRef.current = true;
          updateFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) updateFromClientX(e.clientX);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
        }}
        onPointerLeave={() => {
          draggingRef.current = false;
        }}
      >
        {/* Base After image */}
        <img
          src={afterImage}
          alt={afterLabel}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* Clipped Before image */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={beforeLabel}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded bg-[#0B2545]/85 text-white pointer-events-none">
          {beforeLabel}
        </span>
        <span className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded bg-white/95 text-[#0B2545] border border-[#DEE2E6] pointer-events-none">
          {afterLabel}
        </span>

        {/* Divider & Focusable Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#D4AF37]"
          style={{ left: `${position}%` }}
        >
          <button
            type="button"
            role="slider"
            aria-label="Before and after comparison position"
            aria-valuemin={5}
            aria-valuemax={95}
            aria-valuenow={position}
            onKeyDown={handleKeyDown}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0B2545] text-[#D4AF37] border-2 border-[#D4AF37] shadow-md flex items-center justify-center cursor-ew-resize"
          >
            <MoveHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-xs text-[#6B7280]">{caption}</p>
    </div>
  );
}
