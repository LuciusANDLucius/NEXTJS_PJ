"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authServices from '@/services/authServices'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifySession = async () => {
      const stored = localStorage.getItem('user')
      const token = localStorage.getItem('token')
      if (stored && token) {
        try {
          // GET /auth/me returns user object directly: { user_id, username, user_type, ... }
          const res = await authServices.me()
          if (res && (res.user_id || res.id || res.username)) {
            // Token valid — restore session from localStorage
            setUser(JSON.parse(stored))
          } else {
            // Unexpected response — clear session to be safe
            localStorage.removeItem('user')
            localStorage.removeItem('token')
          }
        } catch (e) {
          // Network error or 401 — clear session
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    verifySession()
  }, [])


  const login = async (credentials) => {
    const res = await authServices.login(credentials)
    if(res && res.user){
      setUser(res.user)
    }
    return res
  }

  const register = async (data) => {
    const res = await authServices.register(data)
    return res
  }

  const logout = () => {
    authServices.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
