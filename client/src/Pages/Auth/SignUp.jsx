import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../utils/baseUrl';


const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/signup`, formData);
      setMessage('Account created successfully!');
      // You can redirect to login here, or reset form
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="bg-gradient-to-r min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="email">Gmail</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
          </div>

          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl transition duration-200">
            Sign Up
          </button>
        </form>

        {message && <p className="text-center text-sm mt-4 text-red-500">{message}</p>}

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?
          <a href="#" className="text-indigo-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
