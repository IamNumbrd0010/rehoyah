/**
 * STATUS BADGE COMPONENT
 * --------------------------------------------------------------------------
 * Pairs explicit text labels and accessible icons with restrained semantic tints.
 * Never relies on color alone to communicate status.
 */

import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

function resolveTone(statusText) {
  const s = String(statusText || '').toLowerCase();
  if (
    s.includes('completed') ||
    s.includes('delivered') ||
    s.includes('approved') ||
    s.includes('published') ||
    s.includes('active') ||
    s.includes('accepted') ||
    s.includes('confirmed')
  ) {
    return {
      cls: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
      Icon: CheckCircle2,
    };
  }
  if (
    s.includes('cancelled') ||
    s.includes('rejected') ||
    s.includes('declined') ||
    s.includes('suspended') ||
    s.includes('inactive') ||
    s.includes('expired') ||
    s.includes('out of stock')
  ) {
    return {
      cls: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]',
      Icon: XCircle,
    };
  }
  if (
    s.includes('pending') ||
    s.includes('preparing') ||
    s.includes('review') ||
    s.includes('hold') ||
    s.includes('draft')
  ) {
    return {
      cls: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      Icon: Clock,
    };
  }
  return {
    cls: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    Icon: AlertCircle,
  };
}

export default function StatusBadge({ status }) {
  const { cls, Icon } = resolveTone(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded border whitespace-nowrap ${cls}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
