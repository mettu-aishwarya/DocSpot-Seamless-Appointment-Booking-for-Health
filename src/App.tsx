import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with layout */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
          
          {/* Auth routes without footer */}
          <Route path="/login" element={
            <Layout showFooter={false}>
              <Login />
            </Layout>
          } />
          <Route path="/register" element={
            <Layout showFooter={false}>
              <Register />
            </Layout>
          } />
          
          {/* Dashboard routes without footer */}
          <Route path="/dashboard" element={
            <Layout showFooter={false}>
              <Dashboard />
            </Layout>
          } />
          <Route path="/admin" element={
            <Layout showFooter={false}>
              <Dashboard />
            </Layout>
          } />
          <Route path="/doctor" element={
            <Layout showFooter={false}>
              <Dashboard />
            </Layout>
          } />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;