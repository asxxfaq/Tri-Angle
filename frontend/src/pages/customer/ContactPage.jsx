import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const ContactPage = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />

    <div style={{ flex: 1, paddingTop: 120, paddingBottom: 80, background: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="grid-2" style={{ gap: 64, alignItems: 'start' }}>
          <div>
            <span className="section-label">Contact Us</span>
            <div className="gold-divider" style={{ margin: '0 0 24px' }} />
            <h2 className="section-title" style={{ marginBottom: 28 }}>Get in <span className="gradient-text">Touch</span></h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              {[
                { icon: '📍', label: 'Location', value: 'Kasaragod, Kerala, India' },
                { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                { icon: '✉️', label: 'Email', value: 'info@trianglecatering.com' },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.3rem', marginTop: 2 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 3 }}>{c.label}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.5rem', marginBottom: 22, color: 'var(--gold-light)' }}>Send a Message</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input className="form-input" placeholder="Full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={4} placeholder="Tell us about your event..." style={{ resize: 'vertical' }} />
              </div>
              <button type="button" className="btn btn-primary" onClick={() => alert('Thanks for your message! Our team will contact you soon.')}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '36px 0 20px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.png" alt="TRI-ANGLE logo" style={{ width: 34, height: 34, objectFit: 'contain' }} />
            <span className="gradient-text" style={{ fontFamily: 'Cormorant Garamond,serif', fontWeight: 600, fontSize: '1.4rem', letterSpacing: '0.1em' }}>TRI-ANGLE</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', letterSpacing: '0.06em' }}>
            © {new Date().getFullYear()} TRI-ANGLE Catering, Kasaragod, Kerala. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
);

export default ContactPage;
