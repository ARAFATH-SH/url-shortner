import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShortenerForm } from './components/ShortenerForm';
import { LinkList } from './components/LinkList';
import { QRCodeModal } from './components/QRCodeModal';
import { ToastContainer } from './components/Toast';
import { fetchUrls, checkHealth } from './services/api';

export function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('shortlink_theme') || 'dark');
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [qrModal, setQrModal] = useState({ open: false, url: '', shortCode: '' });
  const [toasts, setToasts] = useState([]);

  // Theme Sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shortlink_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast System
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load Links from Backend
  const loadLinks = async () => {
    setLoading(true);
    try {
      const isOnline = await checkHealth();
      setIsBackendOnline(isOnline);

      if (isOnline) {
        const fetched = await fetchUrls();
        setLinks(fetched);
      } else {
        // Fallback demo links if offline or connecting initially
        const cached = localStorage.getItem('shortlink_local_links');
        if (cached) {
          setLinks(JSON.parse(cached));
        } else {
          setLinks([
            { id: 1, original_url: 'https://github.com/arafath-sh/url-shortener', short_code: 'demo01' },
            { id: 2, original_url: 'https://golang.org/doc/', short_code: 'goDocs' }
          ]);
        }
      }
    } catch (err) {
      console.warn('Could not load links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleLinkCreated = (newLink) => {
    setLinks(prev => [newLink, ...prev]);
    // Cache in local storage for seamless offline access
    const updated = [newLink, ...links];
    localStorage.setItem('shortlink_local_links', JSON.stringify(updated));
  };

  const handleDeleteSuccess = (shortCode) => {
    setLinks(prev => prev.filter(item => item.short_code !== shortCode));
    const updated = links.filter(item => item.short_code !== shortCode);
    localStorage.setItem('shortlink_local_links', JSON.stringify(updated));
  };

  const handleOpenQR = (url, shortCode) => {
    setQrModal({ open: true, url, shortCode });
  };

  return (
    <div className="app-viewport">
      {/* Background Glow Orbs */}
      <div className="bg-decor">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        onBackendStatusChange={setIsBackendOnline}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '4rem' }}>
        <Hero />
        
        <ShortenerForm 
          onLinkCreated={handleLinkCreated} 
          addToast={addToast} 
        />

        <LinkList 
          links={links} 
          loading={loading} 
          onRefresh={loadLinks} 
          onDeleteSuccess={handleDeleteSuccess}
          onOpenQR={handleOpenQR}
          addToast={addToast}
        />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container footer-content">
          <p>© 2026 ShortLink Engine • Built for Go Backend REST APIs</p>
          <div className="footer-links">
            <span className="api-tag">REST API: <code>POST /urls</code></span>
            <span className="api-tag"><code>GET /urls/&#123;code&#125;</code></span>
            <span className="api-tag"><code>DELETE /urls/&#123;code&#125;</code></span>
          </div>
        </div>
      </footer>

      {/* QR Modal */}
      {qrModal.open && (
        <QRCodeModal 
          url={qrModal.url} 
          shortCode={qrModal.shortCode} 
          onClose={() => setQrModal({ open: false, url: '', shortCode: '' })}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <style>{`
        .app-footer {
          border-top: var(--glass-border);
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          padding: 1.25rem 0;
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-links {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .api-tag code {
          background: var(--bg-tertiary);
          color: var(--accent-cyan);
          padding: 0.15rem 0.45rem;
          border-radius: 6px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
}

export default App;
