import { useState } from 'react';
import Navbar from '../../components/Navbar';

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '') + '/images/';
const photos = Array.from({ length: 10 }, (_, i) => ({
  src: `${BASE}image${i + 1}.jpg`,
  alt: `TRI-ANGLE Team Photo ${i + 1}`,
}));

const PhotoGallery = () => {
  const [lightbox, setLightbox] = useState(null); // index or null

  const prev = () => setLightbox(i => (i - 1 + photos.length) % photos.length);
  const next = () => setLightbox(i => (i + 1) % photos.length);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />

      {/* ── Header ── */}
      <div style={{
        paddingTop: 120, paddingBottom: 56, textAlign: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.1) 0%, transparent 65%), var(--bg-primary)',
      }}>
        <span className="section-label">Our Team</span>
        <div className="gold-divider" />
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 400, fontStyle: 'italic' }}>
          Photo <span className="gradient-text">Gallery</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: '0.9rem', letterSpacing: '0.04em' }}>
          A glimpse of our 400+ professional catering team in action
        </p>
      </div>

      {/* ── Gallery Grid ── */}
      <div style={{ paddingBottom: 88 }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}>
            {photos.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setLightbox(idx)}
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  cursor: 'zoom-in',
                  border: '1px solid var(--border)',
                  aspectRatio: idx % 3 === 0 ? '4/5' : idx % 3 === 1 ? '1/1' : '3/4',
                  background: 'var(--bg-secondary)',
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-gold)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg,#2e1a1e,#160c0e)';
                    const ph = document.createElement('div');
                    ph.innerHTML = '📸';
                    ph.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:3rem;';
                    e.target.parentElement.appendChild(ph);
                  }}
                />
                {/* Hover overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(14,6,8,0.82) 0%, transparent 50%)',
                  opacity: 0, transition: 'opacity 0.28s',
                  display: 'flex', alignItems: 'flex-end', padding: 16,
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <div>
                    <div style={{ color: 'var(--gold-light)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>TRI-ANGLE Team</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: 2 }}>Click to view ↗</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.93)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Prev */}
          <button onClick={e => { e.stopPropagation(); prev(); }} style={{
            position: 'absolute', left: 24, background: 'rgba(201,168,76,0.15)',
            border: '1px solid var(--border-gold)', color: 'var(--gold-light)',
            width: 48, height: 48, borderRadius: '50%', fontSize: '1.3rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>‹</button>

          {/* Image */}
          <img
            src={photos[lightbox].src}
            alt={photos[lightbox].alt}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '85vw', maxHeight: '88vh',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-gold)',
              boxShadow: '0 0 60px rgba(201,168,76,0.2)',
              objectFit: 'contain',
            }}
          />

          {/* Next */}
          <button onClick={e => { e.stopPropagation(); next(); }} style={{
            position: 'absolute', right: 24, background: 'rgba(201,168,76,0.15)',
            border: '1px solid var(--border-gold)', color: 'var(--gold-light)',
            width: 48, height: 48, borderRadius: '50%', fontSize: '1.3rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>›</button>

          {/* Close */}
          <button onClick={() => setLightbox(null)} style={{
            position: 'absolute', top: 20, right: 20,
            background: 'rgba(201,168,76,0.12)', border: '1px solid var(--border-gold)',
            color: 'var(--gold-light)', width: 40, height: 40, borderRadius: '50%',
            fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          {/* Counter */}
          <div style={{
            position: 'absolute', bottom: 20,
            color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '0.1em',
          }}>
            {lightbox + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
