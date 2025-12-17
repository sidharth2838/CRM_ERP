import React, { useState } from 'react';
import axios from 'axios';

export default function ImageInput({ value, onChange, placeholder = "Add Image URL or Upload" }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('/api/website/upload-image/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.image_url) {
        onChange(response.data.image_url);
        setUploadError(null);
      }
    } catch (err) {
      setUploadError('Upload failed: ' + (err.response?.data?.error || err.message));
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (urlInput.startsWith('http')) {
      onChange(urlInput);
      setUrlInput('');
      setShowUrlInput(false);
    } else {
      setUploadError('Please enter a valid URL starting with http:// or https://');
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      {/* Display current image */}
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="w-32 h-24 object-cover rounded border-2 border-blue-300" />
          <button
            onClick={handleClear}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-center text-sm hover:bg-red-600 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload section */}
      <div className="space-y-2">
        {/* File Upload */}
        <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded bg-blue-50 hover:bg-blue-100 cursor-pointer transition">
          <div className="text-center">
            <span className="text-2xl">📤</span>
            <p className="text-sm font-semibold text-blue-600">
              {isUploading ? 'Uploading...' : 'Click or drag image here'}
            </p>
            <p className="text-xs text-gray-600">JPG, PNG, GIF, WebP (max 5MB)</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>

        {/* URL Input Toggle */}
        <button
          onClick={() => setShowUrlInput(!showUrlInput)}
          type="button"
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition"
        >
          {showUrlInput ? '✕ Hide URL Input' : '🔗 Add Image URL'}
        </button>

        {/* URL Input Form */}
        {showUrlInput && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                setUploadError(null);
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
              className="flex-1 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddUrl}
              type="button"
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>
        )}

        {/* Error message */}
        {uploadError && (
          <div className="px-3 py-2 bg-red-50 border border-red-300 rounded text-sm text-red-600">
            {uploadError}
          </div>
        )}
      </div>

      {/* Example URLs */}
      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
        <p className="font-semibold mb-1">📝 Example URLs:</p>
        <code className="block text-xs">https://picsum.photos/400/300</code>
        <code className="block text-xs">https://i.pravatar.cc/150?u=name</code>
      </div>
    </div>
  );
}
