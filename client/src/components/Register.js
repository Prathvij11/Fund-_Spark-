import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(90deg, #f8fafc 0%, #e3e8ee 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        background: 'white',
        borderRadius: 18,
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        padding: '2.5rem 2rem 2rem 2rem',
        border: '1px solid #e3e8ee',
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1976d2', marginBottom: '1.2rem', letterSpacing: 1, textAlign: 'center' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              placeholder="Username"
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #b0bec5', marginTop: 6, fontSize: '1rem' }}
            />
          </div>
          <div style={{ marginBottom: 18, position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password"
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.6rem', borderRadius: 8, border: '1px solid #b0bec5', marginTop: 6, fontSize: '1rem', paddingRight: '3.5rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                position: 'absolute',
                right: 10,
                top: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1976d2',
                fontSize: '1rem',
                fontWeight: 600,
                padding: 0,
                height: '1.7rem',
                lineHeight: '1.7rem',
              }}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div style={{ marginBottom: 18 }}>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1px solid #b0bec5', marginTop: 6, fontSize: '1rem', color: role === '' ? '#888' : '#222' }}
              required
            >
              <option value="" disabled hidden>Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', fontSize: '1.1rem', padding: '0.7rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px #e3e8ee', transition: 'background 0.2s', marginBottom: 10 }} onMouseOver={e => e.target.style.background = '#0d47a1'} onMouseOut={e => e.target.style.background = '#1976d2'}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <div style={{color:'#d32f2f', marginTop: 8, textAlign: 'center', fontWeight: 600}}>{error}</div>}
        </form>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span style={{ color: '#333', fontSize: '1rem' }}>Already have an account?</span>
          <Link to="/login" style={{
            display: 'inline-block',
            marginLeft: 8,
            color: 'white',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            padding: '0.4rem 1.2rem',
            borderRadius: 8,
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 2px 8px #e3e8ee',
            transition: 'background 0.2s',
          }} onMouseOver={e => e.target.style.background = '#0d47a1'} onMouseOut={e => e.target.style.background = 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 