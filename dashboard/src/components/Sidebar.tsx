import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    { id: 'operator', label: 'Operator', icon: '⚙️' },
    { id: 'activity', label: 'Live Activity', icon: '⚡' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '🔧' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">⚡ ClawTrade</div>
        <div className="sidebar-tagline">AI DeFi Operator</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ padding: '24px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-dark)', marginBottom: '8px' }}>
          💾 SYSTEM STATUS
        </div>
        <div style={{ padding: '12px', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', fontSize: '11px' }}>
          <div style={{ marginBottom: '6px' }}>Uptime: 18h 32m</div>
          <div>Actions: 847</div>
        </div>
      </div>
    </div>
  );
}
