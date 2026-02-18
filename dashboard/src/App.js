import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Operator } from './components/Operator';
import { AgentTeam } from './components/AgentTeam';
import { ActivityFeed } from './components/ActivityFeed';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { Explainability } from './components/Explainability';
import './design-system.css';
export default function App() {
    const [records, setRecords] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [status, setStatus] = useState('Connecting...');
    const [isActive, setIsActive] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [activeTab, setActiveTab] = useState('operator');
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
    const getLastDecisionTime = () => {
        if (records.length > 0) {
            return records[records.length - 1].timestamp;
        }
        return undefined;
    };
    const successCount = records.filter(r => r.status === 'success').length;
    const successRate = records.length > 0 ? (successCount / records.length) * 100 : 0;
    return (_jsxs("div", { className: "app-container", children: [_jsx(Sidebar, { activeTab: activeTab, onTabChange: setActiveTab }), _jsxs("div", { className: "main-content", children: [_jsx(Topbar, { status: status, isActive: isActive, lastDecisionTime: getLastDecisionTime() }), _jsxs("div", { className: "main-panel", children: [_jsx(Operator, { onActivate: (profile) => {
                                    setIsActive(true);
                                    console.log(`Agent activated with ${profile} profile`);
                                }, isActive: isActive }), _jsx(AgentTeam, { isActive: isActive, lastCycle: records[records.length - 1] }), metrics && (_jsx(PerformanceMetrics, { totalHarvested: metrics.totalHarvested, totalCompounded: metrics.totalCompounded, realizedAPR: metrics.realizedAPR, successRate: successRate, totalActions: records.length })), _jsx(ActivityFeed, { records: records, onSelectAction: setSelectedAction })] })] }), selectedAction && (_jsxs("div", { children: [_jsx("div", { style: {
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            zIndex: 999
                        }, onClick: () => setSelectedAction(null) }), _jsx(Explainability, { action: selectedAction, onClose: () => setSelectedAction(null) })] }))] }));
}
