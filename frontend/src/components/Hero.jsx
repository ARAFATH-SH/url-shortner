import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-badge animate-fade-in">
        <Sparkles size={14} className="badge-icon" />
        <span>Powered by High Performance Go Engine</span>
      </div>

      <h1 className="hero-title animate-fade-in">
        Shorten Links with <br />
        <span className="gradient-text">Lightning Speed & Precision</span>
      </h1>

      <p className="hero-subtitle animate-fade-in">
        Transform long, complex URLs into memorable, sleek short codes instantly. 
        Integrated with Go REST microservice architecture.
      </p>

      <div className="hero-features animate-fade-in">
        <div className="feature-chip">
          <Zap size={14} /> Instant Redirection
        </div>
        <div className="feature-chip">
          <ShieldCheck size={14} /> PostgreSQL Backed
        </div>
        <div className="feature-chip">
          <Sparkles size={14} /> Auto QR Generation
        </div>
      </div>

      <style>{`
        .hero-container {
          text-align: center;
          padding: 3rem 1rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(139, 92, 246, 0.12);
          border: 1px solid rgba(139, 92, 246, 0.25);
          color: var(--accent-purple);
          padding: 0.35rem 0.9rem;
          border-radius: 99px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .badge-icon {
          color: var(--accent-pink);
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }
        }
        .hero-subtitle {
          font-size: 1.05rem;
          color: var(--text-muted);
          max-width: 580px;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .hero-features {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }
        .feature-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          padding: 0.3rem 0.75rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
