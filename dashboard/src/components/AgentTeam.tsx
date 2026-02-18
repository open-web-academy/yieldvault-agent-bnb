import React from 'react';

interface AgentTeamProps {
  isActive: boolean;
  lastCycle: any;
}

export function AgentTeam({ isActive, lastCycle }: AgentTeamProps) {
  const agents = [
    { 
      name: 'Strategy', 
      icon: '🧠',
      role: 'Vault Monitor',
      message: 'Analyzing APR deltas...', 
      status: isActive ? 'active' : 'idle'
    },
    { 
      name: 'Risk', 
      icon: '⚖️',
      role: 'Risk Manager',
      message: 'Validating risk profile...', 
      status: isActive ? 'active' : 'idle'
    },
    { 
      name: 'Execution', 
      icon: '⚡',
      role: 'TX Processor',
      message: lastCycle ? 'Transaction sent...' : 'Ready',
      status: lastCycle ? 'executing' : 'idle'
    },
    { 
      name: 'Learning', 
      icon: '📈',
      role: 'Optimizer',
      message: 'Training models...', 
      status: 'learning'
    },
    { 
      name: 'Narrator', 
      icon: '📝',
      role: 'Explainer',
      message: 'Generating insights...', 
      status: 'idle'
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Agent Team</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {agents.filter(a => a.status === 'active').length} Active
        </span>
      </div>
      <div className="agent-team-grid">
        {agents.map((agent, i) => (
          <div key={i} className={`agent-card status-${agent.status}`}>
            <div className="agent-header">
              <div className="agent-icon">{agent.icon}</div>
              <div>
                <div className="agent-name">{agent.name}</div>
                <div className="agent-role">{agent.role}</div>
              </div>
            </div>
            <div className="agent-message">{agent.message}</div>
            <div className={`agent-status ${agent.status}`}>
              {agent.status === 'active' && '⚡ Active'}
              {agent.status === 'idle' && '⏸️ Idle'}
              {agent.status === 'executing' && '🔄 Executing'}
              {agent.status === 'learning' && '📚 Learning'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
