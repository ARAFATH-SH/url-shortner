import React, { useState, useEffect } from 'react';
import { Zap, Server, Sun, Moon, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { getApiUrl, setApiUrl, checkHealth } from '../services/api';

export function Navbar({ theme, toggleTheme, onBackendStatusChange }) {
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(getApiUrl());
  const [pinging, setPinging] = useState(false);

  const testConnection = async () => {
    setPinging(true);
    const online = await checkHealth();
    setIsBackendOnline(online);
    if (onBackendStatusChange) onBackendStatusChange(online);
    setPinging(false);
  };

  useEffect(() => {
    testConnection();
    const interval = setInterval(testConnection, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setApiUrl(apiUrlInput);
    setShowConfig(false);
    testConnection();
  };

  return (
    <header className="navbar-header">
      <div className="container nav-content">
        <div className="brand-logo">
          <div className="logo-icon-bg">
            <Zap className="logo-icon" size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-name">Snip<span className="gradient-text">Link</span></span>
            <span className="brand-badge">Go API</span>
          </div>
        </div>

        <div className="nav-actions">
          {/* Backend Status Pill */}
          <div className="backend-pill-container">
            <button 
              className={`status-pill ${isBackendOnline ? 'online' : 'offline'}`}
              onClick={() => setShowConfig(true)}
              title="Click to configure API server"
            >
              <span className={`status-dot ${isBackendOnline ? 'dot-online' : 'dot-offline'}`} />
              <Server size={14} />
              <span>{isBackendOnline ? 'Backend Ready' : 'Backend Offline'}</span>
              <Settings size={13} className="settings-icon" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button 
            className="icon-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Backend Config Modal */}
      {showConfig && (
        <div className="modal-backdrop" onClick={() => setShowConfig(false)}>
          <div className="modal-card animate-pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Server size={18} /> Backend API Settings</h3>
              <button className="close-btn" onClick={() => setShowConfig(false)}>&times;</button>
            </div>
            <form onSubmit={handleSaveConfig} className="modal-body">
              <p className="modal-desc">
                Configure your Go backend endpoint. Default target is <code>http://localhost:8080</code>.
              </p>
              <div className="input-group">
                <label>API Base URL</label>
                <input 
                  type="url" 
                  value={apiUrlInput} 
                  onChange={(e) => setApiUrlInput(e.target.value)} 
                  placeholder="http://localhost:8080"
                  required
                />
              </div>

              <div className="status-banner">
                {isBackendOnline ? (
                  <div className="status-msg success">
                    <CheckCircle2 size={16} /> Server response OK at {getApiUrl()}
                  </div>
                ) : (
                  <div className="status-msg warning">
                    <AlertCircle size={16} /> Backend server unreachable. Make sure Go backend is running on <code>http://localhost:8080</code>.
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={testConnection} disabled={pinging}>
                  {pinging ? 'Testing...' : 'Test Connection'}
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: var(--glass-border);
          padding: 0.9rem 0;
        }
        .nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-icon-bg {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: var(--gradient-brand);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
        }
        .brand-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .brand-name {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .brand-badge {
          font-size: 0.7rem;
          padding: 0.15rem 0.5rem;
          border-radius: 99px;
          background: rgba(99, 102, 241, 0.15);
          color: var(--accent-indigo);
          border: 1px solid rgba(99, 102, 241, 0.3);
          font-weight: 600;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .status-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          font-weight: 500;
          padding: 0.4rem 0.8rem;
          border-radius: 99px;
          background: var(--bg-tertiary);
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }
        .status-pill.online {
          border-color: rgba(16, 185, 129, 0.3);
          color: var(--text-main);
        }
        .status-pill.offline {
          border-color: rgba(244, 63, 94, 0.3);
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot-online {
          background-color: var(--accent-emerald);
          box-shadow: 0 0 10px var(--accent-emerald);
        }
        .dot-offline {
          background-color: var(--accent-rose);
          box-shadow: 0 0 8px var(--accent-rose);
        }
        .settings-icon {
          opacity: 0.6;
          margin-left: 0.2rem;
        }
        .icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--bg-tertiary);
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
        .icon-btn:hover {
          background: var(--bg-card-hover);
          color: var(--accent-purple);
        }

        /* Modal styling */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .modal-card {
          background: var(--bg-secondary);
          border: var(--glass-border);
          border-radius: 16px;
          width: 100%;
          max-width: 480px;
          padding: 1.5rem;
          box-shadow: var(--shadow-md);
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .modal-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
        }
        .close-btn {
          background: none;
          color: var(--text-muted);
          font-size: 1.5rem;
          line-height: 1;
        }
        .modal-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .modal-desc code {
          background: var(--bg-tertiary);
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          color: var(--accent-pink);
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        .input-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .input-group input {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          padding: 0.7rem 1rem;
          border-radius: 10px;
          font-size: 0.95rem;
        }
        .status-banner {
          margin-bottom: 1.25rem;
        }
        .status-msg {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.85rem;
          border-radius: 8px;
          font-size: 0.82rem;
        }
        .status-msg.success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-emerald);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .status-msg.warning {
          background: rgba(244, 63, 94, 0.1);
          color: var(--accent-rose);
          border: 1px solid rgba(244, 63, 94, 0.2);
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
        .btn-secondary {
          background: var(--bg-tertiary);
          color: var(--text-main);
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 500;
        }
        .btn-primary {
          background: var(--gradient-brand);
          color: #fff;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
      `}</style>
    </header>
  );
}
