import React from 'react';
import { X, MapPin, Clock, ThumbsUp, ShieldAlert, Sparkles, User, Tag, AlertTriangle, Lightbulb, Wifi, Droplets, Lock, Volume2 } from 'lucide-react';
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="incident-id-badge" style={{ fontSize: '0.85rem' }}>
              {incident.id}
            </span>
            <span 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.35rem', 
                fontSize: '0.78rem', 
                fontWeight: 600, 
                color: catObj?.color || '#94a3b8' 
              }}
            >
              <IconComp size={15} color={catObj?.color} />
              {catObj?.label || incident.category}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.65rem', lineHeight: 1.35 }}>
            {incident.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div className="incident-location-line" style={{ marginTop: 0 }}>
              <MapPin size={15} color="var(--cyan-400)" />
              <span><strong>{incident.location}</strong> {incident.zone ? `(${incident.zone})` : ''}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <Clock size={14} />
              <span>Reported {formatTimeAgo(incident.timestamp)}</span>
            </div>
          </div>

          {/* Linked Pattern Cluster Callout if applicable */}
          {linkedPattern && (
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--purple-400)' }}>
                  <Sparkles size={14} />
                  <span>Linked to AI Pattern Cluster ({linkedPattern.incidentCount} Reports)</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan-400)' }}>
                  {linkedPattern.confidence}% Confidence
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                <strong>Hypothesis:</strong> {linkedPattern.hypothesis.title} — {linkedPattern.hypothesis.summary}
              </p>
            </div>
          )}

          {/* Description Section */}
          <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', background: 'rgba(10, 15, 28, 0.7)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--cyan-400)', textTransform: 'uppercase', marginBottom: '0.45rem' }}>
              Student Report Description
            </div>
            <p style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.55 }}>
              {incident.description}
            </p>
            {incident.impact && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.82rem', color: '#fbbf24' }}>
                <strong>Observed Impact:</strong> {incident.impact}
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Reported By</div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={14} color="var(--purple-400)" />
                <span>{incident.reportedBy || 'Student Reporter'}</span>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Severity Priority</div>
              <div style={{ marginTop: '0.2rem' }}>
                <span className={`priority-tag priority-${incident.priority}`}>
                  {incident.priority} Urgency
                </span>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Resolution Status</div>
              <div style={{ marginTop: '0.2rem' }}>
                <select
                  className="form-select"
                  style={{ width: '100%', padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                  value={incident.status}
                  onChange={(e) => onChangeStatus(incident.id, e.target.value)}
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
            className="btn btn-secondary"
            onClick={() => onUpvote(incident.id)}
          >
            <ThumbsUp size={15} color="var(--purple-400)" />
            <span>Corroborate (+{incident.upvotes || 0})</span>
          </button>

          {linkedPattern && linkedPattern.verification?.status !== 'verified_risk' && (
            <button
              type="button"
              className="btn btn-amber"
              onClick={() => {
                onClose();
                onVerifyPattern(linkedPattern);
              }}
            >
              <ShieldAlert size={15} />
              <span>Verify Parent Pattern</span>
            </button>
          )}

          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
