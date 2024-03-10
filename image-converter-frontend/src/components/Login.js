// components/Login.js
import React, { useState } from 'react';
import '../style/styles.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  

    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers,
          body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Data Retrieve:', data.token);
        localStorage.setItem('token', data.token);
        console.log('Token stored:', localStorage.getItem('token'));
        window.location.href = '/home';
      } 
      else {
        console.error('Login failed:', response.status);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  return (
    <div className="container gradient-background">
      <div className="form">
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input type="text" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
        <br>
        </br>
        <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
