"use client"
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function LoginForm({ onSuccess }){
  const { login: authLogin } = useAuth()
  const [form, setForm] = useState({ username: '', pass: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => { setForm({...form, [e.target.name]: e.target.value}); setFieldErrors({...fieldErrors, [e.target.name]: ''}) }

  const validate = () => {
    const errs = {}
    if(!form.username) errs.username = 'Vui lòng nhập username'
    if(!form.pass) errs.pass = 'Vui lòng nhập mật khẩu'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const errs = validate()
    if(Object.keys(errs).length){ setFieldErrors(errs); return }
    setLoading(true)
    try{
      const res = await authLogin(form)
      if(res && res.token){
        if(typeof onSuccess === 'function') onSuccess(res)
      } else {
        setError(res?.message || 'Đăng nhập thất bại')
      }
    }catch(err){
      setError(err?.response?.data?.message || err?.message || 'Lỗi server')
    }finally{setLoading(false)}
  }

  return (
    <div className="form-card">
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <div>
          <h2 style={{margin:0}}>Đăng nhập</h2>
          <p style={{color:'var(--muted)',marginTop:8}}>Đăng nhập để tiếp tục mua sắm</p>
        </div>

        {error && <div className="field-error">{error}</div>}

        <div>
          <div className="form-label">Username</div>
          <input name="username" className="input" value={form.username} onChange={handleChange} />
          {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
        </div>

        <div>
          <div className="form-label">Mật khẩu</div>
          <input name="pass" type="password" className="input" value={form.pass} onChange={handleChange} />
          {fieldErrors.pass && <div className="field-error">{fieldErrors.pass}</div>}
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => { setForm({ username:'', pass:'' }); setFieldErrors({}); setError(''); }}>Hủy</button>
          <button className="btn" type="submit" disabled={loading}>{loading? 'Đang...' : 'Đăng nhập'}</button>
        </div>
      </form>
    </div>
  )
}
