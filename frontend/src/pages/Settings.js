import React, { useState } from 'react';
import { updateMe } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TABS = ['Account', 'Profile', 'Password'];

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [tab, setTab] = useState('Account');
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    bio: user?.profile?.bio || '',
    website: user?.profile?.website || '',
    location: user?.profile?.location || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateMe(form);
      await refreshUser();
      toast.success('Settings saved!');
    } catch {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Settings</h1>
        <p className="dashboard-subtitle">Manage your account preferences</p>
      </div>

      <div className="settings-layout">
        {/* Nav */}
        <div className="settings-nav">
          {TABS.map(t => (
            <button
              key={t}
              className={`settings-nav-item ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card card-body">
          {tab === 'Account' && (
            <form onSubmit={handleSave}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 24 }}>Account Info</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-control" name="first_name" value={form.first_name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-control" name="last_name" value={form.last_name} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-control" value={user?.username || ''} disabled style={{ opacity: 0.5 }} />
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 4 }}>Username cannot be changed.</p>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          )}

          {tab === 'Profile' && (
            <form onSubmit={handleSave}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 24 }}>Public Profile</h2>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-control" name="bio" value={form.bio} onChange={handleChange} rows={4} placeholder="Tell readers about yourself…" />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
              </div>
              <div className="form-group">
                <label className="form-label">Website</label>
                <input className="form-control" name="website" value={form.website} onChange={handleChange} placeholder="https://yoursite.com" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Update Profile'}
              </button>
            </form>
          )}

          {tab === 'Password' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 16 }}>Change Password</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
                To change your password, use the Django Admin panel at{' '}
                <a href="/admin/" target="_blank" rel="noreferrer">/admin/</a>{' '}
                and update your account from there.
              </p>
              <a href="/admin/auth/user/" target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
                Open Admin Panel →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
