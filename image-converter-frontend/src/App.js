import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/connection/SignIn';
import SignUp from './components/connection/SignUp';
import ImageConverter from './components/converter/ImageConverter';
import UserActivityCheck from './components/connection/UserActivityCheck';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';
import HistoryPage from './components/HistoryPage';

const Logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'
};

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const isAdmin = userRole === 'admin';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/convert" element={<ImageConverter />} />
        <Route path="/setting" element={<Settings />} />
        {isAuthenticated && isAdmin ? (
          <Route path="/admin" element={<AdminPanel />} />
        ) : (
          isAuthenticated ? (
            <Route path="/admin" element={<Navigate to="/home" replace state={{ alert: 'You are not authorized to access the admin panel' }} />} />
          ) : null
        )}
      </Routes>
    </Router>
  );
};

export default () => <UserActivityCheck><App /></UserActivityCheck>;
