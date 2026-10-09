import React from 'react';
import { Radio, PlusCircle, RotateCcw, Zap, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenReport, onOpenPresets, onResetData, clusterCount, verifiedCount }) {
  return (
    <>
      <div className="demo-presentation-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>⚡ HACKATHON DEMO MODE:</span>
          <span>ECHO AI Pattern Radar &bull; Human-in-the-loop Campus Safety Intelligence</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#c084fc' }}>
            <strong>{clusterCount}</strong> AI Pattern{clusterCount === 1 ? '' : 's'} Detected
          </span>
          <span style={{ color: '#34d399' }}>
            <strong>{verifiedCount}</strong> Human-Verified
          </span>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onResetData}
            title="Reset to 5+ clean demo sample incidents"
            style={{ padding: '2px 8px', fontSize: '0.72rem' }}
          >
            <RotateCcw size={12} /> Reset Data
          </button>
        </div>
      </div>

      <header className="navbar">
        <div className="nav-inner">
          <div className="brand-section" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="brand-logo-glow">
              <Radio size={22} className="live-icon" />
            </div>
            <div>
              <div className="brand-title">
                ECHO
                <span className="brand-tag">AI RADAR</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '-2px' }}>
                Campus Incident Pattern Intelligence
              </div>
            </div>
          </div>

          <div className="nav-actions">
            <div className="radar-live-badge" title="Real-time campus telemetry active">
              <div className="live-dot" />
              <span>RADAR ACTIVE</span>
            </div>

            <button 
              className="btn btn-cyan btn-sm"
              onClick={onOpenPresets}
              title="Trigger instant demo scenario to demonstrate pattern clustering"
            >
              <Zap size={15} />
              <span>Demo Presets</span>
            </button>

            <button 
              className="btn btn-primary"
              onClick={onOpenReport}
            >
              <PlusCircle size={16} />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
