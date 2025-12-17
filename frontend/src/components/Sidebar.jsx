import React from 'react';

const Sidebar = () => (
  <aside className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0 z-40">
    <div className="h-20 flex items-center justify-center border-b border-gray-800">
      <span className="text-2xl font-bold tracking-wide">FC/CRM</span>
    </div>
    <nav className="flex-1 min-h-0 py-6 px-4 space-y-2 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <a href="/" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Dashboard</a>
      <a href="/customers" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Customers</a>
      <a href="/companies" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Companies</a>
      <a href="/invoices" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Invoices</a>
      <a href="/payments" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Payments</a>
      <a href="/quotes" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Quotes</a>
      <a href="/leads" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Leads</a>
      <a href="/offers-for-leads" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Offers for Leads</a>
      <a href="/expenses" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Expenses</a>
      <a href="/expense-category" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Expenses Category</a>
      <a href="/products" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Products</a>
      <a href="/products-category" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Products Category</a>
      <a href="/report" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Report</a>
      <a href="/orders" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Order</a>
      <a href="/settings" className="block py-2 px-4 rounded hover:bg-gray-800 transition">Settings</a>
      <a href="/website" className="block py-2 px-4 rounded hover:bg-pink-600 transition text-pink-700 font-bold">View Website</a>
      <a href="/admin/website-controller" className="block py-2 px-4 rounded hover:bg-blue-600 transition text-blue-700 font-bold">Website Controller</a>
    </nav>
    <div className="p-4 border-t border-gray-800 text-xs text-gray-400">&copy; 2025 FC/CRM</div>
  </aside>
);

export default Sidebar;
