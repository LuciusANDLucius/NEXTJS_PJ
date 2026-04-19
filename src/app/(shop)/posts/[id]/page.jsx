'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPost } from '@/services/postService';
import { useParams } from 'next/navigation';

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    const fetchPost = async () => {
      try {
        const res = await getPost(params.id);
        setPost(res.data || res);
      } catch (error) {
        console.error("Failed to load post detail", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 20px', color: '#64748b' }}>Đang tải nội dung bài viết...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '100px 20px', color: '#64748b' }}>Không tìm thấy bài viết này.</div>;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 20px', minHeight: '60vh' }}>
      <nav style={{ marginBottom: 24, fontSize: 14, color: '#64748b', display: 'flex', gap: 8 }}>
        <Link href="/" style={{ color: '#0284c7', textDecoration: 'none' }}>Trang chủ</Link>
        <span>&rsaquo;</span>
        <Link href="/posts" style={{ color: '#0284c7', textDecoration: 'none' }}>Tin tức</Link>
        <span>&rsaquo;</span>
        <span>{post.title || post.post_name}</span>
      </nav>

      <article style={{ background: '#fff', borderRadius: 12, padding: '40px 0' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 16, lineHeight: 1.3 }}>{post.title || post.post_name}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30, paddingBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0ea5e9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>A</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#334155' }}>Admin</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Đăng ngày {new Date(post.created_at || Date.now()).toLocaleDateString('vi-VN')}</div>
          </div>
        </div>

        {post.image && (
          <div style={{ marginBottom: 30, borderRadius: 12, overflow: 'hidden' }}>
            <img src={post.image.startsWith('http') ? post.image : `http://localhost:5000/uploads/${post.image}`} alt={post.title || post.post_name} style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}

        <div 
          style={{ fontSize: 16, color: '#334155', lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: post.detail || post.content || post.summary || 'Nội dung đang được cập nhật...' }} 
        />
        
        <div style={{ marginTop: 60, paddingTop: 30, borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/posts" style={{ color: '#0284c7', fontWeight: 500, textDecoration: 'none' }}>&larr; Xem các bài viết khác</Link>
        </div>
      </article>
    </div>
  );
}
