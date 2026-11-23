/**
 * GLOBAL APPLICATION STATE CONTEXT
 * --------------------------------------------------------------------------
 * Coordinates current demo user session, shopping cart, wishlist, site
 * settings, and toast notifications across public pages and dashboards.
 *
 * NOTE ON PERSISTENCE:
 * Cart, wishlist, and demo session state are stored in localStorage via
 * demoStore.js strictly for frontend demonstration across page reloads.
 * Replace cart/wishlist persistence with database-backed endpoints once
 * user authentication and API routes are connected.
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService.js';
import * as contentService from '../services/contentService.js';
import { readDemoStore, writeDemoStore } from '../services/demoStore.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [settings, setSettings] = useState(null);
  const [cartItems, setCartItems] = useState(() => readDemoStore('cart_items', []));
  const [wishlistIds, setWishlistIds] = useState(() => readDemoStore('wishlist_ids', ['prod-01', 'prod-07']));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, tone = 'info') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timer);
  }, [toast]);

  const refreshUser = useCallback(async () => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
    setAuthReady(true);
  }, []);

  const refreshSettings = useCallback(async () => {
    const data = await contentService.getSettings();
    setSettings(data);
  }, []);

  useEffect(() => {
    refreshUser();
    refreshSettings();
  }, [refreshUser, refreshSettings]);

  // Persist demo cart & wishlist locally
  useEffect(() => {
    writeDemoStore('cart_items', cartItems);
  }, [cartItems]);

  useEffect(() => {
    writeDemoStore('wishlist_ids', wishlistIds);
  }, [wishlistIds]);

  const addToCart = useCallback(
    (product, quantity = 1, variant = '') => {
      if (!product || !product.inStock) {
        showToast('This demo item is currently marked out of stock.', 'warning');
        return;
      }
      const chosenVariant = variant || (product.variants && product.variants[0]) || 'Standard';
      const unitPrice = product.salePrice || product.price;

      setCartItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === product.id && item.variant === chosenVariant
        );
        if (existingIndex >= 0) {
          const next = [...prev];
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + Number(quantity),
          };
          return next;
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            variant: chosenVariant,
            unitPrice,
            quantity: Number(quantity),
          },
        ];
      });
      showToast(`Added "${product.name}" to demo cart.`, 'success');
    },
    [showToast]
  );

  const updateCartQty = useCallback((productId, variant, nextQty) => {
    if (nextQty <= 0) {
      setCartItems((prev) =>
        prev.filter((item) => !(item.productId === productId && item.variant === variant))
      );
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.variant === variant
          ? { ...item, quantity: nextQty }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId, variant) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variant === variant))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId, productName) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
        showToast(
          exists
            ? `Removed ${productName || 'item'} from demo wishlist.`
            : `Saved ${productName || 'item'} to demo wishlist.`,
          'info'
        );
        return next;
      });
    },
    [showToast]
  );

  const switchRole = useCallback(
    async (roleKey) => {
      const res = await authService.switchDemoRole(roleKey);
      setCurrentUser(res.data);
      showToast(
        res.data
          ? `Demo preview switched to ${res.data.role.toUpperCase()} (${res.data.fullName}).`
          : 'Switched to Public Visitor preview.',
        'info'
      );
      return res.data;
    },
    [showToast]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
    showToast('Signed out of demo session.', 'info');
  }, [showToast]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        authReady,
        refreshUser,
        settings,
        refreshSettings,
        cartItems,
        cartCount,
        cartSubtotal,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        wishlistIds,
        toggleWishlist,
        switchRole,
        logout,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
