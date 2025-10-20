import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AttributesList from './pages/AttributesList'
import SuppliersList from './pages/SuppliersList'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import ProductsList from './pages/ProductsList'
import ProductForm from './pages/ProductForm'
import ProductDetails from './pages/ProductDetails'

import { useState } from 'react';
function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onSidebarToggle={() => setSidebarOpen(true)} />
      {/* Sidebar overlays on mobile, fixed on desktop */}
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content: offset by sidebar width on desktop, full width on mobile */}
      <main
        className="transition-all duration-200 min-h-0 h-[calc(100vh-64px)] overflow-auto p-6 md:p-8 pt-8 md:pt-10"
        style={{ marginLeft: '0', width: '100%' }}
        // Tailwind: ml-0 on mobile, ml-64 on md+
        // Use inline style for marginLeft to ensure correct offset
        // Responsive utility classes for padding
        // pt-8 for spacing below navbar
      >
        <div className="md:ml-64">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><Dashboard/></ProtectedLayout></ProtectedRoute>} />

  <Route path="/attributes/:type" element={<ProtectedRoute><ProtectedLayout><AttributesList/></ProtectedLayout></ProtectedRoute>} />
  <Route path="/suppliers" element={<ProtectedRoute><ProtectedLayout><SuppliersList/></ProtectedLayout></ProtectedRoute>} />

  <Route path="/products" element={<ProtectedRoute><ProtectedLayout><ProductsList/></ProtectedLayout></ProtectedRoute>} />
  <Route path="/products/create" element={<ProtectedRoute><ProtectedLayout><ProductForm editMode={false}/></ProtectedLayout></ProtectedRoute>} />
  <Route path="/products/:id/edit" element={<ProtectedRoute><ProtectedLayout><ProductForm editMode={true}/></ProtectedLayout></ProtectedRoute>} />
  <Route path="/products/:id" element={<ProtectedRoute><ProtectedLayout><ProductDetails/></ProtectedLayout></ProtectedRoute>} />

  <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
