import React, { useState, useEffect } from 'react';
import { createBooking, getEligiblePromotions } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ room, prefillCheckIn, prefillCheckOut, onClose, onSuccess }) {
  const { user } = useAuth();
  const [checkIn, setCheckIn]     = useState(prefillCheckIn || '');
  const [checkOut, setCheckOut]   = useState(prefillCheckOut || '');
  const [promoCode, setPromoCode] = useState('');
  const [promos, setPromos]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nights   = checkIn && checkOut
    ? Math.max(0, (new Date(checkOut) - new Date(checkIn)) / 86400000) : 0;

  useEffect(() => {
    getEligiblePromotions()
      .then(res => setPromos(res.data.data || []))
      .catch(() => {});
  }, []);

  const getDiscountedPrice = () => {
    if (!promoCode || nights === 0) return null;
    const base  = room.price * nights;
    const promo = promos.find(p => p.code === promoCode);
    if (!promo) return null;
    return promo.type === 'PERCENTAGE'
      ? Math.round(base - (base * promo.discountValue / 100))
      : Math.max(0, Math.round(base - promo.discountValue));
  };

  const discountedPrice = getDiscountedPrice();
  const basePrice       = nights > 0 ? room.price * nights : 0;
  const savings         = discountedPrice !== null ? basePrice - discountedPrice : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!checkIn || !checkOut) { setError('Please select both dates'); return; }
    if (checkOut <= checkIn)   { setError('Check-out must be after check-in'); return; }
    setLoading(true);
    try {
      const res = await createBooking({ roomId:room.id, checkIn, checkOut, promoCode:promoCode.trim()||null });
      onSuccess(res.data.message, res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.75)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:1000, backdropFilter:'blur(10px)'
    }}>
      <div style={{
        background:'#fff', borderRadius:'24px', padding:'36px',
        width:'480px', maxHeight:'92vh', overflowY:'auto',
        boxShadow:'0 40px 100px rgba(0,0,0,0.4)'
      }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' }}>
          <div>
            <h2 style={{ margin:'0 0 4px', color:'#0f172a', fontSize:'22px', fontWeight:'900', letterSpacing:'-0.5px' }}>
              Confirm Booking
            </h2>
            <p style={{ color:'#64748b', margin:0, fontSize:'14px' }}>
              {room.type} Room · ₹{room.price}/night
              {nights > 0 && <span style={{ color:'#2563eb', marginLeft:'6px', fontWeight:'700' }}>
                · {nights} night{nights > 1 ? 's' : ''}
              </span>}
            </p>
          </div>
          <button onClick={onClose} style={{
            background:'#f1f5f9', border:'none', borderRadius:'50%',
            width:'36px', height:'36px', cursor:'pointer',
            fontSize:'16px', color:'#64748b', fontWeight:'700',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dates */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'20px' }}>
            <div>
              <label style={lStyle}>📅 Check-in</label>
              <input type="date" min={today} value={checkIn}
                onChange={e => setCheckIn(e.target.value)} required style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>📅 Check-out</label>
              <input type="date" min={tomorrow} value={checkOut}
                onChange={e => setCheckOut(e.target.value)} required style={iStyle} />
            </div>
          </div>

          {/* Eligible Coupons */}
          {promos.length > 0 && (
            <div style={{ marginBottom:'20px' }}>
              <label style={lStyle}>
                🏷️ Your Eligible Coupons
                <span style={{ color:'#94a3b8', fontWeight:'400', fontSize:'12px', marginLeft:'6px' }}>
                  ⭐ {user?.loyaltyPoints || 0} pts
                </span>
              </label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'8px' }}>
                {promos.map(p => {
                  const isSelected = promoCode === p.code;
                  const discount   = p.type === 'PERCENTAGE' ? `${p.discountValue}% OFF` : `₹${p.discountValue} OFF`;
                  return (
                    <button key={p.code} type="button"
                      onClick={() => setPromoCode(isSelected ? '' : p.code)}
                      style={{
                        background: isSelected ? 'linear-gradient(135deg,#2563eb,#7c3aed)' : '#f8fafc',
                        color: isSelected ? '#fff' : '#1e293b',
                        border: isSelected ? '2px solid transparent' : '2px dashed #cbd5e1',
                        borderRadius:'12px', padding:'10px 16px',
                        cursor:'pointer', transition:'all 0.2s', textAlign:'left', minWidth:'120px'
                      }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
                        <span style={{
                          background: isSelected ? 'rgba(255,255,255,0.25)' : '#eff6ff',
                          color: isSelected ? '#fff' : '#2563eb',
                          borderRadius:'5px', padding:'1px 7px',
                          fontSize:'11px', fontWeight:'800', letterSpacing:'0.5px'
                        }}>{p.code}</span>
                        {isSelected && <span style={{ fontSize:'12px' }}>✓</span>}
                      </div>
                      <div style={{ fontSize:'16px', fontWeight:'900',
                        color: isSelected ? '#fde68a' : '#16a34a' }}>{discount}</div>
                      {p.minLoyaltyPoints > 0 && (
                        <div style={{ fontSize:'10px', marginTop:'2px',
                          color: isSelected ? 'rgba(255,255,255,0.7)' : '#94a3b8' }}>
                          Needs {p.minLoyaltyPoints} pts
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {promoCode && (
                <button type="button" onClick={() => setPromoCode('')} style={{
                  background:'none', border:'none', color:'#ef4444',
                  cursor:'pointer', fontSize:'12px', marginTop:'6px', fontWeight:'700'
                }}>✕ Remove coupon</button>
              )}
            </div>
          )}

          {promos.length === 0 && (
            <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'12px',
              padding:'14px', marginBottom:'20px', fontSize:'13px', color:'#64748b' }}>
              🏷️ No coupons available yet.
              <span style={{ color:'#2563eb', marginLeft:'4px', fontWeight:'600' }}>
                Book more to earn loyalty points!
              </span>
            </div>
          )}

          {/* Manual input */}
          <div style={{ marginBottom:'20px' }}>
            <label style={lStyle}>
              Or enter code manually
              <span style={{ color:'#94a3b8', fontWeight:'400', fontSize:'12px', marginLeft:'6px' }}>(optional)</span>
            </label>
            <input placeholder="e.g. SUMMER20" value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              style={{ ...iStyle, fontFamily:'monospace', letterSpacing:'1px' }} />
          </div>

          {/* Price Summary */}
          {nights > 0 && (
            <div style={{ background:'linear-gradient(135deg,#f8fafc,#eff6ff)',
              border:'1px solid #e2e8f0', borderRadius:'16px',
              padding:'18px', marginBottom:'20px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ color:'#64748b', fontSize:'14px' }}>₹{room.price} × {nights} nights</span>
                <span style={{ fontWeight:'700', color:'#1e293b' }}>₹{basePrice}</span>
              </div>
              {discountedPrice !== null && (
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                  <span style={{ color:'#16a34a', fontSize:'14px', fontWeight:'600' }}>
                    🏷️ {promoCode} discount
                  </span>
                  <span style={{ color:'#16a34a', fontWeight:'700' }}>- ₹{savings}</span>
                </div>
              )}
              <div style={{ borderTop:'1px solid #e2e8f0', paddingTop:'10px',
                display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:'800', color:'#0f172a', fontSize:'15px' }}>Total</span>
                <div style={{ textAlign:'right' }}>
                  {discountedPrice !== null && (
                    <span style={{ textDecoration:'line-through', color:'#94a3b8',
                      fontSize:'13px', marginRight:'8px' }}>₹{basePrice}</span>
                  )}
                  <span style={{ fontWeight:'900', color:'#1e3a8a', fontSize:'22px' }}>
                    ₹{discountedPrice !== null ? discountedPrice : basePrice}
                  </span>
                </div>
              </div>
              {discountedPrice !== null && (
                <div style={{ marginTop:'8px', background:'#f0fdf4', border:'1px solid #86efac',
                  borderRadius:'8px', padding:'8px 12px', color:'#16a34a',
                  fontSize:'13px', fontWeight:'700', textAlign:'center' }}>
                  🎉 You save ₹{savings} with {promoCode}!
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={{ background:'#fef2f2', border:'1px solid #fecaca',
              borderRadius:'10px', padding:'12px 16px', color:'#dc2626',
              fontSize:'13px', marginBottom:'16px', fontWeight:'600' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display:'flex', gap:'12px' }}>
            <button type="button" onClick={onClose} style={{
              flex:1, padding:'14px', border:'1.5px solid #e2e8f0',
              borderRadius:'12px', cursor:'pointer', background:'#fff',
              fontWeight:'700', color:'#475569', fontSize:'14px'
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              flex:2, padding:'14px',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg,#2563eb,#7c3aed)',
              color:'#fff', border:'none', borderRadius:'12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight:'800', fontSize:'14px',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(37,99,235,0.4)',
              transition:'all 0.3s'
            }}>
              {loading ? '⏳ Booking...' : `Confirm Booking${discountedPrice !== null ? ` · ₹${discountedPrice}` : ''}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const lStyle = { display:'block', marginBottom:'6px', fontWeight:'700', color:'#374151', fontSize:'13px' };
const iStyle = {
  width:'100%', padding:'11px 14px', border:'1.5px solid #e2e8f0',
  borderRadius:'10px', fontSize:'14px', boxSizing:'border-box',
  outline:'none', background:'#fafafa', transition:'border-color 0.2s'
};
