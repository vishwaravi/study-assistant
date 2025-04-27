import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/signup', {
        name,
        email,
        password
      });

      console.log('Signup success:', response.data);
      navigate('/'); // Redirect to login after successful signup
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Create your StudyMate account</h2>
        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-blue-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
