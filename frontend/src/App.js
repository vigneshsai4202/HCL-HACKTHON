import React, { useState } from 'react';
import { searchHotels } from './services/api';
import { useAuth } from './context/AuthContext';
import HotelCard from './components/HotelCard';
import PromotionsBanner from './components/PromotionsBanner';
import AuthPage from './pages/AuthPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import HotelDetailPage from './components/HotelDetailPage';

const AMENITIES    = ['WiFi','Pool','Gym','Parking','Restaurant','AC','Spa','Beach Access'];
const POPULAR_CITIES = ['Chennai','Mumbai','Delhi','Bangalore','Goa','Hyderabad'];

export default function App() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState('home');

  const [location, setLocation]     = useState('');
  const [checkIn, setCheckIn]       = useState('');
  const [checkOut, setCheckOut]     = useState('');
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
  const [minRating, setMinRating]   = useState('');
  const [amenity, setAmenity]       = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [hotels, setHotels]               = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [successMsg, setSuccessMsg]       = useState('');

  if (!user) return <AuthPage />;
  if (page === 'history') return <BookingHistoryPage onBack={() => setPage('home')} />;

  if (page === 'hotelDetail' && selectedHotel) return (
    <div style={{ minHeight:'100vh', fontFamily:"'Segoe UI',sans-serif" }}>
      <Navbar user={user} logout={logout} page={page} setPage={setPage} setHotels={setHotels} setSelectedHotel={setSelectedHotel} />
      <HotelDetailPage hotel={selectedHotel} checkIn={checkIn} checkOut={checkOut}
        onBack={() => setPage('hotels')} onBookingSuccess={msg => setSuccessMsg(msg)} />
    </div>
  );

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleSearch = async (e, quickCity = null) => {
    if (e) e.preventDefault();
    const searchLoc = quickCity || location;
    if (!searchLoc.trim()) return;
    if (quickCity) setLocation(quickCity);
    setPage('hotels');
    setLoading(true); setError(''); setHotels([]); setSelectedHotel(null);
    try {
      const res = await searchHotels(searchLoc, minPrice||null, maxPrice||null, minRating||null, amenity||null, checkIn||null, checkOut||null);
      res.data.success ? setHotels(res.data.data) : setError(res.data.message);
    } catch { setError('Failed to fetch hotels. Check backend connection.'); }
    finally { setLoading(false); }
  };

  const clearFilters = () => { setMinPrice(''); setMaxPrice(''); setMinRating(''); setAmenity(''); setCheckIn(''); setCheckOut(''); };
  const activeFilterCount = [minPrice, maxPrice, minRating, amenity, checkIn, checkOut].filter(Boolean).length;

  return (
    <div style={{ minHeight:'100vh', fontFamily:"'Segoe UI',sans-serif", background:'#f8fafc' }}>

      <Navbar user={user} logout={logout} page={page} setPage={setPage} setHotels={setHotels} setSelectedHotel={setSelectedHotel} />

      {/* ══ HOME PAGE ══ */}
      {page === 'home' && (
        <>
          {/* HERO */}
          <div style={{
            background:'linear-gradient(135deg,#020617 0%,#0f172a 35%,#1e3a8a 70%,#1d4ed8 100%)',
            padding:'90px 24px 110px', textAlign:'center', position:'relative', overflow:'hidden'
          }}>
            <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'500px', height:'500px',
              background:'radial-gradient(circle,rgba(96,165,250,0.08),transparent 70%)', borderRadius:'50%' }} />
            <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'400px', height:'400px',
              background:'radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)', borderRadius:'50%' }} />

            <div style={{ position:'relative', maxWidth:'820px', margin:'0 auto' }}>
              <h1 style={{ color:'#fff', fontSize:'50px', fontWeight:'900', margin:'0 0 16px',
                lineHeight:1.05, letterSpacing:'-1.5px' }}>
                Where would you like to stay,{' '}
                <span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  {user.name}
                </span>?
              </h1>
              <p style={{ color:'#94a3b8', fontSize:'17px', marginBottom:'40px', lineHeight:1.7 }}>
                Search hotels with advanced filters — dates, price, rating & amenities
              </p>

              {/* Search Box */}
              <div style={{ background:'#fff', borderRadius:'20px', padding:'24px',
                boxShadow:'0 32px 80px rgba(0,0,0,0.4)', textAlign:'left' }}>

                {/* Row 1 */}
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto',
                  gap:'12px', marginBottom:'16px', alignItems:'end' }}>
                  <div>
                    <label style={hLabel}>📍 Destination</label>
                    <input type="text" placeholder="City, e.g. Chennai" value={location}
                      onChange={e => setLocation(e.target.value)} style={hInput} />
                  </div>
                  <div>
                    <label style={hLabel}>📅 Check-in</label>
                    <input type="date" min={today} value={checkIn}
                      onChange={e => setCheckIn(e.target.value)} style={hInput} />
                  </div>
                  <div>
                    <label style={hLabel}>📅 Check-out</label>
                    <input type="date" min={tomorrow} value={checkOut}
                      onChange={e => setCheckOut(e.target.value)} style={hInput} />
                  </div>
                  <button type="button" onClick={handleSearch} style={{
                    background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff',
                    border:'none', borderRadius:'12px', padding:'13px 28px',
                    fontSize:'15px', fontWeight:'800', cursor:'pointer', whiteSpace:'nowrap',
                    boxShadow:'0 4px 16px rgba(37,99,235,0.4)'
                  }}>Search 🔍</button>
                </div>

                {/* Row 2 — Filters */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
                  <div>
                    <label style={hLabel}>💰 Min Price (₹)</label>
                    <input type="number" placeholder="1000" value={minPrice}
                      onChange={e => setMinPrice(e.target.value)} style={hInput} min="0" />
                  </div>
                  <div>
                    <label style={hLabel}>💰 Max Price (₹)</label>
                    <input type="number" placeholder="8000" value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)} style={hInput} min="0" />
                  </div>
                  <div>
                    <label style={hLabel}>⭐ Min Rating</label>
                    <select value={minRating} onChange={e => setMinRating(e.target.value)} style={hInput}>
                      <option value="">Any</option>
                      <option value="3">3+</option><option value="3.5">3.5+</option>
                      <option value="4">4+</option><option value="4.5">4.5+</option>
                    </select>
                  </div>
                  <div>
                    <label style={hLabel}>🏨 Amenity</label>
                    <select value={amenity} onChange={e => setAmenity(e.target.value)} style={hInput}>
                      <option value="">Any</option>
                      {AMENITIES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div style={{ marginTop:'14px', display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ fontSize:'12px', color:'#64748b', fontWeight:'600' }}>Active:</span>
                    {checkIn   && <Tag label={checkIn} />}
                    {checkOut  && <Tag label={checkOut} />}
                    {minPrice  && <Tag label={`₹${minPrice}+`} />}
                    {maxPrice  && <Tag label={`₹${maxPrice}-`} />}
                    {minRating && <Tag label={`${minRating}★+`} />}
                    {amenity   && <Tag label={amenity} />}
                    <button onClick={clearFilters} style={{ background:'none', border:'none',
                      color:'#ef4444', cursor:'pointer', fontSize:'12px', fontWeight:'700' }}>✕ Clear</button>
                  </div>
                )}
              </div>

              {/* Popular cities */}
              <div style={{ marginTop:'24px', display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
                <span style={{ color:'#475569', fontSize:'13px', alignSelf:'center', fontWeight:'600' }}>Quick:</span>
                {POPULAR_CITIES.map(city => (
                  <button key={city} onClick={() => handleSearch(null, city)} style={{
                    background:'rgba(255,255,255,0.08)', color:'#cbd5e1',
                    border:'1px solid rgba(255,255,255,0.15)', borderRadius:'20px',
                    padding:'7px 16px', cursor:'pointer', fontSize:'13px', fontWeight:'600',
                    backdropFilter:'blur(4px)'
                  }}>{city}</button>
                ))}
              </div>
            </div>
          </div>

          <PromotionsBanner />

          {/* Stats */}
          <div style={{ background:'#fff', padding:'44px 24px', borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ maxWidth:'900px', margin:'0 auto',
              display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'20px', textAlign:'center' }}>
              {[
                { num:'500+', label:'Hotels',       icon:'🏨', color:'#2563eb' },
                { num:'10K+', label:'Happy Guests', icon:'😊', color:'#7c3aed' },
                { num:'50+',  label:'Cities',       icon:'📍', color:'#0891b2' },
                { num:'4.8★', label:'Rating',       icon:'⭐', color:'#d97706' },
              ].map(s => (
                <div key={s.label} style={{ padding:'20px', borderRadius:'16px',
                  background:'#f8fafc', border:'1px solid #e2e8f0' }}>
                  <div style={{ fontSize:'28px', marginBottom:'6px' }}>{s.icon}</div>
                  <div style={{ fontSize:'28px', fontWeight:'900', color:s.color }}>{s.num}</div>
                  <div style={{ color:'#64748b', fontSize:'13px', marginTop:'4px', fontWeight:'600' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══ HOTELS PAGE ══ */}
      {page === 'hotels' && (
        <div style={{ maxWidth:'1060px', margin:'0 auto', padding:'28px 16px' }}>

          <PromotionsBanner />

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ marginTop:'20px' }}>
            <div style={{ display:'flex', gap:'10px', marginBottom:'12px' }}>
              <input type="text" placeholder="📍 Search location..." value={location}
                onChange={e => setLocation(e.target.value)}
                style={{ flex:1, padding:'13px 18px', fontSize:'15px',
                  border:'2px solid #e2e8f0', borderRadius:'12px', outline:'none',
                  background:'#fff', fontWeight:'500' }} />
              <button type="button" onClick={() => setShowFilters(!showFilters)} style={{
                padding:'13px 18px',
                background: showFilters ? 'linear-gradient(135deg,#1e3a8a,#2563eb)' : '#fff',
                color: showFilters ? '#fff' : '#374151',
                border:'2px solid #e2e8f0', borderRadius:'12px',
                cursor:'pointer', fontWeight:'700', fontSize:'14px', position:'relative'
              }}>
                🔧 Filters
                {activeFilterCount > 0 && (
                  <span style={{ position:'absolute', top:'-7px', right:'-7px',
                    background:'#ef4444', color:'#fff', borderRadius:'50%',
                    width:'20px', height:'20px', fontSize:'11px',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:'800' }}>{activeFilterCount}</span>
                )}
              </button>
              <button type="submit" style={{
                padding:'13px 28px',
                background:'linear-gradient(135deg,#2563eb,#7c3aed)',
                color:'#fff', border:'none', borderRadius:'12px',
                fontSize:'15px', cursor:'pointer', fontWeight:'800',
                boxShadow:'0 4px 16px rgba(37,99,235,0.3)'
              }}>Search</button>
            </div>

            {showFilters && (
              <div style={{ background:'#fff', border:'1px solid #e2e8f0',
                borderRadius:'16px', padding:'20px', marginBottom:'16px',
                boxShadow:'0 4px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:'16px' }}>
                  <div><label style={lStyle}>📅 Check-in</label>
                    <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)} style={fInput} /></div>
                  <div><label style={lStyle}>📅 Check-out</label>
                    <input type="date" min={tomorrow} value={checkOut} onChange={e => setCheckOut(e.target.value)} style={fInput} /></div>
                  <div><label style={lStyle}>💰 Min Price (₹)</label>
                    <input type="number" placeholder="1000" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={fInput} min="0" /></div>
                  <div><label style={lStyle}>💰 Max Price (₹)</label>
                    <input type="number" placeholder="8000" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={fInput} min="0" /></div>
                  <div><label style={lStyle}>⭐ Min Rating</label>
                    <select value={minRating} onChange={e => setMinRating(e.target.value)} style={fInput}>
                      <option value="">Any</option>
                      <option value="3">3+</option><option value="3.5">3.5+</option>
                      <option value="4">4+</option><option value="4.5">4.5+</option>
                    </select></div>
                  <div><label style={lStyle}>🏨 Amenity</label>
                    <select value={amenity} onChange={e => setAmenity(e.target.value)} style={fInput}>
                      <option value="">Any</option>
                      {AMENITIES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select></div>
                </div>
                {activeFilterCount > 0 && (
                  <div style={{ marginTop:'14px', display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ fontSize:'13px', color:'#64748b', fontWeight:'600' }}>Active:</span>
                    {checkIn   && <Tag label={`Check-in: ${checkIn}`} />}
                    {checkOut  && <Tag label={`Check-out: ${checkOut}`} />}
                    {minPrice  && <Tag label={`Min ₹${minPrice}`} />}
                    {maxPrice  && <Tag label={`Max ₹${maxPrice}`} />}
                    {minRating && <Tag label={`Rating ${minRating}+`} />}
                    {amenity   && <Tag label={amenity} />}
                    <button onClick={clearFilters} style={{ background:'none', border:'none',
                      color:'#ef4444', cursor:'pointer', fontSize:'13px', fontWeight:'700' }}>✕ Clear all</button>
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign:'center', padding:'80px' }}>
              <div style={{ width:'48px', height:'48px', border:'4px solid #e2e8f0',
                borderTop:'4px solid #2563eb', borderRadius:'50%',
                animation:'spin 0.8s linear infinite', margin:'0 auto' }} />
              <p style={{ color:'#64748b', marginTop:'16px', fontSize:'15px', fontWeight:'600' }}>
                Searching hotels...
              </p>
            </div>
          )}

          {error && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca',
              borderRadius:'12px', padding:'16px', color:'#dc2626',
              marginBottom:'20px', fontWeight:'600' }}>⚠️ {error}</div>
          )}

          {successMsg && (
            <div style={{ background:'#f0fdf4', border:'1px solid #86efac',
              borderRadius:'12px', padding:'16px', color:'#16a34a',
              marginBottom:'20px', fontWeight:'700', fontSize:'15px' }}>🎉 {successMsg}</div>
          )}

          {/* Hotel grid */}
          {hotels.length > 0 && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between',
                alignItems:'center', marginBottom:'20px' }}>
                <h2 style={{ color:'#0f172a', margin:0, fontSize:'22px', fontWeight:'900', letterSpacing:'-0.5px' }}>
                  {hotels.length} Hotel{hotels.length > 1 ? 's' : ''} in "{location}"
                </h2>
                {checkIn && checkOut && (
                  <span style={{ color:'#0f766e', fontSize:'13px', fontWeight:'700',
                    background:'#f0fdf4', padding:'7px 14px', borderRadius:'10px',
                    border:'1px solid #86efac' }}>
                    📅 {checkIn} → {checkOut}
                  </span>
                )}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'20px' }}>
                {hotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel}
                    onSelect={h => { setSelectedHotel(h); setPage('hotelDetail'); }}
                    isSelected={selectedHotel?.id === hotel.id} />
                ))}
              </div>
            </>
          )}

          {!loading && hotels.length === 0 && !error && location && (
            <div style={{ textAlign:'center', padding:'80px', background:'#fff',
              borderRadius:'20px', border:'2px dashed #e2e8f0' }}>
              <div style={{ fontSize:'56px', marginBottom:'16px' }}>🏨</div>
              <h3 style={{ color:'#475569', margin:'0 0 8px', fontSize:'20px' }}>No hotels found</h3>
              <p style={{ color:'#94a3b8', margin:0 }}>Try a different location or adjust your filters</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function Navbar({ user, logout, page, setPage, setHotels, setSelectedHotel }) {
  return (
    <nav style={{
      background:'rgba(10,15,30,0.96)', backdropFilter:'blur(16px)',
      padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between',
      height:'68px', position:'sticky', top:0, zIndex:100,
      borderBottom:'1px solid rgba(255,255,255,0.06)',
      boxShadow:'0 4px 24px rgba(0,0,0,0.4)'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}
        onClick={() => { setPage('home'); setHotels([]); setSelectedHotel(null); }}>
        <div style={{ width:'36px', height:'36px',
          background:'linear-gradient(135deg,#2563eb,#7c3aed)',
          borderRadius:'10px', display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:'20px' }}>🏨</div>
        <span style={{ color:'#fff', fontWeight:'800', fontSize:'20px', letterSpacing:'-0.5px' }}>
          Stay<span style={{ background:'linear-gradient(90deg,#60a5fa,#a78bfa)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Ease</span>
        </span>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
        {[
          { label:'🏠 Home',       p:'home',    action:() => { setPage('home'); setHotels([]); setSelectedHotel(null); } },
          { label:'🏨 Hotels',     p:'hotels',  action:() => setPage('hotels') },
          { label:'📋 My Bookings',p:'history', action:() => setPage('history') },
        ].map(n => (
          <button key={n.p} onClick={n.action} style={{
            background: page === n.p ? 'rgba(96,165,250,0.15)' : 'transparent',
            color: page === n.p ? '#60a5fa' : '#94a3b8',
            border: page === n.p ? '1px solid rgba(96,165,250,0.3)' : '1px solid transparent',
            borderRadius:'10px', padding:'8px 16px', cursor:'pointer',
            fontSize:'14px', fontWeight:'700', transition:'all 0.2s'
          }}>{n.label}</button>
        ))}
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
        <div style={{ textAlign:'right' }}>
          <div style={{ color:'#fff', fontSize:'14px', fontWeight:'700' }}>👋 {user.name}</div>
          <div style={{ color:'#60a5fa', fontSize:'12px', fontWeight:'600' }}>⭐ {user.loyaltyPoints} pts</div>
        </div>
        <button onClick={logout} style={{
          background:'rgba(239,68,68,0.15)', color:'#fca5a5',
          border:'1px solid rgba(239,68,68,0.25)', borderRadius:'10px',
          padding:'8px 16px', cursor:'pointer', fontSize:'13px', fontWeight:'700'
        }}>Logout</button>
      </div>
    </nav>
  );
}

function Tag({ label }) {
  return (
    <span style={{ background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe',
      borderRadius:'20px', padding:'3px 10px', fontSize:'12px', fontWeight:'700' }}>
      {label}
    </span>
  );
}

const hLabel = { display:'block', marginBottom:'6px', fontWeight:'700', color:'#374151', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.5px' };
const hInput = { width:'100%', padding:'11px 14px', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', outline:'none', background:'#fafafa' };
const lStyle = { display:'block', marginBottom:'4px', fontWeight:'700', color:'#374151', fontSize:'13px' };
const fInput = { width:'100%', padding:'9px 10px', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'14px', boxSizing:'border-box', outline:'none' };
