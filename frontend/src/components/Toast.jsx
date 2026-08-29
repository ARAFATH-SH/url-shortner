import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type} animate-pop-in`}>
          <div className="toast-icon">
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>&times;</button>
        </div>
      ))}

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          max-width: 380px;
          pointer-events: none;
        }
        .toast-item {
          pointer-events: auto;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          background: var(--bg-secondary);
          color: var(--text-main);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
          font-size: 0.88rem;
        }
        .toast-item.success {
          border-color: rgba(16, 185, 129, 0.4);
        }
        .toast-item.success .toast-icon {
          color: var(--accent-emerald);
        }
        .toast-item.error {
          border-color: rgba(244, 63, 94, 0.4);
        }
        .toast-item.error .toast-icon {
          color: var(--accent-rose);
        }
        .toast-item.info {
          border-color: rgba(6, 182, 212, 0.4);
        }
        .toast-item.info .toast-icon {
          color: var(--accent-cyan);
        }
        .toast-message {
          flex: 1;
        }
        .toast-close {
          background: none;
          color: var(--text-dim);
          font-size: 1.2rem;
          line-height: 1;
        }
        .toast-close:hover {
          color: var(--text-main);
        }
      `}</style>
    </div>
  );
}
