import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import axios from 'axios';

const ExpenseCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        // API endpoint not implemented - using demo data
        const demoCategories = [
          { id: 1, name: 'Office Supplies' },
          { id: 2, name: 'Travel' },
          { id: 3, name: 'Food & Dining' },
          { id: 4, name: 'Equipment' },
        ];
        setCategories(demoCategories);
        setError(null);
      } catch (e) {
        setError('Failed to load categories');
        setCategories([]);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (c) => (c.name || '').toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => setShowAddModal(true);
  const handleEdit = (category) => {
    setEditCategory(category);
    setShowEditModal(true);
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditCategory(null);
  };
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setCategories(categories.filter(c => c.id !== id));
    alert('Category deleted successfully');
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
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Expense Categories</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAdd}>Add</button>
          <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
            Import
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleImport} />
          </label>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={handleExport}>Export</button>
          <input
            type="text"
            placeholder="Filter by name..."
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
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2">{c.name || '-'}</td>
                    <td className="px-4 py-2">{c.description || '-'}</td>
                    <td className="px-4 py-2">
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 mr-2" onClick={() => handleEdit(c)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCategories.length === 0 && <div className="text-gray-500 mt-4">No categories found.</div>}
          </div>
        )}
        <Modal isOpen={showAddModal} onClose={handleCloseModal} title="Add Expense Category">
          <div>Category add form goes here.</div>
        </Modal>
        <Modal isOpen={showEditModal} onClose={handleCloseModal} title="Edit Expense Category">
          <div>Edit form for {editCategory?.name}</div>
        </Modal>
      </main>
    </div>
  );
};

export default ExpenseCategoryPage;
