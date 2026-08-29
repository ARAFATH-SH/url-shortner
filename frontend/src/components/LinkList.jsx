import React, { useState } from 'react';
import { Search, Copy, Check, Trash2, QrCode, ExternalLink, RefreshCw, BarChart2, Link as LinkIcon, Database } from 'lucide-react';
import { deleteShortUrl, getApiUrl } from '../services/api';

export function LinkList({ links, loading, onRefresh, onDeleteSuccess, onOpenQR, addToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [deletingCode, setDeletingCode] = useState(null);

  const getFullShortUrl = (shortCode) => {
    const apiBase = getApiUrl();
    return `${apiBase}/urls/${shortCode}`;
  };

  const handleCopy = (shortCode, id) => {
    const full = getFullShortUrl(shortCode);
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    addToast('Copied short link!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (shortCode) => {
    if (!window.confirm(`Are you sure you want to delete short link /urls/${shortCode}?`)) {
      return;
    }

    setDeletingCode(shortCode);
    try {
      await deleteShortUrl(shortCode);
      addToast(`Deleted /urls/${shortCode}`, 'info');
      if (onDeleteSuccess) onDeleteSuccess(shortCode);
    } catch (err) {
      console.error(err);
      addToast('Failed to delete URL from backend.', 'error');
    } finally {
      setDeletingCode(null);
    }
  };

  const filteredLinks = links.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.original_url && item.original_url.toLowerCase().includes(term)) ||
      (item.short_code && item.short_code.toLowerCase().includes(term))
    );
  });

  return (
    <div className="dashboard-section">
      {/* Metrics Bar */}
      <div className="metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-icon purple">
            <LinkIcon size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value">{links.length}</span>
            <span className="metric-label">Total Shortened Links</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon cyan">
            <Database size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value">
              {new Set(links.map(l => {
                try { return new URL(l.original_url).hostname; } catch(_) { return 'custom'; }
              })).size}
            </span>
            <span className="metric-label">Unique Target Domains</span>
          </div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon pink">
            <BarChart2 size={20} />
          </div>
          <div className="metric-data">
            <span className="metric-value">Active</span>
            <span className="metric-label">Go PostgreSQL Storage</span>
          </div>
        </div>
      </div>

      {/* Control Bar & Search */}
      <div className="list-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by URL or short code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>&times;</button>
          )}
        </div>

        <button className="refresh-btn" onClick={onRefresh} disabled={loading} title="Refresh link list">
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Links List */}
      <div className="links-container">
        {loading && links.length === 0 ? (
          <div className="empty-state glass-card">
            <RefreshCw size={28} className="spin accent-purple" />
            <p>Loading links from PostgreSQL database...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="empty-state glass-card">
            <LinkIcon size={32} className="text-dim" />
            <h3>{searchTerm ? 'No matching links found' : 'No shortened links yet'}</h3>
            <p>{searchTerm ? 'Try adjusting your search query.' : 'Use the form above to generate your first shortened URL!'}</p>
          </div>
        ) : (
          <div className="links-grid">
            {filteredLinks.map((link) => {
              const fullUrl = getFullShortUrl(link.short_code);
              const isDeleting = deletingCode === link.short_code;
              const isCopied = copiedId === (link.id || link.short_code);

              return (
                <div key={link.id || link.short_code} className={`link-card glass-card ${isDeleting ? 'deleting' : ''}`}>
                  <div className="link-card-header">
                    <div className="short-code-chip">
                      <span className="code-prefix">/urls/</span>
                      <span className="code-text">{link.short_code}</span>
                    </div>

                    <div className="card-quick-actions">
                      <button
                        className="card-action-btn"
                        onClick={() => onOpenQR(fullUrl, link.short_code)}
                        title="Generate QR Code"
                      >
                        <QrCode size={16} />
                      </button>

                      <button
                        className="card-action-btn delete-btn"
                        onClick={() => handleDelete(link.short_code)}
                        disabled={isDeleting}
                        title="Delete URL"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="link-card-body">
                    <div className="original-url-label">Original Destination</div>
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="original-url-link"
                      title={link.original_url}
                    >
                      {link.original_url}
                    </a>
                  </div>

                  <div className="link-card-footer">
                    <div className="short-url-display">
                      {fullUrl}
                    </div>

                    <div className="footer-btns">
                      <button
                        className={`copy-link-btn ${isCopied ? 'copied' : ''}`}
                        onClick={() => handleCopy(link.short_code, link.id || link.short_code)}
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>

                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="visit-link-btn"
                        title="Test Redirection"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .dashboard-section {
          margin-top: 1rem;
        }

        /* Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .metric-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .metric-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-icon.purple {
          background: rgba(139, 92, 246, 0.15);
          color: var(--accent-purple);
        }
        .metric-icon.cyan {
          background: rgba(6, 182, 212, 0.15);
          color: var(--accent-cyan);
        }
        .metric-icon.pink {
          background: rgba(236, 72, 153, 0.15);
          color: var(--accent-pink);
        }
        .metric-data {
          display: flex;
          flex-direction: column;
        }
        .metric-value {
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .metric-label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Controls */
        .list-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .search-box {
          flex: 1;
          min-width: 260px;
          display: flex;
          align-items: center;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0.6rem 0.9rem;
          gap: 0.6rem;
        }
        .search-icon {
          color: var(--text-dim);
        }
        .search-box input {
          flex: 1;
          background: transparent;
          color: var(--text-main);
          font-size: 0.9rem;
        }
        .clear-search {
          background: none;
          color: var(--text-dim);
          font-size: 1.2rem;
        }
        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-card);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          padding: 0.6rem 1.1rem;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 600;
        }
        .refresh-btn:hover {
          background: var(--bg-card-hover);
          color: var(--accent-purple);
        }

        /* Grid */
        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .link-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-radius: 16px;
        }
        .link-card.deleting {
          opacity: 0.5;
          pointer-events: none;
        }
        .link-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.9rem;
        }
        .short-code-chip {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.25);
          padding: 0.25rem 0.65rem;
          border-radius: 8px;
        }
        .code-prefix {
          color: var(--text-dim);
        }
        .code-text {
          color: var(--accent-indigo);
          font-weight: 700;
        }
        .card-quick-actions {
          display: flex;
          gap: 0.4rem;
        }
        .card-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--bg-tertiary);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);
        }
        .card-action-btn:hover {
          color: var(--accent-cyan);
          background: var(--bg-card-hover);
        }
        .card-action-btn.delete-btn:hover {
          color: var(--accent-rose);
          background: rgba(244, 63, 94, 0.15);
        }

        .link-card-body {
          margin-bottom: 1rem;
        }
        .original-url-label {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }
        .original-url-link {
          font-size: 0.88rem;
          color: var(--text-main);
          text-decoration: none;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .original-url-link:hover {
          color: var(--accent-purple);
          text-decoration: underline;
        }

        .link-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-secondary);
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }
        .short-url-display {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: var(--accent-cyan);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 170px;
        }
        .footer-btns {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .copy-link-btn {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
          font-weight: 600;
          background: var(--accent-purple);
          color: #fff;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
        }
        .copy-link-btn.copied {
          background: var(--accent-emerald);
        }
        .visit-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          background: var(--bg-tertiary);
          color: var(--text-muted);
          border-radius: 6px;
          text-decoration: none;
        }
        .visit-link-btn:hover {
          color: var(--text-main);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .empty-state h3 {
          font-size: 1.1rem;
        }
        .empty-state p {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
