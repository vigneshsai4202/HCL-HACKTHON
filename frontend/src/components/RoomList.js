import React, { useState } from 'react';

const ROOM_ICONS  = { SINGLE:'🛏️', DOUBLE:'🛏️🛏️', SUITE:'👑' };
const ROOM_COLORS = {
  SINGLE:{ bg:'linear-gradient(135deg,#eff6ff,#dbeafe)', text:'#2563eb' },
  DOUBLE:{ bg:'linear-gradient(135deg,#f5f3ff,#ede9fe)', text:'#7c3aed' },
  SUITE: { bg:'linear-gradient(135deg,#fffbeb,#fef3c7)', text:'#d97706' },
};

function RoomList({ rooms, onBook }) {
  const [hovered, setHovered] = useState(null);

  if (rooms.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'48px', background:'#fff',
        borderRadius:'16px', border:'2px dashed #e2e8f0' }}>
        <div style={{ fontSize:'48px', marginBottom:'12px' }}>😔</div>
        <h3 style={{ color:'#475569', margin:'0 0 6px' }}>No rooms available</h3>
        <p style={{ color:'#94a3b8', margin:0, fontSize:'14px' }}>
          Try selecting different dates to check availability
        </p>
      </div>
    );
  }

  return (
    <div style={{ display:'grid', gap:'12px' }}>
      {rooms.map((room) => {
        const colors = ROOM_COLORS[room.type] || ROOM_COLORS.SINGLE;
        const isHov  = hovered === room.id;
        return (
          <div key={room.id}
            onMouseEnter={() => setHovered(room.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'20px 24px', borderRadius:'16px', gap:'16px', flexWrap:'wrap',
              background:'#fff',
              border: isHov ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
              boxShadow: isHov ? '0 8px 32px rgba(37,99,235,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
              transform: isHov ? 'translateY(-2px)' : 'none',
              transition:'all 0.25s cubic-bezier(0.4,0,0.2,1)'
            }}>
            <div style={{ display:'flex', gap:'16px', alignItems:'center' }}>
              <div style={{ width:'56px', height:'56px', background:colors.bg,
                borderRadius:'14px', display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:'24px', flexShrink:0 }}>
                {ROOM_ICONS[room.type] || '🛏️'}
              </div>
              <div>
                <div style={{ fontWeight:'800', color:'#0f172a', fontSize:'16px', marginBottom:'4px' }}>
                  {room.type} Room
                </div>
                <div style={{ color:'#64748b', fontSize:'13px', marginBottom:'6px' }}>
                  {room.type === 'SINGLE' && '🧍 Solo traveler · 1 bed · Up to 1 guest'}
                  {room.type === 'DOUBLE' && '👫 Couples · 2 beds · Up to 2 guests'}
                  {room.type === 'SUITE'  && '👑 Luxury · King bed + living area · Up to 3 guests'}
                </div>
                <span style={{ background:'#f0fdf4', color:'#16a34a',
                  border:'1px solid #86efac', borderRadius:'20px',
                  padding:'2px 10px', fontSize:'11px', fontWeight:'700' }}>
                  ✅ Available
                </span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'22px', fontWeight:'900', color:'#1e3a8a' }}>₹{room.price}</div>
                <div style={{ color:'#94a3b8', fontSize:'12px', fontWeight:'600' }}>per night</div>
              </div>
              <button onClick={() => onBook(room)} style={{
                background:'linear-gradient(135deg,#2563eb,#7c3aed)', color:'#fff',
                border:'none', borderRadius:'12px', padding:'12px 24px',
                cursor:'pointer', fontWeight:'800', fontSize:'14px',
                boxShadow: isHov ? '0 8px 24px rgba(37,99,235,0.45)' : '0 4px 12px rgba(37,99,235,0.3)',
                transition:'box-shadow 0.25s'
              }}>Book Now →</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RoomList;
