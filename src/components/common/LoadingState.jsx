/**
 * LOADING STATE COMPONENT
 * --------------------------------------------------------------------------
 * Clean skeleton rows or blocks shown while async service calls resolve.
 */

export default function LoadingState({ rows = 3, label = 'Loading...' }) {
  return (
    <div className="space-y-3" role="status" aria-live="polite" aria-label={label}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-14 rounded-md bg-[#F1F3F5] border border-[#EAECEF] animate-pulse"
        />
      ))}
    </div>
  );
}
