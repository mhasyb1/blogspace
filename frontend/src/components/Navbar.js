import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          Blog<span>Space</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <span>Home</span>
          </NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                <span>Profile</span>
              </NavLink>
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                <span>Settings</span>
              </NavLink>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink>
              <NavLink to="/register" className="btn-nav-accent">Get Started</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
