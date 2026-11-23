/**
 * SLIDE-OVER CART DRAWER & DEMO CHECKOUT FLOW
 * --------------------------------------------------------------------------
 * Allows adding/updating/removing cart items, inspecting NGN subtotal,
 * and testing a demo order draft submission.
 *
 * PAYMENT INTEGRATION NOTE:
 * - No real payment or card data is collected here.
 * - Order drafts created here are stored locally for frontend preview.
 * - Connect Paystack checkout + server-side transaction verification inside
 *   orderService.createOrderDraft() before going live.
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, Info, ShoppingBag, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import * as orderService from '../../services/orderService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { isValidEmail, isValidPhone } from '../../utils/validation.js';
import Button from '../common/Button.jsx';
import QuantityControl from './QuantityControl.jsx';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    cartSubtotal,
    updateCartQty,
    removeFromCart,
    clearCart,
    currentUser,
    showToast,
  } = useApp();

  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'confirmed'
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryMethod: 'Delivery Placeholder',
    deliveryAddress: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        customerName: prev.customerName || currentUser.fullName || '',
        customerEmail: prev.customerEmail || currentUser.email || '',
        customerPhone: prev.customerPhone || currentUser.phone || '',
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isCartOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const validateCheckout = () => {
    const next = {};
    if (!form.customerName.trim()) next.customerName = 'Full name is required.';
    if (!isValidEmail(form.customerEmail)) next.customerEmail = 'Enter a valid email address.';
    if (!isValidPhone(form.customerPhone)) next.customerPhone = 'Enter a valid phone number.';
    if (form.deliveryMethod === 'Delivery Placeholder' && !form.deliveryAddress.trim()) {
      next.deliveryAddress = 'Please enter a delivery address placeholder.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!validateCheckout() || submitting) return;
    setSubmitting(true);

    const res = await orderService.createOrderDraft({
      customerId: currentUser?.id || null,
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerPhone: form.customerPhone.trim(),
      deliveryMethod: form.deliveryMethod,
      deliveryAddress:
        form.deliveryMethod === 'Pickup Placeholder'
          ? 'Showroom Pickup Placeholder'
          : form.deliveryAddress.trim(),
      notes: form.notes.trim(),
      items: cartItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        variant: item.variant,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });

    setSubmitting(false);
    if (res.ok) {
      setConfirmedOrder(res.data);
      clearCart();
      setStep('confirmed');
      showToast('Demo order draft created (not paid / not sent to live server).', 'success');
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    if (step === 'confirmed') setStep('cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping cart drawer">
      <div className="fixed inset-0 bg-[#0B2545]/50" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EAECEF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0B2545]" aria-hidden="true" />
            <h2 className="text-base font-semibold text-[#0B2545]">
              {step === 'cart' && `Demo Cart (${cartItems.reduce((s, i) => s + i.quantity, 0)})`}
              {step === 'checkout' && 'Demo Order Draft Checkout'}
              {step === 'confirmed' && 'Order Draft Recorded (Demo)'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close cart drawer"
            className="p-1.5 rounded text-[#6B7280] hover:text-[#0B2545] hover:bg-[#F1F3F5] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="text-sm font-medium text-[#0B2545]">Your demo cart is empty.</p>
                  <p className="text-xs text-[#6B7280]">
                    Browse sample paints, decor materials, lighting, and custom furniture in the Shop.
                  </p>
                  <Button to="/shop" variant="primary" size="sm" onClick={handleClose}>
                    Browse Shop
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded bg-[#F8F9FA] border border-[#EAECEF] text-xs text-[#4B5563] flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#0B2545] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      Sample prices and cart items are stored locally in your browser for demonstration.
                    </span>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={`${item.productId}-${item.variant}`}
                      className="flex gap-3 pb-4 border-b border-[#EAECEF]"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded object-cover border border-[#EAECEF] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/shop/${item.slug}`}
                          onClick={handleClose}
                          className="text-sm font-semibold text-[#0B2545] hover:underline line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[#6B7280] mt-0.5">{item.variant}</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <QuantityControl
                            value={item.quantity}
                            onChange={(qty) => updateCartQty(item.productId, item.variant, qty)}
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0B2545] tabular-nums">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId, item.variant)}
                              aria-label={`Remove ${item.name}`}
                              className="p-1 text-[#6B7280] hover:text-[#B91C1C] cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="demo-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4" noValidate>
              <div className="p-3 rounded bg-[#FFFBEB] border border-[#FDE68A] text-xs text-[#92400E]">
                <strong>Demo Checkout Notice:</strong> Payment is NOT connected yet. Submitting creates a local unpaid order draft only (Paystack integration slot reserved for backend connection).
              </div>

              <div>
                <label htmlFor="chk-name" className="rehoyah-label">Full Name *</label>
                <input
                  id="chk-name"
                  type="text"
                  className="rehoyah-input"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  aria-invalid={Boolean(errors.customerName)}
                />
                {errors.customerName && <p className="text-xs text-[#B91C1C] mt-1">{errors.customerName}</p>}
              </div>

              <div>
                <label htmlFor="chk-email" className="rehoyah-label">Email Address *</label>
                <input
                  id="chk-email"
                  type="email"
                  className="rehoyah-input"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  aria-invalid={Boolean(errors.customerEmail)}
                />
                {errors.customerEmail && <p className="text-xs text-[#B91C1C] mt-1">{errors.customerEmail}</p>}
              </div>

              <div>
                <label htmlFor="chk-phone" className="rehoyah-label">Phone Number *</label>
                <input
                  id="chk-phone"
                  type="tel"
                  className="rehoyah-input"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  aria-invalid={Boolean(errors.customerPhone)}
                />
                {errors.customerPhone && <p className="text-xs text-[#B91C1C] mt-1">{errors.customerPhone}</p>}
              </div>

              <div>
                <label htmlFor="chk-method" className="rehoyah-label">Fulfillment Preference (Placeholder)</label>
                <select
                  id="chk-method"
                  className="rehoyah-select"
                  value={form.deliveryMethod}
                  onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                >
                  <option value="Delivery Placeholder">Delivery (Placeholder)</option>
                  <option value="Pickup Placeholder">Showroom Pickup (Placeholder)</option>
                </select>
              </div>

              {form.deliveryMethod === 'Delivery Placeholder' && (
                <div>
                  <label htmlFor="chk-addr" className="rehoyah-label">Delivery Address *</label>
                  <textarea
                    id="chk-addr"
                    rows={2}
                    className="rehoyah-textarea"
                    value={form.deliveryAddress}
                    onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                    placeholder="Street, area, city, state"
                    aria-invalid={Boolean(errors.deliveryAddress)}
                  />
                  {errors.deliveryAddress && <p className="text-xs text-[#B91C1C] mt-1">{errors.deliveryAddress}</p>}
                </div>
              )}

              <div>
                <label htmlFor="chk-notes" className="rehoyah-label">Order Notes (Optional)</label>
                <textarea
                  id="chk-notes"
                  rows={2}
                  className="rehoyah-textarea"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <div className="p-3 rounded border border-[#EAECEF] bg-[#F8F9FA] text-xs text-[#4B5563]">
                <p className="font-semibold text-[#0B2545]">Future Payment Slot (Not Connected)</p>
                <p className="mt-1">Paystack card &amp; transfer checkout will connect here once backend verification endpoints are added.</p>
              </div>
            </form>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="py-6 space-y-4">
              <div className="w-11 h-11 rounded-md bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0B2545]">Demo Order Draft Created</h3>
              <p className="text-sm text-[#4B5563]">
                Reference <strong className="text-[#0B2545] tabular-nums">{confirmedOrder.id}</strong> has been saved in local demo storage only. <strong>No payment was charged and no order was sent to Rehoyah yet.</strong>
              </p>
              <div className="p-4 rounded bg-[#F8F9FA] border border-[#EAECEF] text-xs space-y-1.5">
                <p><strong>Payment Status:</strong> {confirmedOrder.paymentStatus}</p>
                <p><strong>Fulfillment:</strong> {confirmedOrder.deliveryMethod}</p>
                <p className="tabular-nums"><strong>Demo Subtotal:</strong> {formatCurrency(confirmedOrder.total)}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button to="/account/orders" variant="primary" size="sm" onClick={handleClose}>
                  View Demo Orders
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClose}>
                  Continue Browsing
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="p-5 border-t border-[#EAECEF] bg-[#F8F9FA] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#4B5563]">Demo Subtotal</span>
              <span className="text-lg font-bold text-[#0B2545] tabular-nums">
                {formatCurrency(cartSubtotal)}
              </span>
            </div>
            <p className="text-[11px] text-[#6B7280]">
              Delivery fees &amp; payment verification will calculate upon backend integration.
            </p>
            <Button variant="gold" className="w-full" onClick={() => setStep('checkout')}>
              Proceed to Demo Checkout
            </Button>
          </div>
        )}

        {step === 'checkout' && (
          <div className="p-5 border-t border-[#EAECEF] bg-[#F8F9FA] flex items-center justify-between gap-3">
            <Button variant="secondary" size="sm" onClick={() => setStep('cart')}>
              Back to Cart
            </Button>
            <Button type="submit" form="demo-checkout-form" variant="primary" disabled={submitting}>
              {submitting ? 'Saving Draft...' : `Create Demo Order (${formatCurrency(cartSubtotal)})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
