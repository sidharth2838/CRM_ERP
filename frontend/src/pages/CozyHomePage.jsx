import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CozyHomePage = () => {
  const [siteInfo, setSiteInfo] = useState(null);
  const [heroSection, setHeroSection] = useState(null);
  const [features, setFeatures] = useState([]);
  const [stories, setStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [newsletter, setNewsletter] = useState({ title: 'Subscribe to Our Newsletter', description: '', placeholder: 'Enter your email' });
  const [loading, setLoading] = useState(true);

  // Fetch website data from API (database) on component mount
  useEffect(() => {
    const fetchWebsiteDataFromAPI = async () => {
      try {
        console.log('📡 Fetching website data from API...');
        
        // Fetch all data in parallel
        const [storiesRes, testimonialsRes, galleryRes, faqsRes, partnersRes, heroRes, newsletterRes] = await Promise.all([
          axios.get('/website/stories/').catch(() => ({ data: [] })),
          axios.get('/website/testimonials/').catch(() => ({ data: [] })),
          axios.get('/website/gallery/').catch(() => ({ data: [] })),
          axios.get('/website/faq/').catch(() => ({ data: [] })),
          axios.get('/website/partners/').catch(() => ({ data: [] })),
          axios.get('/website/hero/').catch(() => ({ data: {} })),
          axios.get('/website/newsletter/').catch(() => ({ data: {} })),
        ]);

        console.log('✅ API Stories:', storiesRes.data.length, 'items');
        console.log('✅ API Testimonials:', testimonialsRes.data.length, 'items');
        console.log('✅ API Gallery:', galleryRes.data.length, 'items');
        console.log('✅ API FAQs:', faqsRes.data.length, 'items');
        console.log('✅ API Partners:', partnersRes.data.length, 'items');

        // Update state with API data (database is the source of truth)
        if (Array.isArray(storiesRes.data)) setStories(storiesRes.data);
        if (Array.isArray(testimonialsRes.data)) setTestimonials(testimonialsRes.data);
        if (Array.isArray(galleryRes.data)) setGallery(galleryRes.data);
        if (Array.isArray(faqsRes.data)) setFaqs(faqsRes.data);
        if (Array.isArray(partnersRes.data)) setPartners(partnersRes.data);
        if (heroRes.data && typeof heroRes.data === 'object') setHeroSection(heroRes.data);
        if (newsletterRes.data && typeof newsletterRes.data === 'object') setNewsletter(newsletterRes.data);
      } catch (e) {
        console.error('❌ Error fetching website data from API:', e);
      }
    };
    
    // Fetch from API immediately
    fetchWebsiteDataFromAPI();

    // No longer fetching products
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Header />

      {/* Hero Section */}
      {(
        <section className="relative h-96 bg-gradient-to-r from-orange-50 to-red-50 flex items-center">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 gap-8 items-center w-full">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">{heroSection?.title || 'Welcome to CozyCorner'}</h1>
              <p className="text-xl text-gray-700 mb-6">{heroSection?.subtitle || 'Discover premium furniture for your cozy home'}</p>
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-semibold">
                {heroSection?.cta_text || 'Explore Products'}
              </button>
            </div>
            {heroSection?.image && (
              <img src={heroSection.image} alt="Hero" className="w-full h-80 object-cover rounded-lg" />
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Why Our Furniture Are Something More?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.id} className="text-center">
                  <div className="text-5xl mb-4">{feature.icon || '✨'}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* Stories Section */}
      {stories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-gray-900">Stories About How We Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stories.map((story) => (
                <article key={story.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                  {story.image ? (
                    <img src={story.image} alt={story.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="bg-gray-300 h-48 flex items-center justify-center">
                      <span className="text-gray-500">Story Image</span>
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{story.author}</p>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{story.title}</h3>
                    <p className="text-gray-600 mb-4">{story.excerpt}</p>
                    <a href="#" className="text-orange-600 font-semibold hover:text-orange-700">
                      Read More →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="text-yellow-500 mb-3">{'⭐'.repeat(testimonial.rating)}</div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-4">
                    {testimonial.image && (
                      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Inspiration Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-110 transition" />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Gallery Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center">
                    <p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.id} className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition">
                  <summary className="font-semibold text-gray-900 flex justify-between items-center">
                    {faq.question}
                    <span className="ml-2">+</span>
                  </summary>
                  <p className="text-gray-700 mt-4">{faq.answer}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{faq.category}</span>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partners Section */}
      {partners.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">Our Partners & Brands</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
                  {partner.logo ? (
                    <img src={partner.logo} alt={partner.name} className="h-20 object-contain" />
                  ) : (
                    <span className="text-gray-500 text-center">{partner.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-orange-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Follow Us on Instagram</h2>
          <p className="text-lg mb-8 opacity-90">Join our community and stay inspired with the latest collections</p>
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded text-gray-900 focus:outline-none"
            />
            <button className="bg-gray-900 px-8 py-3 rounded font-semibold hover:bg-gray-800 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CozyHomePage;
