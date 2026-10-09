import React, { useState } from 'react';
import { X, ShieldCheck, AlertOctagon, CheckCircle2, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function VerificationModal({ isOpen, onClose, pattern, onSaveVerification }) {
  const [officerName, setOfficerName] = useState('Officer J. Miller (Campus Safety)');
  const [actionNotes, setActionNotes] = useState('Work order dispatched to Facilities & Electrical team. Perimeter inspection underway.');
  const [verificationType, setVerificationType] = useState('verified_risk');

  if (!isOpen || !pattern) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveVerification(pattern.id, {
      status: verificationType,
      verifiedBy: officerName.trim() || 'Campus Safety Officer',
      verifiedAt: new Date().toISOString(),
      notes: actionNotes.trim()
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="verification-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <div className="modal-title" id="verification-modal-title">
            <ShieldCheck size={20} color="var(--accent-amber)" />
            <span>Human Verification Audit</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Safety Mandate Banner */}
            <div style={{
              padding: '0.75rem 0.95rem',
              borderRadius: '8px',
              background: 'var(--accent-amber-bg)',
              border: '1px solid var(--accent-amber-border)',
              marginBottom: '1.15rem',
              fontSize: '0.8rem',
              color: 'var(--accent-amber)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                <ShieldAlert size={15} />
                <span>MANDATORY SAFETY PROTOCOL</span>
              </div>
              <div style={{ lineHeight: 1.4 }}>
                ECHO's detector identified a statistical correlation. University safety regulations mandate human officer physical inspection before confirming physical risk.
              </div>
            </div>

            {/* Pattern Summary Card */}
            <div className="glass-card" style={{ padding: '0.95rem 1.15rem', marginBottom: '1.15rem', background: 'var(--bg-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {pattern.location}
                </span>
                <span style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {pattern.incidentCount} Reports &bull; {pattern.confidence}% Detector Score
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={13} />
                <span>Hypothesis: {pattern.hypothesis.title}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.4 }}>
                {pattern.hypothesis.summary}
              </p>
            </div>

            {/* Verification Decision */}
            <div className="form-group">
              <label className="form-label" id="assessment-label">Safety Officer Assessment *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }} role="radiogroup" aria-labelledby="assessment-label">
                <button
                  type="button"
                  role="radio"
                  aria-checked={verificationType === 'verified_risk'}
                  className={`category-radio-btn ${verificationType === 'verified_risk' ? 'selected' : ''}`}
                  onClick={() => setVerificationType('verified_risk')}
                >
                  <CheckCircle2 size={15} color={verificationType === 'verified_risk' ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Confirm Verified Risk</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hazard confirmed on site</div>
                  </div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={verificationType === 'dismissed'}
                  className={`category-radio-btn ${verificationType === 'dismissed' ? 'selected' : ''}`}
                  onClick={() => setVerificationType('dismissed')}
                >
                  <AlertOctagon size={15} color={verificationType === 'dismissed' ? 'var(--text-muted)' : 'var(--text-muted)'} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>Dismiss / Coincidence</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Unrelated occurrences</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Officer Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="officer-name-input">Verifying Officer / Staff Name *</label>
              <input
                id="officer-name-input"
                type="text"
                className="form-input"
                placeholder="e.g. Officer Miller, Facilities & Safety"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
              />
            </div>

            {/* Action Notes */}
            <div className="form-group">
              <label className="form-label" htmlFor="action-notes-input">Remediation Action & Dispatch Notes *</label>
              <textarea
                id="action-notes-input"
                className="form-textarea"
                placeholder="Log work order number, physical dispatch team, or dismissal rationale..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={verificationType === 'verified_risk' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              <UserCheck size={14} />
              <span>{verificationType === 'verified_risk' ? 'Record Verified Risk' : 'Dismiss Pattern'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
