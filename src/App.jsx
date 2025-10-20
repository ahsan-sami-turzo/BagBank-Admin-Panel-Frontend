import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AttributesList from './pages/AttributesList'
import SuppliersList from './pages/SuppliersList'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'

function ProtectedLayout({ children }){
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/dashboard" element={<ProtectedRoute><ProtectedLayout><Dashboard/></ProtectedLayout></ProtectedRoute>} />

      <Route path="/attributes/:type" element={<ProtectedRoute><ProtectedLayout><AttributesList/></ProtectedLayout></ProtectedRoute>} />
      <Route path="/suppliers" element={<ProtectedRoute><ProtectedLayout><SuppliersList/></ProtectedLayout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
