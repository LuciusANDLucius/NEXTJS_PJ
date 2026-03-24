import React from 'react';

export default function Table({ columns, data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
        Không có dữ liệu nào để hiển thị
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            {columns.map(col => (
              <th 
                key={col.key} 
                style={{ 
                  padding: '16px 24px', 
                  color: '#475569', 
                  fontWeight: 600, 
                  fontSize: '13px', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap' 
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={row.id || row.product_id || row.cat_id || index} 
              style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', background: '#fff' }} 
              onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'} 
              onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: '16px 24px', color: '#334155', fontSize: '14px', verticalAlign: 'middle' }}>
                  {/* Kiểm tra nếu cột có custom render thì tự render code đó, nếu không in giá trị cơ bản ra */}
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}