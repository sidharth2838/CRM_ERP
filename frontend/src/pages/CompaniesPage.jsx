import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import { companyService } from '../services/api';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    contact_person: ''
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchCompanies();
  }, [page]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyService.getAll({ page, page_size: pageSize });
      if (response.data.success) {
        setCompanies(response.data.results);
        setError(null);
      } else {
        setError('Failed to load companies');
        setCompanies([]);
      }
    } catch (e) {
      setError('Failed to load companies');
      setCompanies([]);
    }
    setLoading(false);
  };

  const filteredCompanies = companies.filter(
    (c) => (c.name || '').toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      contact_person: ''
    });
    setShowAddModal(true);
  };

  const handleEdit = (company) => {
    setEditCompany(company);
    setFormData({
      name: company.name,
      address: company.address,
      phone: company.phone,
      email: company.email,
      contact_person: company.contact_person
    });
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditCompany(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      contact_person: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveAdd = async () => {
    if (!formData.name.trim()) {
      alert('Company name is required');
      return;
    }

    try {
      const response = await companyService.create(formData);
      if (response.data.success) {
        setCompanies([response.data.company, ...companies]);
        handleCloseModal();
        alert('Company added successfully');
      } else {
        alert(response.data.error || 'Failed to add company');
      }
    } catch (e) {
      alert('Error adding company: ' + (e.response?.data?.error || e.message));
    }
  };

  const handleSaveEdit = async () => {
    if (!formData.name.trim()) {
      alert('Company name is required');
      return;
    }

    try {
      const response = await companyService.update(editCompany.id, formData);
      if (response.data.success) {
        const updatedCompanies = companies.map(c =>
          c.id === editCompany.id ? { ...c, ...formData } : c
        );
        setCompanies(updatedCompanies);
        handleCloseModal();
        alert('Company updated successfully');
      } else {
        alert(response.data.error || 'Failed to update company');
      }
    } catch (e) {
      alert('Error updating company: ' + (e.response?.data?.error || e.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    
    try {
      const response = await companyService.delete(id);
      if (response.data.success) {
        setCompanies(companies.filter(c => c.id !== id));
        alert('Company deleted successfully');
      } else {
        alert(response.data.error || 'Failed to delete company');
      }
    } catch (e) {
      alert('Error deleting company: ' + (e.response?.data?.error || e.message));
    }
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
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Companies</h1>
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
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Contact Person</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-2">{c.name || '-'}</td>
                    <td className="px-4 py-2">{c.email || '-'}</td>
                    <td className="px-4 py-2">{c.phone || '-'}</td>
                    <td className="px-4 py-2">{c.contact_person || '-'}</td>
                    <td className="px-4 py-2">
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 mr-2" onClick={() => handleEdit(c)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(c.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCompanies.length === 0 && <div className="text-gray-500 mt-4">No companies found.</div>}
          </div>
        )}
        <Modal isOpen={showAddModal} onClose={handleCloseModal} title="Add Company">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              name="contact_person"
              placeholder="Contact Person"
              value={formData.contact_person}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSaveAdd}
              >
                Save
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <Modal isOpen={showEditModal} onClose={handleCloseModal} title={`Edit Company: ${editCompany?.name}`}>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="text"
              name="contact_person"
              placeholder="Contact Person"
              value={formData.contact_person}
              onChange={handleFormChange}
              className="border px-3 py-2 rounded w-full"
            />
            <div className="flex gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleSaveEdit}
              >
                Update
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default CompaniesPage;

