import React from 'react';

const Topbar = () => (
  <header className="h-16 bg-white shadow flex items-center px-8 fixed left-64 right-0 top-0 z-30">
    <div className="flex-1 flex items-center">
      <span className="text-lg font-semibold text-gray-800">Dashboard</span>
    </div>
    <div className="flex items-center gap-4">
      <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
        <i className="fas fa-bell text-gray-500"></i>
      </button>
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">U</div>
      <button
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        onClick={() => {
          localStorage.removeItem('crm_jwt');
          localStorage.removeItem('crm_role');
          window.location.replace('/login');
        }}
      >Logout</button>
    </div>
  </header>
);

export default Topbar;
