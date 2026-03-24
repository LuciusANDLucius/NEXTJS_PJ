'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const menu = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Sản phẩm', path: '/admin/products' },
    { name: 'Danh mục', path: '/admin/categories' },
  ];

  return (
    <div className="sidebar" style={{ width: '250px', background: '#1e293b', color: '#fff', padding: '20px' }}>
      <h3 style={{ color: '#38bdf8', textAlign: 'center' }}>Admin Panel</h3>
      <nav style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {menu.map(item => (
          <Link 
            key={item.path} 
            href={item.path}
            style={{ 
              padding: '12px', 
              color: pathname === item.path ? '#fff' : '#94a3b8',
              background: pathname === item.path ? '#334155' : 'transparent',
              textDecoration: 'none',
              borderRadius: '6px'
            }}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}