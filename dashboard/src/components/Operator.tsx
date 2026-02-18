import React, { useState } from 'react';

interface OperatorProps {
  onActivate: (profile: string) => void;
  isActive: boolean;
}

export function Operator({ onActivate, isActive }: OperatorProps) {
  const [selectedProfile, setSelectedProfile] = useState('balanced');
  
  const profiles = [
    { id: 'conservative', name: 'Conservative', desc: 'Safe, steady growth', color: '#4CAF50' },
    { id: 'balanced', name: 'Balanced', desc: 'Moderate risk, good yields', color: '#2196F3' },
    { id: 'aggressive', name: 'Aggressive', desc: 'High-yield, higher risk', color: '#FF9800' }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Operator Panel</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', color: '#666', fontWeight: '500' }}>
          Risk Profile
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile.id)}
              style={{
                padding: '12px',
                border: selectedProfile === profile.id ? `2px solid ${profile.color}` : '2px solid #ddd',
                backgroundColor: selectedProfile === profile.id ? `${profile.color}10` : '#f9f9f9',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{profile.name}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{profile.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onActivate(selectedProfile)}
        disabled={isActive}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: isActive ? '#ccc' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: isActive ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {isActive ? '✓ Agent Active' : 'Activate Agent'}
      </button>

      {isActive && (
        <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '8px', color: '#2e7d32', fontSize: '14px' }}>
          Agent is running. Executing every 60 seconds.
        </div>
      )}
    </div>
  );
}
