import React, { useState } from 'react';
import axios from 'axios';

const UserManagementPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('finance');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const token = localStorage.getItem('crm_jwt');
      const res = await axios.post('/api/create-user/', {
        username,
        password,
        role,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('User created successfully!');
      setUsername('');
      setPassword('');
      setRole('finance');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to create user');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Staff/Finance User</h2>
      {message && <div className="text-green-600 mb-4">{message}</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleCreateUser} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="finance">Finance</option>
          <option value="staff">Staff</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create User</button>
      </form>
    </div>
  );
};

export default UserManagementPage;
