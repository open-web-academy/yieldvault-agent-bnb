import React, { useState } from 'react';

interface ExplainabilityProps {
  action: any;
  onClose: () => void;
}

export function Explainability({ action, onClose }: ExplainabilityProps) {
  if (!action) return null;

  const decision = action.decision || {};

  return (
    <div style={{
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
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Why This Decision</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ fontSize: '14px', color: '#888' }}>
          {new Date(action.timestamp * 1000).toLocaleString()}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <section style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>Action</h4>
          <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '14px' }}>
            <strong>{action.action}</strong> on {action.vault_id}
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>Decision Profile</h4>
          <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '14px' }}>
            {decision.profile || 'balanced'}
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>Confidence</h4>
          <div style={{
            width: '100%',
            height: '24px',
            backgroundColor: '#e0e0e0',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((decision.confidence || 0.7) * 100)}%`,
              height: '100%',
              backgroundColor: '#2196F3',
              transition: 'width 0.3s'
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
            {((decision.confidence || 0.7) * 100).toFixed(0)}% confidence
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>Rules Triggered</h4>
          <div>
            {(decision.rules_triggered || []).map((rule: string, i: number) => (
              <div key={i} style={{
                padding: '8px 12px',
                backgroundColor: '#e8f5e9',
                border: '1px solid #c8e6c9',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '8px'
              }}>
                ✓ {rule}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>Metrics Snapshot</h4>
          <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '8px', fontSize: '13px' }}>
            {decision.metrics_snapshot ? (
              <div>
                <div>Yield: ${(decision.metrics_snapshot.yield_usd || 0).toFixed(2)}</div>
                <div>Gas Cost: ${(decision.metrics_snapshot.gas_usd || 0).toFixed(2)}</div>
                <div>APR Delta: {(decision.metrics_snapshot.delta_pct || 0).toFixed(2)}%</div>
              </div>
            ) : (
              'No metrics available'
            )}
          </div>
        </section>

        <section>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>Agent Trace</h4>
          <div>
            {(decision.agent_trace || []).map((trace: any, i: number) => (
              <div key={i} style={{
                padding: '10px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #eee',
                borderRadius: '6px',
                fontSize: '12px',
                marginBottom: '8px'
              }}>
                <strong>{trace.agent}</strong> @ {trace.ts}
                <div style={{ color: '#888', marginTop: '4px' }}>{trace.message}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
