import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPosts, createPost, updatePost, deletePost } from '../api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

// Default new posts to 'published' so they appear on the Home page immediately
const EMPTY_FORM = { title: '', content: '', category: 'technology', status: 'published' };
const CATEGORIES = ['technology', 'science', 'lifestyle', 'travel', 'food', 'other'];

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchPosts = () => {
    setLoading(true);
    getPosts({ mine: true })
      .then(({ data }) => setPosts(data.results || data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => { setForm(EMPTY_FORM); setEditPost(null); setShowModal(true); };
  const openEdit = (post) => {
    setForm({ title: post.title, content: post.content, category: post.category, status: post.status });
    setEditPost(post);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editPost) {
        await updatePost(editPost.id, form);
        toast.success('Post updated!');
      } else {
        await createPost(form);
        toast.success('Post created!');
      }
      setShowModal(false);
      fetchPosts();
    } catch (err) {
      toast.error('Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      toast.success('Post deleted.');
      fetchPosts();
    } catch {
      toast.error('Failed to delete post.');
    }
  };

  const filtered = filter === 'all' ? posts : posts.filter(p => p.status === filter);

  const published = posts.filter(p => p.status === 'published').length;
  const drafts = posts.filter(p => p.status === 'draft').length;
  const totalComments = posts.reduce((s, p) => s + (p.comments_count || 0), 0);

  return (
    <div className="container page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, {user?.first_name || user?.username} ✦</p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{published}</div>
          <div className="stat-label">Published</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{drafts}</div>
          <div className="stat-label">Drafts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalComments}</div>
          <div className="stat-label">Comments</div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="section-header">
        <h2 className="section-title">My Posts</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ New Post</button>
      </div>

      <div className="filter-bar">
        {['all', 'published', 'draft'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">✦</div>
          <p className="empty-state-text">
            {filter !== 'all'
              ? `No ${filter} posts yet.`
              : 'No posts yet. Start writing!'}
          </p>
          <button className="btn btn-primary" onClick={openCreate}>Create First Post</button>
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map(post => (
            <div className="post-card" key={post.id}>
              <div className="post-card-body">
                <div className="post-card-meta">
                  <span className="badge badge-category">{post.category}</span>
                  <span className={`badge ${post.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                    {post.status}
                  </span>
                </div>
                <h3 className="post-card-title">
                  <Link to={`/posts/${post.id}`} style={{ color: 'inherit' }}>{post.title}</Link>
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: 16 }}>
                  {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : ''} · 💬 {post.comments_count}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(post)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(post.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editPost ? 'Edit Post' : 'New Post'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Give your post a compelling title…"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    placeholder="Write your story here…"
                    rows={8}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-control" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : editPost ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
