
import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Modal from '../components/Modal';
import axios from 'axios';

const ProductsPage = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await axios.get('/api/products/');
        setProducts(res.data.results || res.data || []);
        setError(null);
      } catch (e) {
        setError('Failed to load products');
        setProducts([]);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Filtered products
  const filteredProducts = products.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(filter.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(filter.toLowerCase())
  );

  // Handlers for Add/Edit
  const handleAdd = () => setShowAddModal(true);
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };
  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditProduct(null);
  };
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setProducts(products.filter(p => p.id !== id));
    alert('Product deleted successfully');
  };

  // Placeholder for import/export
  const handleImport = (e) => {
    // TODO: implement import logic
    alert('Import not implemented yet');
  };
  const handleExport = () => {
    // TODO: implement export logic
    alert('Export not implemented yet');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar />
      <Topbar />
      <main className="ml-64 pt-20 px-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Products</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAdd}>Add</button>
          <label className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
            Import
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleImport} />
          </label>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={handleExport}>Export</button>
          <input
            type="text"
            placeholder="Filter by name, category..."
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
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.name || '-'}</td>
                    <td className="px-4 py-2">{p.category || '-'}</td>
                    <td className="px-4 py-2">{p.price || '-'}</td>
                    <td className="px-4 py-2">{p.stock || '-'}</td>
                    <td className="px-4 py-2">
                      <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 mr-2" onClick={() => handleEdit(p)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && <div className="text-gray-500 mt-4">No products found.</div>}
          </div>
        )}

        {/* Add Modal */}
        <Modal isOpen={showAddModal} onClose={handleCloseModal} title="Add Product">
          {/* TODO: Add product form */}
          <div>Product add form goes here.</div>
        </Modal>
        {/* Edit Modal */}
        <Modal isOpen={showEditModal} onClose={handleCloseModal} title="Edit Product">
          {/* TODO: Edit product form */}
          <div>Edit form for {editProduct?.name}</div>
        </Modal>
      </main>
    </div>
  );
};

export default ProductsPage;
