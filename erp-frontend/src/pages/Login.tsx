import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { loginAPI } from '../services/api.ts';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginAPI({ email, password });
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'Super Admin') navigate('/admin');
      else navigate('/tenant');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0f;
          overflow: hidden;
        }

        /* Left Panel */
        .left-panel {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          overflow: hidden;
        }

        .left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(16,185,129,0.15) 0%, transparent 50%);
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .floating-card {
          position: absolute;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          padding: 20px 24px;
          animation: float 6s ease-in-out infinite;
        }

       .card-1 {
  top: 12%;
  right: 5%;
  animation-delay: 0s;
}

.card-2 {
  top: 42%;
  right: 5%;
  animation-delay: 2s;
}

.card-3 {
  top: 72%;
  right: 5%;
  animation-delay: 4s;
}

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .card-stat {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: white;
        }

        .card-label {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          margin-top: 4px;
          letter-spacing: 0.5px;
        }

        .card-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }

        .left-content {
          position: relative;
          z-index: 1;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 60px;
        }

        .brand-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        .hero-text {
          font-family: 'Syne', sans-serif;
          font-size: 52px;
          font-weight: 800;
          color: white;
          line-height: 1.1;
          letter-spacing: -2px;
          margin-bottom: 24px;
        }

        .hero-text span {
          background: linear-gradient(135deg, #6366f1, #a78bfa, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          font-size: 16px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          max-width: 380px;
          margin-bottom: 48px;
        }

        .features {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.7);
          font-size: 14px;
        }

        .feature-icon {
          width: 32px;
          height: 32px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        /* Right Panel */
        .right-panel {
          width: 480px;
          background: #0f0f1a;
          border-left: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
          position: relative;
        }

        .right-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
        }

        .login-form-container {
          width: 100%;
        }

        .form-header {
          margin-bottom: 40px;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: white;
          letter-spacing: -1px;
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
        }

        .error-box {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 12px 16px;
          color: #f87171;
          font-size: 13px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .field-wrapper {
          position: relative;
        }

        .field-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: white;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s;
        }

        .field-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.05);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .field-input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          transition: color 0.2s;
        }

        .password-toggle:hover { color: rgba(255,255,255,0.7); }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: white;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
          letter-spacing: 0.3px;
        }

        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(99,102,241,0.4);
        }

        .submit-btn:active { transform: translateY(0); }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .divider-text {
          font-size: 12px;
          color: rgba(255,255,255,0.25);
          white-space: nowrap;
        }

        .role-hints {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .role-hint {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }

        .role-badge {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-form-container {
          animation: fadeIn 0.5s ease forwards;
        }
      `}</style>

      <div className="login-root">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="grid-overlay" />

          {/* Floating Cards */}
{/* Floating Cards */}
<div className="floating-card card-1">
  <div className="card-stat">24</div>
  <div className="card-label">
    <span className="card-dot" style={{ background: '#10b981' }} />
    Active ERPs
  </div>
</div>
<div className="floating-card card-2">
  <div className="card-stat">1,248</div>
  <div className="card-label">
    <span className="card-dot" style={{ background: '#6366f1' }} />
    Total Users
  </div>
</div>
<div className="floating-card card-3">
  <div className="card-stat">₹2.4M</div>
  <div className="card-label">
    <span className="card-dot" style={{ background: '#f59e0b' }} />
    Inventory Value
  </div>
</div>

          <div className="left-content">
            <div className="brand">
              <div className="brand-icon">🏢</div>
              <span className="brand-name">NexERP</span>
            </div>

            <h1 className="hero-text">
              Manage Every<br />
              Business <span>Smarter.</span>
            </h1>

            <p className="hero-desc">
              A powerful multi-tenant ERP platform built for modern businesses.
              One platform, infinite possibilities.
            </p>

            <div className="features">
              {[
                { icon: '🔐', text: 'Enterprise-grade security & role management' },
                { icon: '📦', text: 'Real-time inventory tracking & analytics' },
                { icon: '👥', text: 'Multi-tenant architecture with data isolation' },
              ].map((f, i) => (
                <div className="feature-item" key={i}>
                  <div className="feature-icon">{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="login-form-container">
            <div className="form-header">
              <h2 className="form-title">Welcome back</h2>
              <p className="form-subtitle">Sign in to your workspace</p>
            </div>

            {error && (
              <div className="error-box">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="field-wrapper">
                  <input
                    type="email"
                    className="field-input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="spinner" />Signing in...</>
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Access levels</span>
              <div className="divider-line" />
            </div>

            <div className="role-hints">
              <div className="role-hint">
                <span className="role-badge" style={{ background: 'rgba(99,102,241,0.2)', color: '#a78bfa' }}>
                  Super Admin
                </span>
                Platform owner — manages all ERP tenants
              </div>
              <div className="role-hint">
                <span className="role-badge" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                  Tenant User
                </span>
                Company staff — accesses their ERP only
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;