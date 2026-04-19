'use client';
import React, { useRef, useState } from 'react';
import { uploadSingle } from '@/services/uploadService';

/**
 * ImageUploader - Component chọn ảnh & upload lên server
 * Props:
 *   value: string (URL ảnh hiện tại)
 *   onChange: (url: string) => void  - callback trả về URL sau khi upload xong
 *   label: string
 */
export default function ImageUploader({ value, onChange, label = 'Hình ảnh' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');

  // Resolve preview URL (nếu là tên file thì thêm base URL)
  const resolveUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000/uploads/${url}`;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError('');
    setUploading(true);

    try {
      const res = await uploadSingle(file);
      const uploadedUrl = res.file || res.url || '';
      setPreview(resolveUrl(uploadedUrl));
      onChange(uploadedUrl); // Trả về URL gốc để lưu vào DB
    } catch (err) {
      setError('Upload thất bại. Kiểm tra lại quyền Admin hoặc kết nối.');
      setPreview(resolveUrl(value || ''));
      onChange(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview('');
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const currentPreview = preview || resolveUrl(value);

  return (
    <div style={{ marginBottom: 4 }}>
      {/* Preview Area */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          width: '100%', height: 180, borderRadius: 8, border: '2px dashed #cbd5e1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f8fafc', cursor: uploading ? 'wait' : 'pointer',
          overflow: 'hidden', position: 'relative', transition: '0.2s',
        }}
      >
        {currentPreview ? (
          <>
            <img
              src={currentPreview}
              alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            {!uploading && (
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: '0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>Nhấn để đổi ảnh</span>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a.75.75 0 000-1.5H3A.75.75 0 003 21zm.75-3.75h16.5M21 21H3" />
            </svg>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Nhấn để chọn ảnh</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>JPG, PNG, WEBP (tối đa 5MB)</div>
          </div>
        )}

        {uploading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTop: '3px solid #0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 13, color: '#64748b' }}>Đang upload...</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Actions row */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#334155' }}
        >
          {currentPreview ? '🔄 Đổi ảnh' : '📁 Chọn ảnh'}
        </button>
        {currentPreview && (
          <button
            type="button"
            onClick={handleClear}
            disabled={uploading}
            style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #fecaca', background: '#fef2f2', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#dc2626' }}
          >
            🗑 Xoá ảnh
          </button>
        )}
      </div>

      {error && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 6 }}>⚠️ {error}</div>}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
