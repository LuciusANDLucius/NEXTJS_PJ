"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authServices from '@/services/authServices'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verifySession = async () => {
      const stored = localStorage.getItem('user')
      const token = localStorage.getItem('token') || localStorage.getItem('admin_token')
      if (stored && token) {
        try {

          const res = await authServices.me()
          if (res && (res.user_id || res.id || res.username)) {
            setUser(JSON.parse(stored))
          } else {
            // Nếu API /me không tồn tại (trả về null từ service), 
            // chúng ta vẫn tin tưởng dữ liệu trong localStorage để giữ phiên đăng nhập.
            if (res === null) {
                setUser(JSON.parse(stored))
            } else {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
            }
          }
        } catch (error) {
           // Giữ lại session nếu lỗi không phải là 401 Unauthorized
           setUser(JSON.parse(stored))
        }
      }
      setLoading(false)
    }
    verifySession()
  }, [])


  const login = async (credentials) => {
    const res = await authServices.login(credentials)
    if (res && res.user) {
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

export function useAuth() {
  return useContext(AuthContext)
}
