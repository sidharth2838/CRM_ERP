import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WebsitePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteInfo, setSiteInfo] = useState({ heading: 'Welcome to CozyCorner', description: 'Discover our products!' });

  useEffect(() => {
    async function fetchContent() {
      try {
        // Replace with your actual API endpoints
        const prodRes = await axios.get('/api/products/');
        setProducts(prodRes.data.results || prodRes.data || []);
        // Example: fetch site info from backend
        // const infoRes = await axios.get('/api/site-info/');
        // setSiteInfo(infoRes.data);
      } catch {
        setProducts([]);
      }
      setLoading(false);
    }
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col items-center py-12 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-pink-700 mb-4 rounded-xl bg-white/80 px-6 py-2 shadow-soft">{siteInfo.heading}</h1>
        <p className="text-lg text-gray-700 mb-2 rounded bg-white/60 px-4 py-2 inline-block shadow-soft">{siteInfo.description}</p>
      </header>
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">No products found.</div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-card p-6 flex flex-col items-center">
              <img src={product.image || 'https://via.placeholder.com/120x120?text=Product'} alt={product.name} className="w-28 h-28 object-cover rounded-full mb-4 border-4 border-pink-200" />
              <h2 className="text-xl font-bold text-pink-700 mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2 text-center">{product.description}</p>
              <span className="text-lg font-semibold text-blue-700 mb-2">${product.price}</span>
              <button className="mt-2 px-4 py-2 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition">View Details</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default WebsitePage;
