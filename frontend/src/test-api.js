import axios from './api/axiosConfig';

async function testAPI() {
  try {
    console.log('Testing API calls...');
    
    const heroRes = await axios.get('/website/hero/');
    console.log('Hero response:', heroRes);
    
    const storiesRes = await axios.get('/website/stories/');
    console.log('Stories response:', storiesRes);
    
    const galleryRes = await axios.get('/website/gallery/');
    console.log('Gallery response:', galleryRes);
    
    const testimonialsRes = await axios.get('/website/testimonials/');
    console.log('Testimonials response:', testimonialsRes);
  } catch (error) {
    console.error('Error:', error);
  }
}

export default testAPI;
