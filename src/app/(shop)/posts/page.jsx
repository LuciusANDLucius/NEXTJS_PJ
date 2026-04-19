'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { listPosts } from '@/services/postService';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await listPosts();
        setPosts(res.data || res || []);
      } catch (error) {
        console.error("Failed to load posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: '0 20px', minHeight: '60vh' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 30, color: '#0f172a' }}>Khám phá tin tức & Bài viết</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Đang tải bài viết...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Hiện chưa có bài viết nào.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 30 }}>
          {posts.map(post => (
            <Link key={post.post_id || post.id} href={`/posts/${post.post_id || post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: '0.3s', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: 200, background: '#f1f5f9', position: 'relative' }}>
                  {post.image ? (
                    <img src={post.image.startsWith('http') ? post.image : `http://localhost:5000/uploads/${post.image}`} alt={post.title || post.post_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>Không có ảnh</div>
                  )}
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 12, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {post.title || post.post_name}
                  </h3>
                  <p style={{ fontSize: 14, color: '#475569', marginBottom: 20, lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {post.summary || post.detail || "Đang cập nhật nội dung..."}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                    <span style={{ fontSize: 13, color: '#64748b' }}>{new Date(post.created_at || Date.now()).toLocaleDateString('vi-VN')}</span>
                    <span style={{ fontSize: 14, color: '#0284c7', fontWeight: 500 }}>Đọc tiếp &rarr;</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
