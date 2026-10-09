import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, FileText, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { formatTimeAgo } from '../utils/patternEngine';

export default function EvidenceAlert({ pattern, onVerifyPattern, onSelectIncident }) {
  const [expanded, setExpanded] = useState(true);

  if (!pattern) return null;

  const isVerified = pattern.verification?.status === 'verified_risk';
  const isDismissed = pattern.verification?.status === 'dismissed';

  return (
    <div className={`evidence-alert-container ${isVerified ? 'glass-card-cyan-glow' : 'glass-card-amber-glow'}`}>
      <div className="evidence-alert-header">
        <div className="alert-title-group">
          <div className="alert-badge-pulse" style={isVerified ? { borderColor: 'var(--emerald-500)', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--emerald-400)' } : {}}>
            <AlertTriangle size={16} />
            <span>{isVerified ? 'VERIFIED CAMPUS RISK' : 'AI PATTERN HYPOTHESIS'}</span>
          </div>

          <div>
            <div className="alert-title">
              <span>{pattern.hypothesis.title}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                ({pattern.incidentCount} Correlated Reports &bull; {pattern.confidence}% AI Confidence)
              </span>
            </div>
            <p className="alert-summary">
              {pattern.hypothesis.summary}
            </p>
          </div>
        </div>

        <div className="alert-actions">
          {!isVerified && !isDismissed ? (
            <button 
              className="btn btn-amber btn-sm"
              onClick={() => onVerifyPattern(pattern)}
              title="Review evidence and confirm or dismiss this campus pattern"
            >
              <ShieldCheck size={16} />
              <span>Verify Pattern Risk</span>
            </button>
          ) : isVerified ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--emerald-400)', fontSize: '0.82rem', fontWeight: 600 }}>
              <CheckCircle size={16} /> Confirmed by {pattern.verification.verifiedBy || 'Campus Safety'}
            </span>
          ) : (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
              Pattern Marked as Dismissed
            </span>
          )}

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse evidence breakdown' : 'Expand evidence breakdown'}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{expanded ? 'Hide Evidence' : 'View Evidence'}</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="evidence-breakdown-box">
          <div className="evidence-columns">
            <div>
              <div className="evidence-section-title">
                <FileText size={15} />
                <span>Synthesized Evidence & Spatial Correlation</span>
              </div>
              <ul className="evidence-bullet-list">
                {pattern.hypothesis.evidencePoints.map((pt, idx) => (
                  <li key={idx} className="evidence-bullet-item">
                    <div className="evidence-bullet-dot" />
                    <span>{pt}</span>
                  </li>
                ))}
                <li className="evidence-bullet-item" style={{ color: 'var(--cyan-400)' }}>
                  <div className="evidence-bullet-dot" style={{ background: 'var(--cyan-400)' }} />
                  <span>
                    <strong>Recommended Action:</strong> {pattern.hypothesis.recommendedAction}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <div className="evidence-section-title">
                <span>Corroborating Student Reports ({pattern.incidents.length})</span>
              </div>
              <div className="corroborating-reports-list">
                {pattern.incidents.slice(0, 3).map((inc) => (
                  <div 
                    key={inc.id} 
                    className="corroborating-report-card"
                    onClick={() => onSelectIncident(inc)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>{inc.id}</span>
                        <span>{inc.title}</span>
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '0.74rem', marginTop: '2px' }}>
                        {inc.zone || inc.location} &bull; {formatTimeAgo(inc.timestamp)} &bull; {inc.upvotes || 0} upvotes
                      </div>
                    </div>
                    <ArrowRight size={14} color="#64748b" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="human-review-rule-note">
            <HelpCircle size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Safety Guardrail:</strong> AI inferences are probabilistic hypotheses. ECHO requires human facility confirmation before triggering physical dispatch or risk alerts.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
