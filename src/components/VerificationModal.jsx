import React, { useState } from 'react';
import { X, ShieldCheck, AlertOctagon, CheckCircle2, FileText, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <ShieldCheck size={22} color="var(--amber-400)" />
            <span>Human-in-the-Loop Pattern Verification</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Safety Mandate Banner */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              color: '#fef3c7'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--amber-400)', marginBottom: '0.2rem' }}>
                <ShieldAlert size={16} />
                <span>MANDATORY SAFETY PROTOCOL</span>
              </div>
              <div>
                ECHO's AI engine identified a statistical anomaly from student report correlations. Pursuant to university safety standards, an authorized officer must verify the physical conditions before dispatching response protocol.
              </div>
            </div>

            {/* Pattern Summary Card */}
            <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem', background: 'rgba(15, 23, 42, 0.8)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                  {pattern.location}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--cyan-400)', fontFamily: 'var(--font-mono)' }}>
                  {pattern.incidentCount} Reports &bull; {pattern.confidence}% AI Confidence
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--purple-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} />
                <span>AI Hypothesis: {pattern.hypothesis.title}</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.4rem', lineHeight: 1.45 }}>
                {pattern.hypothesis.summary}
              </p>
            </div>

            {/* Verification Decision */}
            <div className="form-group">
              <label className="form-label">Safety Officer Assessment *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`category-radio-btn ${verificationType === 'verified_risk' ? 'selected' : ''}`}
                  onClick={() => setVerificationType('verified_risk')}
                  style={verificationType === 'verified_risk' ? { borderColor: 'var(--emerald-500)', background: 'rgba(16, 185, 129, 0.18)', color: '#fff' } : {}}
                >
                  <CheckCircle2 size={16} color={verificationType === 'verified_risk' ? 'var(--emerald-400)' : '#94a3b8'} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>Confirm Verified Risk</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pattern is real hazard</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={`category-radio-btn ${verificationType === 'dismissed' ? 'selected' : ''}`}
                  onClick={() => setVerificationType('dismissed')}
                  style={verificationType === 'dismissed' ? { borderColor: '#64748b', background: 'rgba(100, 116, 139, 0.2)', color: '#fff' } : {}}
                >
                  <AlertOctagon size={16} color={verificationType === 'dismissed' ? '#94a3b8' : '#64748b'} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700 }}>Dismiss / Coincidence</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Unrelated incidents</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Officer Name */}
            <div className="form-group">
              <label className="form-label">Verifying Officer / Reviewer Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Officer Miller, Campus Operations"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
              />
            </div>

            {/* Action Notes */}
            <div className="form-group">
              <label className="form-label">Dispatch / Remediation Action Notes *</label>
              <textarea
                className="form-textarea"
                placeholder="Log the physical action taken, facilities work order number, or reason for dismissal..."
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={verificationType === 'verified_risk' ? 'btn btn-primary' : 'btn btn-secondary'}
            >
              <UserCheck size={16} />
              <span>{verificationType === 'verified_risk' ? 'Record Verified Risk' : 'Dismiss Pattern'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
