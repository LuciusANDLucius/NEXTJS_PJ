"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authServices from '@/services/authServices'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(stored){
      try{ setUser(JSON.parse(stored)) }catch(e){ setUser(null) }
    }
    setLoading(false)
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
