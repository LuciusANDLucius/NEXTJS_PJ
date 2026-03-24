"use client"
import React, { useState, useRef } from 'react'
import authAgent from '@/utils/authAgent'
import { useAuth } from '@/context/AuthContext'

export default function LoginForm({ onSuccess }){
  const [form, setForm] = useState({ username: '', pass: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState(null)
  const usernameRef = useRef(null)
  const passRef = useRef(null)
  const { login } = useAuth()

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors(null)
    setLoading(true)
    try{
      const res = await login(form)
      if(res && res.token){
        if(typeof onSuccess === 'function') onSuccess(res)
      } else {
        // use agent if response-like
        const result = authAgent(res || {})
        setError(result.uiMessage)
        if(result.fieldErrors) setFieldErrors(result.fieldErrors)
        // focus field if indicated
        if(result.field === 'username' && usernameRef.current) usernameRef.current.focus()
        if(result.field === 'pass' && passRef.current) passRef.current.focus()
      }
    }catch(err){
      const result = authAgent(err)
      setError(result.uiMessage)
      if(result.fieldErrors) setFieldErrors(result.fieldErrors)
      if(result.field === 'username' && usernameRef.current) usernameRef.current.focus()
      if(result.field === 'pass' && passRef.current) passRef.current.focus()
    }finally{setLoading(false)}
  }

  return (
    <div className="card" style={{maxWidth:420,margin:'24px auto'}}>
      <h2>Đăng nhập</h2>
      {error && <div style={{color:'crimson',marginBottom:8}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:10}}>
          <label>Username</label>
          <input ref={usernameRef} name="username" value={form.username} onChange={handleChange} className="input" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #e5e7eb'}} />
          {fieldErrors?.username && <div style={{color:'crimson',marginTop:6}}>{fieldErrors.username}</div>}
        </div>
        <div style={{marginBottom:10}}>
          <label>Mật khẩu</label>
          <input ref={passRef} name="pass" type="password" value={form.pass} onChange={handleChange} className="input" style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #e5e7eb'}} />
          {fieldErrors?.pass && <div style={{color:'crimson',marginTop:6}}>{fieldErrors.pass}</div>}
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button className="btn" type="submit" disabled={loading}>{loading? 'Đang...' : 'Đăng nhập'}</button>
        </div>
      </form>
    </div>
  )
}
