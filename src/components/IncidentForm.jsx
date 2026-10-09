import React, { useState } from 'react';
import { X, Send, Zap, Lightbulb, AlertTriangle, Wifi, Droplets, Lock, Volume2 } from 'lucide-react';
import { CATEGORIES, CAMPUS_LOCATIONS, DEMO_PRESETS } from '../data/initialData';

const ICONS_MAP = {
  Lightbulb,
  AlertTriangle,
  Wifi,
  Droplets,
  Lock,
  Volume2
};

export default function IncidentForm({ isOpen, onClose, onSubmitIncident }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('lighting');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [zone, setZone] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('Anonymous Student');
  const [isAnonymous, setIsAnonymous] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title.trim(),
      category,
      location,
      zone: zone.trim() || 'General Area',
      priority,
      status: 'New',
      timestamp: new Date().toISOString(),
      description: description.trim(),
      reportedBy: isAnonymous ? 'Anonymous Student' : (reportedBy.trim() || 'Student Reporter'),
      upvotes: 1
    };

    onSubmitIncident(newIncident);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setTitle('');
    setCategory('lighting');
    setLocation(CAMPUS_LOCATIONS[0]);
    setZone('');
    setPriority('Medium');
    setDescription('');
  };

  const loadPreset = (preset) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setLocation(preset.location);
    setZone(preset.zone);
    setPriority(preset.priority);
    setDescription(preset.description);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="report-modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" id="report-modal-title">
            <Send size={18} color="var(--accent-teal)" />
            <span>Log Campus Incident</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Quick Demo Preset Trigger */}
            <div className="demo-preset-panel">
              <div className="demo-preset-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Zap size={13} /> Demo Incident Presets
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Quick Populate</span>
              </div>
              <div className="preset-btn-group">
                {DEMO_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="preset-chip-btn"
                    onClick={() => loadPreset(preset)}
                  >
                    <span>{preset.label}</span>
                    <span style={{ color: 'var(--accent-teal)', fontSize: '0.72rem', fontWeight: 600 }}>Fill Form &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div className="form-group">
              <label className="form-label" id="category-group-label">Issue Category *</label>
              <div className="category-radio-grid" role="radiogroup" aria-labelledby="category-group-label">
                {CATEGORIES.map((cat) => {
                  const IconComp = ICONS_MAP[cat.icon] || AlertTriangle;
                  const isSelected = category === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`category-radio-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <IconComp size={14} color={isSelected ? 'var(--accent-teal)' : 'var(--text-muted)'} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="incident-title-input">Issue Summary / Title *</label>
              <input
                id="incident-title-input"
                type="text"
                className="form-input"
                placeholder="e.g. Broken floodlight along North Quad walkway"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Location & Zone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="location-select">Campus Location *</label>
                <select 
                  id="location-select"
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="zone-input">Specific Zone / Floor</label>
                <input
                  id="zone-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2nd Floor Corridor / Pillar 3"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>
            </div>

            {/* Priority & Anonymity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="priority-select">Severity Level</label>
                <select 
                  id="priority-select"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low — Minor operational issue</option>
                  <option value="Medium">Medium — Disruption / Inconvenience</option>
                  <option value="High">High — Safety or access hazard</option>
                  <option value="Critical">Critical — Immediate safety risk</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="identity-select">Reporter Privacy</label>
                <select 
                  id="identity-select"
                  className="form-select"
                  value={isAnonymous ? 'anon' : 'named'}
                  onChange={(e) => setIsAnonymous(e.target.value === 'anon')}
                >
                  <option value="anon">Anonymous Student</option>
                  <option value="named">Provide Name / Affiliation</option>
                </select>
              </div>
            </div>

            {!isAnonymous && (
              <div className="form-group">
                <label className="form-label" htmlFor="reporter-name-input">Reporter Name or ID</label>
                <input
                  id="reporter-name-input"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Morgan (RA, Dorm 4)"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                />
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="description-input">Physical Observations & Details *</label>
              <textarea
                id="description-input"
                className="form-textarea"
                placeholder="Describe visible damage, hazards, sounds (buzzing/water), or time of occurrence..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <span className="form-help">
                Location and physical details help the pattern detector identify spatial clusters.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={!title.trim() || !description.trim()}>
              <Send size={14} />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
