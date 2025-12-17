import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeroSectionEditor from '../components/HeroSectionEditor';
import FeaturesSectionEditor from '../components/FeaturesSectionEditor';
import TestimonialsSectionEditor from '../components/TestimonialsSectionEditor';
// Placeholder imports for other editors
// import NavigationEditor from '../components/NavigationEditor';
// import FooterEditor from '../components/FooterEditor';
// import SocialLinksEditor from '../components/SocialLinksEditor';
// import SEOEditor from '../components/SEOEditor';
// import SiteInfoEditor from '../components/SiteInfoEditor';

const sectionEndpoints = {
  hero: '/api/homepage/hero/',
  features: '/api/homepage/features/',
  testimonials: '/api/homepage/testimonials/',
  navigation: '/api/homepage/navigation/',
  footer: '/api/homepage/footer/',
  social: '/api/homepage/social/',
  seo: '/api/homepage/seo/',
  siteinfo: '/api/siteinfo/',
};

const WebsiteController = () => {
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllSections() {
      setLoading(true);
      try {
        const results = {};
        for (const [key, url] of Object.entries(sectionEndpoints)) {
          try {
            const res = await axios.get(url);
            results[key] = res.data;
          } catch (e) {
            results[key] = null;
          }
        }
        setSections(results);
        setError(null);
      } catch (e) {
        setError('Failed to load homepage sections');
      }
      setLoading(false);
    }
    fetchAllSections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Website Controller</h1>
      {loading ? (
        <div>Loading homepage sections...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-8 w-full max-w-3xl">
          <HeroSectionEditor data={sections.hero} />
          <FeaturesSectionEditor data={sections.features} />
          <TestimonialsSectionEditor data={sections.testimonials} />
          {/* Add more editors here as you implement them */}
          {/* <NavigationEditor data={sections.navigation} /> */}
          {/* <FooterEditor data={sections.footer} /> */}
          {/* <SocialLinksEditor data={sections.social} /> */}
          {/* <SEOEditor data={sections.seo} /> */}
          {/* <SiteInfoEditor data={sections.siteinfo} /> */}
        </div>
      )}
    </div>
  );
};

export default WebsiteController;
