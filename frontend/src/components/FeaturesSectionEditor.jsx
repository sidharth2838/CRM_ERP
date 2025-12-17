import React, { useState } from 'react';
import axios from 'axios';

const FeaturesSectionEditor = ({ data }) => {
  const [features, setFeatures] = useState(data || []);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Simple feature editing (title/description only)
  const handleChange = (idx, field, value) => {
    const updated = [...features];
    updated[idx][field] = value;
    setFeatures(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // Save all features (PUT or POST per feature, adjust as needed)
      await Promise.all(features.map(f => axios.put(`/api/homepage/features/${f.id}/`, f)));
      setSuccess(true);
    } catch (e) {
      setError('Failed to save features');
    }
    setSaving(false);
  };

  return (
    <div className="mb-8 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-2">Edit Features Section</h3>
      {features.length === 0 ? (
        <div className="text-gray-400">No features found.</div>
      ) : (
        <div className="space-y-4">
          {features.map((f, idx) => (
            <div key={f.id} className="border rounded p-2">
              <input name="title" value={f.title} onChange={e => handleChange(idx, 'title', e.target.value)} placeholder="Title" className="border p-2 rounded w-full mb-2" />
              <textarea name="description" value={f.description} onChange={e => handleChange(idx, 'description', e.target.value)} placeholder="Description" className="border p-2 rounded w-full mb-2" />
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

export default FeaturesSectionEditor;
