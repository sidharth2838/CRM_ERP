import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import UserManagementPage from './UserManagementPage';

const SettingsPage = () => (
  <div className="bg-gray-100 min-h-screen">
    <Sidebar />
    <Topbar />
    <main className="ml-64 pt-20 px-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CRM System Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">CRM System Details</h2>
          <ul className="text-gray-700 space-y-2">
            <li><strong>Version:</strong> 1.0.0</li>
            <li><strong>Last Updated:</strong> December 2025</li>
            <li><strong>Modules:</strong> Customers, Companies, Invoices, Payments, Products, Reports, Orders, Leads, Staff/Finance Management</li>
          </ul>
        </div>
        {/* Company Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Company Details</h2>
          <ul className="text-gray-700 space-y-2">
            <li><strong>Name:</strong> [Your Company Name]</li>
            <li><strong>Email:</strong> [company@email.com]</li>
            <li><strong>Phone:</strong> [Company Phone]</li>
            <li><strong>Address:</strong> [Company Address]</li>
          </ul>
        </div>
        {/* Support & Function Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Support & Function Details</h2>
          <ul className="text-gray-700 space-y-2">
            <li><strong>Support Email:</strong> support@crm.com</li>
            <li><strong>Documentation:</strong> <a href="/help" className="text-blue-600 underline">Help & Docs</a></li>
            <li><strong>Contact:</strong> +1-800-CRM-HELP</li>
          </ul>
        </div>
        {/* User Creation (Manager/Admin only) */}
        {(localStorage.getItem('crm_role') === 'admin' || localStorage.getItem('crm_role') === 'manager') && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Staff/Finance User</h2>
            <UserManagementPage />
          </div>
        )}
      </div>
    </main>
  </div>
);

export default SettingsPage;
