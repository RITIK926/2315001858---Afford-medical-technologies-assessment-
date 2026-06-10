import { useState, useEffect, startTransition } from "react";
import { Product } from "../types";
import { Search, SlidersHorizontal, ArrowUpDown, HelpCircle, Check, Star, ShoppingBag, X, Layers, Percent } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const categories = ["Phone", "Computer", "TV", "Earphone", "Tablet", "Charger", "Mouse", "Keypad"];

export default function ProductsAggregator() {
  const [selectedCompany, setSelectedCompany] = useState("AMZ");
  const [selectedCategory, setSelectedCategory] = useState("Phone");
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [top, setTop] = useState(12);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [compareShelfOpen, setCompareShelfOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/companies/${selectedCompany}/categories/${selectedCategory}/products?minPrice=${minPrice}&maxPrice=${maxPrice}&top=${top}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not download products listings.");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load e-commerce products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCompany, selectedCategory, sortBy, sortOrder]);

  const toggleCompare = (p: Product) => {
    setComparisonList(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) {
        return prev.filter(item => item.id !== p.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, p];
    });
  };

  const removeCompare = (id: string) => {
    setComparisonList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            Product aggregator storefront
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Compare and sort items in wholesale directories across five networks
          </p>
        </div>

        {comparisonList.length > 0 && (
          <button
            onClick={() => setCompareShelfOpen(true)}
            className="flex items-center gap-2 py-2 px-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            Comparison Deck ({comparisonList.length}/3)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-6 h-fit">
          <div className="flex items-center gap-2 font-semibold text-sm text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-50">
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            Listing Filters
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">E-Commerce Chain</label>
            <div className="flex flex-wrap gap-1.5">
              {companies.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCompany(c)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedCompany === c
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Category</label>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left py-2 px-3 rounded-xl text-xs font-medium cursor-pointer transition-colors flex justify-between items-center ${
                    selectedCategory === cat
                      ? "bg-slate-50 text-indigo-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                  {selectedCategory === cat && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex justify-between text-xs font-semibold text-gray-600">
              <span className="font-bold text-gray-500 uppercase tracking-wide">Min Price</span>
              <span>${minPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="500"
              step="50"
              value={minPrice}
              onChange={(e) => startTransition(() => setMinPrice(Number(e.target.value)))}
              className="w-full accent-indigo-600"
            />

            <div className="flex justify-between text-xs font-semibold text-gray-600 mt-2">
              <span className="font-bold text-gray-500 uppercase tracking-wide">Max Price</span>
              <span>${maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => startTransition(() => setMaxPrice(Number(e.target.value)))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-50">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Scope Limit</label>
            <input
              type="number"
              min="1"
              max="50"
              value={top}
              onChange={(e) => startTransition(() => setTop(Math.max(1, parseInt(e.target.value) || 12)))}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-sm focus:outline-hidden focus:border-indigo-300"
            />
          </div>

          <button
            onClick={fetchProducts}
            className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors cursor-pointer flex justify-center items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Apply Conditions
          </button>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-xs font-semibold text-gray-500">
              Listing: <strong className="text-indigo-600">{products.length}</strong> items in Category <strong className="text-gray-900">{selectedCategory}</strong>
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1 text-xs text-gray-500 font-bold uppercase tracking-wider">
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
                Sort
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-150 rounded-xl py-1.5 px-3 text-xs text-gray-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="discount">Discount</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                className="p-1.5 hover:bg-gray-50 rounded-lg text-xs font-bold text-indigo-600 border border-gray-100 cursor-pointer"
              >
                {sortOrder.toUpperCase()}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-50 shadow-xs">
              <span className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium text-gray-500">Syncing products data directory...</p>
            </div>
          ) : error ? (
            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-50 shadow-xs text-center p-6">
              <HelpCircle className="w-12 h-12 text-red-400 mb-3" />
              <p className="text-sm font-bold text-gray-800">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
              >
                Retry Download
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-150 shadow-xs text-center p-6">
              <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-sm font-bold text-gray-500">No matching commercial items discovered</p>
              <p className="text-xs text-gray-400 mt-1">Refine minimum/maximum limits</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => {
                const inCompare = comparisonList.some(item => item.id === p.id);
                return (
                  <motion.div
                    layout
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-150 hover:border-indigo-100 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                          {p.company} Network
                        </span>
                        {p.discount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                            <Percent className="w-2.5 h-2.5" />
                            {p.discount}% OFF
                          </span>
                        )}
                      </div>

                      <h4
                        className="font-bold text-gray-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                        onClick={() => setSelectedProduct(p)}
                      >
                        {p.productName}
                      </h4>

                      <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mt-2">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{p.rating}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-50 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">Estimated Price</span>
                        <span className="text-lg font-extrabold text-gray-900">${p.price}</span>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleCompare(p)}
                          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                            inCompare
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-gray-200 hover:border-gray-300 text-gray-500"
                          }`}
                          title="Add item to deck comparison checklist"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-xl overflow-hidden"
            >
              <div className="p-6 pb-0 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-widest">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">
                    {selectedProduct.productName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Price</span>
                    <strong className="text-md font-extrabold text-gray-900">${selectedProduct.price}</strong>
                  </div>
                  <div className="text-center border-x border-gray-150">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Rating</span>
                    <strong className="text-md font-extrabold text-gray-900">{selectedProduct.rating} ★</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Availability</span>
                    <strong className={`text-md font-extrabold ${selectedProduct.availability === "yes" ? "text-emerald-600" : "text-amber-500"}`}>
                      {selectedProduct.availability === "yes" ? "In Stock" : "Unavailable"}
                    </strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Product Features & Specifications</h5>
                  <p className="text-sm text-gray-600 leading-relaxed bg-white/50">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-indigo-50/20 border border-indigo-100/40 rounded-xl">
                    <span className="text-[10px] text-indigo-500 font-bold uppercase block">Origin Code</span>
                    <span className="text-xs text-gray-700 font-semibold uppercase">{selectedProduct.id}</span>
                  </div>
                  <div className="p-3 bg-emerald-50/20 border border-emerald-100/40 rounded-xl">
                    <span className="text-[10px] text-emerald-500 font-bold uppercase block">Promotion discount</span>
                    <span className="text-xs text-gray-700 font-semibold">{selectedProduct.discount}% reduction</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      toggleCompare(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {comparisonList.some(item => item.id === selectedProduct.id) ? "Remove comparison deck" : "Insert to Comparison List"}
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Close Sheet
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {compareShelfOpen && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  Product comparison table
                </h3>
                <button
                  onClick={() => setCompareShelfOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-x-auto">
                <div className="min-w-[620px] grid grid-cols-4 gap-4 divide-x divide-gray-100">
                  <div className="space-y-6 pr-4 flex flex-col justify-end pb-4 font-bold text-xs text-gray-400 uppercase tracking-wider">
                    <div className="h-12 flex items-center">Commercial Item</div>
                    <div className="border-t border-gray-100/50 pt-3">Channel Network</div>
                    <div className="border-t border-gray-100/50 pt-3">Base Price</div>
                    <div className="border-t border-gray-100/50 pt-3">Product rating</div>
                    <div className="border-t border-gray-100/50 pt-3">Availability</div>
                    <div className="border-t border-gray-100/50 pt-3">Reduction Applied</div>
                  </div>

                  {comparisonList.map(item => (
                    <div key={item.id} className="px-4 space-y-6 flex flex-col justify-between">
                      <div className="h-12 flex items-start justify-between gap-1">
                        <span className="text-sm font-bold text-gray-900 line-clamp-2">{item.productName}</span>
                        <button
                          onClick={() => removeCompare(item.id)}
                          className="p-1 hover:bg-gray-100 text-gray-400 hover:text-red-500 rounded-full cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="border-t border-gray-100 pt-3 text-sm font-semibold text-gray-700 uppercase">
                        {item.company}
                      </div>

                      <div className="border-t border-gray-100 pt-3 text-md font-extrabold text-gray-900">
                        ${item.price}
                      </div>

                      <div className="border-t border-gray-100 pt-3 text-sm font-semibold text-amber-500 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {item.rating}
                      </div>

                      <div className="border-t border-gray-100 pt-3 text-sm">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                          item.availability === "yes"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {item.availability === "yes" ? "In Stock" : "Unavailable"}
                        </span>
                      </div>

                      <div className="border-t border-gray-100 pt-3 text-sm text-gray-600 font-semibold">
                        {item.discount}% Reduction
                      </div>
                    </div>
                  ))}

                  {Array.from({ length: 3 - comparisonList.length }).map((_, idx) => (
                    <div key={idx} className="px-4 flex flex-col items-center justify-center border-dashed border-2 border-gray-100 rounded-2xl h-64 text-center">
                      <Layers className="w-8 h-8 text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400 font-semibold">Slot Available</p>
                      <p className="text-[10px] text-gray-300 mt-0.5">Click layers icon on listings to fill.</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setComparisonList([])}
                  className="px-4 py-2 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Clear Selection
                </button>
                <button
                  onClick={() => setCompareShelfOpen(false)}
                  className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl text-xs font-semibold cursor-pointer shadow-indigo-600/10 shadow-md"
                >
                  Close Deck
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
