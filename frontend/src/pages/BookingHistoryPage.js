import React, { useEffect, useState } from 'react';
import { getBookingHistory, rebook, cancelBooking } from '../services/api';

export default function BookingHistoryPage({ onBack }) {
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [rebookModal, setRebookModal]   = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [dates, setDates]               = useState({ checkIn:'', checkOut:'' });
  const [msg, setMsg]                   = useState({ text:'', type:'' });
  const [actionLoading, setActionLoading] = useState(false);

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const loadBookings = () => {
    setLoading(true);
    getBookingHistory()
      .then(res => setBookings(res.data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, []);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text:'', type:'' }), 4000);
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await cancelBooking(cancelTarget.id);
      setCancelTarget(null);
      showMsg('Booking cancelled. The room is now available for others.', 'success');
      loadBookings();
    } catch (err) {
      setCancelTarget(null);
      showMsg(err.response?.data?.message || 'Cancellation failed', 'error');
    } finally { setActionLoading(false); }
  };

  const handleRebook = async (e) => {
    e.preventDefault();
    if (dates.checkOut <= dates.checkIn) { showMsg('Check-out must be after check-in', 'error'); return; }
    setActionLoading(true);
    try {
      await rebook(rebookModal.id, { checkIn: dates.checkIn, checkOut: dates.checkOut });
      setRebookModal(null);
      showMsg('Rebooked successfully! 🎉', 'success');
      loadBookings();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Rebook failed', 'error');
    } finally { setActionLoading(false); }
  };

  const isCancellable = (b) => b.status === 'CONFIRMED' && b.checkIn > today;

  const confirmed = bookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelled = bookings.filter(b => b.status === 'CANCELLED').length;

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc', fontFamily:"'Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{
        background:'linear-gradient(135deg,#0f172a,#1e3a8a)',
        padding:'28px 32px', display:'flex', alignItems:'center', gap:'16px'
      }}>
        <button onClick={onBack} style={{
          background:'rgba(255,255,255,0.1)', color:'#fff',
          border:'1px solid rgba(255,255,255,0.2)', borderRadius:'10px',
          padding:'9px 18px', cursor:'pointer', fontSize:'14px', fontWeight:'600',
          backdropFilter:'blur(8px)'
        }}>← Back</button>
        <div>
          <h1 style={{ color:'#fff', margin:0, fontSize:'22px', fontWeight:'800' }}>📋 My Bookings</h1>
          <p style={{ color:'#94a3b8', margin:0, fontSize:'13px' }}>Manage your reservations</p>
        </div>
      </div>

      <div style={{ maxWidth:'860px', margin:'0 auto', padding:'32px 16px' }}>

        {/* Stats row */}
        {bookings.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px', marginBottom:'28px' }}>
            {[
              { label:'Total Bookings', value:bookings.length, color:'#2563eb', bg:'#eff6ff', icon:'📋' },
              { label:'Confirmed',      value:confirmed,        color:'#16a34a', bg:'#f0fdf4', icon:'✅' },
              { label:'Cancelled',      value:cancelled,        color:'#dc2626', bg:'#fef2f2', icon:'❌' },
            ].map(s => (
              <div key={s.label} style={{ background:s.bg, borderRadius:'16px', padding:'20px',
                border:`1px solid ${s.color}22`, textAlign:'center' }}>
                <div style={{ fontSize:'28px', marginBottom:'4px' }}>{s.icon}</div>
                <div style={{ fontSize:'28px', fontWeight:'900', color:s.color }}>{s.value}</div>
                <div style={{ color:'#64748b', fontSize:'13px', fontWeight:'600' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Message */}
        {msg.text && (
          <div style={{
            background: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border:`1px solid ${msg.type === 'success' ? '#86efac' : '#fecaca'}`,
            borderRadius:'12px', padding:'14px 18px',
            color: msg.type === 'success' ? '#16a34a' : '#dc2626',
            marginBottom:'20px', fontWeight:'700', fontSize:'14px',
            display:'flex', alignItems:'center', gap:'8px'
          }}>
            {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:'60px' }}>
            <div style={{ width:'40px', height:'40px', border:'4px solid #e2e8f0',
              borderTop:'4px solid #2563eb', borderRadius:'50%',
              animation:'spin 0.8s linear infinite', margin:'0 auto' }} />
            <p style={{ color:'#64748b', marginTop:'12px' }}>Loading your bookings...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && bookings.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 24px',
            background:'#fff', borderRadius:'20px', border:'2px dashed #e2e8f0' }}>
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>📭</div>
            <h3 style={{ color:'#475569', margin:'0 0 8px', fontSize:'20px' }}>No bookings yet</h3>
            <p style={{ color:'#94a3b8', margin:'0 0 24px' }}>Start exploring hotels and make your first booking!</p>
            <button onClick={onBack} style={{
              background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff',
              border:'none', borderRadius:'10px', padding:'12px 28px',
              cursor:'pointer', fontWeight:'700', fontSize:'14px'
            }}>Explore Hotels →</button>
          </div>
        )}

        {/* Booking cards */}
        {!loading && bookings.map((b) => (
          <div key={b.id} style={{
            background:'#fff', borderRadius:'20px', marginBottom:'16px',
            boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0',
            overflow:'hidden',
            borderLeft:`5px solid ${b.status === 'CONFIRMED' ? '#22c55e' : '#ef4444'}`
          }}>
            {/* Card header */}
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9',
              display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'44px', height:'44px',
                  background: b.status === 'CONFIRMED'
                    ? 'linear-gradient(135deg,#dcfce7,#bbf7d0)'
                    : 'linear-gradient(135deg,#fee2e2,#fecaca)',
                  borderRadius:'12px', display:'flex', alignItems:'center',
                  justifyContent:'center', fontSize:'22px' }}>
                  {b.status === 'CONFIRMED' ? '✅' : '❌'}
                </div>
                <div>
                  <div style={{ fontWeight:'800', color:'#0f172a', fontSize:'16px' }}>
                    {b.room?.hotel?.name}
                  </div>
                  <div style={{ color:'#94a3b8', fontSize:'12px', marginTop:'2px' }}>
                    Reservation STE-{String(b.id).padStart(6,'0')} · {b.createdAt?.split('T')[0]}
                  </div>
                </div>
              </div>
              <span style={{
                background: b.status === 'CONFIRMED' ? '#dcfce7' : '#fee2e2',
                color: b.status === 'CONFIRMED' ? '#16a34a' : '#dc2626',
                borderRadius:'20px', padding:'5px 14px', fontSize:'12px', fontWeight:'800'
              }}>
                {b.status}
              </span>
            </div>

            {/* Card body */}
            <div style={{ padding:'20px 24px', display:'flex',
              justifyContent:'space-between', alignItems:'flex-end',
              flexWrap:'wrap', gap:'16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,auto)', gap:'20px 32px' }}>
                <div>
                  <div style={{ color:'#94a3b8', fontSize:'11px', fontWeight:'700',
                    textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px' }}>Room</div>
                  <div style={{ color:'#1e293b', fontWeight:'700', fontSize:'14px' }}>
                    {b.room?.type} Room
                  </div>
                </div>
                <div>
                  <div style={{ color:'#94a3b8', fontSize:'11px', fontWeight:'700',
                    textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px' }}>Check-in</div>
                  <div style={{ color:'#1e293b', fontWeight:'700', fontSize:'14px' }}>{b.checkIn}</div>
                </div>
                <div>
                  <div style={{ color:'#94a3b8', fontSize:'11px', fontWeight:'700',
                    textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px' }}>Check-out</div>
                  <div style={{ color:'#1e293b', fontWeight:'700', fontSize:'14px' }}>{b.checkOut}</div>
                </div>
                <div>
                  <div style={{ color:'#94a3b8', fontSize:'11px', fontWeight:'700',
                    textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px' }}>Total Paid</div>
                  <div style={{ color:'#1e3a8a', fontWeight:'900', fontSize:'16px' }}>₹{b.totalPrice}</div>
                </div>
                {b.promoCodeUsed && (
                  <div>
                    <div style={{ color:'#94a3b8', fontSize:'11px', fontWeight:'700',
                      textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'4px' }}>Promo</div>
                    <span style={{ background:'#f0fdf4', color:'#16a34a',
                      border:'1px solid #86efac', borderRadius:'6px',
                      padding:'2px 8px', fontSize:'12px', fontWeight:'700' }}>
                      🏷️ {b.promoCodeUsed}
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', minWidth:'120px' }}>
                {b.status === 'CONFIRMED' && (
                  <button onClick={() => { setRebookModal(b); setDates({ checkIn:'', checkOut:'' }); }}
                    style={{
                      background:'linear-gradient(135deg,#eff6ff,#dbeafe)',
                      color:'#2563eb', border:'1px solid #bfdbfe',
                      borderRadius:'10px', padding:'9px 16px',
                      cursor:'pointer', fontWeight:'700', fontSize:'13px'
                    }}>🔁 Rebook</button>
                )}
                {isCancellable(b) ? (
                  <button onClick={() => setCancelTarget(b)} style={{
                    background:'linear-gradient(135deg,#fef2f2,#fee2e2)',
                    color:'#dc2626', border:'1px solid #fecaca',
                    borderRadius:'10px', padding:'9px 16px',
                    cursor:'pointer', fontWeight:'700', fontSize:'13px'
                  }}>✕ Cancel</button>
                ) : b.status === 'CONFIRMED' && (
                  <span style={{ fontSize:'11px', color:'#94a3b8', textAlign:'center',
                    padding:'4px', fontWeight:'600' }}>Check-in passed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Dialog */}
      {cancelTarget && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:1000, backdropFilter:'blur(8px)' }}>
          <div style={{ background:'#fff', borderRadius:'24px', padding:'36px',
            width:'420px', maxWidth:'95vw', boxShadow:'0 40px 100px rgba(0,0,0,0.4)' }}>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ fontSize:'48px', marginBottom:'12px' }}>⚠️</div>
              <h3 style={{ margin:'0 0 8px', color:'#0f172a', fontSize:'20px', fontWeight:'900' }}>
                Cancel Booking?
              </h3>
              <p style={{ color:'#64748b', margin:'0 0 4px', fontWeight:'700' }}>
                {cancelTarget.room?.hotel?.name} — {cancelTarget.room?.type} Room
              </p>
              <p style={{ color:'#94a3b8', margin:0, fontSize:'14px' }}>
                📅 {cancelTarget.checkIn} → {cancelTarget.checkOut}
              </p>
            </div>
            <div style={{ background:'#fefce8', border:'1px solid #fde047',
              borderRadius:'12px', padding:'14px', marginBottom:'24px',
              fontSize:'13px', color:'#854d0e', lineHeight:1.6 }}>
              ⚠️ This action cannot be undone. The room will be released and available for others to book.
            </div>
            <div style={{ display:'flex', gap:'12px' }}>
              <button onClick={() => setCancelTarget(null)} disabled={actionLoading} style={{
                flex:1, padding:'13px', border:'1.5px solid #e2e8f0',
                borderRadius:'12px', cursor:'pointer', background:'#fff',
                fontWeight:'700', color:'#475569', fontSize:'14px'
              }}>Keep Booking</button>
              <button onClick={handleCancel} disabled={actionLoading} style={{
                flex:1, padding:'13px', background:'linear-gradient(135deg,#dc2626,#ef4444)',
                color:'#fff', border:'none', borderRadius:'12px',
                cursor:'pointer', fontWeight:'800', fontSize:'14px',
                boxShadow:'0 4px 16px rgba(220,38,38,0.4)'
              }}>{actionLoading ? 'Cancelling...' : 'Yes, Cancel'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Rebook Modal */}
      {rebookModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:1000, backdropFilter:'blur(8px)' }}>
          <div style={{ background:'#fff', borderRadius:'24px', padding:'36px',
            width:'420px', maxWidth:'95vw', boxShadow:'0 40px 100px rgba(0,0,0,0.4)' }}>
            <h3 style={{ margin:'0 0 6px', color:'#0f172a', fontSize:'20px', fontWeight:'900' }}>
              🔁 Quick Rebook
            </h3>
            <p style={{ color:'#64748b', marginBottom:'24px', fontSize:'14px' }}>
              {rebookModal.room?.hotel?.name} — {rebookModal.room?.type} Room
            </p>
            <form onSubmit={handleRebook}>
              <label style={lStyle}>New Check-in</label>
              <input type="date" min={today} required style={iStyle}
                value={dates.checkIn}
                onChange={e => setDates({...dates, checkIn:e.target.value})} />
              <label style={lStyle}>New Check-out</label>
              <input type="date" min={tomorrow} required style={iStyle}
                value={dates.checkOut}
                onChange={e => setDates({...dates, checkOut:e.target.value})} />
              <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
                <button type="button" onClick={() => setRebookModal(null)}
                  disabled={actionLoading} style={{
                    flex:1, padding:'13px', border:'1.5px solid #e2e8f0',
                    borderRadius:'12px', cursor:'pointer', background:'#fff',
                    fontWeight:'700', color:'#475569', fontSize:'14px'
                  }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{
                  flex:1, padding:'13px',
                  background:'linear-gradient(135deg,#2563eb,#7c3aed)',
                  color:'#fff', border:'none', borderRadius:'12px',
                  cursor:'pointer', fontWeight:'800', fontSize:'14px',
                  boxShadow:'0 4px 16px rgba(37,99,235,0.4)'
                }}>{actionLoading ? 'Booking...' : 'Confirm Rebook'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const lStyle = { display:'block', marginBottom:'6px', fontWeight:'700', color:'#374151', fontSize:'13px' };
const iStyle = {
  width:'100%', padding:'12px 14px', marginBottom:'16px',
  border:'1.5px solid #e2e8f0', borderRadius:'12px',
  fontSize:'14px', boxSizing:'border-box', outline:'none'
};
