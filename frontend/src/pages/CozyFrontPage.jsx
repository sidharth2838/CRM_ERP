import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CozyFrontPage = () => {
  const [siteInfo, setSiteInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSiteInfo() {
      try {
        const res = await axios.get('/api/siteinfo/');
        setSiteInfo(res.data);
      } catch {
        setSiteInfo(null);
      }
      setLoading(false);
    }
    fetchSiteInfo();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100"><span className="text-xl text-gray-500">Loading...</span></div>;
  }
  if (!siteInfo) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100"><span className="text-xl text-red-500">No site info found.</span></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex flex-col items-center justify-center py-12 px-4">
      <header className="w-full max-w-4xl text-center mb-12">
        <img src={siteInfo.hero_image} alt="Cozy Home" className="w-full h-64 object-cover rounded-3xl shadow-card mb-8" />
        <h1 className="text-6xl font-extrabold text-pink-700 mb-4 rounded-xl bg-white/80 px-6 py-2 shadow-soft inline-block">{siteInfo.heading}</h1>
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">{siteInfo.subheading}</h2>
        <p className="text-lg text-gray-700 mb-2 rounded bg-white/60 px-4 py-2 inline-block shadow-soft">{siteInfo.description}</p>
      </header>
      <div className="flex gap-6 mt-8">
        <a href="/website" className="px-8 py-4 rounded-full bg-pink-500 text-white font-bold text-xl shadow hover:bg-pink-600 transition">Explore Products</a>
        <a href="/login" className="px-8 py-4 rounded-full bg-blue-500 text-white font-bold text-xl shadow hover:bg-blue-600 transition">CRM Login</a>
      </div>
    </div>
  );
};

export default CozyFrontPage;
