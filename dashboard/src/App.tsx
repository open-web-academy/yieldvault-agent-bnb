import { useState, useEffect } from 'react'
import './App.css'

interface ExecutionRecord {
  timestamp: number
  action: string
  vault_id?: string
  vault?: string
  vault_name?: string
  state_hash?: string
  tx_hash?: string
  confidence?: number
  net_apr?: number
  rewards_usd?: number | string
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
        
        // Ensure data is valid
        const validData = Array.isArray(data) ? data.filter((r: any) => r && r.action) : []
        setRecords(validData.slice(-20))
        
        // Calculate metrics safely
        if (validData.length > 0) {
          const harvested = validData
            .filter((r: any) => r.action && typeof r.action === 'string' && r.action.includes('HARVEST'))
            .reduce((sum: number, r: any) => sum + (parseFloat(r.rewards_usd) || 0), 0)
          
          const compounded = validData
            .filter((r: any) => r.action && typeof r.action === 'string' && r.action.includes('COMPOUND'))
            .reduce((sum: number, r: any) => sum + (parseFloat(r.rewards_usd) || 0), 0)
          
          const vaultsMap = validData.reduce((acc: any, r: any) => {
            const vaultId = r.vault_id || r.vault || 'unknown'
            if (!acc[vaultId]) acc[vaultId] = { actions: 0, rewards: 0 }
            acc[vaultId].actions += 1
            acc[vaultId].rewards += parseFloat(r.rewards_usd) || 0
            return acc
          }, {})
          
          setMetrics({
            totalHarvested: harvested,
            totalCompounded: compounded,
            realizedAPR: compounded > 0 ? ((compounded / 1000) * 365 * 100).toFixed(2) : '0',
            vaults: vaultsMap
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
          {records && records.length > 0 ? records.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>
                {r && r.timestamp ? new Date(r.timestamp * 1000).toLocaleTimeString() : '-'}
              </td>
              <td style={{ padding: '10px' }} title={r?.vault_name || ''}>
                {r && (r.vault_id || r.vault) ? String(r.vault_id || r.vault).slice(0, 25) : 'unknown'}
              </td>
              <td style={{ padding: '10px' }}>
                <strong style={{ 
                  color: r && r.action && typeof r.action === 'string' && r.action.includes('COMPOUND') ? '#2e7d32' : 
                         r && r.action && typeof r.action === 'string' && r.action.includes('HARVEST') ? '#1976d2' : '#666' 
                }}>
                  {r?.action || 'UNKNOWN'}
                </strong>
              </td>
              <td style={{ padding: '10px' }}>
                {r && r.rewards_usd ? '$' + parseFloat(String(r.rewards_usd)).toFixed(2) : '-'}
              </td>
              <td style={{ padding: '10px' }}>
                {r && r.tx_hash && String(r.tx_hash) !== 'null' && String(r.tx_hash) !== '0x' ? (
                  <a 
                    href={`https://testnet.bscscan.com/tx/${r.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0066cc', textDecoration: 'none', fontSize: '12px' }}
                  >
                    {String(r.tx_hash).slice(0, 10)}...
                  </a>
                ) : (
                  <span style={{ color: '#999' }}>-</span>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No logs available yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
