import React, { useState } from 'react';
import { login, register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon:'🔍', title:'Smart Search',       desc:'Filter by location, dates, price, rating & amenities' },
  { icon:'🏷️', title:'Exclusive Deals',    desc:'Promo codes and seasonal offers every week' },
  { icon:'⭐', title:'Loyalty Rewards',    desc:'Earn 10 points per booking, unlock member discounts' },
  { icon:'📋', title:'Easy Management',    desc:'View, cancel or rebook anytime with one click' },
  { icon:'🔒', title:'Secure Booking',     desc:'JWT-secured APIs and encrypted passwords' },
  { icon:'📧', title:'Email Confirmation', desc:'Instant booking confirmation sent to your inbox' },
];

const TESTIMONIALS = [
  { name:'Priya S.',  city:'Chennai',   text:'Found an amazing sea-view room at half the price. Loved the promo codes!', rating:5 },
  { name:'Rahul M.',  city:'Mumbai',    text:'Super easy to book and cancel. The loyalty points are a great bonus.',      rating:5 },
  { name:'Ananya K.', city:'Bangalore', text:'Clean UI, fast search, and instant email confirmation. Highly recommend!',  rating:4 },
];

export default function AuthPage() {
  const { login: setUser } = useAuth();
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState({ name:'', email:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const openModal  = (type) => { setModal(type); setError(''); setForm({ name:'', email:'', password:'' }); };
  const closeModal = () => { setModal(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = modal === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register(form);
      if (res.data.success) setUser(res.data.data);
      else setError(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif", background:'#f8fafc', minHeight:'100vh' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position:'sticky', top:0, zIndex:100,
        background:'rgba(10,15,30,0.96)', backdropFilter:'blur(16px)',
        padding:'0 40px', height:'68px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        boxShadow:'0 4px 24px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px',
            background:'linear-gradient(135deg,#2563eb,#7c3aed)',
            borderRadius:'10px', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'20px' }}>🏨</div>
          <span style={{ color:'#fff', fontWeight:'800', fontSize:'20px', letterSpacing:'-0.5px' }}>
            Stay<span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Ease</span>
          </span>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button onClick={() => openModal('login')} style={{
            background:'transparent', color:'#e2e8f0',
            border:'1px solid rgba(255,255,255,0.2)', borderRadius:'10px',
            padding:'9px 22px', cursor:'pointer', fontSize:'14px', fontWeight:'600'
          }}>Sign In</button>
          <button onClick={() => openModal('register')} style={{
            background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff',
            border:'none', borderRadius:'10px', padding:'9px 22px',
            cursor:'pointer', fontSize:'14px', fontWeight:'700',
            boxShadow:'0 4px 16px rgba(37,99,235,0.4)'
          }}>Get Started Free</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        background:'linear-gradient(135deg,#020617 0%,#0f172a 35%,#1e3a8a 70%,#1d4ed8 100%)',
        padding:'110px 24px 130px', textAlign:'center', position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', top:'-120px', right:'-120px', width:'600px', height:'600px',
          background:'radial-gradient(circle,rgba(96,165,250,0.08),transparent 70%)', borderRadius:'50%' }} />
        <div style={{ position:'absolute', bottom:'-100px', left:'-100px', width:'500px', height:'500px',
          background:'radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)', borderRadius:'50%' }} />

        <div style={{ position:'relative', maxWidth:'720px', margin:'0 auto' }}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'8px',
            background:'rgba(96,165,250,0.12)', border:'1px solid rgba(96,165,250,0.25)',
            borderRadius:'20px', padding:'7px 18px', color:'#93c5fd',
            fontSize:'13px', marginBottom:'28px', fontWeight:'600'
          }}>
            <span style={{ width:'6px', height:'6px', background:'#22c55e',
              borderRadius:'50%', display:'inline-block', animation:'pulse 2s infinite' }} />
            &nbsp;Trusted by 10,000+ happy travelers across India
          </div>

          <h1 style={{ color:'#fff', fontSize:'58px', fontWeight:'900', margin:'0 0 22px',
            lineHeight:1.05, letterSpacing:'-2px' }}>
            Find & Book Your<br />
            <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa,#f472b6)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Perfect Hotel Stay
            </span>
          </h1>

          <p style={{ color:'#94a3b8', fontSize:'18px', lineHeight:1.8,
            maxWidth:'520px', margin:'0 auto 48px' }}>
            Search hundreds of hotels across India. Filter by price, rating,
            amenities and dates. Best deals guaranteed.
          </p>

          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => openModal('register')} style={{
              background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff',
              border:'none', borderRadius:'14px', padding:'17px 40px',
              fontSize:'16px', fontWeight:'800', cursor:'pointer',
              boxShadow:'0 8px 32px rgba(37,99,235,0.5)'
            }}>Get Started Free 🚀</button>
            <button onClick={() => openModal('login')} style={{
              background:'rgba(255,255,255,0.08)', color:'#e2e8f0',
              border:'1px solid rgba(255,255,255,0.2)', borderRadius:'14px',
              padding:'17px 40px', fontSize:'16px', fontWeight:'600', cursor:'pointer',
              backdropFilter:'blur(8px)'
            }}>Sign In →</button>
          </div>

          <div style={{ display:'flex', gap:'28px', justifyContent:'center', marginTop:'48px', flexWrap:'wrap' }}>
            {['🔒 Secure Payments','📧 Instant Confirmation','🏷️ Best Price Guarantee'].map(b => (
              <span key={b} style={{ color:'#475569', fontSize:'13px', fontWeight:'600' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ background:'#fff', padding:'52px 24px', borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto',
          display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px', textAlign:'center' }}>
          {[
            { num:'500+', label:'Hotels Listed',  icon:'🏨', color:'#2563eb' },
            { num:'10K+', label:'Happy Guests',   icon:'😊', color:'#7c3aed' },
            { num:'50+',  label:'Cities Covered', icon:'📍', color:'#0891b2' },
            { num:'4.8★', label:'Avg Rating',     icon:'⭐', color:'#d97706' },
          ].map(s => (
            <div key={s.label} style={{ padding:'24px 16px', borderRadius:'16px',
              background:'#f8fafc', border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:'32px', marginBottom:'8px' }}>{s.icon}</div>
              <div style={{ fontSize:'32px', fontWeight:'900', color:s.color, letterSpacing:'-1px' }}>{s.num}</div>
              <div style={{ color:'#64748b', fontSize:'13px', marginTop:'4px', fontWeight:'600' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ padding:'88px 24px', background:'#f8fafc' }}>
        <div style={{ maxWidth:'1040px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'60px' }}>
            <h2 style={{ color:'#0f172a', fontSize:'40px', fontWeight:'900', margin:'0 0 14px', letterSpacing:'-1px' }}>
              Why Choose StayEase?
            </h2>
            <p style={{ color:'#64748b', fontSize:'17px', margin:0 }}>
              Everything you need for a seamless hotel booking experience
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background:'#fff', borderRadius:'20px', padding:'28px',
                boxShadow:'0 4px 20px rgba(0,0,0,0.05)', border:'1px solid #e2e8f0',
                display:'flex', gap:'18px', alignItems:'flex-start'
              }}>
                <div style={{ width:'48px', height:'48px', flexShrink:0,
                  background:'linear-gradient(135deg,#eff6ff,#dbeafe)',
                  borderRadius:'14px', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:'24px' }}>{f.icon}</div>
                <div>
                  <h3 style={{ color:'#1e293b', margin:'0 0 6px', fontSize:'16px', fontWeight:'800' }}>{f.title}</h3>
                  <p style={{ color:'#64748b', fontSize:'13px', margin:0, lineHeight:1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div style={{ padding:'88px 24px', background:'#fff' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ color:'#0f172a', fontSize:'40px', fontWeight:'900', margin:'0 0 14px', letterSpacing:'-1px' }}>
            How It Works
          </h2>
          <p style={{ color:'#64748b', fontSize:'17px', marginBottom:'60px' }}>
            Book your perfect stay in 4 simple steps
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px' }}>
            {[
              { step:'1', icon:'📝', title:'Register',    desc:'Create your free account in seconds',          color:'#2563eb' },
              { step:'2', icon:'🔍', title:'Search',      desc:'Find hotels by location, dates & filters',     color:'#7c3aed' },
              { step:'3', icon:'🛏️', title:'Pick a Room', desc:'Choose from available rooms & apply promo',    color:'#0891b2' },
              { step:'4', icon:'✅', title:'Confirm',     desc:'Get instant email confirmation',               color:'#16a34a' },
            ].map(s => (
              <div key={s.step} style={{ textAlign:'center' }}>
                <div style={{
                  width:'56px', height:'56px', background:s.color,
                  borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  margin:'0 auto 16px', color:'#fff', fontWeight:'900', fontSize:'20px',
                  boxShadow:`0 8px 24px ${s.color}66`
                }}>{s.step}</div>
                <div style={{ fontSize:'28px', marginBottom:'10px' }}>{s.icon}</div>
                <h3 style={{ color:'#1e293b', margin:'0 0 6px', fontSize:'15px', fontWeight:'800' }}>{s.title}</h3>
                <p style={{ color:'#64748b', fontSize:'13px', margin:0, lineHeight:1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div style={{ padding:'88px 24px', background:'linear-gradient(135deg,#f8fafc,#eff6ff)' }}>
        <div style={{ maxWidth:'960px', margin:'0 auto' }}>
          <h2 style={{ textAlign:'center', color:'#0f172a', fontSize:'40px', fontWeight:'900',
            margin:'0 0 14px', letterSpacing:'-1px' }}>What Our Guests Say</h2>
          <p style={{ textAlign:'center', color:'#64748b', fontSize:'17px', marginBottom:'52px' }}>
            Real reviews from real travelers
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} style={{
                background:'#fff', borderRadius:'20px', padding:'28px',
                boxShadow:'0 8px 32px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0',
                position:'relative', overflow:'hidden'
              }}>
                <div style={{ position:'absolute', top:'12px', right:'20px',
                  fontSize:'64px', color:'#f1f5f9', fontFamily:'Georgia', lineHeight:1,
                  userSelect:'none' }}>"</div>
                <div style={{ color:'#f59e0b', fontSize:'16px', marginBottom:'14px', letterSpacing:'2px' }}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p style={{ color:'#475569', fontSize:'14px', lineHeight:1.8,
                  margin:'0 0 20px', fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{
                    width:'40px', height:'40px',
                    background:['linear-gradient(135deg,#2563eb,#3b82f6)',
                      'linear-gradient(135deg,#7c3aed,#8b5cf6)',
                      'linear-gradient(135deg,#0891b2,#06b6d4)'][i],
                    borderRadius:'50%', display:'flex', alignItems:'center',
                    justifyContent:'center', color:'#fff', fontWeight:'800', fontSize:'16px'
                  }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:'800', color:'#1e293b', fontSize:'14px' }}>{t.name}</div>
                    <div style={{ color:'#94a3b8', fontSize:'12px' }}>📍 {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{
        background:'linear-gradient(135deg,#0f172a,#1e3a8a,#7c3aed)',
        padding:'80px 24px', textAlign:'center', position:'relative', overflow:'hidden'
      }}>
        <div style={{ position:'absolute', inset:0,
          background:'radial-gradient(ellipse at center,rgba(96,165,250,0.1),transparent 70%)' }} />
        <div style={{ position:'relative' }}>
          <h2 style={{ color:'#fff', fontSize:'42px', fontWeight:'900', margin:'0 0 14px', letterSpacing:'-1px' }}>
            Ready to Find Your Perfect Stay?
          </h2>
          <p style={{ color:'#bfdbfe', fontSize:'17px', marginBottom:'40px' }}>
            Join 10,000+ travelers who book smarter with StayEase
          </p>
          <button onClick={() => openModal('register')} style={{
            background:'#fff', color:'#1e3a8a', border:'none',
            borderRadius:'14px', padding:'18px 48px', fontSize:'17px',
            fontWeight:'900', cursor:'pointer', boxShadow:'0 12px 40px rgba(0,0,0,0.3)'
          }}>Create Free Account 🚀</button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background:'#020617', padding:'44px 24px' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          flexWrap:'wrap', gap:'16px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
              <div style={{ width:'28px', height:'28px',
                background:'linear-gradient(135deg,#2563eb,#7c3aed)',
                borderRadius:'8px', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:'16px' }}>🏨</div>
              <span style={{ color:'#fff', fontWeight:'800', fontSize:'18px' }}>
                Stay<span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Ease</span>
              </span>
            </div>
            <p style={{ color:'#475569', fontSize:'13px', margin:0 }}>© 2026 StayEase. All rights reserved.</p>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={() => openModal('login')} style={{
              background:'transparent', color:'#94a3b8',
              border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px',
              padding:'8px 20px', cursor:'pointer', fontSize:'14px', fontWeight:'600'
            }}>Sign In</button>
            <button onClick={() => openModal('register')} style={{
              background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff',
              border:'none', borderRadius:'8px', padding:'8px 20px',
              cursor:'pointer', fontSize:'14px', fontWeight:'700'
            }}>Register</button>
          </div>
        </div>
      </footer>

      {/* ── AUTH MODAL ── */}
      {modal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.75)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:1000, backdropFilter:'blur(10px)'
        }} onClick={closeModal}>
          <div style={{
            background:'#fff', borderRadius:'24px', padding:'44px',
            width:'440px', maxWidth:'95vw',
            boxShadow:'0 40px 100px rgba(0,0,0,0.5)',
            position:'relative'
          }} onClick={e => e.stopPropagation()}>

            <button onClick={closeModal} style={{
              position:'absolute', top:'18px', right:'18px',
              background:'#f1f5f9', border:'none', borderRadius:'50%',
              width:'34px', height:'34px', cursor:'pointer',
              fontSize:'16px', color:'#64748b', display:'flex',
              alignItems:'center', justifyContent:'center', fontWeight:'700'
            }}>✕</button>

            <div style={{ textAlign:'center', marginBottom:'32px' }}>
              <div style={{ width:'64px', height:'64px', margin:'0 auto 16px',
                background:'linear-gradient(135deg,#2563eb,#7c3aed)',
                borderRadius:'20px', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:'32px',
                boxShadow:'0 8px 24px rgba(37,99,235,0.4)' }}>🏨</div>
              <h2 style={{ margin:'0 0 6px', color:'#0f172a', fontSize:'26px',
                fontWeight:'900', letterSpacing:'-0.5px' }}>
                {modal === 'login' ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p style={{ color:'#64748b', margin:0, fontSize:'14px' }}>
                {modal === 'login' ? 'Sign in to your StayEase account' : 'Join 10,000+ travelers on StayEase'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {modal === 'register' && (
                <div style={{ marginBottom:'16px' }}>
                  <label style={fLabel}>Full Name</label>
                  <input placeholder="John Doe" value={form.name}
                    onChange={e => setForm({...form, name:e.target.value})}
                    required style={fInput} />
                </div>
              )}
              <div style={{ marginBottom:'16px' }}>
                <label style={fLabel}>Email Address</label>
                <input type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  required style={fInput} />
              </div>
              <div style={{ marginBottom:'24px', position:'relative' }}>
                <label style={fLabel}>Password</label>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password:e.target.value})}
                  required style={{ ...fInput, paddingRight:'44px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position:'absolute', right:'12px', top:'36px',
                  background:'none', border:'none', cursor:'pointer',
                  color:'#94a3b8', fontSize:'16px', padding:'4px'
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>

              {error && (
                <div style={{ background:'#fef2f2', border:'1px solid #fecaca',
                  borderRadius:'10px', padding:'12px 16px', color:'#dc2626',
                  fontSize:'13px', marginBottom:'18px' }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'15px',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg,#2563eb,#7c3aed)',
                color:'#fff', border:'none', borderRadius:'12px',
                fontSize:'16px', fontWeight:'800',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(37,99,235,0.4)',
                transition:'all 0.3s'
              }}>
                {loading ? '⏳ Please wait...' : modal === 'login' ? '🔑 Sign In' : '🚀 Create Account'}
              </button>
            </form>

            <p style={{ textAlign:'center', marginTop:'22px', color:'#64748b', fontSize:'14px' }}>
              {modal === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <span onClick={() => openModal(modal === 'login' ? 'register' : 'login')}
                style={{ color:'#2563eb', cursor:'pointer', fontWeight:'800' }}>
                {modal === 'login' ? 'Register Free' : 'Sign In'}
              </span>
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}

const fLabel = { display:'block', marginBottom:'7px', fontWeight:'700', color:'#374151', fontSize:'13px' };
const fInput = {
  width:'100%', padding:'13px 16px', border:'1.5px solid #e2e8f0',
  borderRadius:'12px', fontSize:'15px', boxSizing:'border-box',
  outline:'none', background:'#fafafa', transition:'border-color 0.2s,box-shadow 0.2s'
};
