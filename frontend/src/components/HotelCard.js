import React, { useState } from 'react';

const AMENITY_ICONS = {
  'WiFi':'📶','Pool':'🏊','Gym':'💪','Parking':'🅿️',
  'Restaurant':'🍽️','AC':'❄️','Spa':'💆','Beach Access':'🏖️','Concierge':'🛎️'
};

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#1e3a8a,#2563eb)',
  'linear-gradient(135deg,#065f46,#059669)',
  'linear-gradient(135deg,#7c2d12,#ea580c)',
  'linear-gradient(135deg,#4c1d95,#7c3aed)',
  'linear-gradient(135deg,#0f172a,#1e3a8a)',
];

function HotelCard({ hotel, onSelect, isSelected }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const amenityList = hotel.amenities ? hotel.amenities.split(',').map(a => a.trim()) : [];
  const fallback    = FALLBACK_GRADIENTS[(hotel.id - 1) % FALLBACK_GRADIENTS.length];

  return (
    <div
      className="hotel-card"
      onClick={() => onSelect(hotel)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '20px', cursor: 'pointer', background: '#fff',
        overflow: 'hidden', position: 'relative',
        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
        boxShadow: isSelected
          ? '0 12px 40px rgba(37,99,235,0.3)'
          : hovered ? '0 12px 40px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0,0,0,0.06)',
        transform: isSelected || hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Image */}
      <div style={{ position:'relative', height:'210px', overflow:'hidden' }}>
        {hotel.imageUrl && !imgError ? (
          <img src={hotel.imageUrl} alt={hotel.name} onError={() => setImgError(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.5s ease' }} />
        ) : (
          <div style={{ width:'100%', height:'100%', background:fallback,
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:'60px' }}>🏨</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position:'absolute', inset:0,
          background:'linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.6))' }} />

        {/* Rating */}
        <div style={{ position:'absolute', top:'12px', right:'12px',
          background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
          color:'#fbbf24', borderRadius:'10px', padding:'5px 10px',
          fontSize:'13px', fontWeight:'800', display:'flex', alignItems:'center', gap:'4px' }}>
          ⭐ {hotel.rating}
        </div>

        {/* Location */}
        <div style={{ position:'absolute', bottom:'12px', left:'12px',
          background:'rgba(0,0,0,0.55)', backdropFilter:'blur(8px)',
          color:'#fff', borderRadius:'8px', padding:'4px 10px',
          fontSize:'12px', fontWeight:'600' }}>
          📍 {hotel.location}
        </div>

        {/* Selected badge */}
        {isSelected && (
          <div style={{ position:'absolute', top:'12px', left:'12px',
            background:'#2563eb', color:'#fff', borderRadius:'8px',
            padding:'4px 10px', fontSize:'12px', fontWeight:'700' }}>
            ✓ Selected
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:'18px' }}>
        <h3 style={{ margin:'0 0 4px', color:'#0f172a', fontSize:'17px', fontWeight:'800',
          letterSpacing:'-0.3px' }}>{hotel.name}</h3>
        <p style={{ margin:'0 0 12px', color:'#94a3b8', fontSize:'12px' }}>
          {hotel.address}
        </p>

        {/* Amenities */}
        {amenityList.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'14px' }}>
            {amenityList.slice(0,5).map(a => (
              <span key={a} style={{ background:'#f1f5f9', borderRadius:'20px',
                padding:'3px 9px', fontSize:'11px', color:'#475569', fontWeight:'600' }}>
                {AMENITY_ICONS[a] || '✓'} {a}
              </span>
            ))}
            {amenityList.length > 5 && (
              <span style={{ background:'#eff6ff', borderRadius:'20px',
                padding:'3px 9px', fontSize:'11px', color:'#2563eb', fontWeight:'600' }}>
                +{amenityList.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <span style={{ fontSize:'22px', fontWeight:'900', color:'#1e3a8a' }}>₹{hotel.price}</span>
            <span style={{ color:'#94a3b8', fontSize:'12px', marginLeft:'2px' }}>/night</span>
          </div>
          <div style={{
            background: isSelected
              ? '#2563eb'
              : 'linear-gradient(135deg,#2563eb,#7c3aed)',
            color:'#fff', borderRadius:'10px', padding:'9px 18px',
            fontSize:'13px', fontWeight:'700',
            boxShadow: hovered ? '0 4px 16px rgba(37,99,235,0.4)' : 'none',
            transition:'box-shadow 0.3s'
          }}>
            {isSelected ? '✓ Selected' : 'View Rooms →'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
