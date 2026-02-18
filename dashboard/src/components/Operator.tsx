import React, { useState } from 'react';

interface OperatorProps {
  onActivate: (profile: string) => void;
  isActive: boolean;
}

export function Operator({ onActivate, isActive }: OperatorProps) {
  const [selectedProfile, setSelectedProfile] = useState('balanced');
  
  const profiles = [
    { 
      id: 'conservative', 
      name: 'Conservative', 
      desc: 'Safe, steady growth',
      details: 'Lower yields, minimal risk exposure'
    },
    { 
      id: 'balanced', 
      name: 'Balanced', 
      desc: 'Moderate risk, good yields',
      details: 'Optimal risk-reward balance'
    },
    { 
      id: 'aggressive', 
      name: 'Aggressive', 
      desc: 'High-yield strategies',
      details: 'Maximum yield, higher volatility'
    }
  ];

  return (
    <div className="card hero-card">
      <div className="hero-content">
        <div className="hero-title">AI Yield Operator</div>
        <div className="hero-subtitle">
          Let autonomous AI manage your DeFi yield strategies with data-driven decision making.
        </div>

        <div className="profile-selector">
          <label className="profile-label">Risk Profile</label>
          <div className="profile-pills">
            {profiles.map(profile => (
              <button
                key={profile.id}
                className={`profile-pill ${selectedProfile === profile.id ? 'active' : ''}`}
                onClick={() => setSelectedProfile(profile.id)}
                title={profile.details}
              >
                <div className="profile-pill-name">{profile.name}</div>
                <div className="profile-pill-desc">{profile.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onActivate(selectedProfile)}
          disabled={isActive}
          className="btn-primary"
        >
          {isActive ? '✓ Agent Active' : 'Activate AI Agent'}
        </button>

        {isActive && (
          <div className="activation-message">
            ✓ Agent is running autonomously. Executing strategies every 60 seconds with {selectedProfile} risk profile.
          </div>
        )}
      </div>
    </div>
  );
}
