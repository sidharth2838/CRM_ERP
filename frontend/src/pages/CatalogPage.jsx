import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories and products on component mount
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [selectedCategories, priceRange, sortBy]);

  const loadCategories = async () => {
    try {
      const response = await axios.get('/products/categories/');
      if (response.data.results) {
        setCategories(response.data.results);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        min_price: priceRange[0],
        max_price: priceRange[1],
        sort: sortBy,
      };

      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.join(',');
      }

      const response = await axios.get('/products/catalog/', { params });

      if (response.data.results) {
        setProducts(response.data.results);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    setPriceRange([priceRange[0], newPrice]);
  };

  const getImageUrl = (product) => {
    if (product.image) {
      if (product.image.startsWith('http')) {
        return product.image;
      }
      return `http://localhost:8000${product.image}`;
    }
    return '/placeholder-product.png';
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Navbar - Visible on scroll */}
      {isScrolled && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all duration-300">
          <Header />
        </div>
      )}

      {/* ==================== PAGE HEADER SECTION ==================== */}
      <section className="relative w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="h-1 w-12 bg-white mr-4"></div>
            <p className="text-sm font-light tracking-widest uppercase opacity-75 text-white">
              Curated Collection
            </p>
            <div className="h-1 w-12 bg-white ml-4"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Our Products Catalog
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover our complete selection of premium products crafted with attention to detail and quality
          </p>
        </div>
      </section>

      {/* Show navbar above on mobile/desktop when not scrolled */}
      {!isScrolled && <Header />}

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ==================== SIDEBAR FILTERS ==================== */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Categories Filter */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                  Categories
                </h3>
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm">No categories available</p>
                ) : (
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="ml-3 text-gray-700 group-hover:text-gray-900 font-medium">
                          {category.name || 'Uncategorized'}
                        </span>
                        <span className="ml-auto text-gray-500 text-sm bg-white px-2 py-1 rounded">
                          {category.product_count || 0}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                  Price Range
                </h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={handlePriceChange}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-gray-700 font-semibold">
                    <span>${priceRange[0].toFixed(0)}</span>
                    <span>${priceRange[1].toFixed(0)}</span>
                  </div>
                  <button
                    onClick={() => setPriceRange([0, 5000])}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold mt-2"
                  >
                    ↺ Reset Price
                  </button>
                </div>
              </div>

              {/* Sort Option */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-1 h-6 bg-blue-600 mr-3 rounded"></span>
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-gray-700 font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* ==================== PRODUCTS GRID ==================== */}
          <div className="lg:col-span-3">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 font-medium">
                ⚠️ {error}
              </div>
            )}

            {products.length === 0 && !loading ? (
              <div className="bg-gray-50 rounded-2xl p-16 text-center">
                <div className="text-5xl mb-4">📦</div>
                <p className="text-gray-600 text-xl font-medium">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters or categories</p>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="mb-8 flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">
                      Showing <span className="font-bold text-gray-900">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {/* Product Image Container */}
                      <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <img
                          src={getImageUrl(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="48" font-family="system-ui"%3E📦%3C/text%3E%3C/svg%3E';
                          }}
                        />

                        {/* Discount Badge */}
                        {product.discount_percent && product.discount_percent > 0 && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            -{product.discount_percent}%
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        {/* Category Badge */}
                        {product.category && (
                          <p className="text-xs text-blue-600 uppercase font-bold tracking-widest mb-3">
                            {product.category.name || 'Uncategorized'}
                          </p>
                        )}

                        {/* Product Name */}
                        <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>

                        {/* Description */}
                        {product.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-6">
                          <span className="text-2xl font-bold text-gray-900">
                            ${parseFloat(product.price || 0).toFixed(2)}
                          </span>
                          {product.cost_price && parseFloat(product.cost_price) > parseFloat(product.price || 0) && (
                            <span className="text-sm text-gray-500 line-through">
                              ${parseFloat(product.cost_price).toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
