/**
 * RESPONSIVE DATA TABLE COMPONENT
 * --------------------------------------------------------------------------
 * Renders clean tabular columns on desktop and automatically converts each
 * row into a readable labeled stack on small mobile screens via
 * `.rehoyah-responsive-table` in `src/styles/responsive.css`.
 */

import EmptyState from '../common/EmptyState.jsx';

export default function DataTable({
  columns = [],
  rows = [],
  keyField = 'id',
  emptyTitle = 'No records available',
  emptyDescription = 'There are no items matching your current filter.',
}) {
  if (!rows.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="rehoyah-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse rehoyah-responsive-table">
          <thead className="bg-[#F8F9FA] border-b border-[#EAECEF]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-xs font-semibold text-[#4B5563] uppercase tracking-wider whitespace-nowrap ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAECEF]">
            {rows.map((row, idx) => (
              <tr key={row[keyField] || idx} className="hover:bg-[#F8F9FA]/70 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    data-label={col.label}
                    className={`px-4 py-3 text-sm text-[#111827] ${
                      col.align === 'right' ? 'md:text-right' : 'md:text-left'
                    }`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
