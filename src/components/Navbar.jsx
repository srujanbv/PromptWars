import React from 'react';
import { Activity, PlusCircle, RotateCcw, Zap, Sun, Moon, Monitor, Shield } from 'lucide-react';

export default function Navbar({ 
  onOpenReport, 
  onOpenPresets, 
  onResetData, 
  clusterCount, 
  verifiedCount,
  themeMode,
  onThemeChange 
}) {
  return (
    <>
      <div className="demo-presentation-banner">
        <div className="banner-left">
          <span className="banner-badge">Campus Operations Live</span>
          <span>ECHO Telemetry & Incident Pattern Detection</span>
        </div>
        <div className="banner-right">
          <span style={{ color: 'var(--accent-purple)' }}>
            <strong>{clusterCount}</strong> Active Pattern{clusterCount === 1 ? '' : 's'}
          </span>
          <span style={{ color: 'var(--accent-emerald)' }}>
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
            <div className="brand-icon-box">
              <Shield size={20} />
            </div>
            <div>
              <div className="brand-title">
                ECHO
                <span className="brand-tag">OPS RADAR</span>
              </div>
              <div className="brand-subtitle">
                Campus Safety & Facilities Intelligence
              </div>
            </div>
          </div>

          <div className="nav-actions">
            <div className="radar-live-badge" title="Campus telemetry stream active">
              <div className="live-dot" />
              <span>TELEMETRY ACTIVE</span>
            </div>

            {/* Persistent Light / Dark / System Theme Switcher */}
            <div className="theme-switcher" role="group" aria-label="Theme mode selector">
              <button
                type="button"
                className={`theme-toggle-btn ${themeMode === 'system' ? 'active' : ''}`}
                onClick={() => onThemeChange('system')}
                title="System theme"
                aria-label="System default theme"
              >
                <Monitor size={13} />
                <span>System</span>
              </button>
              <button
                type="button"
                className={`theme-toggle-btn ${themeMode === 'light' ? 'active' : ''}`}
                onClick={() => onThemeChange('light')}
                title="Light theme"
                aria-label="Light theme"
              >
                <Sun size={13} />
                <span>Light</span>
              </button>
              <button
                type="button"
                className={`theme-toggle-btn ${themeMode === 'dark' ? 'active' : ''}`}
                onClick={() => onThemeChange('dark')}
                title="Dark theme"
                aria-label="Dark theme"
              >
                <Moon size={13} />
                <span>Dark</span>
              </button>
            </div>

            <button 
              className="btn btn-cyan btn-sm"
              onClick={onOpenPresets}
              title="Test instant scenario injection for live demonstration"
            >
              <Zap size={14} />
              <span>Demo Presets</span>
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={onOpenReport}
            >
              <PlusCircle size={15} />
              <span>+ Log Incident</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
