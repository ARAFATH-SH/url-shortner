import React, { useState } from 'react';
import { Link2, ArrowRight, Clipboard, Check, QrCode, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createShortUrl, getApiUrl } from '../services/api';

export function ShortenerForm({ onLinkCreated, addToast }) {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [latestCreated, setLatestCreated] = useState(null);
  const [copied, setCopied] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text);
        setErrorMsg('');
      }
    } catch (err) {
      addToast('Please manually paste the URL into input.', 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLatestCreated(null);

    let trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a valid URL.');
      return;
    }

    // Auto prepend http/https if missing
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
      setUrlInput(trimmed);
    }

    try {
      new URL(trimmed);
    } catch (_) {
      setErrorMsg('Invalid URL format. Example: https://example.com');
      return;
    }

    setLoading(true);

    try {
      const result = await createShortUrl(trimmed);
      setLatestCreated(result);
      if (onLinkCreated) onLinkCreated(result);
      addToast('Short code generated successfully!', 'success');

      // Trigger Confetti effect!
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#10b981']
      });

      setUrlInput('');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to communicate with Go backend. Is server running on port 8080?');
      addToast('Error shortening URL', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getFullShortUrl = (shortCode) => {
    const apiBase = getApiUrl();
    return `${apiBase}/urls/${shortCode}`;
  };

  const handleCopy = (shortCode) => {
    const full = getFullShortUrl(shortCode);
    navigator.clipboard.writeText(full);
    setCopied(true);
    addToast('Short link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="shortener-wrapper">
      <form onSubmit={handleSubmit} className="shortener-card glass-card">
        <div className="input-container">
          <div className="input-icon-wrapper">
            <Link2 className="input-icon" size={22} />
          </div>

          <input
            type="text"
            className="url-input"
            placeholder="Paste long link here (e.g. https://github.com/arafath-sh/url-shortener)"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            disabled={loading}
          />

          {urlInput && (
            <button
              type="button"
              className="clear-input-btn"
              onClick={() => setUrlInput('')}
              title="Clear input"
            >
              &times;
            </button>
          )}

          <button
            type="button"
            className="paste-btn"
            onClick={handlePaste}
            title="Paste from clipboard"
          >
            Paste
          </button>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !urlInput.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="spin" size={18} />
                <span>Snapping...</span>
              </>
            ) : (
              <>
                <span>Shorten</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="form-error animate-fade-in">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>

      {/* Success Result Card */}
      {latestCreated && (
        <div className="result-card glass-card animate-pop-in">
          <div className="result-header">
            <span className="result-badge">⚡ Link Ready</span>
            <span className="result-original" title={latestCreated.original_url}>
              Target: {latestCreated.original_url}
            </span>
          </div>

          <div className="result-body">
            <div className="short-url-box">
              <span className="short-url-text">
                {getFullShortUrl(latestCreated.short_code)}
              </span>
            </div>

            <div className="result-actions">
              <button
                className={`action-btn copy-btn ${copied ? 'copied' : ''}`}
                onClick={() => handleCopy(latestCreated.short_code)}
              >
                {copied ? <Check size={16} /> : <Clipboard size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <a
                href={getFullShortUrl(latestCreated.short_code)}
                target="_blank"
                rel="noopener noreferrer"
                className="action-btn visit-btn"
              >
                <ExternalLink size={16} />
                <span>Visit Link</span>
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .shortener-wrapper {
          width: 100%;
          max-width: 800px;
          margin: 0 auto 2.5rem;
        }
        .shortener-card {
          padding: 0.6rem;
          border-radius: 20px;
          box-shadow: var(--shadow-glow);
          position: relative;
        }
        .input-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--bg-secondary);
          border-radius: 16px;
          padding: 0.4rem 0.5rem 0.4rem 1rem;
          border: 1px solid var(--border-color);
        }
        .input-container:focus-within {
          border-color: var(--accent-purple);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
        }
        .input-icon-wrapper {
          color: var(--accent-indigo);
          display: flex;
          align-items: center;
        }
        .url-input {
          flex: 1;
          background: transparent;
          color: var(--text-main);
          font-size: 1.05rem;
          padding: 0.75rem 0.5rem;
        }
        .url-input::placeholder {
          color: var(--text-dim);
          font-size: 0.95rem;
        }
        .clear-input-btn {
          background: none;
          color: var(--text-dim);
          font-size: 1.4rem;
          padding: 0 0.4rem;
        }
        .clear-input-btn:hover {
          color: var(--text-main);
        }
        .paste-btn {
          background: var(--bg-tertiary);
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.55rem 0.85rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
        }
        .paste-btn:hover {
          color: var(--text-main);
          background: var(--bg-card-hover);
        }
        .submit-btn {
          background: var(--gradient-brand);
          color: #fff;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.75rem 1.4rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
        }
        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .form-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-rose);
          font-size: 0.85rem;
          padding: 0.75rem 1rem 0.2rem;
        }

        /* Result Card */
        .result-card {
          margin-top: 1.25rem;
          padding: 1.25rem;
          border-radius: 16px;
          background: var(--bg-card);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          gap: 1rem;
        }
        .result-badge {
          background: rgba(16, 185, 129, 0.15);
          color: var(--accent-emerald);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 99px;
        }
        .result-original {
          font-size: 0.82rem;
          color: var(--text-dim);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 450px;
        }
        .result-body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .short-url-box {
          font-family: var(--font-mono);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--accent-cyan);
          background: var(--bg-secondary);
          padding: 0.6rem 1rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          word-break: break-all;
        }
        .result-actions {
          display: flex;
          gap: 0.6rem;
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.55rem 0.95rem;
          border-radius: 10px;
          text-decoration: none;
        }
        .copy-btn {
          background: var(--accent-purple);
          color: #fff;
        }
        .copy-btn.copied {
          background: var(--accent-emerald);
        }
        .visit-btn {
          background: var(--bg-tertiary);
          color: var(--text-main);
          border: 1px solid var(--border-color);
        }
        .visit-btn:hover {
          background: var(--bg-card-hover);
        }
      `}</style>
    </div>
  );
}
