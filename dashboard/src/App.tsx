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
}

export default function App() {
  const [records, setRecords] = useState<ExecutionRecord[]>([])
  const [status, setStatus] = useState('Connecting...')

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        // Detect API endpoint: use window.location.origin if available, fallback to localhost
        const apiBase = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'
        const res = await fetch(`${apiBase}/api/logs`)
        const data = await res.json()
        setRecords(Array.isArray(data) ? data.slice(-10) : [])
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
    <div className="app">
      <h1>Yield Farming Agent Dashboard</h1>
      <div className="status">{status}</div>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Vault</th>
            <th>Action</th>
            <th>APR</th>
            <th>Confidence</th>
            <th>TX Hash (BNB Testnet)</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{new Date(r.timestamp * 1000).toLocaleTimeString()}</td>
              <td title={r.vault_name}>{r.vault_id.slice(0, 20)}</td>
              <td><strong>{r.action}</strong></td>
              <td>{r.net_apr ? r.net_apr.toFixed(2) + '%' : '-'}</td>
              <td>{r.confidence ? (r.confidence * 100).toFixed(0) + '%' : '-'}</td>
              <td>
                {r.tx_hash && r.tx_hash !== 'null' ? (
                  <a 
                    href={`https://testnet.bscscan.com/tx/${r.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0066cc', textDecoration: 'none' }}
                  >
                    {r.tx_hash.slice(0, 10)}...{r.tx_hash.slice(-8)}
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
