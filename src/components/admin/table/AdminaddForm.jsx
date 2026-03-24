import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';

export default function AdminaddForm({ isOpen, onClose, onSubmit, fields, initialData, title }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>{title}</h3>
        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <div key={field.name} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                {field.label} {field.required && <span style={{color:'red'}}>*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">-- Chọn --</option>
                  {field.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              )}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
            <Button type="button" onClick={onClose} style={{ background: '#9ca3af', color: '#fff' }}>Hủy</Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
