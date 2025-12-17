import React, { useState } from 'react';
import axios from 'axios';

const HeroSectionEditor = ({ data }) => {
  const [form, setForm] = useState({
    heading: data?.heading || '',
    subheading: data?.subheading || '',
    background_color: data?.background_color || '',
    cta_button_text: data?.cta_button_text || '',
    cta_button_url: data?.cta_button_url || '',
    text_color: data?.text_color || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      await axios.put('/api/homepage/hero/', form);
      setSuccess(true);
    } catch (e) {
      setError('Failed to save hero section');
    }
    setSaving(false);
  };

  return (
    <div className="mb-8 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-2">Edit Hero Section</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="heading" value={form.heading} onChange={handleChange} placeholder="Heading" className="border p-2 rounded" />
        <input name="subheading" value={form.subheading} onChange={handleChange} placeholder="Subheading" className="border p-2 rounded" />
        <input name="background_color" value={form.background_color} onChange={handleChange} placeholder="Background Color" className="border p-2 rounded" />
        <input name="cta_button_text" value={form.cta_button_text} onChange={handleChange} placeholder="CTA Button Text" className="border p-2 rounded" />
        <input name="cta_button_url" value={form.cta_button_url} onChange={handleChange} placeholder="CTA Button URL" className="border p-2 rounded" />
        <input name="text_color" value={form.text_color} onChange={handleChange} placeholder="Text Color" className="border p-2 rounded" />
      </div>
      <button onClick={handleSave} disabled={saving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        {saving ? 'Saving...' : 'Save'}
      </button>
      {success && <div className="text-green-600 mt-2">Saved!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default HeroSectionEditor;
