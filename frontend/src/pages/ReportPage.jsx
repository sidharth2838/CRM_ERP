import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const ReportPage = () => (
  <div className="bg-gray-100 min-h-screen">
    <Sidebar />
    <Topbar />
    <main className="ml-64 pt-20 px-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-900">Report</h1>
      <div className="bg-white rounded-lg shadow p-6">Report content and analytics will go here.</div>
    </main>
  </div>
);

export default ReportPage;
