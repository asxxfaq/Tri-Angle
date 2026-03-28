import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const events = [
  { icon:'💍', name:'Marriage',      desc:'Complete wedding reception & ceremony service', color:'rgba(201,168,76,0.12)' },
  { icon:'🏠', name:'House Warming', desc:'Grihapravesha & housewarming celebrations',      color:'rgba(123,28,46,0.12)'  },
  { icon:'💑', name:'Engagement',    desc:'Ring ceremony & engagement parties',             color:'rgba(201,168,76,0.08)'  },
  { icon:'🌿', name:'Sadya',          desc:'Traditional Kerala sadya service',               color:'rgba(76,175,135,0.08)' },
  { icon:'🎂', name:'Birthday',       desc:'Birthday parties & celebrations',               color:'rgba(106,159,202,0.08)'},
  { icon:'🏢', name:'Corporate',      desc:'Office events & corporate gatherings',           color:'rgba(167,139,250,0.08)'},
  { icon:'🎊', name:'Festivals',      desc:'Festival & cultural event catering',             color:'rgba(201,168,76,0.1)'  },
  { icon:'🥂', name:'Anniversary',    desc:'Anniversary & milestone celebrations',           color:'rgba(123,28,46,0.1)'   },
];

const testimonials = [
  { name:'Ravi Menon',    loc:'Kasaragod',  text:'TRI-ANGLE made our wedding absolutely perfect. 20 boys, fully disciplined and professional. Highly recommend!',              rating:5, initial:'R' },
  { name:'Fathima Beevi', loc:'Kanhangad',  text:"Used them for our sadya — 15 boys serving 300+ guests flawlessly. Will book again for our daughter's engagement.",          rating:5, initial:'F' },
  { name:'Suresh Kumar',  loc:'Manjeshwar', text:'Corporate event with 8 staff. Everything was smooth and on time. Excellent communication from the team.',                    rating:4, initial:'S' },
  { name:'Anjali Nair',   loc:'Kasaragod',  text:'Impeccable service for our housewarming! The staff was courteous, well-dressed, and managed everything beautifully.',        rating:5, initial:'A' },
  { name:'Mohammed Rafi', loc:'Kanhangad',  text:'Booked for a birthday party — the staff arrived early, set up quickly, and kept the event running smoothly throughout!',    rating:5, initial:'M' },
];

const whyUs = [
  { icon:'🏆', title:'Award Winning',    desc:'Recognized as the most trusted catering brand in northern Kerala for 3 consecutive years.' },
  { icon:'🎓', title:'Trained Staff',    desc:'Every member undergoes rigorous training in service etiquette, hygiene, and event management.' },
  { icon:'⚡', title:'Quick Booking',    desc:'Book online in under 3 minutes. We confirm your request within 24 hours.' },
  { icon:'🛡️', title:'100% Reliable',    desc:'Zero cancellations policy. We always deliver on our commitments, no matter what.' },
];

