import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import client, { attachTokenStore } from '../api/client'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const AUTH_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY || 'bagbank_token'
const USER_KEY = import.meta.env.VITE_USER_STORAGE_KEY || 'bagbank_user'

export function AuthProvider({ children }){
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_KEY))
  const [user, setUser] = useState(() => {
    try { const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null } catch(e){ return null }
  })
  const [loading, setLoading] = useState(!!token)

  const saveToken = useCallback((t, remember = true) => {
    setToken(t)
    if (t) {
      if (remember) localStorage.setItem(AUTH_KEY, t)
      else sessionStorage.setItem(AUTH_KEY, t)
    } else {
      localStorage.removeItem(AUTH_KEY)
      sessionStorage.removeItem(AUTH_KEY)
    }
  }, [])

  const clearUserAndToken = useCallback(()=>{
    setUser(null)
    setToken(null)
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(AUTH_KEY)
  }, [])

  const handleUnauthorized = useCallback(()=>{
    clearUserAndToken()
    navigate('/login')
  }, [navigate, clearUserAndToken])

  // attach store so api client can read token and call onUnauthorized
  useEffect(()=>{
    attachTokenStore({
      getToken: ()=> localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY),
      onUnauthorized: handleUnauthorized
    })
  }, [handleUnauthorized])

  const fetchUser = useCallback(async ()=>{
    const t = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
    if (!t) { setLoading(false); return null }
    try{
      setLoading(true)
      const res = await client.get('/auth/me')
      setUser(res.data)
      localStorage.setItem(USER_KEY, JSON.stringify(res.data))
      setLoading(false)
      return res.data
    }catch(err){
      clearUserAndToken()
      setLoading(false)
      return null
    }
  }, [clearUserAndToken])

  useEffect(()=>{
    // initialize only once on mount
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async ({ username, password, remember=true })=>{
    try{
      const res = await client.post('/auth/login', { username, password })
      const access_token = res.data.access_token
      saveToken(access_token, remember)
      // fetch user and navigate
      const user = await fetchUser()
      if (user) {
        navigate('/dashboard')
        toast.success('Logged in')
      }
      return user
    }catch(err){
      const st = err?.response?.status
      if (st === 401 || st === 422) {
        throw new Error('Invalid username or password.')
      }
      throw err
    }
  }, [saveToken, fetchUser, navigate])

  const logout = useCallback(async ()=>{
    try{
      await client.post('/auth/logout')
    }catch(e){
      // ignore network errors
    }
    clearUserAndToken()
    navigate('/login')
    toast.success('Logged out successfully.')
  }, [clearUserAndToken, navigate])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}

export default AuthContext
