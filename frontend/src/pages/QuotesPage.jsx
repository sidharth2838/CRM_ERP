import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import axios from 'axios';

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuote, setEditQuote] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchQuotes() {
      setLoading(true);
      try {
        const res = await axios.get('/api/quotes/');
        setQuotes(res.data.results || res.data || []);
        setError(null);
      } catch (e) {
        setError('Failed to load quotes');
        setQuotes([]);
      }
      setLoading(false);
    }
    fetchQuotes();
  }, []);

  const filteredQuotes = quotes.filter(
    (q) => (q.reference || '').toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => setShowAddModal(true);
  const handleEdit = (quote) => {
    setEditQuote(quote);
    setShowEditModal(true);
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditQuote(null);
  };
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    setQuotes(quotes.filter(q => q.id !== id));
    alert('Quote deleted successfully');
  };
  const handleImport = (e) => {
    alert('Import not implemented yet');
  };
  const handleExport = () => {
    alert('Export not implemented yet');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-20 px-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Quotes</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAdd}>Add</button>
          <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
            Import
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleImport} />
          </label>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={handleExport}>Export</button>
          <input
            type="text"
            placeholder="Filter by reference..."
            className="border px-3 py-2 rounded w-64"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Reference</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotes.map((q) => (
                  <tr key={q.id} className="border-t">
                    <td className="px-4 py-2">{q.reference || '-'}</td>
                    <td className="px-4 py-2">{q.customer || '-'}</td>
                    <td className="px-4 py-2">{q.date || '-'}</td>
                    <td className="px-4 py-2">{q.total || '-'}</td>
                    <td className="px-4 py-2">
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 mr-2" onClick={() => handleEdit(q)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(q.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredQuotes.length === 0 && <div className="text-gray-500 mt-4">No quotes found.</div>}
          </div>
        )}
        <Modal isOpen={showAddModal} onClose={handleCloseModal} title="Add Quote">
          <div>Quote add form goes here.</div>
        </Modal>
        <Modal isOpen={showEditModal} onClose={handleCloseModal} title="Edit Quote">
          <div>Edit form for {editQuote?.reference}</div>
        </Modal>
      </main>
    </div>
  );
};

export default QuotesPage;
