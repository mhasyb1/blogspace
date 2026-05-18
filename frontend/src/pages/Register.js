import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '', password2: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await registerUser(form);
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Register error:', err.response ?? err);
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        setErrors(data);
      } else if (typeof data === 'string') {
        setErrors({ non_field_errors: [data] });
      } else {
        setErrors({ non_field_errors: ['Registration failed. Please try again.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  const formatError = (error) => {
    if (!error) return null;
    if (Array.isArray(error)) return error.join(' ');
    return error;
  };

  const fieldError = (field) => {
    const message = formatError(errors[field]);
    return message ? <p className="form-error">{message}</p> : null;
  };

  return (
    <div className="auth-page">
      <div className="auth-card card card-body">
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join BlogSpace today — it's free</p>

        {errors.non_field_errors && (
          <div className="alert alert-error">{formatError(errors.non_field_errors)}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-control" name="first_name" value={form.first_name} onChange={handleChange} placeholder="Jane" />
              {fieldError('first_name')}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className="form-control" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Doe" />
              {fieldError('last_name')}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-control" name="username" value={form.username} onChange={handleChange} placeholder="janedoe" required />
            {fieldError('username')}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
            {fieldError('email')}
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" required />
            {fieldError('password')}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-control" type="password" name="password2" value={form.password2} onChange={handleChange} placeholder="Repeat password" required />
            {fieldError('password2')}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
