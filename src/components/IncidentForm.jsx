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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Send size={20} color="var(--purple-400)" />
            <span>Report Campus Issue</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Quick Demo Preset Trigger */}
            <div className="demo-preset-panel">
              <div className="demo-preset-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={14} /> Hackathon Live Demo Presets
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>1-Click populate</span>
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
                    <span style={{ color: 'var(--cyan-400)', fontSize: '0.72rem' }}>Fill Form &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div className="form-group">
              <label className="form-label">Issue Category *</label>
              <div className="category-radio-grid">
                {CATEGORIES.map((cat) => {
                  const IconComp = ICONS_MAP[cat.icon] || AlertTriangle;
                  const isSelected = category === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-radio-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setCategory(cat.id)}
                      style={isSelected ? { borderColor: cat.color, color: '#fff' } : {}}
                    >
                      <IconComp size={16} color={isSelected ? cat.color : '#94a3b8'} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Issue Title / Summary *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Blown fuse / dark walkway near Chemistry wing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Location & Zone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Campus Location *</label>
                <select 
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
                <label className="form-label">Specific Zone / Pillar / Floor</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2nd Floor West Wing"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                />
              </div>
            </div>

            {/* Priority & Anonymity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Urgency / Severity</label>
                <select 
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Low">Low — Minor inconvenience</option>
                  <option value="Medium">Medium — Moderate disruption</option>
                  <option value="High">High — Safety or access hazard</option>
                  <option value="Critical">Critical — Urgent campus safety</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reporter Identity</label>
                <select 
                  className="form-select"
                  value={isAnonymous ? 'anon' : 'named'}
                  onChange={(e) => setIsAnonymous(e.target.value === 'anon')}
                >
                  <option value="anon">Anonymous Student</option>
                  <option value="named">Provide Name / ID</option>
                </select>
              </div>
            </div>

            {!isAnonymous && (
              <div className="form-group">
                <label className="form-label">Your Name or Student Email</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Morgan (Room 304)"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                />
              </div>
            )}

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Detailed Observations *</label>
              <textarea
                className="form-textarea"
                placeholder="Describe what you observed, visible hazards, sounds (buzzing/water), or time of failure..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <span className="form-help">
                Tip: Corroborating physical details helps ECHO's AI cluster engine identify shared root causes.
              </span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim() || !description.trim()}>
              <Send size={16} />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
