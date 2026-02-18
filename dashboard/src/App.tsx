import { useState, useEffect } from 'react'
import { Operator } from './components/Operator'
import { AgentTeam } from './components/AgentTeam'
import { Explainability } from './components/Explainability'
import './App.css'

interface ExecutionRecord {
  timestamp: number
  action: string
  vault_id?: string
  vault?: string
  vault_name?: string
  tx_hash?: string
  confidence?: number
  rewards_usd?: number | string
  cycle?: number
  status?: string
  error?: string
  decision?: any
}

interface PerformanceMetrics {
  totalHarvested: number
  totalCompounded: number
  realizedAPR: number | string
  vaults: Record<string, any>
}

export default function App() {
  const [records, setRecords] = useState<ExecutionRecord[]>([])
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [status, setStatus] = useState('Connecting...')
  const [isActive, setIsActive] = useState(false)
  const [selectedAction, setSelectedAction] = useState<ExecutionRecord | null>(null)

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const apiBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'
        const res = await fetch(`${apiBase}/api/logs`)
        const data = await res.json()
        
        const validData = Array.isArray(data) ? data.filter((r: any) => r && r.action) : []
        setRecords(validData.slice(-20))
        
        if (validData.length > 0) {
          const harvested = validData
            .filter((r: any) => r.action?.includes('HARVEST'))
            .reduce((sum: number, r: any) => sum + (parseFloat(String(r.rewards_usd)) || 0), 0)
          
          const compounded = validData
            .filter((r: any) => r.action?.includes('COMPOUND'))
            .reduce((sum: number, r: any) => sum + (parseFloat(String(r.rewards_usd)) || 0), 0)
          
          setMetrics({
            totalHarvested: harvested,
            totalCompounded: compounded,
            realizedAPR: compounded > 0 ? ((compounded / 1000) * 365 * 100).toFixed(2) : '0',
            vaults: validData.reduce((acc: any, r: any) => {
              const id = r.vault_id || r.vault || 'unknown'
              if (!acc[id]) acc[id] = { actions: 0, rewards: 0 }
              acc[id].actions += 1
              acc[id].rewards += parseFloat(String(r.rewards_usd)) || 0
              return acc
            }, {})
          })
        }
        setStatus('Live')
      } catch (err) {
        console.error('Error:', err)
        setStatus('Error')
      }
    }
    fetchRecords()
    const interval = setInterval(fetchRecords, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>ClawTrade-BNB</h1>
          <div style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
            Autonomous DeFi Trading Agent • Status: <span style={{ color: status === 'Live' ? '#4CAF50' : '#f44336' }}>● {status}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          {/* Sidebar */}
          <div>
            <Operator onActivate={(profile) => {
              setIsActive(true)
              console.log(`Agent activated with ${profile} profile`)
            }} isActive={isActive} />
            
            <AgentTeam isActive={isActive} lastCycle={records[records.length - 1]} />

            {/* Metrics Cards */}
            <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#666', fontWeight: '600' }}>Performance</h4>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Total Harvested</div>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>${metrics?.totalHarvested?.toFixed(2) || '0.00'}</div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Realized APR</div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: '#2196F3' }}>
                  {typeof metrics?.realizedAPR === 'string' ? metrics.realizedAPR : (metrics?.realizedAPR as any)?.toFixed(2)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Total Actions</div>
                <div style={{ fontSize: '20px', fontWeight: '600' }}>{records.length}</div>
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div>
            <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>Recent Actions</h3>
              
              {records.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  Waiting for first action...
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Time</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Action</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666' }}>TX</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px', fontSize: '13px' }}>
                          {new Date(r.timestamp * 1000).toLocaleTimeString()}
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px', fontWeight: '500' }}>
                          {r.action}
                          {r.vault_id && <div style={{ fontSize: '11px', color: '#888' }}>{r.vault_id}</div>}
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>
                          <button
                            onClick={() => setSelectedAction(r)}
                            style={{
                              padding: '4px 12px',
                              backgroundColor: r.status === 'success' ? '#e8f5e9' : r.status === 'error' ? '#ffebee' : '#e3f2fd',
                              color: r.status === 'success' ? '#2e7d32' : r.status === 'error' ? '#c62828' : '#1976d2',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            {r.status === 'success' ? '✓ SUCCESS' : r.status === 'error' ? '✗ ERROR' : '→ SUGGESTED'}
                            <div style={{ fontSize: '10px', marginTop: '2px' }}>Why?</div>
                          </button>
                        </td>
                        <td style={{ padding: '12px', fontSize: '13px' }}>
                          {r.tx_hash && r.tx_hash !== 'null' ? (
                            <a href={`https://testnet.bscscan.com/tx/${r.tx_hash}`} target="_blank" rel="noreferrer" style={{ color: '#2196F3', textDecoration: 'none' }}>
                              {String(r.tx_hash).slice(0, 10)}...
                            </a>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Explainability Drawer */}
      {selectedAction && (
        <Explainability action={selectedAction} onClose={() => setSelectedAction(null)} />
      )}
    </div>
  )
}
