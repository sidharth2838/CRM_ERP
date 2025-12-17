import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();
  const [heroSection, setHeroSection] = useState(null);
  const [collectionsSection, setCollectionsSection] = useState(null);
  const [qualitySection, setQualitySection] = useState(null);
  const [furnitureDetailsSection, setFurnitureDetailsSection] = useState(null);
  const [testimonialsSectionSettings, setTestimonialsSectionSettings] = useState(null);
  const [storiesSectionSettings, setStoriesSectionSettings] = useState(null);
  const [stories, setStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [slideShowIndex, setSlideShowIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting to fetch landing page data...');
        const [storiesRes, testimonialsRes, galleryRes, heroRes, collectionsRes, qualityRes, furnitureDetailsRes, testimonialsSectionRes, storiesSectionRes] = await Promise.all([
          axios.get('/website/stories/').catch((e) => {
            console.error('Stories fetch error:', e);
            return { data: [] };
          }),
          axios.get('/website/testimonials/').catch((e) => {
            console.error('Testimonials fetch error:', e);
            return { data: [] };
          }),
          axios.get('/website/gallery/').catch((e) => {
            console.error('Gallery fetch error:', e);
            return { data: [] };
          }),
          axios.get('/website/hero/').catch((e) => {
            console.error('Hero fetch error:', e);
            return { data: {} };
          }),
          axios.get('/website/collections/').catch((e) => {
            console.error('Collections fetch error:', e);
            return { data: {} };
          }),
          axios.get('/website/quality/').catch((e) => {
            console.error('Quality fetch error:', e);
            return { data: {} };
          }),
          axios.get('/website/furniture-details/').catch((e) => {
            console.error('Furniture details fetch error:', e);
            return { data: {} };
          }),
          axios.get('/website/testimonials-section/').catch((e) => {
            console.error('Testimonials section fetch error:', e);
            return { data: {} };
          }),
          axios.get('/website/stories-section/').catch((e) => {
            console.error('Stories section fetch error:', e);
            return { data: {} };
          }),
        ]);

        console.log('Stories data:', storiesRes.data);
        console.log('Testimonials data:', testimonialsRes.data);
        console.log('Gallery data:', galleryRes.data);

        setStories(Array.isArray(storiesRes.data) ? storiesRes.data : []);
        setTestimonials(Array.isArray(testimonialsRes.data) ? testimonialsRes.data : []);
        setGallery(Array.isArray(galleryRes.data) ? galleryRes.data : []);
        setHeroSection(heroRes.data || {});
        setCollectionsSection(collectionsRes.data || {});
        setQualitySection(qualityRes.data || {});
        setFurnitureDetailsSection(furnitureDetailsRes.data || {});
        setTestimonialsSectionSettings(testimonialsSectionRes.data || {});
        setStoriesSectionSettings(storiesSectionRes.data || {});
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Detect scroll for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slideshow effect - rotate through gallery images
  useEffect(() => {
    if (gallery.length === 0) return;
    const interval = setInterval(() => {
      setSlideShowIndex((prev) => (prev + 1) % gallery.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [gallery.length]);

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-50"><p className="text-gray-600 text-lg">Loading...</p></div>;

  // Helper function to construct full image URL
  const getFullImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/media/')) return `http://localhost:8000${url}`;
    return url;
  };

  return (
    <div className="bg-white">
      {/* DEBUG PANEL - SHOWS LOADED DATA */}
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-lg text-xs max-w-xs z-50 shadow-lg">
        <strong>Data Status:</strong>
        <div>Hero: {heroSection?.id ? '✓' : '✗'}</div>
        <div>Stories: {stories.length}</div>
        <div>Testimonials: {testimonials.length}</div>
        <div>Gallery: {gallery.length}</div>
      </div>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative w-full h-screen bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: heroSection?.image_url ? `url('${getFullImageUrl(heroSection.image_url)}')` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Navbar - Visible on scroll */}
        {isScrolled && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all duration-300">
            <Header />
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-35"></div>

        {/* Hero Content - Absolute positioning (scrolls with hero) */}
        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          <div className="w-full h-full flex items-center justify-between">
            
            {/* LEFT SIDE: Text Content */}
            <div className="flex-1 text-white z-10 max-w-2xl">
              <div className="mb-6 flex items-center">
                <div className="h-1 w-12 bg-white mr-4"></div>
                <p className="text-sm font-light tracking-widest uppercase opacity-90">
                  Premium Furniture
                </p>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
                {heroSection?.title || 'Where Quality Meets Style'}
              </h1>
              
              <p className="text-lg md:text-xl mb-10 opacity-90 leading-relaxed max-w-md font-light">
                {heroSection?.subtitle || 'Discover our handcrafted furniture pieces designed for comfort and elegance. Transform your space into a sanctuary of style.'}
              </p>
              
              <button 
                onClick={() => navigate('/catalog')}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl">
                {heroSection?.cta_text || 'Shop Now'}
              </button>
            </div>

            {/* RIGHT SIDE: Product Showcase Box */}
            <div className="hidden lg:flex flex-1 h-full items-center justify-end pr-8">
              {gallery.length > 0 ? (
                <div className="bg-white rounded-3xl overflow-hidden w-96 h-96" style={{border: '12px solid white', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
                  {/* Image Container - Full Height */}
                  <div className="relative w-full h-full bg-gray-100 overflow-hidden">
                    <img
                      key={gallery[slideShowIndex]?.id}
                      src={getFullImageUrl(gallery[slideShowIndex]?.image_url)}
                      alt={gallery[slideShowIndex]?.title}
                      className="w-full h-full object-cover transition-opacity duration-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl w-96 h-96 flex items-center justify-center" style={{border: '12px solid white', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
                  <div className="text-center">
                    <p className="text-gray-400 text-lg mb-4">📸</p>
                    <p className="text-gray-500 text-sm">No images</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Show navbar above hero on mobile/desktop when not scrolled */}
      {!isScrolled && <Header />}

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '✨', title: 'ARTISANAL CRAFTSMANSHIP', desc: 'Handcrafted with attention to detail' },
              { icon: '🌿', title: 'SUSTAINABILITY AT HEART', desc: 'Eco-friendly materials and practices' },
              { icon: '🎨', title: 'CUSTOMIZE FOR PERSONAL TOUCH', desc: 'Make it uniquely yours' },
              { icon: '⭐', title: 'DURABILITY & QUALITY FOCUS', desc: 'Built to last generations' },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-sm mb-2 uppercase tracking-widest text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== OUR LATEST COLLECTIONS (Products/Stories) ==================== */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">{storiesSectionSettings?.heading || collectionsSection?.title || 'OUR LATEST COLLECTIONS'}</h2>
            <p className="text-gray-600 text-lg">{storiesSectionSettings?.description || collectionsSection?.description || 'Discover our curated selection of premium furniture pieces'}</p>
          </div>

          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stories.map((story, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4 h-64 bg-gray-200">
                    {story.image_url ? (
                      <img src={story.image_url} alt={story.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-4xl">📦</div>
                    )}
                    <div className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition">❤️</div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition">{story.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{story.excerpt}</p>
                  <p className="text-xs text-gray-500">By {story.author}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg">No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== WHERE QUALITY MEETS STYLE ==================== */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6">{qualitySection?.heading || 'Where Quality Meets Style'}</h2>
              <p className="text-xl text-gray-300 mb-8">{qualitySection?.description || 'Every piece in our collection is carefully selected to ensure it meets our high standards for quality, design, and functionality.'}</p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">{qualitySection?.cta_text || 'Explore More'}</button>
            </div>
            <div className="relative h-96 bg-gray-700 rounded-2xl overflow-hidden">
              {qualitySection?.image_url ? (
                <img src={getFullImageUrl(qualitySection.image_url)} alt="Quality" className="w-full h-full object-cover" />
              ) : (
                gallery[0]?.image_url && <img src={gallery[0].image_url} alt="Quality" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY OUR FURNITURE IS SOMETHING MORE ==================== */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">{furnitureDetailsSection?.heading || 'Why Our Furniture Is Something More?'}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden">
              {furnitureDetailsSection?.image_url ? (
                <img src={getFullImageUrl(furnitureDetailsSection.image_url)} alt="Details" className="w-full h-full object-cover" />
              ) : (
                gallery[1]?.image_url && <img src={gallery[1].image_url} alt="Details" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-6">{furnitureDetailsSection?.subheading || 'Details Are Important'}</h3>
              <ul className="space-y-4">
                {(furnitureDetailsSection?.details && Array.isArray(furnitureDetailsSection.details) ? furnitureDetailsSection.details : [
                  'Premium materials sourced from trusted suppliers',
                  'Expert craftsmanship in every detail',
                  'Sustainable and eco-friendly production',
                  'Timeless designs that never go out of style',
                ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="text-2xl">✓</span>
                    <p className="text-gray-700">{typeof item === 'string' ? item : item.text || item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">{testimonialsSectionSettings?.heading || 'What Our Customers Say'}</h2>
          {testimonialsSectionSettings?.description && (
            <p className="text-center text-lg text-gray-600 mb-16">{testimonialsSectionSettings.description}</p>
          )}

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <div className="flex items-center gap-4 mb-6">
                    {testimonial.image_url && <img src={testimonial.image_url} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover" />}
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.comment}"</p>
                  <div className="text-yellow-400">{'⭐'.repeat(testimonial.rating)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-600 text-lg">No testimonials yet. Share your experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== STORIES/BLOG ==================== */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16">Stories About How We Work</h2>

          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories.slice(0, 3).map((story, idx) => (
                <article key={idx} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-6 h-64 bg-gray-300">
                    {story.image_url && <img src={story.image_url} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition uppercase">{story.title}</h3>
                  <p className="text-gray-600 mb-4">{story.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {story.author}</span>
                    <a href="#" className="text-blue-600 font-bold hover:underline">READ MORE →</a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg">No stories available yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* ==================== INSTAGRAM SECTION ==================== */}
      <section className="bg-gray-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Follow Us On Instagram</h2>
          <p className="text-2xl mb-8">@CozyCorner</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.slice(0, 4).map((item, idx) => (
              <div key={idx} className="relative h-48 bg-gray-700 rounded-lg overflow-hidden group cursor-pointer">
                {item.image_url && <img src={item.image_url} alt="Instagram" className="w-full h-full object-cover group-hover:scale-110 transition" />}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                  <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition">❤️</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
