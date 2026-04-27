import React, { useEffect, useState } from 'react';
import { getActivePromotions } from '../services/api';

function PromotionsBanner() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    getActivePromotions()
      .then(res => setPromos(res.data.data || []))
      .catch(() => {});
  }, []);

  if (promos.length === 0) return null;

  return (
    <div style={{
      background: 'linear-gradient(90deg,#4f46e5,#7c3aed,#2563eb)',
      padding: '10px 16px', overflow: 'hidden', position: 'relative'
    }}>
      {/* Shimmer effect */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',
        animation: 'shimmer 2s infinite'
      }} />
      <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap', position:'relative' }}>
        {promos.map((p) => (
          <div key={p.id} style={{
            display:'flex', alignItems:'center', gap:'8px',
            background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)',
            border:'1px solid rgba(255,255,255,0.2)',
            borderRadius:'20px', padding:'5px 14px',
            color:'#fff', fontSize:'13px', whiteSpace:'nowrap'
          }}>
            <span style={{
              background:'#fff', color:'#7c3aed', borderRadius:'6px',
              padding:'2px 8px', fontWeight:'800', fontSize:'11px', letterSpacing:'0.5px'
            }}>{p.code}</span>
            <span style={{ color:'#e2e8f0', fontSize:'12px' }}>{p.description}</span>
            <span style={{ color:'#fde68a', fontWeight:'800', fontSize:'13px' }}>
              {p.type === 'PERCENTAGE' ? `${p.discountValue}% OFF` : `₹${p.discountValue} OFF`}
            </span>
          </div>
        ))}
      </div>
      <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
    </div>
  );
}

export default PromotionsBanner;
