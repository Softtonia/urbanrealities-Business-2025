// Dashboards.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MyProfile from './my-profile/MyProfile';


const Dashboards = ({ user }) => {
  if (!user || !user.is_login) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'consultancy':
      return (
        <>
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/insight" element={<Document />} />
          <Route path="/dashboard/*" element={"consultancy"} />
        </>
      );
    case 'business':
      return (
        <>
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/insight" element={<Document />} />
          <Route path="/dashboard/*" element={'<AgentDashboard />'} />
        </>
      );
    case 'agent':
      return (
        <>
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/insight" element={<Document />} />
          <Route path="/dashboard/*" element={'<AgentDashboard />'} />
        </>
      );
    default:
      return <Navigate to="/login" />;
  }
};

export default Dashboards;