/* ── Intersection Observer hook ── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ── Staggered children reveal ── */
function RevealSection({ children, className = '', style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`reveal-section ${visible ? 'revealed' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ── Testimonials Carousel ── */
function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState('');
  const [ref, visible] = useReveal();

  const go = (dir) => {
    setAnimating(dir > 0 ? 'slide-left' : 'slide-right');
    setTimeout(() => {
      setCurrent(c => (c + dir + testimonials.length) % testimonials.length);
      setAnimating('');
    }, 280);
  };

  const t = testimonials[current];
  const prev = testimonials[(current - 1 + testimonials.length) % testimonials.length];
  const next = testimonials[(current + 1) % testimonials.length];

  return (
    <div ref={ref} className={`carousel-wrapper ${visible ? 'revealed' : ''}`}>
      {/* Side cards */}
      <div className="carousel-side-card carousel-side-left" onClick={() => go(-1)}>
        <div className="csc-initial">{prev.initial}</div>
        <div className="csc-name">{prev.name}</div>
      </div>

      {/* Main card */}
      <div className={`carousel-main-card ${animating}`}>
        <div className="carousel-quote">"</div>
        <div className="carousel-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < t.rating ? 'star star-filled' : 'star star-empty'}>★</span>
          ))}
        </div>
        <p className="carousel-text">{t.text}</p>
        <div className="carousel-divider" />
        <div className="carousel-author">
          <div className="carousel-avatar">{t.initial}</div>
          <div>
            <div className="carousel-name">{t.name}</div>
            <div className="carousel-loc">📍 {t.loc}</div>
          </div>
        </div>
      </div>

      {/* Side cards */}
      <div className="carousel-side-card carousel-side-right" onClick={() => go(1)}>
        <div className="csc-initial">{next.initial}</div>
        <div className="csc-name">{next.name}</div>
      </div>

      {/* Dots */}
      <div className="carousel-dots">
        {testimonials.map((_, i) => (
          <button key={i} className={`carousel-dot ${i === current ? 'active' : ''}`} onClick={() => {
            const dir = i > current ? 1 : -1;
            setAnimating(dir > 0 ? 'slide-left' : 'slide-right');
            setTimeout(() => { setCurrent(i); setAnimating(''); }, 280);
          }} />
        ))}
      </div>

      {/* Arrow buttons */}
      <button className="carousel-arrow carousel-arrow-left" onClick={() => go(-1)}>‹</button>
      <button className="carousel-arrow carousel-arrow-right" onClick={() => go(1)}>›</button>
    </div>
  );
}

const LandingPage = () => (
  <div style={{ minHeight:'100vh' }}>
    <Navbar />

    {/* ── HERO ──────────────────────────────────────────── */}
    <section className="hero">
      {/* Floating orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="container">
        <div style={{ maxWidth:720 }}>
          <div className="hero-badge animate-fade-down">
            <span>✦</span>
            <span>12+ Years of Excellence in Catering Services</span>
          </div>
          <h1 className="hero-title animate-fade-up">
            Kerala's Most Trusted<br />
            <span className="gradient-text">Catering Team</span>
          </h1>
          <p className="hero-desc animate-fade-up" style={{ animationDelay:'0.15s' }}>
            TRI-ANGLE provides professional catering boys &amp; girls for all your events.
            Based in Kasaragod, Kerala — serving marriages, house warmings, engagements,
            sadyas and more with 400+ trained student staff.
          </p>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }} className="animate-fade-up" style2={{ animationDelay:'0.3s' }}>
            <Link to="/book" className="btn btn-primary btn-lg pulse-glow">Book Now</Link>
          </div>
          <div className="hero-stats animate-fade-up" style={{ animationDelay:'0.45s' }}>
            {[['400+','Team Members'],['12+','Years Experience'],['5000+','Events Served'],['100%','Satisfaction']].map(([v,l], i) => (
              <div key={l} className="hero-stat-item" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <div className="hero-stat-value">{v}</div>
                <div className="hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── MARQUEE ───────────────────────────────────────── */}
    <div style={{
      background:'linear-gradient(90deg, var(--burgundy-deep), var(--burgundy), var(--burgundy-light), var(--burgundy))',
      padding:'13px 0', overflow:'hidden',
    }}>
      <div style={{ display:'flex', gap:64, animation:'marquee 22s linear infinite', whiteSpace:'nowrap', color:'var(--champagne)', fontWeight:600, fontSize:'0.78rem', letterSpacing:'0.14em' }}>
        {[...Array(4)].map((_, i) => (
          <span key={i}>✦ MARRIAGE &nbsp; • &nbsp; HOUSE WARMING &nbsp; • &nbsp; ENGAGEMENT &nbsp; • &nbsp; SADYA &nbsp; • &nbsp; BIRTHDAY &nbsp; • &nbsp; CORPORATE &nbsp; • &nbsp;</span>
        ))}
      </div>
    </div>

    {/* ── ABOUT ─────────────────────────────────────────── */}
    <section className="section" id="about">
      <div className="container">
        <div className="grid-2" style={{ gap:64, alignItems:'center' }}>
          <RevealSection>
            <span className="section-label">About TRI-ANGLE</span>
            <div className="gold-divider" style={{ margin:'0 0 20px' }} />
            <h2 className="section-title" style={{ marginBottom:20 }}>
              Kasaragod's Premier<br /><span className="gradient-text">Catering Service</span>
            </h2>
            <p style={{ color:'var(--text-secondary)', lineHeight:1.95, marginBottom:16 }}>
              With over 12 years of experience, TRI-ANGLE has become the most trusted name in catering services
              across Kasaragod and northern Kerala. Our team of 400+ part-time student staff brings energy,
              discipline, and professionalism to every event.
            </p>
            <p style={{ color:'var(--text-secondary)', lineHeight:1.95, marginBottom:36 }}>
              We specialize in providing both male and female catering staff for weddings, house warmings,
              engagements, sadyas, corporate events, and more. Every member is trained for impeccable service.
            </p>
            <div style={{ display:'flex', gap:32 }}>
              {[['🏆','Award Winning'],['🎓','Trained Staff'],['⚡','Quick Booking']].map(([icon, label]) => (
                <div key={label} className="about-badge">
                  <span style={{ fontSize:'1.7rem' }}>{icon}</span>
                  <span style={{ fontSize:'0.72rem', color:'var(--text-secondary)', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>{label}</span>
                </div>
              ))}
            </div>
          </RevealSection>

          <RevealSection style={{ animationDelay:'0.2s' }}>
            <div className="about-card-fancy">
              <div className="about-card-glow" />
              <div style={{ fontSize:'4rem', marginBottom:16, position:'relative', zIndex:1 }}>🍽️</div>
              <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.6rem', marginBottom:10, position:'relative', zIndex:1 }}>Professional Catering</h3>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.88rem', position:'relative', zIndex:1 }}>
                Male &amp; Female staff for all events across Kasaragod, Kerala
              </p>
              <div className="grid-2" style={{ gap:14, marginTop:28, position:'relative', zIndex:1 }}>
                {[['Male Staff','300+'],['Female Staff','100+'],['Events Done','5000+'],['Cities Served','15+']].map(([l,v]) => (
                  <div key={l} className="about-stat-box">
                    <div style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', color:'var(--gold-light)' }}>{v}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-secondary)', letterSpacing:'0.08em', textTransform:'uppercase' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>

    {/* ── SERVICES / EVENT CARDS ─────────────────────────── */}
    <section className="section" style={{ background:'var(--bg-secondary)' }} id="services">
      <div className="container">
        <RevealSection style={{ textAlign:'center', marginBottom:60 }}>
          <span className="section-label">Our Services</span>
          <div className="gold-divider" />
          <h2 className="section-title">Events We <span className="gradient-text">Cater For</span></h2>
          <p style={{ color:'var(--text-secondary)', marginTop:12, fontSize:'0.9rem' }}>Professional staff for every occasion</p>
        </RevealSection>
        <div className="grid-4">
          {events.map((e, i) => (
            <RevealSection key={e.name} style={{ '--stagger': i, animationDelay: `${i * 0.07}s` }}>
              <div className="event-card">
                <div className="event-card-icon-wrap" style={{ background: e.color }}>
                  <span className="event-card-icon">{e.icon}</span>
                  <div className="event-card-icon-ring" />
                </div>
                <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.2rem', marginBottom:8 }}>{e.name}</h3>
                <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', lineHeight:1.7 }}>{e.desc}</p>
                <div className="event-card-shimmer" />
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>

    {/* ── WHY CHOOSE US ──────────────────────────────────── */}
    <section className="section">
      <div className="container">
        <RevealSection style={{ textAlign:'center', marginBottom:60 }}>
          <span className="section-label">Why Choose Us</span>
          <div className="gold-divider" />
          <h2 className="section-title">Our <span className="gradient-text">Commitment</span></h2>
        </RevealSection>
        <div className="grid-4">
          {whyUs.map((w, i) => (
            <RevealSection key={w.title} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h3 className="why-title">{w.title}</h3>
                <p className="why-desc">{w.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>

    {/* ── HOW IT WORKS ──────────────────────────────────── */}
    <section className="section" style={{ background:'var(--bg-secondary)' }}>
      <div className="container">
        <RevealSection style={{ textAlign:'center', marginBottom:60 }}>
          <span className="section-label">How It Works</span>
          <div className="gold-divider" />
          <h2 className="section-title">Book in <span className="gradient-text">3 Simple Steps</span></h2>
        </RevealSection>
        <div className="steps-row">
          {[
            { step:'01', icon:'📝', title:'Register & Login',  desc:'Create your account and tell us about your event needs' },
            { step:'02', icon:'📅', title:'Fill Booking Form', desc:'Choose event type, date, venue and number of staff needed' },
            { step:'03', icon:'✅', title:'Get Confirmed',      desc:'We assign the right team and confirm your booking instantly' },
          ].map((s, i) => (
            <RevealSection key={s.step} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="step-card">
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
                {i < 2 && <div className="step-connector">→</div>}
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>

    {/* ── TESTIMONIALS CAROUSEL ─────────────────────────── */}
    <section className="section">
      <div className="container">
        <RevealSection style={{ textAlign:'center', marginBottom:60 }}>
          <span className="section-label">Testimonials</span>
          <div className="gold-divider" />
          <h2 className="section-title">What Our <span className="gradient-text">Clients Say</span></h2>
          <p style={{ color:'var(--text-secondary)', marginTop:12, fontSize:'0.9rem' }}>Real stories from real clients across Kerala</p>
        </RevealSection>
        <TestimonialsCarousel />
      </div>
    </section>

    {/* ── CTA ───────────────────────────────────────────── */}
    <section className="section cta-section">
      <div className="cta-glow-1" /><div className="cta-glow-2" />
      <div className="container" style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <RevealSection>
          <span className="section-label" style={{ display:'block' }}>Kasaragod, Kerala</span>
          <div className="gold-divider" />
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2.8rem', fontWeight:400, fontStyle:'italic', marginBottom:16 }}>
            Ready to Book?
          </h2>
          <p style={{ color:'var(--text-secondary)', maxWidth:480, margin:'0 auto 36px', fontSize:'0.9rem', lineHeight:1.8 }}>
            Get professional catering staff for your next event. Quick booking, reliable service.
          </p>
          <Link to="/book" className="btn btn-primary btn-lg pulse-glow">Book Catering Team Now</Link>
        </RevealSection>
      </div>
    </section>

    {/* ── CONTACT ───────────────────────────────────────── */}
    <section className="section" id="contact" style={{ background:'var(--bg-secondary)' }}>
      <div className="container">
        <div className="grid-2" style={{ gap:64, alignItems:'start' }}>
          <RevealSection>
            <span className="section-label">Contact Us</span>
            <div className="gold-divider" style={{ margin:'0 0 24px' }} />
            <h2 className="section-title" style={{ marginBottom:28 }}>Get in <span className="gradient-text">Touch</span></h2>
            <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
              {[
                { icon:'📍', label:'Location',     value:'Kasaragod, Kerala, India' },
                { icon:'📞', label:'Phone',         value:'+91 98765 43210' },
                { icon:'✉️', label:'Email',          value:'info@trianglecatering.com' },
                { icon:'⏰', label:'Working Hours', value:'Mon – Sun: 8:00 AM – 9:00 PM' },
              ].map(c => (
                <div key={c.label} className="contact-info-row">
                  <div className="contact-icon-wrap">{c.icon}</div>
                  <div>
                    <div style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:3 }}>{c.label}</div>
                    <div style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealSection>
          <RevealSection style={{ animationDelay:'0.2s' }}>
            <div className="card contact-form-card">
              <h3 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.5rem', marginBottom:22, color:'var(--gold-light)' }}>Send a Message</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
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
                  <textarea className="form-input" rows={4} placeholder="Tell us about your event..." style={{ resize:'vertical' }} />
                </div>
                <button className="btn btn-primary">Send Message</button>
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>

    {/* ── FOOTER ────────────────────────────────────────── */}
    <footer style={{ background:'var(--bg-primary)', borderTop:'1px solid rgba(201,168,76,0.15)', padding:'36px 0 20px' }}>
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <img src="/logo.png" alt="TRI-ANGLE logo" style={{ width: 34, height: 34, objectFit: 'contain' }} />
            <span className="gradient-text" style={{ fontFamily:'Cormorant Garamond,serif', fontWeight:600, fontSize:'1.4rem', letterSpacing:'0.1em' }}>TRI-ANGLE</span>
          </div>
          <p style={{ color:'var(--text-muted)', fontSize:'0.78rem', letterSpacing:'0.06em' }}>
            © 2024 TRI-ANGLE Catering, Kasaragod, Kerala. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
);

export default LandingPage;
