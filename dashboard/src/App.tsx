import { useState, useEffect } from 'react'
import './App.css'

interface ExecutionRecord {
  timestamp: number
  action: string
  vault_id: string
  state_hash: string
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
    const interval = setInterval(fetchRecords, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="app">
      <h1>Yield Farming Agent Dashboard</h1>
      <div className="status">{status}</div>
      <table>
        <thead><tr><th>Time</th><th>Vault</th><th>Action</th><th>Hash</th></tr></thead>
        <tbody>
          {records.map((r, i) => (
            <tr key={i}>
              <td>{new Date(r.timestamp * 1000).toLocaleTimeString()}</td>
              <td>{r.vault_id}</td>
              <td>{r.action}</td>
              <td>{r.state_hash.slice(0, 16)}...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
