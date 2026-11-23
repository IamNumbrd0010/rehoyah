/**
 * TOAST FEEDBACK COMPONENT
 * --------------------------------------------------------------------------
 * Displays concise non-blocking feedback for cart, form, and dashboard actions.
 */

import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function Toast() {
  const { toast, dismissToast } = useApp();
  if (!toast) return null;

  const toneMap = {
    success: {
      cls: 'bg-[#0B2545] text-white border-[#D4AF37]',
      Icon: CheckCircle2,
    },
    warning: {
      cls: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
      Icon: AlertTriangle,
    },
    info: {
      cls: 'bg-[#0B2545] text-white border-[#153966]',
      Icon: Info,
    },
  };

  const { cls, Icon } = toneMap[toast.tone] || toneMap.info;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 max-w-sm w-[calc(100%-2rem)]"
      role="status"
      aria-live="polite"
    >
      <div className={`flex items-start gap-3 px-4 py-3 rounded-md border shadow-lg ${cls}`}>
        <Icon className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-sm flex-1">{toast.message}</p>
        <button
          type="button"
          onClick={dismissToast}
          aria-label="Dismiss message"
          className="opacity-80 hover:opacity-100 p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
