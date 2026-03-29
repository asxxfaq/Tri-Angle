import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div style={{ minHeight:'100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />

    <div style={{ flex: 1, paddingTop: 120, paddingBottom: 80, background: 'var(--bg-primary)' }}>
      <div className="container">
        <div className="grid-2" style={{ gap:64, alignItems:'center' }}>
          <div>
            <span className="section-label">What We Do</span>
            <div className="gold-divider" style={{ margin:'0 0 20px' }} />
            <h2 className="section-title" style={{ marginBottom:20 }}>
              Kasaragod's Premier<br /><span className="gradient-text">Catering Service</span>
            </h2>
            
            {/* The user specifically wanted this highlighted */}
            <div style={{ background: 'rgba(212,160,41,0.1)', borderLeft: '4px solid var(--gold)', padding: '16px 24px', marginBottom: 24, borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
              <p style={{ color: 'var(--gold)', fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
                We provide the best service team in the Kasaragod district.
              </p>
            </div>

            <p style={{ color:'var(--text-secondary)', lineHeight:1.95, marginBottom:16 }}>
              With over 15 years of experience, TRI-ANGLE has become the most trusted name in catering services
              across Kasaragod and northern Kerala. Our team of 400+ part-time student staff brings energy,
              discipline, and professionalism to every event.
            </p>
            <p style={{ color:'var(--text-secondary)', lineHeight:1.95, marginBottom:36 }}>
              We specialize in providing both male and female catering staff for weddings, house warmings,
              engagements, sadyas, corporate events, and more. Every member is trained for impeccable service.
            </p>
            <div style={{ display:'flex', gap:32 }}>
              {[['🏆','Award Winning'],['🎓','Trained Staff'],['⚡','Quick Booking']].map(([icon, label]) => (
                <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, textAlign:'center' }}>
                  <span style={{ fontSize:'1.7rem' }}>{icon}</span>
                  <span style={{ fontSize:'0.72rem', color:'var(--text-secondary)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 40 }}>
              <Link to="/book" className="btn btn-primary">Book Our Team Today</Link>
            </div>
          </div>

          <div style={{
            background:'linear-gradient(135deg, rgba(201,168,76,0.09), rgba(123,28,46,0.06))',
            border:'1px solid var(--border-gold)', borderRadius:'var(--radius-lg)',
            padding:44, textAlign:'center',
          }}>
            <div style={{ fontSize:'4rem', marginBottom:16 }}>🍽️</div>
            <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.6rem', marginBottom:10 }}>Professional Catering</h3>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem' }}>
              Male &amp; Female staff for all events across Kasaragod, Kerala
            </p>
            <div className="grid-2" style={{ gap:14, marginTop:28 }}>
              {[['Male Staff','300+'],['Female Staff','100+'],['Events Done','5000+'],['Cities Served','15+']].map(([l,v]) => (
                <div key={l} style={{ background:'var(--bg-secondary)', borderRadius:'var(--radius-sm)', padding:18 }}>
                  <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', color:'var(--gold-light)' }}>{v}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-secondary)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer style={{ background:'var(--bg-primary)', borderTop:'1px solid rgba(201,168,76,0.15)', padding:'36px 0 20px', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <img src="/logo.png" alt="TRI-ANGLE logo" style={{ width: 34, height: 34, objectFit: 'contain' }} />
            <span className="gradient-text" style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:600, fontSize:'1.4rem', letterSpacing:'0.1em' }}>TRI-ANGLE</span>
          </div>
          <p style={{ color:'var(--text-muted)', fontSize:'0.78rem', letterSpacing:'0.06em' }}>
            © {new Date().getFullYear()} TRI-ANGLE Catering, Kasaragod, Kerala. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
);

export default AboutPage;
