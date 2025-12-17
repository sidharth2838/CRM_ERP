import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/login/', { username, password });
      const token = res.data?.tokens?.access || res.data?.token;
      const userRole = res.data?.role || res.data?.user?.role || '';
      if (token) {
        localStorage.setItem('crm_jwt', token);
        if (userRole) {
          localStorage.setItem('crm_role', userRole);
          setRole(userRole);
        }
        if (onLogin) onLogin();
        navigate('/');
      } else {
        setError('Login failed: No token received');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {role && (role === 'admin' || role === 'manager') && (
          <div className="text-green-600 text-sm mb-2">Logged in as <b>{role}</b> (Full Access)</div>
        )}
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
