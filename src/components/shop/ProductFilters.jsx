/**
 * SHOP PRODUCT FILTERS BAR
 */

import SearchInput from '../common/SearchInput.jsx';

export default function ProductFilters({
  categories = [],
  selectedCategory,
  onSelectCategory,
  search,
  onSearchChange,
  sort,
  onSortChange,
  inStockOnly,
  onInStockChange,
}) {
  return (
    <div className="rehoyah-card p-4 md:p-5 mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-5">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="Search paints, wallpapers, furniture..."
            label="Search products"
          />
        </div>

        <div className="md:col-span-4">
          <label htmlFor="shop-sort" className="sr-only">Sort products</label>
          <select
            id="shop-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rehoyah-select"
          >
            <option value="featured">Sort: Featured (Demo)</option>
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <div className="md:col-span-3 flex items-center md:justify-end">
          <label className="inline-flex items-center gap-2 text-sm text-[#111827] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="w-4 h-4 accent-[#0B2545]"
            />
            <span>In stock only</span>
          </label>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F3F5]">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#0B2545] text-white border-[#0B2545]'
              : 'bg-[#F8F9FA] text-[#4B5563] border-[#EAECEF] hover:border-[#CED4DA]'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#0B2545] text-white border-[#0B2545]'
                : 'bg-[#F8F9FA] text-[#4B5563] border-[#EAECEF] hover:border-[#CED4DA]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
