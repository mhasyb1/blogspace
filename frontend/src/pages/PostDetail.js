import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, createComment, deleteComment } from '../api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = () => {
    setLoading(true);
    getPost(id)
      .then(({ data }) => setPost(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPost(); }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please log in to comment.'); return; }
    setSubmitting(true);
    try {
      await createComment({ post: id, content: comment });
      setComment('');
      toast.success('Comment posted!');
      fetchPost();
    } catch {
      toast.error('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (cid) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(cid);
      toast.success('Comment deleted.');
      fetchPost();
    } catch {
      toast.error('Failed to delete comment.');
    }
  };

  if (loading) return <div className="spinner" />;
  if (!post) return null;

  return (
    <div className="container page">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <article>
        <div className="post-detail-header">
          <div className="post-card-meta" style={{ marginBottom: 16 }}>
            <span className="badge badge-category">{post.category}</span>
            <span className={`badge ${post.status === 'published' ? 'badge-published' : 'badge-draft'}`}>{post.status}</span>
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          <div style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 32 }}>
            by <strong style={{ color: 'var(--text)' }}>{post.author_username}</strong>
            {post.created_at && ` · ${format(new Date(post.created_at), 'MMMM d, yyyy')}`}
          </div>
        </div>
        <p className="post-detail-content">{post.content}</p>
      </article>

      {/* Comments */}
      <div className="comments-section">
        <h2 className="section-title" style={{ marginBottom: 24 }}>
          Comments ({post.comments?.length || 0})
        </h2>

        {/* Comment form */}
        <form onSubmit={handleComment} style={{ marginBottom: 32 }}>
          <div className="form-group">
            <label className="form-label">Leave a comment</label>
            <textarea
              className="form-control"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={user ? 'Share your thoughts…' : 'Log in to comment'}
              rows={3}
              disabled={!user}
              required
            />
          </div>
          <button className="btn btn-primary" disabled={submitting || !user}>
            {submitting ? 'Posting…' : 'Post Comment'}
          </button>
        </form>

        {/* Comment list */}
        {(post.comments || []).length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No comments yet. Be the first!</p>
        ) : (
          post.comments.map(c => (
            <div className="comment-card" key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p className="comment-author">{c.author_username}</p>
                  <p className="comment-text">{c.content}</p>
                  <p className="comment-date">
                    {c.created_at ? format(new Date(c.created_at), 'MMM d, yyyy · h:mm a') : ''}
                  </p>
                </div>
                {user && (user.username === c.author_username) && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(c.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
