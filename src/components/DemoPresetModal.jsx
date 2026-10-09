import React from 'react';
import { X, Zap, PlusCircle } from 'lucide-react';
import { DEMO_PRESETS } from '../data/initialData';

export default function DemoPresetModal({ isOpen, onClose, onInjectScenario }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="preset-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div className="modal-title" id="preset-modal-title">
            <Zap size={18} color="var(--accent-teal)" />
            <span>Demonstration Incident Presets</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.45 }}>
            Trigger real-time incident reports to demonstrate how ECHO clusters spatial co-occurrences and populates the Pattern Radar.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {DEMO_PRESETS.map((preset, idx) => (
              <div 
                key={idx}
                className="glass-card"
                style={{ 
                  padding: '0.85rem 1rem', 
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                    {preset.label}
                  </div>
                  <span className={`priority-tag priority-${preset.priority}`}>
                    {preset.priority}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>{preset.location}</strong> &bull; {preset.title}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                  <button
                    type="button"
                    className="btn btn-cyan btn-sm"
                    onClick={() => {
                      onInjectScenario(preset);
                      onClose();
                    }}
                  >
                    <PlusCircle size={13} />
                    <span>Inject Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
