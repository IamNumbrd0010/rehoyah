/**
 * SHOP CATALOG PAGE (DEMO E-COMMERCE)
 * --------------------------------------------------------------------------
 * Supports search, category tabs, availability filter, sorting, and pagination.
 * Clearly marks all prices and inventory as demonstration sample data.
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import Breadcrumbs from '../../components/layout/Breadcrumbs.jsx';
import PageShell from '../../components/layout/PageShell.jsx';
import ProductCard from '../../components/shop/ProductCard.jsx';
import ProductFilters from '../../components/shop/ProductFilters.jsx';
import * as productService from '../../services/productService.js';

const PAGE_SIZE = 9;

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  useEffect(() => {
    productService.getCategories(true).then(setCategories);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    productService
      .getProducts({
        publishedOnly: true,
        category: selectedCategory,
        search,
        sort,
        inStockOnly,
      })
      .then((list) => {
        if (!active) return;
        setProducts(list);
        setPage(1);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCategory, search, sort, inStockOnly]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const pagedProducts = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageShell>
      <section className="bg-[#F8F9FA] border-b border-[#EAECEF] py-10">
        <div className="rehoyah-container-wide">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop' }]} />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B39022]">
                Sample Storefront · Demo Data
              </p>
              <h1 className="mt-1 text-3xl md:text-4xl font-bold text-[#0B2545]">
                Materials, Paints, Decor &amp; Furniture
              </h1>
              <p className="mt-2 text-sm text-[#4B5563] max-w-2xl">
                Sample products and NGN prices shown below are for frontend demonstration only and are not yet connected to live inventory or Paystack payment.
              </p>
            </div>
            <p className="text-xs text-[#6B7280] tabular-nums">
              Showing {products.length} sample item{products.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="rehoyah-container-wide">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            inStockOnly={inStockOnly}
            onInStockChange={setInStockOnly}
          />

          {loading ? (
            <LoadingState rows={4} />
          ) : pagedProducts.length === 0 ? (
            <EmptyState
              title="No sample products matched your filters"
              description="Try clearing your search term or selecting All Categories."
              actionLabel="Reset Filters"
              onAction={() => {
                handleSelectCategory('all');
                setSearch('');
                setInStockOnly(false);
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {pagedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
