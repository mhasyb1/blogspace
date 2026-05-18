import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts({ mine: true, status: 'published' })
      .then(({ data }) => setPosts(data.results || data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const initials = ((user?.first_name?.[0] || '') + (user?.last_name?.[0] || '')) || user?.username?.[0]?.toUpperCase() || '?';

  return (
    <div className="container page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar">{initials}</div>
        <div>
          <h1 className="profile-name">
            {user?.first_name || user?.last_name
              ? `${user.first_name} ${user.last_name}`.trim()
              : user?.username}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 8 }}>@{user?.username}</p>
          {user?.profile?.bio && <p className="profile-bio">{user.profile.bio}</p>}
          <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
            {user?.profile?.location && (
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>📍 {user.profile.location}</span>
            )}
            {user?.profile?.website && (
              <a href={user.profile.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem' }}>
                🔗 Website
              </a>
            )}
            <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
              Member since {user?.date_joined ? format(new Date(user.date_joined), 'MMM yyyy') : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 36 }}>
        <div className="stat-card">
          <div className="stat-number">{user?.post_count || 0}</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Published</div>
        </div>
      </div>

      {/* Published Posts */}
      <div className="section-header">
        <h2 className="section-title">Published Posts</h2>
        <Link to="/dashboard" className="btn btn-ghost btn-sm">Go to Dashboard</Link>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✦</div>
          <p className="empty-state-text">No published posts yet.</p>
          <Link to="/dashboard" className="btn btn-primary btn-sm">Write Something</Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div className="post-card" key={post.id}>
              <div className="post-card-body">
                <div className="post-card-meta">
                  <span className="badge badge-category">{post.category}</span>
                </div>
                <h3 className="post-card-title">
                  <Link to={`/posts/${post.id}`} style={{ color: 'inherit' }}>{post.title}</Link>
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                  {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : ''} · 💬 {post.comments_count}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
