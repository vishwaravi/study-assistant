import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'; // <-- Ensure Routes is imported
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import ProtectedRoute from './components/configs/ProtectedRoute';
import Logout from './components/login/Logout';
import ProfileEdit from './components/Profile/ProfileEdit';
import Dashboard from './components/dashboard/Dashboard';
function App() {
  const isLoggedIn = sessionStorage.getItem('token'); // Or check for user session

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/profile/edit' element={
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        } />

        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" />}
        />
        <Route path='/login' element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

      </Routes>
    </Router>
  );
}

export default App;