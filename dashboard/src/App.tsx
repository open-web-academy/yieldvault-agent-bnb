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
        const res = await fetch('../execution-log.jsonl')
        const text = await res.text()
        const lines = text.trim().split('\n').filter(l => l)
        setRecords(lines.map(l => JSON.parse(l)).slice(-10))
        setStatus('Live')
      } catch {
        setStatus('Error reading log')
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
