import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function AgentTeam({ isActive, lastCycle }) {
    const agents = [
        { name: 'Strategy', role: 'Monitors vaults & APRs', status: isActive ? 'active' : 'idle' },
        { name: 'Risk', role: 'Applies risk profile', status: isActive ? 'active' : 'idle' },
        { name: 'Execution', role: 'Sends transactions', status: lastCycle ? 'executed' : 'ready' },
        { name: 'Learning', role: 'Optimizes parameters', status: 'learning' },
        { name: 'Narrator', role: 'Explains decisions', status: 'ready' }
    ];
    return (_jsxs("div", { style: { padding: '20px', backgroundColor: '#fff', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }, children: [_jsx("h3", { style: { margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }, children: "Agent Team" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }, children: agents.map((agent, i) => {
                    const statusColors = {
                        active: '#4CAF50',
                        idle: '#ccc',
                        executed: '#2196F3',
                        learning: '#FF9800',
                        ready: '#757575'
                    };
                    return (_jsxs("div", { style: {
                            padding: '12px',
                            backgroundColor: '#f9f9f9',
                            border: '1px solid #eee',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${statusColors[agent.status]}`
                        }, children: [_jsx("div", { style: { fontWeight: '600', fontSize: '14px' }, children: agent.name }), _jsx("div", { style: { fontSize: '12px', color: '#888', marginTop: '4px' }, children: agent.role }), _jsx("div", { style: {
                                    marginTop: '8px',
                                    display: 'inline-block',
                                    padding: '4px 8px',
                                    backgroundColor: `${statusColors[agent.status]}20`,
                                    color: statusColors[agent.status],
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '600'
                                }, children: agent.status.toUpperCase() })] }, i));
                }) })] }));
}
