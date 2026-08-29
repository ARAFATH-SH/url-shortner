import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, X, QrCode } from 'lucide-react';

export function QRCodeModal({ url, shortCode, onClose }) {
  const svgRef = useRef(null);

  const downloadQR = () => {
    const svgElement = svgRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20, 360, 360);

      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${shortCode || 'link'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card animate-pop-in qr-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><QrCode size={20} /> QR Code Generator</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="qr-container">
          <div className="qr-box" ref={svgRef}>
            <QRCodeSVG 
              value={url} 
              size={220} 
              level="H" 
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#090d16"
            />
          </div>
          <div className="qr-link-preview">{url}</div>
        </div>

        <div className="modal-footer qr-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn-primary" onClick={downloadQR}>
            <Download size={16} /> Download PNG
          </button>
        </div>
      </div>

      <style>{`
        .qr-modal-card {
          text-align: center;
          max-width: 400px;
        }
        .qr-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 1rem 0;
        }
        .qr-box {
          background: #ffffff;
          padding: 1rem;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        }
        .qr-link-preview {
          margin-top: 1rem;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: var(--accent-cyan);
          word-break: break-all;
          max-width: 320px;
        }
        .qr-footer {
          justify-content: center;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}
