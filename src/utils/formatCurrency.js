/**
 * CURRENCY FORMATTING UTILITY
 * --------------------------------------------------------------------------
 * Formats numeric values into Nigerian Naira (NGN / ₦) consistently across
 * the shop, cart, orders, quotations, and admin/staff dashboards.
 */

export function formatCurrency(amount) {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) {
    return '₦0';
  }

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount);
  } catch {
    return `₦${numericAmount.toLocaleString('en-US')}`;
  }
}

export default formatCurrency;
