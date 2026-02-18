import React from 'react';

interface AgentTeamProps {
  isActive: boolean;
  lastCycle: any;
}

export function AgentTeam({ isActive, lastCycle }: AgentTeamProps) {
  const agents = [
    { name: 'Strategy', role: 'Monitors vaults & APRs', status: isActive ? 'active' : 'idle' },
    { name: 'Risk', role: 'Applies risk profile', status: isActive ? 'active' : 'idle' },
    { name: 'Execution', role: 'Sends transactions', status: lastCycle ? 'executed' : 'ready' },
    { name: 'Learning', role: 'Optimizes parameters', status: 'learning' },
    { name: 'Narrator', role: 'Explains decisions', status: 'ready' }
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Agent Team</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {agents.map((agent, i) => {
          const statusColors = {
            active: '#4CAF50',
            idle: '#ccc',
            executed: '#2196F3',
            learning: '#FF9800',
            ready: '#757575'
          };
          
          return (
            <div key={i} style={{
              padding: '12px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #eee',
              borderRadius: '8px',
              borderLeft: `4px solid ${statusColors[agent.status as keyof typeof statusColors]}`
            }}>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{agent.name}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{agent.role}</div>
              <div style={{
                marginTop: '8px',
                display: 'inline-block',
                padding: '4px 8px',
                backgroundColor: `${statusColors[agent.status as keyof typeof statusColors]}20`,
                color: statusColors[agent.status as keyof typeof statusColors],
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {agent.status.toUpperCase()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
