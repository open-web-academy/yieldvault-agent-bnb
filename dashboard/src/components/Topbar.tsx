import React from 'react';

interface TopbarProps {
  status: string;
  isActive: boolean;
  lastDecisionTime?: number;
}

export function Topbar({ status, isActive, lastDecisionTime }: TopbarProps) {
  const getStatusColor = () => {
    return isActive ? 'var(--success)' : 'var(--text-muted)';
  };

  const getLastDecisionText = () => {
    if (!lastDecisionTime) return 'Never';
    const now = Date.now() / 1000;
    const secondsAgo = Math.round(now - lastDecisionTime);
    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    if (secondsAgo < 3600) return `${Math.round(secondsAgo / 60)}m ago`;
    return `${Math.round(secondsAgo / 3600)}h ago`;
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className={`topbar-badge ${isActive ? 'status-running' : 'status-paused'}`}>
          <div className={`status-indicator ${!isActive ? 'paused' : ''}`}></div>
          <span>{isActive ? '🟢 Autonomous Mode Active' : '🟡 Paused'}</span>
        </div>

        <div className="topbar-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)', color: 'var(--primary-light)' }}>
          <span>🌐 BNB Testnet</span>
        </div>

        <div className="topbar-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: 'var(--warning)' }}>
          <span>⏱️ Last Decision: {getLastDecisionText()}</span>
        </div>
      </div>

      <div className="topbar-right">
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Status: <span style={{ color: getStatusColor(), fontWeight: '600' }}>{status}</span>
        </div>
      </div>
    </div>
  );
}
