import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function PostCard({ post, actions }) {
  const excerpt =
    post.content.length > 130 ? post.content.slice(0, 130) + '…' : post.content;

  return (
    <div className="post-card">
      <div className="post-card-body">
        <div className="post-card-meta">
          <span className="badge badge-category">{post.category}</span>
          {post.status && (
            <span className={`badge ${post.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
              {post.status}
            </span>
          )}
          <span style={{ color: 'var(--muted)', fontSize: '0.78rem', marginLeft: 'auto' }}>
            {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : ''}
          </span>
        </div>

        <h3 className="post-card-title">
          <Link to={`/posts/${post.id}`} style={{ color: 'inherit' }}>
            {post.title}
          </Link>
        </h3>

        <p className="post-card-excerpt">{excerpt}</p>

        <div className="post-card-footer">
          <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
            by <strong style={{ color: 'var(--text)' }}>{post.author_username}</strong>
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
            💬 {post.comments_count || 0}
          </span>
        </div>

        {/* Optional action buttons (e.g. Edit/Delete on Dashboard) */}
        {actions && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {actions(post)}
          </div>
        )}
      </div>
    </div>
  );
}
