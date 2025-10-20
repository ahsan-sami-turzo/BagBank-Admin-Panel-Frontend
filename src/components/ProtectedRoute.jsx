import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }){
  const { token, user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><div className="loader">Loading...</div></div>
  )

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  return children
}
