import React from 'react';

export default function Spinner({ size = 36, center = true }) {
  const el = (
    <div
      style={{
        width: size,
        height: size,
        border: `3px solid var(--border)`,
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );
  return center ? <div className="loading-center">{el}</div> : el;
}
