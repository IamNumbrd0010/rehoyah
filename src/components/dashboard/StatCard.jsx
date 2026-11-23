/**
 * DASHBOARD STAT CARD
 * --------------------------------------------------------------------------
 * Displays concise metrics with tabular numerals and clear demo markers.
 */

export default function StatCard({ label, value, note, icon: Icon }) {
  return (
    <div className="rehoyah-card p-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-medium text-[#6B7280]">{label}</p>
        <p className="mt-1.5 text-2xl font-bold text-[#0B2545] tabular-nums">{value}</p>
        {note && <p className="mt-1 text-xs text-[#6B7280]">{note}</p>}
      </div>
      {Icon && (
        <div className="p-2.5 rounded-md bg-[#F8F9FA] border border-[#EAECEF] text-[#0B2545] shrink-0">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
