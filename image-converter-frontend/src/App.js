// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignIn from './components/connection/SignIn';
import SignUp from './components/connection/SignUp';
import PrivateRoute from './components/PrivateRoute';
import ImageConverter from './components/converter/ImageConverter';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/convert" element={<ImageConverter />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
