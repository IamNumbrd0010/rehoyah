/**
 * PRODUCT DETAIL PAGE (DEMO PDP)
 */

import { useEffect, useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import ProductCard from '../../components/shop/ProductCard.jsx';
import QuantityControl from '../../components/shop/QuantityControl.jsx';
import { useApp } from '../../context/AppContext.jsx';
import * as productService from '../../services/productService.js';
import { formatCurrency } from '../../utils/formatCurrency.js';

export default function ProductDetailPage() {
  const { productSlug } = useParams();
  const { addToCart, setIsCartOpen, wishlistIds, toggleWishlist } = useApp();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      productService.getProductBySlug(productSlug),
      productService.getProducts({ publishedOnly: true }),
    ]).then(([found, all]) => {
      if (!active) return;
      setProduct(found);
      if (found) {
        setActiveImage(found.image);
        setSelectedVariant(found.variants?.[0] || 'Standard');
        setRelated(all.filter((p) => p.id !== found.id && p.categoryId === found.categoryId).slice(0, 3));
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [productSlug]);

  const isSaved = product ? wishlistIds.includes(product.id) : false;

  return (
    <PageShell>
      <div className="rehoyah-container-wide py-10 md:py-14">
        {loading ? (
          <LoadingState rows={4} />
        ) : !product ? (
          <EmptyState
            title="Product not found"
            description="This demo product may have been removed or renamed."
            actionLabel="Return to Shop"
            actionTo="/shop"
          />
        ) : (
          <div className="space-y-14">
            <div>
              <Breadcrumbs
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'Shop', to: '/shop' },
                  { label: product.name },
                ]}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Gallery */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="aspect-[4/3] rounded-md overflow-hidden border border-[#DEE2E6] bg-[#F8F9FA]">
                    <img
                      src={activeImage || product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {product.gallery?.length > 1 && (
                    <div className="flex gap-3">
                      {product.gallery.map((imgUrl, idx) => (
                        <button
                          key={`${imgUrl}-${idx}`}
                          type="button"
                          onClick={() => setActiveImage(imgUrl)}
                          className={`w-20 h-16 rounded overflow-hidden border-2 cursor-pointer ${
                            activeImage === imgUrl ? 'border-[#0B2545]' : 'border-[#DEE2E6]'
                          }`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contiguous Purchase Module */}
                <div className="lg:col-span-6 space-y-5">
                  <div>
                    <p className="text-xs text-[#6B7280] flex items-center gap-2">
                      <span>{product.categoryName}</span>
                      <span aria-hidden="true">·</span>
                      <span>SKU: {product.sku}</span>
                      <span aria-hidden="true">·</span>
                      <span>Demo Listing</span>
                    </p>
                    <h1 className="mt-1.5 text-2xl md:text-3xl font-bold text-[#0B2545]">
                      {product.name}
                    </h1>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[#0B2545] tabular-nums">
                      {formatCurrency(product.salePrice || product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="text-base text-[#6B7280] line-through tabular-nums">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                    <StatusBadge status={product.inStock ? 'In Stock (Demo)' : 'Out of Stock'} />
                  </div>

                  <p className="text-sm md:text-base text-[#4B5563] leading-relaxed">
                    {product.description}
                  </p>

                  {product.variants?.length > 0 && (
                    <div>
                      <label className="rehoyah-label">Finish / Variant Option</label>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant) => (
                          <button
                            key={variant}
                            type="button"
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-3.5 py-2 text-xs font-medium rounded border cursor-pointer transition-colors ${
                              selectedVariant === variant
                                ? 'bg-[#0B2545] text-white border-[#0B2545]'
                                : 'bg-white text-[#111827] border-[#DEE2E6] hover:border-[#0B2545]'
                            }`}
                          >
                            {variant}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <QuantityControl value={qty} onChange={setQty} />
                    <Button
                      variant="primary"
                      disabled={!product.inStock}
                      onClick={() => {
                        addToCart(product, qty, selectedVariant);
                        setIsCartOpen(true);
                      }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {product.inStock ? 'Add to Demo Cart' : 'Unavailable'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => toggleWishlist(product.id, product.name)}
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved ? 'text-[#F57C00]' : ''}`}
                        fill={isSaved ? 'currentColor' : 'none'}
                      />
                      {isSaved ? 'Saved' : 'Save'}
                    </Button>
                  </div>

                  <div className="p-3.5 rounded bg-[#F8F9FA] border border-[#EAECEF] text-xs text-[#4B5563]">
                    <strong>Sample Demo Pricing:</strong> Figures shown are illustrative NGN placeholders. Confirm final material quantities and pricing via Request a Quote or live checkout once connected.
                  </div>

                  {product.specs?.length > 0 && (
                    <div className="pt-4 border-t border-[#EAECEF]">
                      <h2 className="text-sm font-semibold text-[#0B2545] mb-3">Specifications (Sample)</h2>
                      <dl className="divide-y divide-[#EAECEF] border border-[#EAECEF] rounded">
                        {product.specs.map((spec) => (
                          <div key={spec.label} className="px-4 py-2.5 flex justify-between gap-4 text-sm">
                            <dt className="text-[#6B7280]">{spec.label}</dt>
                            <dd className="font-medium text-[#0B2545] text-right">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="pt-8 border-t border-[#EAECEF]">
                <h2 className="text-xl font-bold text-[#0B2545] mb-5">Related Sample Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
