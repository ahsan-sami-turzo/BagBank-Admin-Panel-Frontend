import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo2.png'

export default function Login(){
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) { setError('Please enter username and password'); return }
    setLoading(true)
    try{
      await login({ username, password, remember })
    }catch(err){
      setError(err.message || 'Invalid username or password.')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <div className="text-center mb-4">
          <img src={logo} alt="Logo" className="mx-auto mb-2 **h-20 w-20**" />
          {/* <div className="text-2xl font-bold">Bag Bank Admin Panel</div> */}
          <div className="text-sm text-gray-500">Sign In to Bag Bank Admin Panel</div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              value={username}
              onChange={e=>setUsername(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
              type="text"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                value={password}
                onChange={e=>setPassword(e.target.value)}
                className="block w-full border rounded p-2"
                type={showPassword? 'text' : 'password'}
                autoComplete="current-password"
              />
              <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute right-2 top-2 text-sm text-gray-500">{showPassword? 'Hide' : 'Show'}</button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me
            </label>
            <button className="text-sm text-blue-600">Forgot?</button>
          </div>

          <div>
            <button className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50" disabled={loading}>
              {loading? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
