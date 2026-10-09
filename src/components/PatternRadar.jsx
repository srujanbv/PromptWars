import React, { useState } from 'react';
import { 
  Radar, 
  ShieldAlert, 
  CheckCircle2, 
  ShieldQuestion, 
  ChevronRight, 
  Eye, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Search, 
  AlertCircle,
  Cpu,
  MapPin,
  Tag
} from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { formatTimeAgo } from '../utils/patternEngine';

// Radial coordinates mapping for campus locations on radar scope
const LOCATION_COORDINATES = {
  'North Quad Walkway': { x: 50, y: 22 },
  'Science Annex': { x: 78, y: 65 },
  'Engineering Hall B2': { x: 22, y: 70 },
  'West Dorms & Annex': { x: 24, y: 35 },
  'Library Quad': { x: 50, y: 50 },
  'Student Union Plaza': { x: 75, y: 32 },
  'East Parking Lot C': { x: 82, y: 80 },
  'Dining Commons': { x: 38, y: 80 }
};

export default function PatternRadar({ patterns, onVerifyPattern, onSelectIncident }) {
  const [selectedPatternId, setSelectedPatternId] = useState(patterns[0]?.id || null);
  const [expandedExplanations, setExpandedExplanations] = useState({ [patterns[0]?.id]: true });

  const toggleExplanation = (patternId) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [patternId]: !prev[patternId]
    }));
  };

  const activePattern = patterns.find(p => p.id === selectedPatternId) || patterns[0];

  return (
    <div className="radar-widget-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Radar size={22} color="var(--cyan-400)" />
            <span>Pattern Radar & Hotspots</span>
          </h2>
          <p className="section-subtitle">
            AI correlates real-time campus telemetry to identify multi-report infrastructure clusters
          </p>
        </div>
      </div>

      {/* Visual Radar Scope */}
      <div className="glass-card radar-scope-card">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>
            FREQ: 2.44 GHz &bull; SCAN RANGE: CAMPUS WIDE
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {patterns.length} Active Hotspot{patterns.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="radar-visual-wrapper" role="region" aria-label="Campus Incident Radar Scope">
          {/* Concentric distance rings */}
          <div className="radar-ring ring-1" />
          <div className="radar-ring ring-2" />
          <div className="radar-ring ring-3" />
          <div className="radar-ring ring-4" />

          {/* Crosshairs */}
          <div className="radar-crosshair-h" />
          <div className="radar-crosshair-v" />

          {/* Rotating radar sweep */}
          <div className="radar-sweep-beam" />

          {/* Plotted Cluster Blips */}
          {patterns.map((pattern) => {
            const coords = LOCATION_COORDINATES[pattern.location] || { x: 50, y: 50 };
            const isSelected = activePattern?.id === pattern.id;
            const isVerified = pattern.verification?.status === 'verified_risk';

            return (
              <div
                key={pattern.id}
                className="radar-blip"
                style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
                onClick={() => setSelectedPatternId(pattern.id)}
                title={`${pattern.location}: ${pattern.incidentCount} reports (${pattern.confidence}% confidence)`}
                tabIndex={0}
                role="button"
                aria-label={`Hotspot at ${pattern.location}`}
              >
                <div 
                  className={`radar-blip-dot ${isVerified ? 'cluster-cyan' : 'cluster-high'}`}
                  style={{
                    transform: isSelected ? 'scale(1.4)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 20px #fff' : undefined
                  }}
                >
                  <div className="radar-blip-ping" />
                </div>
                <div className="radar-cluster-label">
                  {pattern.location.split(' ')[0]} ({pattern.incidentCount})
                </div>
              </div>
            );
          })}
        </div>

        <div className="radar-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'var(--rose-500)', boxShadow: '0 0 8px var(--rose-500)' }} />
            <span>Unverified AI Hypothesis</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'var(--cyan-400)', boxShadow: '0 0 8px var(--cyan-400)' }} />
            <span>Verified Risk Hotspot</span>
          </div>
          <div className="legend-item">
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>&bull; Blip size = incident density</span>
          </div>
        </div>
      </div>

      {/* Pattern Cards List */}
      <div className="patterns-list">
        {patterns.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No multi-incident patterns detected yet. Single incidents will automatically group when correlated reports are submitted.
          </div>
        ) : (
          patterns.map((pattern) => {
            const catObj = CATEGORIES.find(c => c.id === pattern.category);
            const isVerified = pattern.verification?.status === 'verified_risk';
            const isDismissed = pattern.verification?.status === 'dismissed';
            const isSelected = activePattern?.id === pattern.id;
            const isExplanationOpen = !!expandedExplanations[pattern.id];
            const explanation = pattern.explanation;

            return (
              <div 
                key={pattern.id} 
                className={`glass-card pattern-card ${isSelected ? 'glass-card-purple-glow' : ''}`}
                style={{ borderLeft: `4px solid ${catObj?.color || 'var(--purple-500)'}` }}
              >
                <div className="pattern-card-header">
                  <div className="pattern-location-group">
                    <div className="pattern-location-name">
                      <span>{pattern.location}</span>
                    </div>
                    <div 
                      className="pattern-category-pill"
                      style={{ 
                        background: `${catObj?.color}22`, 
                        color: catObj?.color,
                        border: `1px solid ${catObj?.color}44` 
                      }}
                    >
                      {catObj?.label || pattern.category} &bull; {pattern.incidentCount} Reports
                    </div>
                  </div>

                  <div className="confidence-gauge-box">
                    <span className="confidence-val">{pattern.confidence}%</span>
                    <span className="confidence-label">AI Confidence</span>
                  </div>
                </div>

                <div className="pattern-hypothesis-box">
                  <div className="hypothesis-title">
                    <Sparkles size={14} />
                    <span>{pattern.hypothesis.title}</span>
                  </div>
                  <p className="hypothesis-text">
                    {pattern.hypothesis.summary}
                  </p>
                </div>

                {/* Sub-incidents preview */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Linked Student Reports ({pattern.incidents.length}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {pattern.incidents.map((inc) => (
                      <div 
                        key={inc.id}
                        onClick={() => onSelectIncident(inc)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.35rem 0.6rem',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          color: '#cbd5e1'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <strong style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>{inc.id}</strong>
                          <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inc.title}
                          </span>
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                          {formatTimeAgo(inc.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* "Explain This Pattern" Section */}
                <div className="pattern-explanation-wrapper">
                  <button
                    type="button"
                    className="pattern-explanation-toggle-btn"
                    onClick={() => toggleExplanation(pattern.id)}
                    aria-expanded={isExplanationOpen}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <HelpCircle size={15} color="var(--cyan-400)" />
                      <span style={{ fontWeight: 700, color: 'var(--cyan-400)' }}>Explain This Pattern</span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        (Detector criteria & observed evidence)
                      </span>
                    </div>
                    {isExplanationOpen ? <ChevronUp size={15} color="var(--cyan-400)" /> : <ChevronDown size={15} color="var(--cyan-400)" />}
                  </button>

                  {isExplanationOpen && explanation && (
                    <div className="pattern-explanation-body">
                      {/* 1. Detector Grouping Criteria */}
                      <div className="explanation-section">
                        <div className="explanation-section-heading">
                          <Cpu size={14} color="var(--cyan-400)" />
                          <span>1. Detector Grouping Criteria</span>
                        </div>
                        <ul className="explanation-bullet-list">
                          {explanation.detectorCriteria.map((crit, idx) => (
                            <li key={idx} className="explanation-bullet-item">
                              <span className="explanation-bullet-dot dot-cyan" />
                              <span>{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 2. Observed Facts vs. Inferred Hypotheses */}
                      <div className="explanation-two-col">
                        {/* Observed Facts (Ground Truth) */}
                        <div className="facts-box">
                          <div className="explanation-section-heading" style={{ color: '#38bdf8' }}>
                            <FileText size={14} color="#38bdf8" />
                            <span>Observed Facts (Ground Truth)</span>
                          </div>
                          <ul className="explanation-bullet-list">
                            {explanation.observedFacts.map((fact, idx) => (
                              <li key={idx} className="explanation-bullet-item">
                                <span className="explanation-bullet-dot dot-cyan" />
                                <span>{fact}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Inferred Hypotheses (AI / Statistical Inference) */}
                        <div className="hypothesis-inference-box">
                          <div className="explanation-section-heading" style={{ color: 'var(--purple-400)' }}>
                            <Sparkles size={14} color="var(--purple-400)" />
                            <span>Inferred Hypotheses (AI Inference)</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#e2e8f0', marginBottom: '0.35rem', fontWeight: 600 }}>
                            {explanation.inferredHypothesis.title}
                          </div>
                          <p style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.45, marginBottom: '0.45rem' }}>
                            {explanation.inferredHypothesis.summary}
                          </p>
                          <div style={{ fontSize: '0.74rem', color: 'var(--purple-400)' }}>
                            <strong>Suggested Next Step:</strong> {explanation.inferredHypothesis.recommendedAction}
                          </div>
                        </div>
                      </div>

                      {/* 3. Supporting Report IDs Breakdown */}
                      <div className="supporting-reports-box">
                        <div className="explanation-section-heading" style={{ color: '#e2e8f0' }}>
                          <Tag size={14} color="var(--amber-400)" />
                          <span>Supporting Reports & Spatial Context</span>
                        </div>
                        <div className="supporting-reports-grid">
                          {pattern.incidents.map((inc) => (
                            <div 
                              key={inc.id}
                              className="supporting-report-chip"
                              onClick={() => onSelectIncident(inc)}
                              title="Click to view full report"
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                  {inc.id}
                                </span>
                                <span className={`priority-tag priority-${inc.priority}`} style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
                                  {inc.priority}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#f1f5f9', fontWeight: 500, margin: '2px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {inc.title}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                                <MapPin size={10} style={{ display: 'inline', marginRight: '2px' }} />
                                {inc.zone || inc.location}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Uncertainty & Human Verification Requirement */}
                      <div className="uncertainty-verification-box">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', marginBottom: '0.35rem' }}>
                          <AlertCircle size={15} color="var(--amber-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ fontSize: '0.76rem', color: '#fef3c7', lineHeight: 1.45 }}>
                            <strong>Uncertainty Note:</strong> {explanation.uncertaintyNote}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', paddingLeft: '1.4rem' }}>
                          <span style={{ fontSize: '0.76rem', color: 'var(--amber-400)', fontWeight: 600, lineHeight: 1.45 }}>
                            &bull; <strong>Protocol Requirement:</strong> {explanation.humanVerificationRequirement}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pattern-card-footer">
                  <div className="verification-status-badge">
                    {isVerified ? (
                      <span className="verification-status-badge status-verified">
                        <CheckCircle2 size={13} />
                        <span>Verified Campus Risk</span>
                      </span>
                    ) : isDismissed ? (
                      <span className="verification-status-badge status-dismissed">
                        <span>Dismissed by Safety</span>
                      </span>
                    ) : (
                      <span className="verification-status-badge status-unverified">
                        <ShieldQuestion size={13} />
                        <span>Unverified AI Hypothesis</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!isVerified && (
                      <button 
                        className="btn btn-amber btn-sm"
                        onClick={() => onVerifyPattern(pattern)}
                      >
                        <ShieldAlert size={14} />
                        <span>Verify / Review</span>
                      </button>
                    )}
                    {isVerified && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onVerifyPattern(pattern)}
                      >
                        <Eye size={14} />
                        <span>Audit Log</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
