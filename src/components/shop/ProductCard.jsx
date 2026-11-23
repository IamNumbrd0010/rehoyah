/**
 * PRODUCT CARD COMPONENT
 * --------------------------------------------------------------------------
 * Displays product placeholder thumbnail, clean unboxed category metadata,
 * sample NGN pricing, wishlist toggle, and Add to Cart action.
 */

import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function ProductCard({ product }) {
  const { addToCart, wishlistIds, toggleWishlist } = useApp();
  const isSaved = wishlistIds.includes(product.id);
  const displayPrice = product.salePrice || product.price;

  return (
    <article className="rehoyah-card rehoyah-card-interactive flex flex-col overflow-hidden">
      <div className="relative bg-[#F8F9FA] aspect-[4/3] overflow-hidden border-b border-[#EAECEF]">
        <Link to={`/shop/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id, product.name)}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute top-3 right-3 p-2 rounded-md border bg-white/95 transition-colors cursor-pointer ${
            isSaved ? 'text-[#F57C00] border-[#F57C00]' : 'text-[#4B5563] border-[#DEE2E6] hover:text-[#0B2545]'
          }`}
        >
          <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div>
          <p className="text-xs text-[#6B7280] flex items-center gap-1.5">
            <span>{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>Sample Item</span>
          </p>
          <h3 className="mt-1 text-base font-semibold text-[#0B2545] leading-snug">
            <Link to={`/shop/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="pt-3 border-t border-[#F1F3F5] flex items-center justify-between gap-2">
          <div>
            <p className="text-base font-bold text-[#0B2545] tabular-nums">
              {formatCurrency(displayPrice)}
            </p>
            {product.salePrice && (
              <p className="text-xs text-[#6B7280] line-through tabular-nums">
                {formatCurrency(product.price)}
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!product.inStock}
            onClick={() => addToCart(product, 1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-btn font-semibold rounded bg-[#0B2545] text-white hover:bg-[#153966] disabled:bg-[#E9ECEF] disabled:text-[#6B7280] disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </article>
  );
}
