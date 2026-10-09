import React from 'react';
import { X, Zap, Sparkles, Check, PlusCircle } from 'lucide-react';
import { DEMO_PRESETS } from '../data/initialData';

export default function DemoPresetModal({ isOpen, onClose, onInjectScenario }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Zap size={20} color="var(--cyan-400)" />
            <span>Hackathon Live Demo Presets</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: 1.45 }}>
            Use these one-click scenarios during your live hackathon presentation to showcase how ECHO instantly clusters correlated reports and updates the Pattern Radar in real-time.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {DEMO_PRESETS.map((preset, idx) => (
              <div 
                key={idx}
                className="glass-card"
                style={{ 
                  padding: '1rem', 
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>
                    {preset.label}
                  </div>
                  <span className={`priority-tag priority-${preset.priority}`}>
                    {preset.priority}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  <strong>{preset.location}</strong> &bull; {preset.title}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                  <button
                    className="btn btn-cyan btn-sm"
                    onClick={() => {
                      onInjectScenario(preset);
                      onClose();
                    }}
                  >
                    <PlusCircle size={14} />
                    <span>Inject Live Incident</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
