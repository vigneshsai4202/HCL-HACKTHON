import React, { useEffect, useState, useCallback } from 'react';
import { getRooms, getRoomSummary } from '../services/api';
import BookingModal from './BookingModal';

const AMENITY_ICONS = {
  'WiFi':'📶','Pool':'🏊','Gym':'💪','Parking':'🅿️',
  'Restaurant':'🍽️','AC':'❄️','Spa':'💆','Beach Access':'🏖️','Concierge':'🛎️'
};
const ROOM_ICONS  = { SINGLE:'🛏️', DOUBLE:'🛏️🛏️', SUITE:'👑' };
const ROOM_COLORS = {
  SINGLE:{ bg:'linear-gradient(135deg,#eff6ff,#dbeafe)' },
  DOUBLE:{ bg:'linear-gradient(135deg,#f5f3ff,#ede9fe)' },
  SUITE: { bg:'linear-gradient(135deg,#fffbeb,#fef3c7)' },
};

export default function HotelDetailPage({ hotel, checkIn, checkOut, onBack, onBookingSuccess }) {
  const [rooms, setRooms]               = useState([]);
  const [summary, setSummary]           = useState({});
  const [loading, setLoading]           = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError]               = useState('');
  const [successMsg, setSuccessMsg]     = useState('');
  const [localCheckIn, setLocalCheckIn]   = useState(checkIn || '');
  const [localCheckOut, setLocalCheckOut] = useState(checkOut || '');
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [datesSelected, setDatesSelected] = useState(!!(checkIn && checkOut));

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nights   = localCheckIn && localCheckOut
    ? Math.max(0, (new Date(localCheckOut) - new Date(localCheckIn)) / 86400000) : 0;

  const fetchData = useCallback(async (ci, co) => {
    setLoading(true); setError('');
    try {
      const [roomsRes, summaryRes] = await Promise.all([
        getRooms(hotel.id, ci, co),
        getRoomSummary(hotel.id, ci, co),
      ]);
      setRooms(roomsRes.data.data || []);
      setSummary(summaryRes.data.data || {});
      setLastRefreshed(new Date());
    } catch { setError('Failed to load rooms.'); }
    finally { setLoading(false); }
  }, [hotel.id]);

  // Only auto-fetch if dates were passed from search
  useEffect(() => {
    if (checkIn && checkOut) fetchData(checkIn, checkOut);
  }, []);

  // Auto-refresh every 30s only when dates are selected
  useEffect(() => {
    if (!datesSelected) return;
    const interval = setInterval(() => fetchData(localCheckIn, localCheckOut), 30000);
    return () => clearInterval(interval);
  }, [datesSelected, localCheckIn, localCheckOut]);

  const handleCheckAvailability = () => {
    if (!localCheckIn || !localCheckOut) { setError('Please select both check-in and check-out dates'); return; }
    if (localCheckOut <= localCheckIn)   { setError('Check-out must be after check-in'); return; }
    setDatesSelected(true);
    fetchData(localCheckIn, localCheckOut);
  };

  const handleBookingSuccess = (message) => {
    setSelectedRoom(null); setSuccessMsg(message);
    fetchData(localCheckIn, localCheckOut);
    if (onBookingSuccess) onBookingSuccess(message);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const amenityList = hotel.amenities ? hotel.amenities.split(',').map(a => a.trim()) : [];
  const roomsByType = rooms.reduce((acc, r) => { (acc[r.type] = acc[r.type] || []).push(r); return acc; }, {});

  const getStatus = (available, total) => {
    if (available === 0)          return { bg:'#fef2f2', color:'#dc2626', label:'Sold Out',    bar:'#ef4444' };
    const pct = available / total;
    if (pct <= 0.3)               return { bg:'#fff7ed', color:'#ea580c', label:'Almost Full', bar:'#f97316' };
    if (pct <= 0.6)               return { bg:'#fefce8', color:'#ca8a04', label:'Filling Fast',bar:'#eab308' };
    return                               { bg:'#f0fdf4', color:'#16a34a', label:'Available',   bar:'#22c55e' };
  };

  return (
    <div style={{ minHeight:'calc(100vh - 64px)', background:'#f8fafc', fontFamily:"'Segoe UI',sans-serif" }}>

      {/* HERO */}
      <div style={{ position:'relative', height:'320px', overflow:'hidden' }}>
        {hotel.imageUrl
          ? <img src={hotel.imageUrl} alt={hotel.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#0f172a,#1e3a8a)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:'80px' }}>🏨</span></div>
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.75))' }} />

        <button onClick={onBack} style={{
          position:'absolute', top:'20px', left:'24px',
          background:'rgba(0,0,0,0.5)', backdropFilter:'blur(8px)', color:'#fff',
          border:'1px solid rgba(255,255,255,0.2)', borderRadius:'8px',
          padding:'8px 16px', cursor:'pointer', fontSize:'14px', fontWeight:'600'
        }}>← Back to Hotels</button>

        <div style={{ position:'absolute', bottom:'24px', left:'24px', right:'24px' }}>
          <div style={{ maxWidth:'1000px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'16px' }}>
            <div>
              <h1 style={{ color:'#fff', fontSize:'30px', fontWeight:'800', margin:'0 0 6px', textShadow:'0 2px 8px rgba(0,0,0,0.5)' }}>🏨 {hotel.name}</h1>
              <p style={{ color:'#e2e8f0', margin:'0 0 10px', fontSize:'14px' }}>📍 {hotel.address}</p>
              <div style={{ display:'flex', gap:'10px', alignItems:'center' }}>
                <span style={{ background:'#f59e0b', color:'#fff', borderRadius:'8px', padding:'4px 12px', fontWeight:'700', fontSize:'14px' }}>⭐ {hotel.rating}</span>
                <span style={{ color:'#fff', fontWeight:'800', fontSize:'20px' }}>₹{hotel.price}<span style={{ fontSize:'13px', fontWeight:'400', color:'#cbd5e1' }}>/night</span></span>
              </div>
            </div>
            {amenityList.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', maxWidth:'420px' }}>
                {amenityList.map(a => (
                  <span key={a} style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:'600' }}>
                    {AMENITY_ICONS[a] || '✓'} {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'32px 16px' }}>

        {/* DATE PICKER */}
        <div style={{ background:'#fff', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0', marginBottom:'28px' }}>
          <h3 style={{ margin:'0 0 16px', color:'#1e293b', fontSize:'16px', fontWeight:'700' }}>
            📅 Select Dates to Check Room Availability
          </h3>
          <div style={{ display:'flex', gap:'16px', alignItems:'flex-end', flexWrap:'wrap' }}>
            <div>
              <label style={labelStyle}>Check-in</label>
              <input type="date" min={today} value={localCheckIn} onChange={e => setLocalCheckIn(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Check-out</label>
              <input type="date" min={tomorrow} value={localCheckOut} onChange={e => setLocalCheckOut(e.target.value)} style={inputStyle} />
            </div>
            <button onClick={handleCheckAvailability} style={{
              background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff',
              border:'none', borderRadius:'10px', padding:'11px 24px', fontSize:'14px', fontWeight:'700', cursor:'pointer'
            }}>Check Availability</button>
            {nights > 0 && (
              <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'10px', padding:'10px 16px' }}>
                <span style={{ color:'#16a34a', fontWeight:'700', fontSize:'14px' }}>
                  {nights} night{nights > 1 ? 's' : ''} · ₹{hotel.price * nights} est.
                </span>
              </div>
            )}
          </div>
          {error && <div style={{ marginTop:'12px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'8px', padding:'10px 14px', color:'#dc2626', fontSize:'13px' }}>⚠️ {error}</div>}
        </div>

        {/* SUCCESS */}
        {successMsg && (
          <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'10px', padding:'16px', color:'#16a34a', marginBottom:'24px', fontWeight:'700', fontSize:'15px' }}>
            🎉 {successMsg}
          </div>
        )}

        {/* PROMPT — no dates yet */}
        {!datesSelected && (
          <div style={{ textAlign:'center', padding:'60px', background:'#fff', borderRadius:'16px', border:'2px dashed #e2e8f0' }}>
            <div style={{ fontSize:'56px', marginBottom:'16px' }}>📅</div>
            <h3 style={{ color:'#475569', margin:'0 0 8px' }}>Select your dates above</h3>
            <p style={{ color:'#94a3b8', margin:0 }}>Pick check-in and check-out dates to see available rooms with live status</p>
          </div>
        )}

        {/* LOADING */}
        {datesSelected && loading && (
          <div style={{ textAlign:'center', padding:'48px' }}>
            <div style={{ width:'40px', height:'40px', border:'4px solid #e2e8f0', borderTop:'4px solid #2563eb', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto' }} />
            <p style={{ color:'#64748b', marginTop:'12px' }}>Checking availability...</p>
          </div>
        )}

        {/* ROOMS — shown only after dates selected */}
        {datesSelected && !loading && (
          <>
            {/* Header with live indicator + refresh */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
              <h2 style={{ margin:0, color:'#1e293b', fontSize:'22px', fontWeight:'800' }}>
                🛏️ Available Rooms
                <span style={{ color:'#64748b', fontWeight:'400', fontSize:'14px', marginLeft:'10px' }}>
                  {localCheckIn} → {localCheckOut}
                </span>
              </h2>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <div style={{ width:'8px', height:'8px', background:'#22c55e', borderRadius:'50%', animation:'pulse 2s infinite' }} />
                <span style={{ color:'#64748b', fontSize:'12px' }}>
                  Live {lastRefreshed ? `· ${lastRefreshed.toLocaleTimeString()}` : ''}
                </span>
                <button onClick={() => fetchData(localCheckIn, localCheckOut)} style={{
                  background:'none', border:'1px solid #e2e8f0', borderRadius:'6px',
                  padding:'3px 10px', cursor:'pointer', fontSize:'12px', color:'#2563eb', fontWeight:'600'
                }}>↻</button>
              </div>
            </div>

            {/* No rooms */}
            {rooms.length === 0 && (
              <div style={{ textAlign:'center', padding:'60px', background:'#fff', borderRadius:'16px', border:'1px solid #e2e8f0' }}>
                <div style={{ fontSize:'56px', marginBottom:'16px' }}>😔</div>
                <h3 style={{ color:'#475569', margin:'0 0 8px' }}>No rooms available</h3>
                <p style={{ color:'#94a3b8', margin:0 }}>All rooms are booked for these dates. Try different dates.</p>
              </div>
            )}

            {/* Rooms grouped by type with live stats in header */}
            {Object.entries(roomsByType).map(([type, typeRooms]) => {
              const colors  = ROOM_COLORS[type] || ROOM_COLORS.SINGLE;
              const info    = summary[type] || {};
              const total   = Number(info.total || 0);
              const avail   = Number(info.available || typeRooms.length);
              const booked  = total - avail;
              const pct     = total > 0 ? Math.round((avail / total) * 100) : 100;
              const status  = getStatus(avail, total);

              return (
                <div key={type} style={{ marginBottom:'28px' }}>

                  {/* Room type header with live availability bar */}
                  <div style={{ background:'#fff', borderRadius:'14px', padding:'16px 20px', marginBottom:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', border:'1px solid #e2e8f0' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{ width:'36px', height:'36px', background:colors.bg, borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
                          {ROOM_ICONS[type]}
                        </div>
                        <div>
                          <span style={{ fontWeight:'800', color:'#1e293b', fontSize:'16px' }}>{type} Rooms</span>
                          <span style={{ color:'#64748b', fontSize:'13px', marginLeft:'8px' }}>
                            {type === 'SINGLE' && '· 1 bed · Solo traveler'}
                            {type === 'DOUBLE' && '· 2 beds · Couples'}
                            {type === 'SUITE'  && '· King bed + living area'}
                          </span>
                        </div>
                      </div>
                      <span style={{ background:status.bg, color:status.color, borderRadius:'20px', padding:'4px 12px', fontSize:'12px', fontWeight:'700' }}>
                        {status.label}
                      </span>
                    </div>

                    {/* Progress bar + stats */}
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ flex:1, background:'#f1f5f9', borderRadius:'99px', height:'6px', overflow:'hidden' }}>
                        <div style={{ height:'100%', borderRadius:'99px', width:`${pct}%`, background:status.bar, transition:'width 0.5s ease' }} />
                      </div>
                      <div style={{ display:'flex', gap:'16px', fontSize:'12px', fontWeight:'700', whiteSpace:'nowrap' }}>
                        <span style={{ color:'#22c55e' }}>✅ {avail} free</span>
                        <span style={{ color:'#ef4444' }}>🔴 {booked} booked</span>
                        <span style={{ color:'#94a3b8' }}>/ {total} total</span>
                      </div>
                    </div>
                  </div>

                  {/* Individual room cards */}
                  <div style={{ display:'grid', gap:'10px' }}>
                    {typeRooms.map((room, index) => (
                      <div key={room.id} style={{
                        background:'#fff', borderRadius:'12px', padding:'18px 20px',
                        boxShadow:'0 2px 8px rgba(0,0,0,0.04)', border:'1px solid #e2e8f0',
                        display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px', flexWrap:'wrap'
                      }}>
                        <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
                          <div style={{ width:'52px', height:'52px', background:colors.bg, borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>
                            {ROOM_ICONS[type]}
                          </div>
                          <div>
                            <div style={{ fontWeight:'700', color:'#1e293b', fontSize:'15px', marginBottom:'4px' }}>
                              {type} Room {index + 1}
                              <span style={{ color:'#94a3b8', fontWeight:'400', fontSize:'12px', marginLeft:'6px' }}>
                                of {total} total
                              </span>
                            </div>
                            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                              <span style={{ background:'#f0fdf4', color:'#16a34a', border:'1px solid #86efac', borderRadius:'20px', padding:'2px 8px', fontSize:'11px', fontWeight:'700' }}>
                                ✅ Available for your dates
                              </span>
                              {nights > 0 && (
                                <span style={{ background:'#eff6ff', color:'#2563eb', border:'1px solid #bfdbfe', borderRadius:'20px', padding:'2px 8px', fontSize:'11px', fontWeight:'700' }}>
                                  {nights} nights = ₹{room.price * nights}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontSize:'20px', fontWeight:'800', color:'#1e3a8a' }}>₹{room.price}</div>
                            <div style={{ color:'#94a3b8', fontSize:'11px' }}>per night</div>
                          </div>
                          <button onClick={() => setSelectedRoom(room)} style={{
                            background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff',
                            border:'none', borderRadius:'10px', padding:'10px 22px',
                            cursor:'pointer', fontWeight:'700', fontSize:'13px',
                            boxShadow:'0 4px 12px rgba(37,99,235,0.3)'
                          }}>Book Now →</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {selectedRoom && (
        <BookingModal room={selectedRoom} prefillCheckIn={localCheckIn} prefillCheckOut={localCheckOut}
          onClose={() => setSelectedRoom(null)} onSuccess={handleBookingSuccess} />
      )}

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}

const labelStyle = { display:'block', marginBottom:'6px', fontWeight:'600', color:'#374151', fontSize:'13px' };
const inputStyle = { padding:'10px 14px', border:'1.5px solid #e2e8f0', borderRadius:'10px', fontSize:'14px', outline:'none' };
