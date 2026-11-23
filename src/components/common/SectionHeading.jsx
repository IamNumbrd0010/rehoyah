/**
 * REUSABLE SECTION HEADING
 * --------------------------------------------------------------------------
 * Provides consistent editorial hierarchy across public sections.
 */

export default function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  action = null,
}) {
  const isCenter = align === 'center';

  return (
    <div
      className={`flex flex-col gap-4 mb-8 ${
        isCenter ? 'items-center text-center max-w-2xl mx-auto' : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={isCenter ? '' : 'max-w-2xl'}>
        {kicker && (
          <p className="text-xs font-semibold tracking-wider text-[#B39022] mb-1.5 uppercase">
            {kicker}
          </p>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-[#0B2545]">{title}</h2>
        {description && (
          <p className="mt-2.5 text-sm md:text-base text-[#4B5563] leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
