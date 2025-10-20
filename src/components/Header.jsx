import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Header(){
  const { user, logout } = useAuth()
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="text-lg font-semibold">BagBank POS</div>
      <div className="flex items-center gap-4">
        {user && <div className="text-sm text-gray-700">{user.username}</div>}
        <button onClick={logout} className="text-sm text-red-600">Logout</button>
      </div>
    </header>
  )
}
// Header component removed; use Navbar instead.
