import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import axios from 'axios';

const OffersForLeadsPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchOffers() {
      setLoading(true);
      try {
        // API endpoint not implemented - using demo data
        const demoOffers = [
          { id: 1, title: 'Special Discount 20%', lead: 'John Smith', status: 'Pending' },
          { id: 2, title: 'Free Consultation', lead: 'Jane Doe', status: 'Accepted' },
          { id: 3, title: 'Bundle Deal', lead: 'Bob Johnson', status: 'Rejected' },
        ];
        setOffers(demoOffers);
        setError(null);
      } catch (e) {
        setError('Failed to load offers');
        setOffers([]);
      }
      setLoading(false);
    }
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter(
    (o) => (o.title || '').toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => setShowAddModal(true);
  const handleEdit = (offer) => {
    setEditOffer(offer);
    setShowEditModal(true);
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditOffer(null);
  };
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    setOffers(offers.filter(o => o.id !== id));
    alert('Offer deleted successfully');
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
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Offers for Leads</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAdd}>Add</button>
          <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
            Import
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleImport} />
          </label>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={handleExport}>Export</button>
          <input
            type="text"
            placeholder="Filter by title..."
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
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Lead</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-4 py-2">{o.title || '-'}</td>
                    <td className="px-4 py-2">{o.lead || '-'}</td>
                    <td className="px-4 py-2">{o.status || '-'}</td>
                    <td className="px-4 py-2">
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 mr-2" onClick={() => handleEdit(o)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(o.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOffers.length === 0 && <div className="text-gray-500 mt-4">No offers found.</div>}
          </div>
        )}
        <Modal isOpen={showAddModal} onClose={handleCloseModal} title="Add Offer for Lead">
          <div>Offer add form goes here.</div>
        </Modal>
        <Modal isOpen={showEditModal} onClose={handleCloseModal} title="Edit Offer for Lead">
          <div>Edit form for {editOffer?.title}</div>
        </Modal>
      </main>
    </div>
  );
};

export default OffersForLeadsPage;
