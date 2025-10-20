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

function ProtectedLayout({ children }){
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1">
          {children}
        </div>
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

  <Route path="/products" element={<ProtectedRoute><ProtectedLayout><ProductsList/></ProtectedLayout></ProtectedRoute>} />
  <Route path="/products/create" element={<ProtectedRoute><ProtectedLayout><ProductForm editMode={false}/></ProtectedLayout></ProtectedRoute>} />
  <Route path="/products/:id/edit" element={<ProtectedRoute><ProtectedLayout><ProductForm editMode={true}/></ProtectedLayout></ProtectedRoute>} />
  <Route path="/products/:id" element={<ProtectedRoute><ProtectedLayout><ProductDetails/></ProtectedLayout></ProtectedRoute>} />

  <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
