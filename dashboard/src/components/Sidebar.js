import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Sidebar({ activeTab, onTabChange }) {
    const navItems = [
        { id: 'operator', label: 'Operator', icon: '⚙️' },
        { id: 'activity', label: 'Live Activity', icon: '⚡' },
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'settings', label: 'Settings', icon: '🔧' }
    ];
    return (_jsxs("div", { className: "sidebar", children: [_jsxs("div", { className: "sidebar-header", children: [_jsx("div", { className: "sidebar-logo", children: "\u26A1 ClawTrade" }), _jsx("div", { className: "sidebar-tagline", children: "AI DeFi Operator" })] }), _jsx("nav", { className: "sidebar-nav", children: navItems.map(item => (_jsxs("button", { className: `nav-item ${activeTab === item.id ? 'active' : ''}`, onClick: () => onTabChange(item.id), children: [_jsx("span", { className: "nav-icon", children: item.icon }), _jsx("span", { children: item.label })] }, item.id))) }), _jsxs("div", { style: { padding: '24px 12px', borderTop: '1px solid var(--border)' }, children: [_jsx("div", { style: { fontSize: '12px', color: 'var(--text-dark)', marginBottom: '8px' }, children: "\uD83D\uDCBE SYSTEM STATUS" }), _jsxs("div", { style: { padding: '12px', backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius-md)', fontSize: '11px' }, children: [_jsx("div", { style: { marginBottom: '6px' }, children: "Uptime: 18h 32m" }), _jsx("div", { children: "Actions: 847" })] })] })] }));
}
