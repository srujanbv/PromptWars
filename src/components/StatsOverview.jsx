import React from 'react';
import { Layers, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

export default function StatsOverview({ incidents, patterns }) {
  const totalIncidents = incidents.length;
  const activePatterns = patterns.length;
  const verifiedRisks = patterns.filter(p => p.verification?.status === 'verified_risk').length;
  const pendingVerification = patterns.filter(p => p.verification?.status === 'unverified').length;
  const totalCorroborations = incidents.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);

  return (
    <div className="stats-grid">
      <div className="glass-card stat-card">
        <div className="stat-info">
          <span className="stat-label">Total Reports</span>
          <div className="stat-value">
            {totalIncidents}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>incidents</span>
          </div>
          <span className="stat-subtext">Across 6 campus zones</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--accent-cyan-bg)', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan-border)' }}>
          <Layers size={20} />
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-info">
          <span className="stat-label">Detected Patterns</span>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>
            {activePatterns}
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 500 }}>clusters</span>
          </div>
          <span className="stat-subtext">
            {pendingVerification > 0 ? `${pendingVerification} pending officer review` : 'All clusters verified'}
          </span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', border: '1px solid var(--accent-purple-border)' }}>
          <ShieldAlert size={20} />
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-info">
          <span className="stat-label">Verified Risks</span>
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
            {verifiedRisks}
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-amber)', fontWeight: 500 }}>confirmed</span>
          </div>
          <span className="stat-subtext">Human-in-the-loop audited</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--accent-amber-bg)', color: 'var(--accent-amber)', border: '1px solid var(--accent-amber-border)' }}>
          <CheckCircle2 size={20} />
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-info">
          <span className="stat-label">Crowd Corroborations</span>
          <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
            +{totalCorroborations}
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 500 }}>signals</span>
          </div>
          <span className="stat-subtext">Student validation inputs</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'var(--accent-emerald-bg)', color: 'var(--accent-emerald)', border: '1px solid var(--accent-emerald-border)' }}>
          <TrendingUp size={20} />
        </div>
      </div>
    </div>
  );
}
