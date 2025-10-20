import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

function formatDateTime(dt) {
  return dt.toLocaleString()
}

export default function Navbar({ onSidebarToggle }) {
  const { user, logout } = useAuth()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav className="w-full bg-[#212529] shadow flex items-center justify-between px-4 py-2 sticky top-0 z-40 h-16">
      <div className="flex items-center gap-2">
        {/* Hamburger for mobile */}
        <button
          className="md:hidden mr-2 p-2 rounded hover:bg-gray-100 focus:outline-none"
          onClick={onSidebarToggle}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <img src={logo} alt="Logo" className="h-20 w-20" />
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-3">
          {user?.image_url ? (
            <img src={user.image_url} alt="User" className="h-8 w-8 rounded-full border" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">U</div>
          )}
          <span className="font-medium text-gray-500">{user?.username}</span>
          <button onClick={logout} className="text-red-600 px-2 py-1 border rounded">Logout</button>
        </div>
        <div className="text-xs text-gray-500 mt-1">{formatDateTime(now)}</div>
      </div>
    </nav>
  )
}