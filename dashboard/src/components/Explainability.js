import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Explainability({ action, onClose }) {
    if (!action)
        return null;
    const decision = action.decision || {};
    return (_jsxs("div", { style: {
            position: 'fixed',
            right: 0,
            top: 0,
            height: '100vh',
            width: '400px',
            backgroundColor: 'white',
            boxShadow: '-2px 0 10px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflowY: 'auto',
            animation: 'slideIn 0.3s ease-out'
        }, children: [_jsx("style", { children: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      ` }), _jsxs("div", { style: { padding: '20px', borderBottom: '1px solid #eee' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }, children: [_jsx("h3", { style: { margin: 0, fontSize: '18px', fontWeight: '600' }, children: "Why This Decision" }), _jsx("button", { onClick: onClose, style: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }, children: "\u00D7" })] }), _jsx("div", { style: { fontSize: '14px', color: '#888' }, children: new Date(action.timestamp * 1000).toLocaleString() })] }), _jsxs("div", { style: { padding: '20px' }, children: [_jsxs("section", { style: { marginBottom: '20px' }, children: [_jsx("h4", { style: { fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }, children: "Action" }), _jsxs("div", { style: { padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '14px' }, children: [_jsx("strong", { children: action.action }), " on ", action.vault_id] })] }), _jsxs("section", { style: { marginBottom: '20px' }, children: [_jsx("h4", { style: { fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }, children: "Decision Profile" }), _jsx("div", { style: { padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '14px' }, children: decision.profile || 'balanced' })] }), _jsxs("section", { style: { marginBottom: '20px' }, children: [_jsx("h4", { style: { fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }, children: "Confidence" }), _jsx("div", { style: {
                                    width: '100%',
                                    height: '24px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '12px',
                                    overflow: 'hidden'
                                }, children: _jsx("div", { style: {
                                        width: `${((decision.confidence || 0.7) * 100)}%`,
                                        height: '100%',
                                        backgroundColor: '#2196F3',
                                        transition: 'width 0.3s'
                                    } }) }), _jsxs("div", { style: { fontSize: '12px', color: '#888', marginTop: '5px' }, children: [((decision.confidence || 0.7) * 100).toFixed(0), "% confidence"] })] }), _jsxs("section", { style: { marginBottom: '20px' }, children: [_jsx("h4", { style: { fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }, children: "Rules Triggered" }), _jsx("div", { children: (decision.rules_triggered || []).map((rule, i) => (_jsxs("div", { style: {
                                        padding: '8px 12px',
                                        backgroundColor: '#e8f5e9',
                                        border: '1px solid #c8e6c9',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        marginBottom: '8px'
                                    }, children: ["\u2713 ", rule] }, i))) })] }), _jsxs("section", { style: { marginBottom: '20px' }, children: [_jsx("h4", { style: { fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }, children: "Metrics Snapshot" }), _jsx("div", { style: { padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '13px' }, children: decision.metrics_snapshot ? (_jsxs("div", { children: [_jsxs("div", { children: ["Yield: $", (decision.metrics_snapshot.yield_usd || 0).toFixed(2)] }), _jsxs("div", { children: ["Gas Cost: $", (decision.metrics_snapshot.gas_usd || 0).toFixed(2)] }), _jsxs("div", { children: ["APR Delta: ", (decision.metrics_snapshot.delta_pct || 0).toFixed(2), "%"] })] })) : ('No metrics available') })] }), _jsxs("section", { children: [_jsx("h4", { style: { fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }, children: "Agent Trace" }), _jsx("div", { children: (decision.agent_trace || []).map((trace, i) => (_jsxs("div", { style: {
                                        padding: '10px',
                                        backgroundColor: '#f9f9f9',
                                        border: '1px solid #eee',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        marginBottom: '8px'
                                    }, children: [_jsx("strong", { children: trace.agent }), " @ ", trace.ts, _jsx("div", { style: { color: '#888', marginTop: '4px' }, children: trace.message })] }, i))) })] })] })] }));
}
