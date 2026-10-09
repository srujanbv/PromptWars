import React from 'react';
import { AlertOctagon, Layers, ShieldAlert, CheckCircle2, TrendingUp } from 'lucide-react';

export default function StatsOverview({ incidents, patterns, onFilterClick }) {
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
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>incidents</span>
          </div>
          <span className="stat-subtext">Across 6 campus sectors</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--cyan-400)' }}>
          <Layers size={24} />
        </div>
      </div>

      <div className="glass-card stat-card glass-card-purple-glow">
        <div className="stat-info">
          <span className="stat-label">AI Pattern Clusters</span>
          <div className="stat-value" style={{ color: 'var(--purple-400)' }}>
            {activePatterns}
            <span style={{ fontSize: '0.9rem', color: 'var(--purple-400)', fontWeight: 500 }}>hotspots</span>
          </div>
          <span className="stat-subtext">
            {pendingVerification > 0 ? `${pendingVerification} pending human review` : 'All patterns reviewed'}
          </span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--purple-400)' }}>
          <ShieldAlert size={24} />
        </div>
      </div>

      <div className="glass-card stat-card glass-card-amber-glow">
        <div className="stat-info">
          <span className="stat-label">Human-Verified Risks</span>
          <div className="stat-value" style={{ color: 'var(--amber-400)' }}>
            {verifiedRisks}
            <span style={{ fontSize: '0.9rem', color: 'var(--amber-400)', fontWeight: 500 }}>confirmed</span>
          </div>
          <span className="stat-subtext">Verified by campus safety</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--amber-400)' }}>
          <CheckCircle2 size={24} />
        </div>
      </div>

      <div className="glass-card stat-card">
        <div className="stat-info">
          <span className="stat-label">Student Corroborations</span>
          <div className="stat-value" style={{ color: 'var(--emerald-400)' }}>
            +{totalCorroborations}
            <span style={{ fontSize: '0.9rem', color: 'var(--emerald-400)', fontWeight: 500 }}>signals</span>
          </div>
          <span className="stat-subtext">Crowdsourced validation</span>
        </div>
        <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--emerald-400)' }}>
          <TrendingUp size={24} />
        </div>
      </div>
    </div>
  );
}
