import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import ImageUploader from '@/components/common/ImageUploader';

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
    let newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Logic tự động tạo alias nếu field hiện tại là brand_name/name/title/cat_name/product_name
      if (['brand_name', 'name', 'title', 'cat_name', 'product_name'].includes(name)) {
          const generateAliasFunc = (str) => {
            if (!str) return '';
            return str.toString().toLowerCase()
                .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
                .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
                .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
                .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
                .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
                .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
                .replace(/đ/gi, 'd')
                .replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '')
                .replace(/ /gi, "-")
                .replace(/\-\-\-\-\-/gi, '-')
                .replace(/\-\-\-\-/gi, '-')
                .replace(/\-\-\-/gi, '-')
                .replace(/\-\-/gi, '-')
                .replace(/^\-+|\-+$/g, '');
          };
          updated.alias = generateAliasFunc(newValue);
      }
      
      return updated;
    });
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
              {field.type === 'image' ? (
                <ImageUploader
                  value={formData[field.name] !== undefined ? formData[field.name] : ''}
                  onChange={(url) => setFormData(prev => ({ ...prev, [field.name]: url }))}
                  label={field.label}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] !== undefined ? formData[field.name] : ''}
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
                  value={formData[field.name] !== undefined ? formData[field.name] : ''}
                  onChange={handleChange}
                  required={field.required}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                />
              ) : (
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] !== undefined ? formData[field.name] : ''}
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
