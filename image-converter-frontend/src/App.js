import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/connection/SignIn';
import SignUp from './components/connection/SignUp';
import ImageConverter from './components/converter/ImageConverter';
import UserActivityCheck from './components/connection/UserActivityCheck';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';

const Logout = () => {
  localStorage.removeItem('token');
  return <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/convert" element={<ImageConverter />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin" element={<AdminPanel></AdminPanel>} />
        {/* Redirect to /login if no other route matches */}
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default () => <UserActivityCheck><App /></UserActivityCheck>;
