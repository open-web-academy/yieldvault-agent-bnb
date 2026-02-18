import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Operator } from './components/Operator';
import { AgentTeam } from './components/AgentTeam';
import { Explainability } from './components/Explainability';
import './App.css';
export default function App() {
    const [records, setRecords] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [status, setStatus] = useState('Connecting...');
    const [isActive, setIsActive] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const apiBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
                const res = await fetch(`${apiBase}/api/logs`);
                const data = await res.json();
                const validData = Array.isArray(data) ? data.filter((r) => r && r.action) : [];
                setRecords(validData.slice(-20));
                if (validData.length > 0) {
                    const harvested = validData
                        .filter((r) => r.action?.includes('HARVEST'))
                        .reduce((sum, r) => sum + (parseFloat(String(r.rewards_usd)) || 0), 0);
                    const compounded = validData
                        .filter((r) => r.action?.includes('COMPOUND'))
                        .reduce((sum, r) => sum + (parseFloat(String(r.rewards_usd)) || 0), 0);
                    setMetrics({
                        totalHarvested: harvested,
                        totalCompounded: compounded,
                        realizedAPR: compounded > 0 ? ((compounded / 1000) * 365 * 100).toFixed(2) : '0',
                        vaults: validData.reduce((acc, r) => {
                            const id = r.vault_id || r.vault || 'unknown';
                            if (!acc[id])
                                acc[id] = { actions: 0, rewards: 0 };
                            acc[id].actions += 1;
                            acc[id].rewards += parseFloat(String(r.rewards_usd)) || 0;
                            return acc;
                        }, {})
                    });
                }
                setStatus('Live');
            }
            catch (err) {
                console.error('Error:', err);
                setStatus('Error');
            }
        };
        fetchRecords();
        const interval = setInterval(fetchRecords, 30000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { style: { minHeight: '100vh', backgroundColor: '#f5f5f5' }, children: [_jsx("header", { style: { backgroundColor: '#fff', borderBottom: '1px solid #eee', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }, children: _jsxs("div", { style: { maxWidth: '1200px', margin: '0 auto' }, children: [_jsx("h1", { style: { margin: 0, fontSize: '24px', fontWeight: '600' }, children: "ClawTrade-BNB" }), _jsxs("div", { style: { fontSize: '14px', color: '#888', marginTop: '4px' }, children: ["Autonomous DeFi Trading Agent \u2022 Status: ", _jsxs("span", { style: { color: status === 'Live' ? '#4CAF50' : '#f44336' }, children: ["\u25CF ", status] })] })] }) }), _jsx("main", { style: { maxWidth: '1200px', margin: '0 auto', padding: '20px' }, children: _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }, children: [_jsxs("div", { children: [_jsx(Operator, { onActivate: (profile) => {
                                        setIsActive(true);
                                        console.log(`Agent activated with ${profile} profile`);
                                    }, isActive: isActive }), _jsx(AgentTeam, { isActive: isActive, lastCycle: records[records.length - 1] }), _jsxs("div", { style: { padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }, children: [_jsx("h4", { style: { margin: '0 0 15px 0', fontSize: '14px', color: '#666', fontWeight: '600' }, children: "Performance" }), _jsxs("div", { style: { marginBottom: '15px' }, children: [_jsx("div", { style: { fontSize: '12px', color: '#888', marginBottom: '4px' }, children: "Total Harvested" }), _jsxs("div", { style: { fontSize: '20px', fontWeight: '600' }, children: ["$", metrics?.totalHarvested?.toFixed(2) || '0.00'] })] }), _jsxs("div", { style: { marginBottom: '15px' }, children: [_jsx("div", { style: { fontSize: '12px', color: '#888', marginBottom: '4px' }, children: "Realized APR" }), _jsxs("div", { style: { fontSize: '20px', fontWeight: '600', color: '#2196F3' }, children: [typeof metrics?.realizedAPR === 'string' ? metrics.realizedAPR : metrics?.realizedAPR?.toFixed(2), "%"] })] }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: '12px', color: '#888', marginBottom: '4px' }, children: "Total Actions" }), _jsx("div", { style: { fontSize: '20px', fontWeight: '600' }, children: records.length })] })] })] }), _jsx("div", { children: _jsxs("div", { style: { padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }, children: [_jsx("h3", { style: { margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }, children: "Recent Actions" }), records.length === 0 ? (_jsx("div", { style: { padding: '40px', textAlign: 'center', color: '#999' }, children: "Waiting for first action..." })) : (_jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }, children: [_jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }, children: "Time" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }, children: "Action" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }, children: "Status" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }, children: "TX" })] }) }), _jsx("tbody", { children: records.map((r, i) => (_jsxs("tr", { style: { borderBottom: '1px solid #eee' }, children: [_jsx("td", { style: { padding: '12px', fontSize: '13px' }, children: new Date(r.timestamp * 1000).toLocaleTimeString() }), _jsxs("td", { style: { padding: '12px', fontSize: '13px', fontWeight: '500' }, children: [r.action, r.vault_id && _jsx("div", { style: { fontSize: '11px', color: '#888' }, children: r.vault_id })] }), _jsx("td", { style: { padding: '12px', fontSize: '13px' }, children: _jsxs("button", { onClick: () => setSelectedAction(r), style: {
                                                                    padding: '4px 12px',
                                                                    backgroundColor: r.status === 'success' ? '#e8f5e9' : r.status === 'error' ? '#ffebee' : '#e3f2fd',
                                                                    color: r.status === 'success' ? '#2e7d32' : r.status === 'error' ? '#c62828' : '#1976d2',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    fontSize: '11px',
                                                                    fontWeight: '600',
                                                                    cursor: 'pointer'
                                                                }, children: [r.status === 'success' ? '✓ SUCCESS' : r.status === 'error' ? '✗ ERROR' : '→ SUGGESTED', _jsx("div", { style: { fontSize: '10px', marginTop: '2px' }, children: "Why?" })] }) }), _jsx("td", { style: { padding: '12px', fontSize: '13px' }, children: r.tx_hash && r.tx_hash !== 'null' ? (_jsxs("a", { href: `https://testnet.bscscan.com/tx/${r.tx_hash}`, target: "_blank", rel: "noreferrer", style: { color: '#2196F3', textDecoration: 'none' }, children: [String(r.tx_hash).slice(0, 10), "..."] })) : '-' })] }, i))) })] }))] }) })] }) }), selectedAction && (_jsx(Explainability, { action: selectedAction, onClose: () => setSelectedAction(null) }))] }));
}
