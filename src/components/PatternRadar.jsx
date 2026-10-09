import React, { useState } from 'react';
import { 
  Radar, 
  ShieldAlert, 
  CheckCircle2, 
  ShieldQuestion, 
  Eye, 
  Sparkles, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
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
            <Radar size={20} color="var(--accent-teal)" />
            <span>Pattern Radar & Spatial Clusters</span>
          </h2>
          <p className="section-subtitle">
            Spatial and domain co-occurrence detector correlating crowdsourced campus reports
          </p>
        </div>
      </div>

      {/* Visual Radar Scope */}
      <div className="glass-card radar-scope-card">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            RADAR SCOPE &bull; ALL SECTORS
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
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
                    transform: isSelected ? 'scale(1.35)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 0 2px var(--accent-teal)' : undefined
                  }}
                />
                <div className="radar-cluster-label">
                  {pattern.location.split(' ')[0]} ({pattern.incidentCount})
                </div>
              </div>
            );
          })}
        </div>

        <div className="radar-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'var(--accent-rose)' }} />
            <span>Unverified AI Hypothesis</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{ background: 'var(--accent-teal)' }} />
            <span>Verified Risk Hotspot</span>
          </div>
          <div className="legend-item">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>&bull; Blip = cluster location</span>
          </div>
        </div>
      </div>

      {/* Pattern Cards List */}
      <div className="patterns-list">
        {patterns.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No multi-incident patterns detected. Reports with matching location and category will cluster automatically.
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
                className="glass-card pattern-card"
                style={{ 
                  borderLeft: `4px solid ${catObj?.color || 'var(--accent-purple)'}`,
                  borderColor: isSelected ? 'var(--border-medium)' : undefined
                }}
              >
                <div className="pattern-card-header">
                  <div className="pattern-location-group">
                    <div className="pattern-location-name">
                      <span>{pattern.location}</span>
                    </div>
                    <div 
                      className="pattern-category-pill"
                      style={{ 
                        background: 'var(--bg-subtle)', 
                        color: catObj?.color || 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)' 
                      }}
                    >
                      {catObj?.label || pattern.category} &bull; {pattern.incidentCount} Reports
                    </div>
                  </div>

                  <div className="confidence-gauge-box">
                    <span className="confidence-val">{pattern.confidence}%</span>
                    <span className="confidence-label">Detector Score</span>
                  </div>
                </div>

                <div className="pattern-hypothesis-box">
                  <div className="hypothesis-title">
                    <Sparkles size={13} />
                    <span>{pattern.hypothesis.title}</span>
                  </div>
                  <p className="hypothesis-text">
                    {pattern.hypothesis.summary}
                  </p>
                </div>

                {/* Sub-incidents preview */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    Linked Student Reports ({pattern.incidents.length}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {pattern.incidents.map((inc) => (
                      <div 
                        key={inc.id}
                        onClick={() => onSelectIncident(inc)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.35rem 0.55rem',
                          background: 'var(--bg-subtle)',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{inc.id}</strong>
                          <span style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inc.title}
                          </span>
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <HelpCircle size={14} color="var(--accent-teal)" />
                      <span style={{ fontWeight: 700, color: 'var(--accent-teal)', fontSize: '0.8rem' }}>Explain This Pattern</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        (Detector criteria & observed facts)
                      </span>
                    </div>
                    {isExplanationOpen ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                  </button>

                  {isExplanationOpen && explanation && (
                    <div className="pattern-explanation-body">
                      {/* 1. Detector Grouping Criteria */}
                      <div>
                        <div className="explanation-section-heading">
                          <Cpu size={13} color="var(--accent-teal)" />
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
                          <div className="explanation-section-heading" style={{ color: 'var(--accent-cyan)' }}>
                            <FileText size={13} color="var(--accent-cyan)" />
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

                        {/* Inferred Hypotheses (AI Inference) */}
                        <div className="hypothesis-inference-box">
                          <div className="explanation-section-heading" style={{ color: 'var(--accent-purple)' }}>
                            <Sparkles size={13} color="var(--accent-purple)" />
                            <span>Inferred Hypotheses (Inference)</span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', marginBottom: '0.25rem', fontWeight: 600 }}>
                            {explanation.inferredHypothesis.title}
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.35rem' }}>
                            {explanation.inferredHypothesis.summary}
                          </p>
                          <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple)' }}>
                            <strong>Suggested Next Step:</strong> {explanation.inferredHypothesis.recommendedAction}
                          </div>
                        </div>
                      </div>

                      {/* 3. Supporting Report IDs Breakdown */}
                      <div className="supporting-reports-box">
                        <div className="explanation-section-heading" style={{ color: 'var(--text-primary)' }}>
                          <Tag size={13} color="var(--accent-amber)" />
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
                                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '0.72rem' }}>
                                  {inc.id}
                                </span>
                                <span className={`priority-tag priority-${inc.priority}`} style={{ fontSize: '0.62rem', padding: '1px 4px' }}>
                                  {inc.priority}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-primary)', fontWeight: 500, margin: '2px 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                {inc.title}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                <MapPin size={10} style={{ display: 'inline', marginRight: '2px' }} />
                                {inc.zone || inc.location}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. Uncertainty & Human Verification Requirement */}
                      <div className="uncertainty-verification-box">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.25rem' }}>
                          <AlertCircle size={14} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', lineHeight: 1.4 }}>
                            <strong>Uncertainty Note:</strong> {explanation.uncertaintyNote}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', paddingLeft: '1.2rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 600, lineHeight: 1.4 }}>
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
                        <CheckCircle2 size={12} />
                        <span>Verified Campus Risk</span>
                      </span>
                    ) : isDismissed ? (
                      <span className="verification-status-badge status-dismissed">
                        <span>Dismissed by Safety</span>
                      </span>
                    ) : (
                      <span className="verification-status-badge status-unverified">
                        <ShieldQuestion size={12} />
                        <span>Unverified AI Hypothesis</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.45rem' }}>
                    {!isVerified && (
                      <button 
                        className="btn btn-amber btn-sm"
                        onClick={() => onVerifyPattern(pattern)}
                      >
                        <ShieldAlert size={13} />
                        <span>Verify / Review</span>
                      </button>
                    )}
                    {isVerified && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onVerifyPattern(pattern)}
                      >
                        <Eye size={13} />
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
