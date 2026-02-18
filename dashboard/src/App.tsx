import { useState, useEffect } from 'react'
import './App.css'

interface ExecutionRecord {
  timestamp: number
  action: string
  vault_id: string
  vault_name?: string
  state_hash: string
  tx_hash?: string
  confidence?: number
  net_apr?: number
  rewards_usd?: number
  cycle?: number
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

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const apiBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'
        const res = await fetch(`${apiBase}/api/logs`)
        const data = await res.json()
        setRecords(Array.isArray(data) ? data.slice(-20) : [])
        
        // Calculate metrics
        if (Array.isArray(data) && data.length > 0) {
          const harvested = data.filter((r: any) => r.action?.includes('HARVEST')).reduce((sum: number, r: any) => sum + (r.rewards_usd || 0), 0)
          const compounded = data.filter((r: any) => r.action?.includes('COMPOUND')).reduce((sum: number, r: any) => sum + (r.rewards_usd || 0), 0)
          setMetrics({
            totalHarvested: harvested,
            totalCompounded: compounded,
            realizedAPR: compounded > 0 ? ((compounded / 1000) * 365 * 100).toFixed(2) : '0',
            vaults: data.reduce((acc: any, r: any) => {
              if (!acc[r.vault_id]) acc[r.vault_id] = { actions: 0, rewards: 0 }
              acc[r.vault_id].actions += 1
              acc[r.vault_id].rewards += r.rewards_usd || 0
              return acc
            }, {})
          })
        }
        setStatus('Live')
      } catch (err) {
        console.error('Error fetching logs:', err)
        setStatus('Error connecting to API')
      }
    }
    fetchRecords()
    const interval = setInterval(fetchRecords, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app" style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>🌾 DeFi Yield Farming Agent</h1>
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: status === 'Live' ? '#e8f5e9' : '#fff3cd', borderRadius: '8px' }}>
        <strong>Status:</strong> {status}
      </div>

      {metrics && (
        <div style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Harvested</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${metrics.totalHarvested?.toFixed(2) || '0.00'}</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Compounded</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${metrics.totalCompounded?.toFixed(2) || '0.00'}</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', color: '#666' }}>Realized APR</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>{typeof metrics.realizedAPR === 'string' ? metrics.realizedAPR : (metrics.realizedAPR as any).toFixed(2)}%</div>
          </div>
        </div>
      )}

      <h2>Recent Actions (Last 20)</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Time</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Vault</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Action</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Rewards</th>
            <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>TX Hash</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{new Date(r.timestamp * 1000).toLocaleTimeString()}</td>
              <td style={{ padding: '10px' }} title={r.vault_name}>{r.vault_id.slice(0, 25)}</td>
              <td style={{ padding: '10px' }}><strong style={{ color: r.action?.includes('COMPOUND') ? '#2e7d32' : r.action?.includes('HARVEST') ? '#1976d2' : '#666' }}>{r.action}</strong></td>
              <td style={{ padding: '10px' }}>{r.rewards_usd ? '$' + r.rewards_usd.toFixed(2) : '-'}</td>
              <td style={{ padding: '10px' }}>
                {r.tx_hash && r.tx_hash !== 'null' ? (
                  <a 
                    href={`https://testnet.bscscan.com/tx/${r.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0066cc', textDecoration: 'none', fontSize: '12px' }}
                  >
                    {r.tx_hash.slice(0, 10)}...
                  </a>
                ) : (
                  <span style={{ color: '#999' }}>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
