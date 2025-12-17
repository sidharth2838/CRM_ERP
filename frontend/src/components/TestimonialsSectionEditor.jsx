import React, { useState } from 'react';
import axios from 'axios';

const TestimonialsSectionEditor = ({ data }) => {
  const [testimonials, setTestimonials] = useState(data || []);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (idx, field, value) => {
    const updated = [...testimonials];
    updated[idx][field] = value;
    setTestimonials(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await Promise.all(testimonials.map(t => axios.put(`/api/homepage/testimonials/${t.id}/`, t)));
      setSuccess(true);
    } catch (e) {
      setError('Failed to save testimonials');
    }
    setSaving(false);
  };

  return (
    <div className="mb-8 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-2">Edit Testimonials Section</h3>
      {testimonials.length === 0 ? (
        <div className="text-gray-400">No testimonials found.</div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t, idx) => (
            <div key={t.id} className="border rounded p-2">
              <input name="author_name" value={t.author_name} onChange={e => handleChange(idx, 'author_name', e.target.value)} placeholder="Author Name" className="border p-2 rounded w-full mb-2" />
              <input name="author_title" value={t.author_title} onChange={e => handleChange(idx, 'author_title', e.target.value)} placeholder="Author Title" className="border p-2 rounded w-full mb-2" />
              <textarea name="testimonial_text" value={t.testimonial_text} onChange={e => handleChange(idx, 'testimonial_text', e.target.value)} placeholder="Testimonial" className="border p-2 rounded w-full mb-2" />
              <input name="rating" type="number" min="1" max="5" value={t.rating} onChange={e => handleChange(idx, 'rating', e.target.value)} className="border p-2 rounded w-full mb-2" />
            </div>
          ))}
        </div>
      )}
      <button onClick={handleSave} disabled={saving} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        {saving ? 'Saving...' : 'Save All'}
      </button>
      {success && <div className="text-green-600 mt-2">Saved!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default TestimonialsSectionEditor;
