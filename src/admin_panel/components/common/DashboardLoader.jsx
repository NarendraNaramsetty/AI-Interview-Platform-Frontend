import React from 'react';

const DashboardLoader = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px'
  }}>
    {/* Ring spinner */}
    <div style={{ position: 'relative', width: '64px', height: '64px' }}>
      <div style={{
        position: 'absolute', inset: 0,
        border: '5px solid #e9ecef',
        borderTop: '5px solid #39ab49',
        borderRadius: '50%',
        animation: 'dashSpin 0.9s linear infinite'
      }} />
      <div style={{
        position: 'absolute', inset: '10px',
        border: '4px solid transparent',
        borderTop: '4px solid #a78bfa',
        borderRadius: '50%',
        animation: 'dashSpin 1.4s linear infinite reverse'
      }} />
    </div>

    {/* Bouncing dots */}
    <div style={{ display: 'flex', gap: '8px' }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          width: '10px', height: '10px',
          borderRadius: '50%',
          background: '#39ab49',
          animation: `dashBounce 1.2s ease-in-out ${i * 0.15}s infinite`
        }} />
      ))}
    </div>

    <p style={{
      color: '#39ab49',
      fontSize: '15px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      margin: 0
    }}>
      Loading Dashboard...
    </p>

    <style>{`
      @keyframes dashSpin {
        to { transform: rotate(360deg); }
      }
      @keyframes dashBounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-10px); opacity: 1; }
      }
    `}</style>
  </div>
);

export default DashboardLoader;
