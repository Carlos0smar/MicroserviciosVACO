import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Purchases from './pages/Purchases';
import AdminEvents from './pages/AdminEvents';
import EventForm from './pages/EventForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route 
              path="/events" 
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/purchases" 
              element={
                <ProtectedRoute>
                  <Purchases />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin only routes */}
            <Route 
              path="/admin/events" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminEvents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events/new" 
              element={
                <ProtectedRoute adminOnly>
                  <EventForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events/:id/edit" 
              element={
                <ProtectedRoute adminOnly>
                  <EventForm />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
