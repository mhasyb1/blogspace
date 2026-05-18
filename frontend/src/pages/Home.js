import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts } from '../api';
import { format } from 'date-fns';

const CATEGORIES = ['all', 'technology', 'science', 'lifestyle', 'travel', 'food', 'other'];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Read category from URL, default to 'all'
  const category = searchParams.get('category') || 'all';

  const setCategory = (cat) => {
    if (cat === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== 'all') params.category = category;
    if (search) params.search = search;
    getPosts(params)
      .then(({ data }) => {
        const all = data.results || data;
        setPosts(all.filter(p => p.status === 'published'));
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <main>
      {/* Hero */}
      <div className="hero">
        <div className="container">
          <p className="hero-eyebrow">The Modern Blogging Platform</p>
          <h1 className="hero-title">Ideas worth <em>sharing</em></h1>
          <p className="hero-sub">Read stories from curious minds. Write yours today.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Start Writing</Link>
            <a href="#posts" className="btn btn-ghost">Explore Posts</a>
          </div>
        </div>
      </div>

      <div className="container page" id="posts">
        {/* Search */}
        <div style={{ marginBottom: 20 }}>
          <input
            className="form-control"
            placeholder="Search posts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 380 }}
          />
        </div>

        {/* Filters */}
        <div className="filter-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="spinner" />
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <p className="empty-state-text">
              {search || category !== 'all'
                ? 'No posts match your search. Try a different filter.'
                : 'No published posts yet. Be the first to write one!'}
            </p>
            <Link to="/register" className="btn btn-primary btn-sm">Create Account</Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function PostCard({ post }) {
  const excerpt = post.content.length > 120 ? post.content.slice(0, 120) + '…' : post.content;
  return (
    <div className="post-card">
      <div className="post-card-body">
        <div className="post-card-meta">
          <span className="badge badge-category">{post.category}</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
            {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : ''}
          </span>
        </div>
        <h3 className="post-card-title">
          <Link to={`/posts/${post.id}`} style={{ color: 'inherit' }}>{post.title}</Link>
        </h3>
        <p className="post-card-excerpt">{excerpt}</p>
        <div className="post-card-footer">
          <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>by {post.author_username}</span>
          <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
            💬 {post.comments_count}
          </span>
        </div>
      </div>
    </div>
  );
}
