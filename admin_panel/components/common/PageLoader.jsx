import React from 'react';

const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px',
      width: '100%',
      gap: '16px'
    }}>
      {/* Spinner */}
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #e9ecef',
        borderTop: '4px solid #39ab49',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />

      {/* Dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#39ab49',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>

      <p style={{
        color: '#6c757d',
        fontSize: '14px',
        fontWeight: '500',
        margin: 0
      }}>
        {message}
      </p>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
