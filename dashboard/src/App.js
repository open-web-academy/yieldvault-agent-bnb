import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './App.css';
export default function App() {
    const [records, setRecords] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [status, setStatus] = useState('Connecting...');
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const apiBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001';
                const res = await fetch(`${apiBase}/api/logs`);
                const data = await res.json();
                // Ensure data is valid
                const validData = Array.isArray(data) ? data.filter((r) => r && r.action) : [];
                setRecords(validData.slice(-20));
                // Calculate metrics safely
                if (validData.length > 0) {
                    const harvested = validData
                        .filter((r) => r.action && typeof r.action === 'string' && r.action.includes('HARVEST'))
                        .reduce((sum, r) => sum + (parseFloat(r.rewards_usd) || 0), 0);
                    const compounded = validData
                        .filter((r) => r.action && typeof r.action === 'string' && r.action.includes('COMPOUND'))
                        .reduce((sum, r) => sum + (parseFloat(r.rewards_usd) || 0), 0);
                    const vaultsMap = validData.reduce((acc, r) => {
                        const vaultId = r.vault_id || r.vault || 'unknown';
                        if (!acc[vaultId])
                            acc[vaultId] = { actions: 0, rewards: 0 };
                        acc[vaultId].actions += 1;
                        acc[vaultId].rewards += parseFloat(r.rewards_usd) || 0;
                        return acc;
                    }, {});
                    setMetrics({
                        totalHarvested: harvested,
                        totalCompounded: compounded,
                        realizedAPR: compounded > 0 ? ((compounded / 1000) * 365 * 100).toFixed(2) : '0',
                        vaults: vaultsMap
                    });
                }
                setStatus('Live');
            }
            catch (err) {
                console.error('Error fetching logs:', err);
                setStatus('Error connecting to API');
            }
        };
        fetchRecords();
        const interval = setInterval(fetchRecords, 30000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { className: "app", style: { padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }, children: [_jsx("h1", { children: "\uD83C\uDF3E DeFi Yield Farming Agent" }), _jsxs("div", { style: { marginBottom: '20px', padding: '15px', backgroundColor: status === 'Live' ? '#e8f5e9' : '#fff3cd', borderRadius: '8px' }, children: [_jsx("strong", { children: "Status:" }), " ", status] }), metrics && (_jsxs("div", { style: { marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }, children: [_jsxs("div", { style: { padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '12px', color: '#666' }, children: "Total Harvested" }), _jsxs("div", { style: { fontSize: '24px', fontWeight: 'bold' }, children: ["$", metrics.totalHarvested?.toFixed(2) || '0.00'] })] }), _jsxs("div", { style: { padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '12px', color: '#666' }, children: "Total Compounded" }), _jsxs("div", { style: { fontSize: '24px', fontWeight: 'bold' }, children: ["$", metrics.totalCompounded?.toFixed(2) || '0.00'] })] }), _jsxs("div", { style: { padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }, children: [_jsx("div", { style: { fontSize: '12px', color: '#666' }, children: "Realized APR" }), _jsxs("div", { style: { fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }, children: [typeof metrics.realizedAPR === 'string' ? metrics.realizedAPR : metrics.realizedAPR.toFixed(2), "%"] })] })] })), _jsx("h2", { children: "Recent Actions (Last 20)" }), _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: '#f5f5f5' }, children: [_jsx("th", { style: { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }, children: "Time" }), _jsx("th", { style: { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }, children: "Vault" }), _jsx("th", { style: { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }, children: "Action" }), _jsx("th", { style: { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }, children: "Status" }), _jsx("th", { style: { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }, children: "Rewards" }), _jsx("th", { style: { padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }, children: "TX Hash" })] }) }), _jsx("tbody", { children: records && records.length > 0 ? records.map((r, i) => (_jsxs("tr", { style: { borderBottom: '1px solid #eee' }, title: r?.error ? `Error: ${r.error}` : '', children: [_jsx("td", { style: { padding: '10px' }, children: r && r.timestamp ? new Date(r.timestamp * 1000).toLocaleTimeString() : '-' }), _jsx("td", { style: { padding: '10px' }, title: r?.vault_name || '', children: r && (r.vault_id || r.vault) ? String(r.vault_id || r.vault).slice(0, 25) : 'unknown' }), _jsx("td", { style: { padding: '10px' }, children: _jsx("strong", { style: {
                                            color: r && r.action && typeof r.action === 'string' && r.action.includes('COMPOUND') ? '#2e7d32' :
                                                r && r.action && typeof r.action === 'string' && r.action.includes('HARVEST') ? '#1976d2' : '#666'
                                        }, children: r?.action || 'UNKNOWN' }) }), _jsxs("td", { style: { padding: '10px' }, children: [_jsx("span", { style: {
                                                backgroundColor: r?.status === 'error' ? '#ffebee' : '#e8f5e9',
                                                color: r?.status === 'error' ? '#c62828' : '#2e7d32',
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }, children: r?.status === 'error' ? '❌ ERROR' : r?.status === 'success' ? '✅ SUCCESS' : r?.status || '—' }), r?.error && _jsxs("div", { style: { fontSize: '10px', color: '#c62828', marginTop: '2px' }, children: [r.error.slice(0, 40), "..."] })] }), _jsx("td", { style: { padding: '10px' }, children: r && r.rewards_usd ? '$' + parseFloat(String(r.rewards_usd)).toFixed(2) : '-' }), _jsx("td", { style: { padding: '10px' }, children: r && r.tx_hash && String(r.tx_hash) !== 'null' && String(r.tx_hash) !== '0x' ? (_jsxs("a", { href: `https://testnet.bscscan.com/tx/${r.tx_hash}`, target: "_blank", rel: "noopener noreferrer", style: { color: '#0066cc', textDecoration: 'none', fontSize: '12px' }, children: [String(r.tx_hash).slice(0, 10), "..."] })) : (_jsx("span", { style: { color: '#999' }, children: "-" })) })] }, i))) : (_jsx("tr", { children: _jsx("td", { colSpan: 6, style: { padding: '20px', textAlign: 'center', color: '#999' }, children: "No logs available yet" }) })) })] })] }));
}
