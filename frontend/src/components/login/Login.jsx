import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/api'; // Import the Axios instance
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For displaying login errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      const { token, name, userId } = response.data; // Assuming your backend sends these
      // Store token in session storage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('id', userId);

      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setErrorMessage('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">Welcome Back</h2>
        <p className="text-sm text-center text-gray-600 mb-8">
          Login to access your study sessions and materials.
        </p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-blue-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="you@example.com"
              />
            </div>
            {emailError && <p className="text-sm text-red-600 mt-1">{emailError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-800 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-blue-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
              />
            </div>
            {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        {errorMessage && <p className="mt-4 text-sm text-center text-red-600">{errorMessage}</p>}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;