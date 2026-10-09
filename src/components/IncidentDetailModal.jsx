import React from 'react';
import { X, MapPin, Clock, ThumbsUp, ShieldAlert, Sparkles, User, AlertTriangle, Lightbulb, Wifi, Droplets, Lock, Volume2 } from 'lucide-react';
import { CATEGORIES } from '../data/initialData';
import { formatTimeAgo } from '../utils/patternEngine';

const ICONS_MAP = {
  Lightbulb,
  AlertTriangle,
  Wifi,
  Droplets,
  Lock,
  Volume2
};

export default function IncidentDetailModal({ 
  incident, 
  isOpen, 
  onClose, 
  onUpvote, 
  onChangeStatus,
  linkedPattern,
  onVerifyPattern
}) {
  if (!isOpen || !incident) return null;

  const catObj = CATEGORIES.find(c => c.id === incident.category);
  const IconComp = catObj ? ICONS_MAP[catObj.icon] : AlertTriangle;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="incident-detail-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span className="incident-id-badge" style={{ fontSize: '0.82rem' }}>
              {incident.id}
            </span>
            <span 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.3rem', 
                fontSize: '0.76rem', 
                fontWeight: 600, 
                color: catObj?.color || 'var(--text-muted)' 
              }}
            >
              <IconComp size={14} color={catObj?.color} />
              {catObj?.label || incident.category}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h2 id="incident-detail-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.55rem', lineHeight: 1.35 }}>
            {incident.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.15rem' }}>
            <div className="incident-location-line" style={{ marginTop: 0 }}>
              <MapPin size={14} color="var(--accent-cyan)" />
              <span><strong>{incident.location}</strong> {incident.zone ? `(${incident.zone})` : ''}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <Clock size={13} />
              <span>Reported {formatTimeAgo(incident.timestamp)}</span>
            </div>
          </div>

          {/* Linked Pattern Cluster Callout if applicable */}
          {linkedPattern && (
            <div style={{
              padding: '0.75rem 0.95rem',
              borderRadius: '8px',
              background: 'var(--accent-purple-bg)',
              border: '1px solid var(--accent-purple-border)',
              marginBottom: '1.15rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
                  <Sparkles size={13} />
                  <span>Linked Spatial Cluster ({linkedPattern.incidentCount} Reports)</span>
                </div>
                <span style={{ fontSize: '0.74rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  {linkedPattern.confidence}% Score
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <strong>Hypothesis:</strong> {linkedPattern.hypothesis.title} — {linkedPattern.hypothesis.summary}
              </p>
            </div>
          )}

          {/* Description Section */}
          <div className="glass-card" style={{ padding: '0.95rem 1.15rem', marginBottom: '1.15rem', background: 'var(--bg-subtle)' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Student Report Narrative
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {incident.description}
            </p>
            {incident.impact && (
              <div style={{ marginTop: '0.65rem', paddingTop: '0.55rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--accent-amber)' }}>
                <strong>Reported Impact:</strong> {incident.impact}
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reported By</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <User size={13} color="var(--accent-teal)" />
                <span>{incident.reportedBy || 'Student Reporter'}</span>
              </div>
            </div>

            <div style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Priority Level</div>
              <div style={{ marginTop: '0.15rem' }}>
                <span className={`priority-tag priority-${incident.priority}`}>
                  {incident.priority} Severity
                </span>
              </div>
            </div>

            <div style={{ padding: '0.65rem', borderRadius: '6px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resolution Status</div>
              <div style={{ marginTop: '0.15rem' }}>
                <select
                  className="form-select"
                  style={{ width: '100%', padding: '0.2rem 0.45rem', fontSize: '0.76rem' }}
                  value={incident.status}
                  onChange={(e) => onChangeStatus(incident.id, e.target.value)}
                  aria-label="Change status"
                >
                  <option value="New">New</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onUpvote(incident.id)}
          >
            <ThumbsUp size={13} color="var(--accent-teal)" />
            <span>Corroborate (+{incident.upvotes || 0})</span>
          </button>

          {linkedPattern && linkedPattern.verification?.status !== 'verified_risk' && (
            <button
              type="button"
              className="btn btn-amber btn-sm"
              onClick={() => {
                onClose();
                onVerifyPattern(linkedPattern);
              }}
            >
              <ShieldAlert size={14} />
              <span>Verify Parent Pattern</span>
            </button>
          )}

          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
