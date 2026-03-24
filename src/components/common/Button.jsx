import React from 'react';

export default function Button({ children, onClick, style, className, disabled, type = 'button', ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        background: '#3b82f6',
        color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        ...style
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
