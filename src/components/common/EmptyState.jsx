/**
 * EMPTY STATE COMPONENT
 * --------------------------------------------------------------------------
 * Used when filtered shop results, tables, or customer lists are empty.
 */

import { Inbox } from 'lucide-react';
import Button from './Button.jsx';

export default function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your filters or adding a new entry.',
  actionLabel,
  onAction,
  actionTo,
}) {
  return (
    <div className="rehoyah-card p-8 md:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-11 h-11 rounded-md bg-[#F1F3F5] text-[#0B2545] flex items-center justify-center mb-4">
        <Inbox className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-[#0B2545]">{title}</h3>
      <p className="mt-1.5 text-sm text-[#4B5563] max-w-md">{description}</p>
      {(actionLabel && (onAction || actionTo)) && (
        <div className="mt-5">
          <Button variant="secondary" size="sm" onClick={onAction} to={actionTo}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
