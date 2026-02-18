import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function AgentTeam({ isActive, lastCycle }) {
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
    return (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h3", { className: "card-title", children: "Agent Team" }), _jsxs("span", { style: { fontSize: '12px', color: 'var(--text-muted)' }, children: [agents.filter(a => a.status === 'active').length, " Active"] })] }), _jsx("div", { className: "agent-team-grid", children: agents.map((agent, i) => (_jsxs("div", { className: `agent-card status-${agent.status}`, children: [_jsxs("div", { className: "agent-header", children: [_jsx("div", { className: "agent-icon", children: agent.icon }), _jsxs("div", { children: [_jsx("div", { className: "agent-name", children: agent.name }), _jsx("div", { className: "agent-role", children: agent.role })] })] }), _jsx("div", { className: "agent-message", children: agent.message }), _jsxs("div", { className: `agent-status ${agent.status}`, children: [agent.status === 'active' && '⚡ Active', agent.status === 'idle' && '⏸️ Idle', agent.status === 'executing' && '🔄 Executing', agent.status === 'learning' && '📚 Learning'] })] }, i))) })] }));
}
