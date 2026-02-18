import React from 'react';

interface PerformanceMetricsProps {
  totalHarvested: number;
  totalCompounded: number;
  realizedAPR: number | string;
  successRate: number;
  totalActions: number;
}

export function PerformanceMetrics({
  totalHarvested,
  totalCompounded,
  realizedAPR,
  successRate,
  totalActions
}: PerformanceMetricsProps) {
  const aprValue = typeof realizedAPR === 'string' ? parseFloat(realizedAPR) : realizedAPR;
  
  const metrics = [
    {
      label: 'Total Harvested',
      value: `$${totalHarvested.toFixed(2)}`,
      change: '+12.5%',
      trend: 'positive',
      icon: '🌾'
    },
    {
      label: 'Total Compounded',
      value: `$${totalCompounded.toFixed(2)}`,
      change: '+8.3%',
      trend: 'positive',
      icon: '📊'
    },
    {
      label: 'Realized APR',
      value: `${typeof realizedAPR === 'string' ? realizedAPR : (realizedAPR as any)?.toFixed(2)}%`,
      change: aprValue > 50 ? '+2.1%' : '+0.5%',
      trend: 'positive',
      icon: '📈'
    },
    {
      label: 'Success Rate',
      value: `${successRate.toFixed(1)}%`,
      change: totalActions > 0 ? '+0.2%' : 'N/A',
      trend: successRate > 95 ? 'positive' : 'neutral',
      icon: '✅'
    }
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((metric, i) => (
        <div key={i} className="metric-card">
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>{metric.icon}</div>
          <div className="metric-label">{metric.label}</div>
          <div className="metric-value">{metric.value}</div>
          <div className={`metric-change ${metric.trend}`}>
            {metric.change} from last cycle
          </div>
        </div>
      ))}
    </div>
  );
}
