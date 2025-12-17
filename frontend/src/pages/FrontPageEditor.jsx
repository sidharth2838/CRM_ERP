import React, { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ImageInput from '../components/ImageInput';

const WebsiteController = () => {
  const [activeTab, setActiveTab] = useState('siteinfo');
  const [siteInfo, setSiteInfo] = useState({ heading: '', subheading: '', description: '', hero_image: '' });
  const [heroSection, setHeroSection] = useState({ title: '', subtitle: '', image: '', cta_text: '' });
  const [collectionsSection, setCollectionsSection] = useState({ title: '', description: '' });
  const [qualitySection, setQualitySection] = useState({ heading: '', description: '', image_url: '', cta_text: '' });
  const [furnitureDetailsSection, setFurnitureDetailsSection] = useState({ heading: '', subheading: '', image_url: '', details: [] });
  const [testimonialsSectionSettings, setTestimonialsSectionSettings] = useState({ heading: '', description: '' });
  const [storiesSectionSettings, setStoriesSectionSettings] = useState({ heading: '', description: '' });
  const [features, setFeatures] = useState([]);
  const [stories, setStories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [newsletter, setNewsletter] = useState({ title: 'Subscribe to Our Newsletter', description: '', placeholder: 'Enter your email' });

  const [newFeature, setNewFeature] = useState({ title: '', description: '', icon: '✨' });
  const [newStory, setNewStory] = useState({ title: '', excerpt: '', author: '', image: '' });
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', comment: '', rating: 5, image: '' });
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', category: 'shipping' });
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [newGallery, setNewGallery] = useState({ title: '', image: '', category: 'rooms' });
  const [newPartner, setNewPartner] = useState({ name: '', logo: '', link: '' });
  
  // Navbar and Footer States
  const [navbarItems, setNavbarItems] = useState([]);
  const [newNavItem, setNewNavItem] = useState({ label: '', url: '', icon_class: '', order: 0, is_dropdown: false, parent_id: null });
  const [footerSections, setFooterSections] = useState([]);
  const [footerLinks, setFooterLinks] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [newFooterSection, setNewFooterSection] = useState({ column_title: '', column_type: 'about', content: '', order: 0 });
  const [newFooterLink, setNewFooterLink] = useState({ section_id: '', link_text: '', link_url: '', order: 0 });
  const [newSocialLink, setNewSocialLink] = useState({ platform: 'facebook', url: '', icon_class: '', order: 0 });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Direct API calls for each data type
  const addStoryToDB = async (storyData) => {
    try {
      // Only send image_url if it's a real URL, not base64
      const imageUrl = (storyData.image && storyData.image.startsWith('http')) ? storyData.image : '';
      const response = await axios.post('/website/stories/', {
        title: storyData.title,
        excerpt: storyData.excerpt,
        author: storyData.author,
        image_url: imageUrl,
      });
      console.log('✅ Story saved to DB:', response.data);
      setStories([...stories, response.data]);
      setSuccess('✅ Story saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save story:', err);
      setError('Failed to save story. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const addTestimonialToDB = async (testimonialData) => {
    try {
      // Only send image_url if it's a real URL, not base64
      const imageUrl = (testimonialData.image && testimonialData.image.startsWith('http')) ? testimonialData.image : '';
      const response = await axios.post('/website/testimonials/', {
        name: testimonialData.name,
        role: testimonialData.role,
        comment: testimonialData.comment,
        rating: testimonialData.rating,
        image_url: imageUrl,
      });
      console.log('✅ Testimonial saved to DB:', response.data);
      setTestimonials([...testimonials, response.data]);
      setSuccess('✅ Testimonial saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save testimonial:', err);
      setError('Failed to save testimonial. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const addGalleryToDB = async (galleryData) => {
    try {
      // Only send image_url if it's a valid URL (not Base64)
      const imageUrl = (galleryData.image && galleryData.image.startsWith('http')) ? galleryData.image : '';
      const response = await axios.post('/website/gallery/', {
        title: galleryData.title,
        image_url: imageUrl,
        category: galleryData.category || 'rooms',
      });
      console.log('✅ Gallery item saved to DB:', response.data);
      setGallery([...gallery, response.data]);
      setSuccess('✅ Gallery item saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save gallery item:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to save gallery item. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const addFaqToDB = async (faqData) => {
    try {
      const response = await axios.post('/website/faq/', {
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category || 'shipping',
      });
      console.log('✅ FAQ saved to DB:', response.data);
      setFaqs([...faqs, response.data]);
      setSuccess('✅ FAQ saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save FAQ:', err);
      setError('Failed to save FAQ. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const addPartnerToDB = async (partnerData) => {
    try {
      // Only send logo_url if it's a valid URL (not Base64)
      const logoUrl = (partnerData.logo && partnerData.logo.startsWith('http')) ? partnerData.logo : '';
      const response = await axios.post('/website/partners/', {
        name: partnerData.name,
        logo_url: logoUrl,
        link: partnerData.link || '',
      });
      console.log('✅ Partner saved to DB:', response.data);
      setPartners([...partners, response.data]);
      setSuccess('✅ Partner saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save partner:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to save partner. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const saveHeroSectionToDB = async () => {
    try {
      // Only send image_url if it's an actual URL (starts with http), not base64
      const imageUrl = (heroSection.image && heroSection.image.startsWith('http')) ? heroSection.image : '';
      
      const response = await axios.put('/website/hero/', {
        title: heroSection.title || '',
        subtitle: heroSection.subtitle || '',
        cta_text: heroSection.cta_text || '',
        image_url: imageUrl,
        hero_box_title: heroSection.hero_box_title || '',
        hero_box_text: heroSection.hero_box_text || '',
      });
      console.log('✅ Hero section saved to DB:', response.data);
      setHeroSection(response.data);
      setSuccess('✅ Hero Section saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save hero section:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      setError(`Failed to save hero section: ${errorMsg}`);
      setTimeout(() => setError(null), 5000);
      return false;
    }
  };

  const saveCollectionsSectionToDB = async () => {
    try {
      const response = await axios.put('/website/collections/', {
        title: collectionsSection.title || '',
        description: collectionsSection.description || '',
      });
      console.log('✅ Collections section saved to DB:', response.data);
      setCollectionsSection(response.data);
      setSuccess('✅ Collections Section saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save collections section:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      setError(`Failed to save collections section: ${errorMsg}`);
      setTimeout(() => setError(null), 5000);
      return false;
    }
  };

  const saveQualitySectionToDB = async () => {
    try {
      // Only send image_url if it's an actual URL (starts with http), not base64
      const imageUrl = (qualitySection.image_url && qualitySection.image_url.startsWith('http')) ? qualitySection.image_url : '';
      
      const response = await axios.put('/website/quality/', {
        heading: qualitySection.heading || '',
        description: qualitySection.description || '',
        image_url: imageUrl,
        cta_text: qualitySection.cta_text || '',
      });
      console.log('✅ Quality section saved to DB:', response.data);
      setQualitySection(response.data);
      setSuccess('✅ Quality Section saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save quality section:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      setError(`Failed to save quality section: ${errorMsg}`);
      setTimeout(() => setError(null), 5000);
      return false;
    }
  };

  const saveFurnitureDetailsSectionToDB = async () => {
    try {
      // Only send image_url if it's an actual URL (starts with http), not base64
      const imageUrl = (furnitureDetailsSection.image_url && furnitureDetailsSection.image_url.startsWith('http')) ? furnitureDetailsSection.image_url : '';
      
      const response = await axios.put('/website/furniture-details/', {
        heading: furnitureDetailsSection.heading || '',
        subheading: furnitureDetailsSection.subheading || '',
        image_url: imageUrl,
        details: furnitureDetailsSection.details || [],
      });
      console.log('✅ Furniture Details section saved to DB:', response.data);
      setFurnitureDetailsSection(response.data);
      setSuccess('✅ Furniture Details Section saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save furniture details section:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      setError(`Failed to save furniture details section: ${errorMsg}`);
      setTimeout(() => setError(null), 5000);
      return false;
    }
  };

  const saveTestimonialsSectionSettingsToDB = async () => {
    try {
      const response = await axios.put('/website/testimonials-section/', {
        heading: testimonialsSectionSettings.heading || '',
        description: testimonialsSectionSettings.description || '',
      });
      console.log('✅ Testimonials section settings saved to DB:', response.data);
      setTestimonialsSectionSettings(response.data);
      setSuccess('✅ Testimonials Section Settings saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save testimonials section settings:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      setError(`Failed to save testimonials section settings: ${errorMsg}`);
      setTimeout(() => setError(null), 5000);
      return false;
    }
  };

  const saveStoriesSectionSettingsToDB = async () => {
    try {
      const response = await axios.put('/website/stories-section/', {
        heading: storiesSectionSettings.heading,
        description: storiesSectionSettings.description
      });

      console.log('✅ Stories section settings saved successfully:', response.data);
      setSuccess('Stories section settings saved successfully!');
      setTimeout(() => setSuccess(null), 5000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save stories section settings:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      setError(`Failed to save stories section settings: ${errorMsg}`);
      setTimeout(() => setError(null), 5000);
      return false;
    }
  };

  const saveNewsletterToDB = async () => {
    try {
      const response = await axios.put('/website/newsletter/', {
        title: newsletter.title,
        description: newsletter.description,
        placeholder: newsletter.placeholder,
      });
      console.log('✅ Newsletter saved to DB:', response.data);
      setNewsletter(response.data);
      setSuccess('✅ Newsletter saved!');
      setTimeout(() => setSuccess(null), 2000);
      return true;
    } catch (err) {
      console.error('❌ Failed to save newsletter:', err);
      setError('Failed to save newsletter. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const updateStoryInDB = async (id, storyData) => {
    try {
      // Only send image_url if it's a real URL, not base64
      const imageUrl = (storyData.image && storyData.image.startsWith('http')) ? storyData.image : '';
      const response = await axios.put(`/website/stories/${id}/`, {
        title: storyData.title,
        excerpt: storyData.excerpt,
        author: storyData.author,
        image_url: imageUrl,
      });
      console.log('✅ Story updated in DB:', response.data);
      setStories(stories.map(s => s.id === id ? response.data : s));
      setSuccess('✅ Story updated!');
      setTimeout(() => setSuccess(null), 2000);
      setEditingStoryId(null);
      setNewStory({ title: '', excerpt: '', author: '', image: '' });
      return true;
    } catch (err) {
      console.error('❌ Failed to update story:', err);
      setError('Failed to update story. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const updateTestimonialInDB = async (id, testimonialData) => {
    try {
      // Only send image_url if it's a real URL, not base64
      const imageUrl = (testimonialData.image && testimonialData.image.startsWith('http')) ? testimonialData.image : '';
      const response = await axios.put(`/website/testimonials/${id}/`, {
        name: testimonialData.name,
        role: testimonialData.role,
        comment: testimonialData.comment,
        rating: testimonialData.rating,
        image_url: imageUrl,
      });
      console.log('✅ Testimonial updated in DB:', response.data);
      setTestimonials(testimonials.map(t => t.id === id ? response.data : t));
      setSuccess('✅ Testimonial updated!');
      setTimeout(() => setSuccess(null), 2000);
      setEditingTestimonialId(null);
      setNewTestimonial({ name: '', role: '', comment: '', rating: 5, image: '' });
      return true;
    } catch (err) {
      console.error('❌ Failed to update testimonial:', err);
      setError('Failed to update testimonial. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const updateFaqInDB = async (id, faqData) => {
    try {
      const response = await axios.put(`/website/faq/${id}/`, {
        question: faqData.question,
        answer: faqData.answer,
        category: faqData.category || 'shipping',
      });
      console.log('✅ FAQ updated in DB:', response.data);
      setFaqs(faqs.map(f => f.id === id ? response.data : f));
      setSuccess('✅ FAQ updated!');
      setTimeout(() => setSuccess(null), 2000);
      setEditingFaqId(null);
      setNewFaq({ question: '', answer: '', category: 'shipping' });
      return true;
    } catch (err) {
      console.error('❌ Failed to update FAQ:', err);
      setError('Failed to update FAQ. Check console.');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const deleteStoryFromDB = async (id) => {
    try {
      await axios.delete(`/website/stories/${id}/`);
      setStories(stories.filter(s => s.id !== id));
      setSuccess('✅ Story deleted!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('❌ Failed to delete story:', err);
      setError('Failed to delete story.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteTestimonialFromDB = async (id) => {
    try {
      await axios.delete(`/website/testimonials/${id}/`);
      setTestimonials(testimonials.filter(t => t.id !== id));
      setSuccess('✅ Testimonial deleted!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('❌ Failed to delete testimonial:', err);
      setError('Failed to delete testimonial.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteGalleryFromDB = async (id) => {
    try {
      await axios.delete(`/website/gallery/${id}/`);
      setGallery(gallery.filter(g => g.id !== id));
      setSuccess('✅ Gallery item deleted!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('❌ Failed to delete gallery item:', err);
      setError('Failed to delete gallery item.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteFaqFromDB = async (id) => {
    try {
      await axios.delete(`/website/faq/${id}/`);
      setFaqs(faqs.filter(f => f.id !== id));
      setSuccess('✅ FAQ deleted!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('❌ Failed to delete FAQ:', err);
      setError('Failed to delete FAQ.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deletePartnerFromDB = async (id) => {
    try {
      await axios.delete(`/website/partners/${id}/`);
      setPartners(partners.filter(p => p.id !== id));
      setSuccess('✅ Partner deleted!');
      setTimeout(() => setSuccess(null), 2000);
    } catch (err) {
      console.error('❌ Failed to delete partner:', err);
      setError('Failed to delete partner.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // ===== NAVBAR MANAGEMENT FUNCTIONS =====
  const loadNavbarConfig = async () => {
    try {
      const response = await axios.get('/website/navbar/get/');
      if (response.data.success) {
        setNavbarItems(response.data.navbar_items || []);
      }
    } catch (err) {
      console.error('❌ Failed to load navbar:', err);
      setError('Failed to load navbar configuration');
      setTimeout(() => setError(null), 3000);
    }
  };

  const saveNavbarItem = async () => {
    if (!newNavItem.label || !newNavItem.url) {
      setError('Please fill in label and URL');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      const response = await axios.post('/website/navbar/save/', newNavItem);
      if (response.data.success) {
        await loadNavbarConfig();
        setNewNavItem({ label: '', url: '', icon_class: '', order: 0, is_dropdown: false, parent_id: null });
        setSuccess('✅ Navbar item saved!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('❌ Failed to save navbar item:', err);
      setError('Failed to save navbar item');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteNavbarItem = async (id) => {
    try {
      const response = await axios.post('/website/navbar/delete/', { id });
      if (response.data.success) {
        await loadNavbarConfig();
        setSuccess('✅ Navbar item deleted!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('❌ Failed to delete navbar item:', err);
      setError('Failed to delete navbar item');
      setTimeout(() => setError(null), 3000);
    }
  };

  // ===== FOOTER MANAGEMENT FUNCTIONS =====
  const loadFooterConfig = async () => {
    try {
      const response = await axios.get('/website/footer/get/');
      if (response.data.success) {
        setFooterSections(response.data.footer_sections || []);
        setSocialLinks(response.data.social_links || []);
      }
    } catch (err) {
      console.error('❌ Failed to load footer:', err);
      setError('Failed to load footer configuration');
      setTimeout(() => setError(null), 3000);
    }
  };

  const saveFooterSection = async () => {
    if (!newFooterSection.column_title || !newFooterSection.column_type) {
      setError('Please fill in title and type');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      const response = await axios.post('/website/footer/section/save/', newFooterSection);
      if (response.data.success) {
        await loadFooterConfig();
        setNewFooterSection({ column_title: '', column_type: 'about', content: '', order: 0 });
        setSuccess('✅ Footer section saved!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('❌ Failed to save footer section:', err);
      setError('Failed to save footer section');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteFooterSection = async (id) => {
    try {
      const response = await axios.post('/website/footer/section/delete/', { id });
      if (response.data.success) {
        await loadFooterConfig();
        setSuccess('✅ Footer section deleted!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('❌ Failed to delete footer section:', err);
      setError('Failed to delete footer section');
      setTimeout(() => setError(null), 3000);
    }
  };

  const saveFooterLink = async () => {
    if (!newFooterLink.section_id || !newFooterLink.link_text || !newFooterLink.link_url) {
      setError('Please fill in all footer link fields');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      const response = await axios.post('/website/footer/link/save/', newFooterLink);
      if (response.data.success) {
        await loadFooterConfig();
        setNewFooterLink({ section_id: '', link_text: '', link_url: '', order: 0 });
        setSuccess('✅ Footer link saved!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('❌ Failed to save footer link:', err);
      setError('Failed to save footer link');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteFooterLink = async (id) => {
    try {
      const response = await axios.post('/website/footer/link/delete/', { id });
      if (response.data.success) {
        await loadFooterConfig();
        setSuccess('✅ Footer link deleted!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('❌ Failed to delete footer link:', err);
      setError('Failed to delete footer link');
      setTimeout(() => setError(null), 3000);
    }
  };

  const saveSocialLink = async () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      setError('Please fill in platform and URL');
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      const response = await axios.post('/website/footer/social/save/', newSocialLink);
      if (response.data.success) {
        await loadFooterConfig();
        setNewSocialLink({ platform: 'facebook', url: '', icon_class: '', order: 0 });
        setSuccess('✅ Social link saved!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('❌ Failed to save social link:', err);
      setError('Failed to save social link');
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteSocialLink = async (id) => {
    try {
      const response = await axios.post('/website/footer/social/delete/', { id });
      if (response.data.success) {
        await loadFooterConfig();
        setSuccess('✅ Social link deleted!');
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      console.error('❌ Failed to delete social link:', err);
      setError('Failed to delete social link');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Load from database on mount (this syncs public website data to admin panel)
  useEffect(() => {
    const loadDataFromDatabase = async () => {
      try {
        console.log('🔄 Loading website data from database...');
        
        // Fetch all data from database endpoints
        const [storiesRes, testimonialsRes, galleryRes, faqsRes, partnersRes, heroRes, collectionsRes, qualityRes, furnitureDetailsRes, testimonialsSectionRes, storiesSectionRes] = await Promise.all([
          axios.get('/website/stories/').catch(() => ({ data: [] })),
          axios.get('/website/testimonials/').catch(() => ({ data: [] })),
          axios.get('/website/gallery/').catch(() => ({ data: [] })),
          axios.get('/website/faq/').catch(() => ({ data: [] })),
          axios.get('/website/partners/').catch(() => ({ data: [] })),
          axios.get('/website/hero/').catch(() => ({ data: {} })),
          axios.get('/website/collections/').catch(() => ({ data: {} })),
          axios.get('/website/quality/').catch(() => ({ data: {} })),
          axios.get('/website/furniture-details/').catch(() => ({ data: {} })),
          axios.get('/website/testimonials-section/').catch(() => ({ data: {} })),
          axios.get('/website/stories-section/').catch(() => ({ data: {} })),
        ]);

        // Set all data from database
        if (storiesRes.data && Array.isArray(storiesRes.data)) setStories(storiesRes.data);
        if (testimonialsRes.data && Array.isArray(testimonialsRes.data)) setTestimonials(testimonialsRes.data);
        if (galleryRes.data && Array.isArray(galleryRes.data)) setGallery(galleryRes.data);
        if (faqsRes.data && Array.isArray(faqsRes.data)) setFaqs(faqsRes.data);
        if (partnersRes.data && Array.isArray(partnersRes.data)) setPartners(partnersRes.data);
        if (heroRes.data && typeof heroRes.data === 'object') setHeroSection(heroRes.data);
        if (collectionsRes.data && typeof collectionsRes.data === 'object') setCollectionsSection(collectionsRes.data);
        if (qualityRes.data && typeof qualityRes.data === 'object') setQualitySection(qualityRes.data);
        if (furnitureDetailsRes.data && typeof furnitureDetailsRes.data === 'object') setFurnitureDetailsSection(furnitureDetailsRes.data);
        if (testimonialsSectionRes.data && typeof testimonialsSectionRes.data === 'object') setTestimonialsSectionSettings(testimonialsSectionRes.data);
        if (storiesSectionRes.data && typeof storiesSectionRes.data === 'object') setStoriesSectionSettings(storiesSectionRes.data);

        console.log('✅ Database data loaded successfully');

        // Load navbar and footer configuration
        await Promise.all([
          loadNavbarConfig(),
          loadFooterConfig(),
        ]);

        // Also load from localStorage for features (if they exist)
        const stored = localStorage.getItem('websiteData');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.features && Array.isArray(data.features)) setFeatures(data.features);
          if (data.newsletter) setNewsletter(data.newsletter);
          if (data.siteInfo) setSiteInfo(data.siteInfo);
        }
      } catch (e) {
        console.error('Error loading data from database:', e);
        // Fallback to localStorage
        try {
          const stored = localStorage.getItem('websiteData');
          if (stored) {
            const data = JSON.parse(stored);
            if (data.features) setFeatures(data.features);
            if (data.stories) setStories(data.stories);
            if (data.testimonials) setTestimonials(data.testimonials);
            if (data.gallery) setGallery(data.gallery);
            if (data.faqs) setFaqs(data.faqs);
            if (data.partners) setPartners(data.partners);
            if (data.newsletter) setNewsletter(data.newsletter);
            if (data.siteInfo) setSiteInfo(data.siteInfo);
            if (data.heroSection) setHeroSection(data.heroSection);
          }
        } catch (err) {
          console.error('Error loading from localStorage:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDataFromDatabase();
  }, []);

  const handleImageUpload = (e, setState) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setState((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold">Loading Website Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-20 px-8 pb-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Website Manager</h1>

        <div className="flex gap-2 mb-8 border-b border-gray-300 flex-wrap overflow-x-auto">
          {['siteinfo', 'hero', 'collections', 'quality', 'furniture-details', 'stories-section', 'features', 'stories', 'testimonials-section', 'testimonials', 'gallery', 'faq', 'partners', 'navbar', 'footer', 'newsletter'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>}

        {/* SITE INFO */}
        {activeTab === 'siteinfo' && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Site Information</h2>
            <div className="space-y-4">
              <label className="block"><span className="font-semibold mb-2 block">Heading</span><input type="text" value={siteInfo.heading} onChange={(e) => setSiteInfo({ ...siteInfo, heading: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
              <label className="block"><span className="font-semibold mb-2 block">Subheading</span><input type="text" value={siteInfo.subheading} onChange={(e) => setSiteInfo({ ...siteInfo, subheading: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
              <label className="block"><span className="font-semibold mb-2 block">Description</span><textarea value={siteInfo.description} onChange={(e) => setSiteInfo({ ...siteInfo, description: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} /></label>
              <label className="block"><span className="font-semibold mb-2 block">Hero Image</span><ImageInput value={siteInfo.hero_image} onChange={(url) => setSiteInfo({ ...siteInfo, hero_image: url })} /></label>
            </div>
            <button onClick={() => { setSuccess('Site Info saved locally'); setTimeout(() => setSuccess(null), 3000); }} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Site Info</button>
          </div>
        )}

        {/* HERO */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Hero Section</h2>
            <div className="space-y-4">
              <label className="block"><span className="font-semibold mb-2 block">Title</span><input type="text" value={heroSection.title} onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Main hero title" /></label>
              <label className="block"><span className="font-semibold mb-2 block">Subtitle</span><input type="text" value={heroSection.subtitle} onChange={(e) => setHeroSection({ ...heroSection, subtitle: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Hero subtitle text" /></label>
              <label className="block"><span className="font-semibold mb-2 block">CTA Button Text</span><input type="text" value={heroSection.cta_text} onChange={(e) => setHeroSection({ ...heroSection, cta_text: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Shop Now" /></label>
              <label className="block"><span className="font-semibold mb-2 block">Hero Background Image</span><ImageInput value={heroSection.image} onChange={(url) => setHeroSection({ ...heroSection, image: url })} placeholder="Upload or paste background image URL" /></label>
              
              <div className="border-t pt-6 mt-6">
                <h3 className="font-bold text-lg mb-4 text-blue-600">Left Side Box Content</h3>
                <label className="block"><span className="font-semibold mb-2 block">Box Title</span><input type="text" value={heroSection.hero_box_title} onChange={(e) => setHeroSection({ ...heroSection, hero_box_title: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Featured Collection" /></label>
                <label className="block"><span className="font-semibold mb-2 block">Box Text</span><textarea value={heroSection.hero_box_text} onChange={(e) => setHeroSection({ ...heroSection, hero_box_text: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Text to display in the left side white box" /></label>
                <p className="text-xs text-gray-500 mt-2">The inner box will show minimized gallery images below this text</p>
              </div>
            </div>
            <button onClick={() => saveHeroSectionToDB()} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Hero Section</button>
          </div>
        )}

        {/* COLLECTIONS SECTION */}
        {activeTab === 'collections' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Our Latest Collections</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block font-semibold mb-2">Section Title</label>
                <input type="text" placeholder="OUR LATEST COLLECTIONS" value={collectionsSection.title} onChange={(e) => setCollectionsSection({ ...collectionsSection, title: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Section Description</label>
                <textarea placeholder="Discover our curated selection of premium furniture pieces" value={collectionsSection.description} onChange={(e) => setCollectionsSection({ ...collectionsSection, description: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
              </div>
            </div>
            <button onClick={() => saveCollectionsSectionToDB()} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Collections Section</button>
          </div>
        )}

        {/* QUALITY SECTION */}
        {activeTab === 'quality' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Where Quality Meets Style</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block font-semibold mb-2">Section Heading</label>
                <input type="text" placeholder="Where Quality Meets Style" value={qualitySection.heading} onChange={(e) => setQualitySection({ ...qualitySection, heading: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Section Description</label>
                <textarea placeholder="Every piece in our collection is carefully selected..." value={qualitySection.description} onChange={(e) => setQualitySection({ ...qualitySection, description: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
              </div>
              <div>
                <label className="block font-semibold mb-2">Call-to-Action Text</label>
                <input type="text" placeholder="Explore More" value={qualitySection.cta_text} onChange={(e) => setQualitySection({ ...qualitySection, cta_text: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Section Image</label>
                <ImageInput onImageSelected={(url) => setQualitySection({ ...qualitySection, image_url: url })} />
              </div>
            </div>
            <button onClick={() => saveQualitySectionToDB()} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Quality Section</button>
          </div>
        )}

        {/* FURNITURE DETAILS SECTION */}
        {activeTab === 'furniture-details' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Why Our Furniture Is Something More?</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block font-semibold mb-2">Section Heading</label>
                <input type="text" placeholder="Why Our Furniture Is Something More?" value={furnitureDetailsSection.heading} onChange={(e) => setFurnitureDetailsSection({ ...furnitureDetailsSection, heading: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Subheading</label>
                <input type="text" placeholder="Details Are Important" value={furnitureDetailsSection.subheading} onChange={(e) => setFurnitureDetailsSection({ ...furnitureDetailsSection, subheading: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Section Image</label>
                <ImageInput onImageSelected={(url) => setFurnitureDetailsSection({ ...furnitureDetailsSection, image_url: url })} />
              </div>
              <div>
                <label className="block font-semibold mb-2">Details List (one per line)</label>
                <textarea placeholder="Premium materials sourced from trusted suppliers&#10;Expert craftsmanship in every detail&#10;Sustainable and eco-friendly production&#10;Timeless designs that never go out of style" value={furnitureDetailsSection.details && Array.isArray(furnitureDetailsSection.details) ? furnitureDetailsSection.details.join('\n') : ''} onChange={(e) => setFurnitureDetailsSection({ ...furnitureDetailsSection, details: e.target.value.split('\n').filter(d => d.trim()) })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={5} />
              </div>
            </div>
            <button onClick={() => saveFurnitureDetailsSectionToDB()} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Furniture Details Section</button>
          </div>
        )}

        {/* STORIES SECTION SETTINGS */}
        {activeTab === 'stories-section' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Our Latest Collections</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block font-semibold mb-2">Section Heading</label>
                <input type="text" placeholder="Our Latest Collections" value={storiesSectionSettings.heading} onChange={(e) => setStoriesSectionSettings({ ...storiesSectionSettings, heading: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Section Description</label>
                <textarea placeholder="Discover our curated selection of unique furniture pieces" value={storiesSectionSettings.description} onChange={(e) => setStoriesSectionSettings({ ...storiesSectionSettings, description: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
              </div>
            </div>
            <button onClick={() => saveStoriesSectionSettingsToDB()} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Stories Section Settings</button>
          </div>
        )}

        {/* TESTIMONIALS SECTION SETTINGS */}
        {activeTab === 'testimonials-section' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block font-semibold mb-2">Section Heading</label>
                <input type="text" placeholder="What Our Customers Say" value={testimonialsSectionSettings.heading} onChange={(e) => setTestimonialsSectionSettings({ ...testimonialsSectionSettings, heading: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block font-semibold mb-2">Section Description</label>
                <textarea placeholder="Hear from our satisfied customers about their experiences" value={testimonialsSectionSettings.description} onChange={(e) => setTestimonialsSectionSettings({ ...testimonialsSectionSettings, description: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
              </div>
            </div>
            <button onClick={() => saveTestimonialsSectionSettingsToDB()} className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Testimonials Section Settings</button>
          </div>
        )}

        {/* FEATURES */}
        {activeTab === 'features' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">Add Feature</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Title" value={newFeature.title} onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })} className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Description" value={newFeature.description} onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })} className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={newFeature.icon} onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })} className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="✨">✨ Sparkles</option>
                  <option value="🌿">🌿 Leaf</option>
                  <option value="🎨">🎨 Palette</option>
                  <option value="💪">💪 Strength</option>
                  <option value="⭐">⭐ Star</option>
                  <option value="🏆">🏆 Trophy</option>
                </select>
              </div>
              <button onClick={() => { if (newFeature.title && newFeature.description) { const updated = [...features, { ...newFeature, id: Date.now() }]; setFeatures(updated); setNewFeature({ title: '', description: '', icon: '✨' }); setSuccess('Feature added!'); setTimeout(() => setSuccess(null), 2000); } else setError('Fill all fields'); }} className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Add Feature</button>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Features ({features.length})</h3>
              {features.map((f) => (
                <div key={f.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start">
                  <div><p className="text-3xl mb-2">{f.icon}</p><p className="font-semibold">{f.title}</p><p className="text-gray-600">{f.description}</p></div>
                  <button onClick={() => { const updated = features.filter(x => x.id !== f.id); setFeatures(updated); setSuccess('Feature deleted!'); setTimeout(() => setSuccess(null), 2000); }} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STORIES */}
        {activeTab === 'stories' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Stories</h2>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">{editingStoryId ? 'Edit Story' : 'Add Story'}</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Title" value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Excerpt" value={newStory.excerpt} onChange={(e) => setNewStory({ ...newStory, excerpt: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Author" value={newStory.author} onChange={(e) => setNewStory({ ...newStory, author: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div>
                  <label className="font-semibold mb-2 block">Story Image</label>
                  <ImageInput value={newStory.image} onChange={(url) => setNewStory({ ...newStory, image: url })} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { if (newStory.title && newStory.excerpt && newStory.author) { if (editingStoryId) { updateStoryInDB(editingStoryId, newStory); } else { addStoryToDB(newStory); setNewStory({ title: '', excerpt: '', author: '', image: '' }); } } else setError('Fill all fields'); }} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">{editingStoryId ? 'Update Story' : 'Add Story'}</button>
                {editingStoryId && <button onClick={() => { setEditingStoryId(null); setNewStory({ title: '', excerpt: '', author: '', image: '' }); }} className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:bg-gray-700">Cancel</button>}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Stories ({stories.length})</h3>
              {stories.map((s) => (
                <div key={s.id} className="p-4 border rounded-lg bg-gray-50">
                  {editingStoryId === s.id ? (
                    <div>Editing... (fields above)</div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1"><p className="font-semibold">{s.title}</p><p className="text-gray-600">{s.excerpt}</p><p className="text-sm text-gray-500">By {s.author}</p>{s.image && <img src={s.image} alt={s.title} className="w-32 h-24 object-cover rounded mt-2" />}</div>
                      <div className="flex gap-2 ml-2 whitespace-nowrap">
                        <button onClick={() => { setEditingStoryId(s.id); setNewStory(s); }} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Edit</button>
                        <button onClick={() => { deleteStoryFromDB(s.id); }} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Testimonials</h2>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">{editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Name" value={newTestimonial.name} onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Role" value={newTestimonial.role} onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <textarea placeholder="Comment" value={newTestimonial.comment} onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
                <select value={newTestimonial.rating} onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
                <div>
                  <label className="font-semibold mb-2 block">Testimonial Image</label>
                  <ImageInput value={newTestimonial.image} onChange={(url) => setNewTestimonial({ ...newTestimonial, image: url })} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { if (newTestimonial.name && newTestimonial.comment) { if (editingTestimonialId) { updateTestimonialInDB(editingTestimonialId, newTestimonial); } else { addTestimonialToDB(newTestimonial); setNewTestimonial({ name: '', role: '', comment: '', rating: 5, image: '' }); } } else setError('Fill name and comment'); }} className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">{editingTestimonialId ? 'Update Testimonial' : 'Add Testimonial'}</button>
                {editingTestimonialId && <button onClick={() => { setEditingTestimonialId(null); setNewTestimonial({ name: '', role: '', comment: '', rating: 5, image: '' }); }} className="bg-gray-600 text-white px-6 py-2 rounded font-bold hover:bg-gray-700">Cancel</button>}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Testimonials ({testimonials.length})</h3>
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 border rounded-lg bg-gray-50">
                  {editingTestimonialId === t.id ? (
                    <div>Editing... (fields above)</div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1"><p className="font-semibold">{t.name}</p><p className="text-sm text-gray-600 mb-1">{t.role}</p><p className="text-yellow-500 mb-2">{'⭐'.repeat(t.rating)}</p><p className="text-gray-700">"{t.comment}"</p>{t.image && <img src={t.image} alt={t.name} className="w-16 h-16 rounded mt-2" />}</div>
                      <div className="flex gap-2 ml-2 whitespace-nowrap">
                        <button onClick={() => { setEditingTestimonialId(t.id); setNewTestimonial(t); }} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">Edit</button>
                        <button onClick={() => { deleteTestimonialFromDB(t.id); }} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">Add Gallery Item</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Title" value={newGallery.title} onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={newGallery.category} onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="rooms">Living Rooms</option>
                  <option value="bedrooms">Bedrooms</option>
                  <option value="kitchens">Kitchens</option>
                  <option value="outdoor">Outdoor</option>
                </select>
                <div>
                  <label className="font-semibold mb-2 block">Gallery Image</label>
                  <ImageInput value={newGallery.image} onChange={(url) => setNewGallery({ ...newGallery, image: url })} />
                </div>
              </div>
              <button onClick={() => { if (newGallery.title) { addGalleryToDB(newGallery); setNewGallery({ title: '', image: '', category: 'rooms' }); } else setError('Fill title'); }} className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Add Item</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="border rounded-lg overflow-hidden bg-gray-50">
                  <img src={item.image_url || item.image} alt={item.title} className="w-full h-32 object-cover" />
                  <div className="p-2"><p className="font-semibold text-sm">{item.title}</p><p className="text-xs text-gray-500 mb-2">{item.category}</p><button onClick={() => { deleteGalleryFromDB(item.id); }} className="bg-red-600 text-white px-2 py-1 rounded text-xs w-full hover:bg-red-700">Remove</button></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">FAQ</h2>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">Add FAQ Item</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Question" value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <textarea placeholder="Answer" value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
                <select value={newFaq.category} onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="shipping">Shipping</option>
                  <option value="returns">Returns</option>
                  <option value="payment">Payment</option>
                  <option value="products">Products</option>
                </select>
              </div>
              <button onClick={() => { if (newFaq.question && newFaq.answer) { addFaqToDB(newFaq); setNewFaq({ question: '', answer: '', category: 'shipping' }); } else setError('Fill question and answer'); }} className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Add FAQ</button>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-lg">FAQs ({faqs.length})</h3>
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-start">
                  <div className="flex-1"><p className="font-semibold">{faq.question}</p><p className="text-gray-700 mt-2">{faq.answer}</p><span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{faq.category}</span></div>
                  <button onClick={() => { deleteFaqFromDB(faq.id); }} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 whitespace-nowrap ml-2">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PARTNERS */}
        {activeTab === 'partners' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Partners & Brands</h2>
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">Add Partner Brand</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Brand name" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Website link (optional)" value={newPartner.link} onChange={(e) => setNewPartner({ ...newPartner, link: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <ImageInput value={newPartner.logo} onChange={(logo) => setNewPartner({ ...newPartner, logo })} placeholder="Upload or paste logo URL" />
              </div>
              <button onClick={() => { if (newPartner.name) { addPartnerToDB(newPartner); setNewPartner({ name: '', logo: '', link: '' }); } else setError('Fill partner name'); }} className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Add Partner</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {partners.map((partner) => (
                <div key={partner.id} className="border rounded-lg p-4 bg-gray-50 text-center">
                  {(partner.logo_url || partner.logo) && <img src={partner.logo_url || partner.logo} alt={partner.name} className="w-full h-24 object-contain mb-2" />}
                  <p className="font-semibold text-sm mb-2">{partner.name}</p>
                  {partner.link && <a href={partner.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs mb-2 block hover:underline">Visit Site</a>}
                  <button onClick={() => { deletePartnerFromDB(partner.id); }} className="bg-red-600 text-white px-2 py-1 rounded text-xs w-full hover:bg-red-700">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NAVBAR */}
        {activeTab === 'navbar' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Navigation Bar</h2>
            
            {/* Add Navbar Item */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">Add Navigation Item</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Menu Label" value={newNavItem.label} onChange={(e) => setNewNavItem({ ...newNavItem, label: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="URL (e.g., /products)" value={newNavItem.url} onChange={(e) => setNewNavItem({ ...newNavItem, url: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Icon Class (e.g., fas fa-home)" value={newNavItem.icon_class} onChange={(e) => setNewNavItem({ ...newNavItem, icon_class: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="flex gap-4">
                  <label className="flex items-center"><input type="checkbox" checked={newNavItem.is_dropdown} onChange={(e) => setNewNavItem({ ...newNavItem, is_dropdown: e.target.checked })} className="mr-2" /> Is Dropdown</label>
                  <input type="number" placeholder="Order" value={newNavItem.order} onChange={(e) => setNewNavItem({ ...newNavItem, order: parseInt(e.target.value) })} className="border px-4 py-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <button onClick={saveNavbarItem} className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Add Menu Item</button>
            </div>

            {/* Current Navigation Items */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Current Menu Items</h3>
              {navbarItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded border">
                  <div className="flex-1">
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.url}</p>
                    {item.submenu && item.submenu.length > 0 && <p className="text-xs text-gray-500">Submenu items: {item.submenu.length}</p>}
                  </div>
                  <button onClick={() => deleteNavbarItem(item.id)} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        {activeTab === 'footer' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Footer Management</h2>
            
            {/* Add Footer Section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
              <h3 className="font-bold text-lg mb-4">Add Footer Section</h3>
              <div className="space-y-3">
                <input type="text" placeholder="Section Title" value={newFooterSection.column_title} onChange={(e) => setNewFooterSection({ ...newFooterSection, column_title: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={newFooterSection.column_type} onChange={(e) => setNewFooterSection({ ...newFooterSection, column_type: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="about">About Us</option>
                  <option value="menu">Menu Links</option>
                  <option value="account">Account Links</option>
                  <option value="info">Information Links</option>
                  <option value="contact">Contact Info</option>
                </select>
                <textarea placeholder="Content (for about/contact sections)" value={newFooterSection.content} onChange={(e) => setNewFooterSection({ ...newFooterSection, content: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} />
                <input type="number" placeholder="Order" value={newFooterSection.order} onChange={(e) => setNewFooterSection({ ...newFooterSection, order: parseInt(e.target.value) })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={saveFooterSection} className="mt-4 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700">Add Section</button>
            </div>

            {/* Add Footer Link */}
            {footerSections.length > 0 && (
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-bold text-lg mb-4">Add Footer Link</h3>
                <div className="space-y-3">
                  <select value={newFooterLink.section_id} onChange={(e) => setNewFooterLink({ ...newFooterLink, section_id: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select Section</option>
                    {footerSections.filter(s => ['menu', 'account', 'info'].includes(s.column_type)).map(section => (
                      <option key={section.id} value={section.id}>{section.column_title}</option>
                    ))}
                  </select>
                  <input type="text" placeholder="Link Text" value={newFooterLink.link_text} onChange={(e) => setNewFooterLink({ ...newFooterLink, link_text: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Link URL" value={newFooterLink.link_url} onChange={(e) => setNewFooterLink({ ...newFooterLink, link_url: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="number" placeholder="Order" value={newFooterLink.order} onChange={(e) => setNewFooterLink({ ...newFooterLink, order: parseInt(e.target.value) })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={saveFooterLink} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Add Link</button>
              </div>
            )}

            {/* Add Social Media Link */}
            <div className="mb-8 p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
              <h3 className="font-bold text-lg mb-4">Add Social Media Link</h3>
              <div className="space-y-3">
                <select value={newSocialLink.platform} onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
                <input type="text" placeholder="Social Media URL" value={newSocialLink.url} onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Icon Class (e.g., fab fa-facebook)" value={newSocialLink.icon_class} onChange={(e) => setNewSocialLink({ ...newSocialLink, icon_class: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Order" value={newSocialLink.order} onChange={(e) => setNewSocialLink({ ...newSocialLink, order: parseInt(e.target.value) })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button onClick={saveSocialLink} className="mt-4 bg-purple-600 text-white px-6 py-2 rounded font-bold hover:bg-purple-700">Add Social Link</button>
            </div>

            {/* Footer Sections Display */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Footer Sections</h3>
              {footerSections.map((section) => (
                <div key={section.id} className="bg-gray-50 p-4 rounded border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{section.column_title}</p>
                      <p className="text-sm text-gray-600">Type: {section.column_type}</p>
                    </div>
                    <button onClick={() => deleteFooterSection(section.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                  </div>
                  {section.links && section.links.length > 0 && (
                    <div className="ml-4 mt-2 space-y-1 text-sm">
                      {section.links.map((link) => (
                        <div key={link.id} className="flex justify-between items-center py-1 px-2 bg-white rounded">
                          <span>{link.link_text}</span>
                          <button onClick={() => deleteFooterLink(link.id)} className="text-red-600 text-xs hover:underline">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social Links Display */}
            {socialLinks.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-bold text-lg">Social Media Links</h3>
                {socialLinks.map((social) => (
                  <div key={social.id} className="flex justify-between items-center bg-gray-50 p-4 rounded border">
                    <div>
                      <p className="font-semibold">{social.platform.toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{social.url}</p>
                    </div>
                    <button onClick={() => deleteSocialLink(social.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NEWSLETTER */}
        {activeTab === 'newsletter' && (
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Newsletter Settings</h2>
            <div className="space-y-4">
              <label className="block"><span className="font-semibold mb-2 block">Section Title</span><input type="text" value={newsletter.title} onChange={(e) => setNewsletter({ ...newsletter, title: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
              <label className="block"><span className="font-semibold mb-2 block">Description</span><textarea value={newsletter.description} onChange={(e) => setNewsletter({ ...newsletter, description: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} /></label>
              <label className="block"><span className="font-semibold mb-2 block">Email Placeholder</span><input type="text" value={newsletter.placeholder} onChange={(e) => setNewsletter({ ...newsletter, placeholder: e.target.value })} className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" /></label>
            </div>
            <button onClick={() => saveNewsletterToDB()} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition">Save Newsletter Settings</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default WebsiteController;
