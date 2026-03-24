import React from 'react';
import productService from '@/services/productService';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700}}>PhungVanhieu</div>
            <div style={{color:'var(--muted)'}}>© {new Date().getFullYear()} All rights reserved</div>
          </div>
          <div style={{display:'flex',gap:12}}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}