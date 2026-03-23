"use client"
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { validateRegister } from '@/utils/validation'

export default function RegisterForm({ onSuccess }){
  const { register: authRegister } = useAuth()
  const [form, setForm] = useState({ username:'', fullname:'', email:'', pass:'', avatar:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
    setFieldErrors({...fieldErrors, [e.target.name]: ''})
  }

  const validate = () => validateRegister(form)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const errs = validate()
    if(Object.keys(errs).length){ setFieldErrors(errs); return }

    setLoading(true)
    try{
      const res = await authRegister(form)
      if(res && res.user){
        setSuccess('Đăng ký thành công.')
        if(typeof onSuccess === 'function') onSuccess(res)
      } else {
        setError(res?.message || 'Đăng ký thất bại')
      }
    }catch(err){
      setError(err?.response?.data?.message || err?.message || 'Lỗi server')
    }finally{setLoading(false)}
  }

  return (
    <div className="form-card">
      <form className="form-grid" onSubmit={handleSubmit} noValidate>
        <div>
          <h2 style={{margin:0}}>Tạo tài khoản</h2>
          <p style={{color:'var(--muted)',marginTop:8}}>Vui lòng điền thông tin để đăng ký.</p>
        </div>

        {error && <div className="field-error">{error}</div>}
        {success && <div style={{color:'green'}}>{success}</div>}

        <div className="form-row">
          <div>
            <div className="form-label">Username</div>
            <input name="username" className="input" placeholder="mai123" value={form.username} onChange={handleChange} />
            {fieldErrors.username && <div className="field-error">{fieldErrors.username}</div>}
          </div>
          <div>
            <div className="form-label">Họ tên</div>
            <input name="fullname" className="input" placeholder="Họ tên " value={form.fullname} onChange={handleChange} />
            {fieldErrors.fullname && <div className="field-error">{fieldErrors.fullname}</div>}
          </div>
        </div>

        <div>
          <div className="form-label">Email</div>
          <input name="email" className="input" placeholder="user@gmail.com" value={form.email} onChange={handleChange} />
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
        </div>

        <div className="form-row">
          <div>
            <div className="form-label">Mật khẩu</div>
            <input name="pass" className="input" type="password" placeholder="*******" value={form.pass} onChange={handleChange} />
            {fieldErrors.pass && <div className="field-error">{fieldErrors.pass}</div>}
          </div>
          <div>
            <div className="form-label">Avatar (tên file)</div>
            <input name="avatar" className="input" placeholder="avatar.jpg" value={form.avatar} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => { setForm({ username:'', fullname:'', email:'', pass:'', avatar:'' }); setFieldErrors({}); setError(''); setSuccess('') }}>Hủy</button>
          <button className="btn" type="submit" disabled={loading}>{loading? 'Đang...' : 'Đăng ký'}</button>
        </div>
      </form>
    </div>
  )
}
