import { useState } from 'react';

const ProductCard = ({ product }) => {
  const [showActions, setShowActions] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="card border-t-4 border-accent">
      {/* Product Image */}
      <div
        className="relative w-full h-72 bg-light-bg flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="text-gray-300 text-4xl">
            <i className="fas fa-image"></i>
          </div>
        )}

        {/* Badge */}
        <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold uppercase">
          NEW
        </span>

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              className="action-btn"
              title="Add to Wishlist"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <i className={`${isWishlisted ? 'fas' : 'far'} fa-heart`}></i>
            </button>
            <button className="action-btn" title="Quick View">
              <i className="far fa-eye"></i>
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="text-accent text-xs font-bold uppercase tracking-wider mb-2">
          {product.category || 'Furniture'}
        </div>
        <h3 className="text-xl font-bold text-primary-dark mb-3 leading-snug">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-12">
          {product.description?.substring(0, 80) || 'Premium quality furniture for your home'}
        </p>

        {/* Price and Button */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary-dark">
            ${product.price || '0'}
          </span>
          <a href={`/product/${product.id}`} className="btn-secondary">
            View
          </a>
        </div>
      </div>
    </div>
  );
};

const ProductsSection = ({ products = [] }) => {
  if (products.length === 0) return null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Our Latest Collections</h2>
          <p className="section-subtitle">
            Discover our handpicked selection of premium furniture and home decor
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
