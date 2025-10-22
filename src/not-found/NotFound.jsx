// NotFound.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NotFound.css'; // Import CSS for styles and animations

const NotFound = () => {
    const location = useLocation()
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 style={{fontSize:"40px"}}>404 - Page Not Found</h1>
        <p>This route ({location.pathname}) is temporarily unavailable.</p>
        <Link to="/" className="home-link">Go to Home Page</Link>
      </div>
    </div>
  );
};

export default NotFound;
