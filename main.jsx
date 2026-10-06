import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { getToken } from './api';
import store from './store';
import Home from './pages/Home';
import CustomerLogin from './pages/CustomerLogin';
import CustomerSignup from './pages/CustomerSignup';
import CustomerDashboard from './pages/CustomerDashboard';
import VendorLogin from './pages/VendorLogin';
import VendorSignup from './pages/VendorSignup';
import VendorDashboard from './pages/VendorDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';
import './app.css';

const currentUser = () => JSON.parse(localStorage.getItem('novacart-user') || 'null');

function Guard({ role, children }) {
  if (!getToken()) return <Navigate to={role === 'vendor' ? '/login' : role === 'customer' ? '/customer-login' : '/admin-login'} replace />;
  const user = currentUser();
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/customer-login" element={<CustomerLogin />} />
    <Route path="/customer-signup" element={<CustomerSignup />} />
    <Route path="/login" element={<VendorLogin />} />
    <Route path="/vendor-signup" element={<VendorSignup />} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/customer" element={<Guard role="customer"><CustomerDashboard /></Guard>} />
    <Route path="/customer/cart" element={<Guard role="customer"><CustomerDashboard /></Guard>} />
    <Route path="/customer/orders" element={<Guard role="customer"><CustomerDashboard /></Guard>} />
    <Route path="/vendor" element={<Guard role="vendor"><VendorDashboard /></Guard>} />
    <Route path="/super-admin" element={<Guard role="super_admin"><AdminDashboard /></Guard>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>);
