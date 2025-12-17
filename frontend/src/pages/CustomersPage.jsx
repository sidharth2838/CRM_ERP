// Modal close handler (restore if missing)
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditCustomer(null);
    navigate('/admin');
  };


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import axios from 'axios';
import { customerService } from '../services/api';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFileImport, FaFileExport } from 'react-icons/fa';

const CustomersPage = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [filter, setFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await axios.get('/api/customers/');
        setCustomers(res.data.results || res.data || []);
        setError(null);
      } catch (e) {
        setError('Failed to load customers');
        setCustomers([]);
      }
      setLoading(false);
    }
    fetchCustomers();
  }, []);


  // Filtered customers
  const filteredCustomers = customers.filter(
    (c) => {
      const matchesText = (c.first_name || c.user?.first_name || '').toLowerCase().includes(filter.toLowerCase()) ||
        (c.last_name || c.user?.last_name || '').toLowerCase().includes(filter.toLowerCase()) ||
        (c.email || c.user?.email || '').toLowerCase().includes(filter.toLowerCase()) ||
        (c.phone || c.user?.profile?.phone || '').toLowerCase().includes(filter.toLowerCase());
      const matchesType = typeFilter === '' || (c.customer_type || '').toLowerCase() === typeFilter.toLowerCase();
      return matchesText && matchesType;
    }
  );

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handlers for Add/Edit

  // Add Customer
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', customer_type: '', password: '' });
    const [addError, setAddError] = useState('');
  const handleAdd = () => setShowAddModal(true);
  const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      setAddError('');
      // Split name into first_name and last_name
      const [first_name, ...rest] = addForm.name.split(' ');
      const last_name = rest.join(' ');
      const payload = {
        username: addForm.email,
        email: addForm.email,
        first_name,
        last_name,
        phone: addForm.phone,
        customer_type: addForm.customer_type,
        password: addForm.password || 'DefaultPass@123',
        role: 'customer',
      };
      await customerService.create(payload);
      setShowAddModal(false);
      setAddForm({ name: '', email: '', phone: '', customer_type: '', password: '' });
      // Refresh list
      const res = await customerService.getAll();
      setCustomers(res.data.results || res.data || []);
    } catch (err) {
      setAddError(err?.response?.data?.error || 'Failed to add customer');
    }
  };

  // Edit Customer
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', customer_type: '', password: '' });
    const [editError, setEditError] = useState('');
  const handleEdit = (customer) => {
    setEditCustomer(customer);
    setEditForm({
      name: (customer.first_name ? customer.first_name : (customer.user?.first_name || '')) + ' ' + (customer.last_name ? customer.last_name : (customer.user?.last_name || '')),
      email: customer.email || customer.user?.email || '',
      phone: customer.phone || (customer.user?.profile?.phone || ''),
      customer_type: customer.customer_type || '',
      password: '',
    });
    setShowEditModal(true);
  };
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditError('');
      const [first_name, ...rest] = editForm.name.split(' ');
      const last_name = rest.join(' ');
      const payload = {
        email: editForm.email,
        first_name,
        last_name,
        phone: editForm.phone,
        customer_type: editForm.customer_type,
        password: editForm.password || undefined,
      };
      await customerService.update(editCustomer.id, payload);
      setShowEditModal(false);
      setEditCustomer(null);
      // Refresh list
      const res = await customerService.getAll();
      setCustomers(res.data.results || res.data || []);
    } catch (err) {
      setEditError(err?.response?.data?.error || 'Failed to update customer');
    }
  };

  // Delete Customer
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerService.delete(id);
      // Refresh list
      const res = await customerService.getAll();
      setCustomers(res.data.results || res.data || []);
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to delete customer. You may need admin/finance/manager role.');
    }
  };

  // Placeholder for import/export
  // CSV Import
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target.result;
      const rows = text.split(/\r?\n/).filter(Boolean);
      const headers = rows[0].split(',').map(h => h.trim());
      let imported = 0, failed = 0;
      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        if (values.length !== headers.length) { failed++; continue; }
        const customer = {};
        headers.forEach((h, idx) => { customer[h] = values[idx].trim(); });
        // Warn if required fields missing
        if (!customer.email || !customer.first_name || !customer.last_name) { failed++; continue; }
        const payload = {
          username: customer.email,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          phone: customer.phone || '',
          customer_type: customer.customer_type || 'regular',
          password: customer.password || 'DefaultPass@123',
          role: 'customer',
          billing_address: customer.billing_address || '',
          shipping_address: customer.shipping_address || '',
          credit_limit: customer.credit_limit || 10000,
          tax_number: customer.tax_number || '',
        };
        try {
          await customerService.create(payload);
          imported++;
        } catch {
          failed++;
        }
      }
      // Refresh list
      const res = await customerService.getAll();
      setCustomers(res.data.results || res.data || []);
      alert(`Import completed! Imported: ${imported}, Failed: ${failed}`);
    };
    reader.readAsText(file);
  };

  // CSV Export
  const handleExport = () => {
    const csvRows = [];
    const headers = ['first_name','last_name','email','phone','customer_type'];
    csvRows.push(headers.join(','));
    customers.forEach(c => {
      csvRows.push([
        c.first_name || '',
        c.last_name || '',
        c.email || '',
        c.phone || '',
        c.customer_type || ''
      ].join(','));
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-20 px-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Customers</h1>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAdd}><FaPlus /> Add</button>
          <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
            <FaFileImport /> Import
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleImport} />
          </label>
          <button className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={handleExport}><FaFileExport /> Export</button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              className="border px-3 py-2 rounded w-64 pl-8"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
            <FaSearch className="absolute left-2 top-3 text-gray-400" />
          </div>
          <select
            className="border px-3 py-2 rounded"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="regular">Regular</option>
            <option value="premium">Premium</option>
            <option value="minimum">Minimum</option>
          </select>
        </div>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((c, idx) => (
                <tr key={c.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{(c.first_name || c.user?.first_name || '') + ' ' + (c.last_name || c.user?.last_name || '')}</td>
                  <td className="px-4 py-2">{c.email || c.user?.email || '-'}</td>
                  <td className="px-4 py-2">{c.phone || c.user?.profile?.phone || '-'}</td>
                  <td className="px-4 py-2">{c.customer_type || '-'}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="group bg-white border border-indigo-500 text-indigo-500 rounded-full p-2 hover:bg-indigo-500 hover:text-white transition shadow"
                      title="Edit"
                      onClick={() => handleEdit(c)}
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      className="group bg-white border border-red-500 text-red-500 rounded-full p-2 hover:bg-red-500 hover:text-white transition shadow"
                      title="Delete"
                      onClick={() => handleDelete(c.id)}
                    >
                      <FaTrash size={18} />
                    </button>
                  {/* Removed duplicate closing </td> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && <div className="text-gray-500 mt-4 px-4">No customers found.</div>}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >Next</button>
          </div>
        )}

        {/* Add Modal */}
        <Modal isOpen={showAddModal} onClose={handleCloseModal} title="Add Customer">
          <form onSubmit={handleAddSubmit} className="space-y-4">
            {addError && <div className="text-red-500 text-sm mb-2">{addError}</div>}
            <input name="name" value={addForm.name} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" placeholder="Name" required />
            <input name="email" value={addForm.email} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" placeholder="Email" required />
            <input name="phone" value={addForm.phone} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" placeholder="Phone" />
            <select name="customer_type" value={addForm.customer_type} onChange={handleAddChange} className="w-full border px-3 py-2 rounded" required>
              <option value="">Select Type</option>
              <option value="regular">Regular</option>
              <option value="premium">Premium</option>
              <option value="minimum">Minimum</option>
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={handleCloseModal}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Add</button>
            </div>
          </form>
        </Modal>
        {/* Edit Modal */}
        <Modal isOpen={showEditModal} onClose={handleCloseModal} title="Edit Customer">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {editError && <div className="text-red-500 text-sm mb-2">{editError}</div>}
            <input name="name" value={editForm.name} onChange={handleEditChange} className="w-full border px-3 py-2 rounded" placeholder="Name" required />
            <input name="email" value={editForm.email} onChange={handleEditChange} className="w-full border px-3 py-2 rounded" placeholder="Email" required />
            <input name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full border px-3 py-2 rounded" placeholder="Phone" />
            <select name="customer_type" value={editForm.customer_type} onChange={handleEditChange} className="w-full border px-3 py-2 rounded" required>
              <option value="">Select Type</option>
              <option value="regular">Regular</option>
              <option value="premium">Premium</option>
              <option value="minimum">Minimum</option>
            </select>
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={handleCloseModal}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
};

export default CustomersPage;
