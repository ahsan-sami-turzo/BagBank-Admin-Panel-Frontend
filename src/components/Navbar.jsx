import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

function formatDateTime(dt) {
  return dt.toLocaleString()
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-8 w-8" />
        <span className="font-bold text-lg">BagBank POS</span>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-3">
          {user?.image_url ? (
            <img src={user.image_url} alt="User" className="h-8 w-8 rounded-full border" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">U</div>
          )}
          <span className="font-medium">{user?.username}</span>
          <button onClick={logout} className="text-red-600 px-2 py-1 border rounded">Logout</button>
        </div>
        <div className="text-xs text-gray-500 mt-1">{formatDateTime(now)}</div>
      </div>
    </nav>
  )
}