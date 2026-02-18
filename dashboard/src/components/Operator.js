import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function Operator({ onActivate, isActive }) {
    const [selectedProfile, setSelectedProfile] = useState('balanced');
    const profiles = [
        {
            id: 'conservative',
            name: 'Conservative',
            desc: 'Safe, steady growth',
            details: 'Lower yields, minimal risk exposure'
        },
        {
            id: 'balanced',
            name: 'Balanced',
            desc: 'Moderate risk, good yields',
            details: 'Optimal risk-reward balance'
        },
        {
            id: 'aggressive',
            name: 'Aggressive',
            desc: 'High-yield strategies',
            details: 'Maximum yield, higher volatility'
        }
    ];
    return (_jsx("div", { className: "card hero-card", children: _jsxs("div", { className: "hero-content", children: [_jsx("div", { className: "hero-title", children: "AI Yield Operator" }), _jsx("div", { className: "hero-subtitle", children: "Let autonomous AI manage your DeFi yield strategies with data-driven decision making." }), _jsxs("div", { className: "profile-selector", children: [_jsx("label", { className: "profile-label", children: "Risk Profile" }), _jsx("div", { className: "profile-pills", children: profiles.map(profile => (_jsxs("button", { className: `profile-pill ${selectedProfile === profile.id ? 'active' : ''}`, onClick: () => setSelectedProfile(profile.id), title: profile.details, children: [_jsx("div", { className: "profile-pill-name", children: profile.name }), _jsx("div", { className: "profile-pill-desc", children: profile.desc })] }, profile.id))) })] }), _jsx("button", { onClick: () => onActivate(selectedProfile), disabled: isActive, className: "btn-primary", children: isActive ? '✓ Agent Active' : 'Activate AI Agent' }), isActive && (_jsxs("div", { className: "activation-message", children: ["\u2713 Agent is running autonomously. Executing strategies every 60 seconds with ", selectedProfile, " risk profile."] }))] }) }));
}
