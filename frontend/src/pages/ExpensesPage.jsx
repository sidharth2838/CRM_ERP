import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import axios from 'axios';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);
      try {
        // API endpoint not implemented - using demo data
        const demoExpenses = [
          { id: 1, description: 'Office Supplies', amount: 150, category: 'Supplies', date: '2025-12-10' },
          { id: 2, description: 'Travel Cost', amount: 500, category: 'Travel', date: '2025-12-09' },
          { id: 3, description: 'Meals', amount: 75, category: 'Food', date: '2025-12-08' },
        ];
        setExpenses(demoExpenses);
        setError(null);
      } catch (e) {
        setError('Failed to load expenses');
        setExpenses([]);
      }
      setLoading(false);
    }
    fetchExpenses();
  }, []);

  const filteredExpenses = expenses.filter(
    (e) => (e.description || '').toLowerCase().includes(filter.toLowerCase())
  );

  const handleAdd = () => setShowAddModal(true);
  const handleEdit = (expense) => {
    setEditExpense(expense);
    setShowEditModal(true);
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditExpense(null);
  };
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setExpenses(expenses.filter(e => e.id !== id));
    alert('Expense deleted successfully');
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
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Expenses</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAdd}>Add</button>
          <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
            Import
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleImport} />
          </label>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={handleExport}>Export</button>
          <input
            type="text"
            placeholder="Filter by description..."
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
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="px-4 py-2">{e.description || '-'}</td>
                    <td className="px-4 py-2">{e.category || '-'}</td>
                    <td className="px-4 py-2">{e.amount || '-'}</td>
                    <td className="px-4 py-2">{e.date || '-'}</td>
                    <td className="px-4 py-2">
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 mr-2" onClick={() => handleEdit(e)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredExpenses.length === 0 && <div className="text-gray-500 mt-4">No expenses found.</div>}
          </div>
        )}
        <Modal isOpen={showAddModal} onClose={handleCloseModal} title="Add Expense">
          <div>Expense add form goes here.</div>
        </Modal>
        <Modal isOpen={showEditModal} onClose={handleCloseModal} title="Edit Expense">
          <div>Edit form for {editExpense?.description}</div>
        </Modal>
      </main>
    </div>
  );
};

export default ExpensesPage;
