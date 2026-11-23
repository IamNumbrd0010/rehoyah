/**
 * CUSTOMER WISHLIST PAGE (/account/wishlist)
 */

import { useEffect, useState } from 'react';
import EmptyState from '../../components/common/EmptyState.jsx';
import DashboardShell from '../../components/dashboard/DashboardShell.jsx';
import ProductCard from '../../components/shop/ProductCard.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as productService from '../../services/productService.js';
import { CUSTOMER_NAV_ITEMS } from './customerNav.js';

export default function CustomerWishlistPage() {
  const { wishlistIds } = useApp();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getProducts({ publishedOnly: true }).then((all) => {
      setProducts(all.filter((p) => wishlistIds.includes(p.id)));
    });
  }, [wishlistIds]);

  return (
    <DashboardShell
      portal="customer"
      portalTitle="Customer Portal"
      pageTitle="Saved Wishlist (Demo)"
      navItems={CUSTOMER_NAV_ITEMS}
    >
      {products.length === 0 ? (
        <EmptyState
          title="Your demo wishlist is empty"
          description="Tap the heart icon on any product in the Shop to save it here."
          actionLabel="Browse Shop"
          actionTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
