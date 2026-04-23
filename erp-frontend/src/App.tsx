import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import Login from './pages/Login.tsx';
import SuperAdminDashboard from './pages/SuperAdminDashboard.tsx';
import TenantDashboard from './pages/TenantDashboard.tsx';
import TenantDetails from './pages/TenantDetails.tsx';
import Inventory from './pages/Inventory.tsx';

const AppRoutes = () => {
  const { user, token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        !token ? <Login /> :
        user?.role === 'Super Admin' ? <Navigate to="/admin" /> : <Navigate to="/tenant" />
      } />
      <Route path="/admin" element={
        token && user?.role === 'Super Admin' ? <SuperAdminDashboard /> : <Navigate to="/login" />
      } />
      <Route path="/tenant-details/:tenantId" element={
        token ? <TenantDetails /> : <Navigate to="/login" />
      } />
      <Route path="/inventory/:tenantId" element={
        token ? <Inventory /> : <Navigate to="/login" />
      } />
      <Route path="/tenant" element={
        token && user?.role !== 'Super Admin' ? <TenantDashboard /> : <Navigate to="/login" />
      } />
      <Route path="/" element={
        !token ? <Navigate to="/login" /> :
        user?.role === 'Super Admin' ? <Navigate to="/admin" /> : <Navigate to="/tenant" />
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;