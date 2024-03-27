// components/PrivateRoute.js
import React from 'react';
import { Navigate, Route } from 'react-router-dom';

// Example: Redirect to login page if user is not authenticated
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      localStorage.getItem('userId') ? (
        <Component {...props} />
      ) : (
        <Navigate to="/login" />
      )
    }
  />
);

export default PrivateRoute;
