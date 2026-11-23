/**
 * REUSABLE BUTTON COMPONENT
 * --------------------------------------------------------------------------
 * Supports native <button> and React Router <Link> navigation cleanly.
 * Uses Montserrat button typography and clear contrast/focus states.
 */

import { Link } from 'react-router-dom';

const VARIANT_CLASSES = {
  primary: 'bg-[#0B2545] text-white hover:bg-[#153966] border border-[#0B2545]',
  gold: 'bg-[#D4AF37] text-[#0B2545] hover:bg-[#B39022] hover:text-white border border-[#D4AF37]',
  accent: 'bg-[#F57C00] text-white hover:bg-[#D96B00] border border-[#F57C00]',
  secondary: 'bg-white text-[#0B2545] hover:bg-[#F8F9FA] border border-[#DEE2E6]',
  ghost: 'bg-transparent text-[#0B2545] hover:bg-[#F1F3F5] border border-transparent',
  danger: 'bg-[#B91C1C] text-white hover:bg-[#991B1B] border border-[#B91C1C]',
};

const SIZE_CLASSES = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

export default function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-btn font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  const classes = `${base} ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${
    SIZE_CLASSES[size] || SIZE_CLASSES.md
  } ${className}`;

  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
}
