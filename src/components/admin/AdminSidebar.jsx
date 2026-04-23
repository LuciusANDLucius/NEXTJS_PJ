'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminMenuData } from '@/data/adminMenu';

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
      <aside suppressHydrationWarning style={{ flexShrink: 0, width: '260px', height: '100vh', background: '#1e293b', color: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 8px rgba(0,0,0,0.1)', zIndex: 20 }}>
        <div suppressHydrationWarning style={{ padding: '24px', fontSize: '22px', fontWeight: 'bold', borderBottom: '1px solid #334155', textAlign: 'center', letterSpacing: '2px', color: '#38bdf8' }}>
          SHOP ADMIN
        </div>
        <nav style={{ flex: 1, padding: '24px 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {adminMenuData.map((menu) => {
              const isActive = pathname === menu.path || (menu.path !== '/admin' && pathname.startsWith(menu.path));
              return (
                <li key={menu.path} style={{ marginBottom: '8px' }}>
                  <Link href={menu.path} style={{ 
                      display: 'flex', alignItems: 'center', padding: '12px 24px', 
                      textDecoration: 'none', color: isActive ? '#fff' : '#94a3b8', 
                      background: isActive ? '#334155' : 'transparent', 
                      borderLeft: isActive ? '4px solid #38bdf8' : '4px solid transparent', 
                      transition: 'all 0.2s', fontWeight: isActive ? '600' : '400' 
                    }}>
                    <svg style={{ width: '22px', height: '22px', marginRight: '14px', stroke: isActive ? '#38bdf8' : 'currentColor' }} fill="none" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={menu.icon}></path>
                    </svg>
                    {menu.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
  );
}
