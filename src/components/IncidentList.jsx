import React, { useState } from 'react';
import { Search, Filter, MapPin, ThumbsUp, Clock, Plus, AlertTriangle, Lightbulb, Wifi, Droplets, Lock, Volume2, RotateCcw } from 'lucide-react';
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

export default function IncidentList({ 
  incidents, 
  onSelectIncident, 
  onUpvoteIncident, 
  onChangeStatus,
  onOpenReport 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || inc.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || inc.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || inc.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setSelectedStatus('all');
  };

  return (
    <div className="incident-feed-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Filter size={19} color="var(--accent-teal)" />
            <span>Campus Incident Log ({filteredIncidents.length})</span>
          </h2>
          <p className="section-subtitle">
            Operational queue of crowdsourced student problem reports and live status telemetry
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onOpenReport}>
          <Plus size={14} />
          <span>+ Log Incident</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="incident-controls">
        <div className="search-input-wrapper">
          <Search size={15} className="search-input-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Filter incidents by keyword, building, or #ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Filter incidents"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="filter-pills-row" role="tablist" aria-label="Category filters">
          <button
            type="button"
            className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All ({incidents.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = incidents.filter(i => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Priority & Status Dropdowns */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select 
            className="form-select" 
            style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Priority: Low</option>
            <option value="Medium">Priority: Medium</option>
            <option value="High">Priority: High</option>
            <option value="Critical">Priority: Critical</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="New">Status: New</option>
            <option value="Investigating">Status: Investigating</option>
            <option value="Under Review">Status: Under Review</option>
            <option value="Resolved">Status: Resolved</option>
          </select>

          {(searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleResetFilters}
              style={{ fontSize: '0.74rem', padding: '0.3rem 0.6rem' }}
            >
              <RotateCcw size={12} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Incident List Cards */}
      <div className="incidents-container">
        {filteredIncidents.length === 0 ? (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              No matching incidents found
            </p>
            <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
              Try adjusting your search query or clear category/priority filters.
            </p>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          filteredIncidents.map((incident) => {
            const catObj = CATEGORIES.find(c => c.id === incident.category);
            const IconComp = catObj ? ICONS_MAP[catObj.icon] : AlertTriangle;
            const statusClass = `status-${incident.status.replace(/\s+/g, '_')}`;

            return (
              <div 
                key={incident.id} 
                className="incident-card"
                onClick={() => onSelectIncident(incident)}
              >
                <div className="incident-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <span className="incident-id-badge">{incident.id}</span>
                    <span 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.25rem', 
                        fontSize: '0.72rem', 
                        fontWeight: 600, 
                        color: catObj?.color || 'var(--text-muted)' 
                      }}
                    >
                      <IconComp size={12} color={catObj?.color} />
                      {catObj?.label || incident.category}
                    </span>
                  </div>

                  <span className={`priority-tag priority-${incident.priority}`}>
                    {incident.priority}
                  </span>
                </div>

                <h3 className="incident-title">{incident.title}</h3>

                <div className="incident-location-line">
                  <MapPin size={12} color="var(--accent-cyan)" />
                  <span><strong>{incident.location}</strong> {incident.zone ? `— ${incident.zone}` : ''}</span>
                </div>

                <p className="incident-desc">
                  {incident.description}
                </p>

                <div className="incident-footer">
                  <div className="incident-meta-left">
                    <span className={`status-badge ${statusClass}`}>
                      {incident.status}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={11} />
                      {formatTimeAgo(incident.timestamp)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="upvote-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvoteIncident(incident.id);
                      }}
                      title="Corroborate this report ('Me Too')"
                    >
                      <ThumbsUp size={12} />
                      <span>{incident.upvotes || 0} Corroborate</span>
                    </button>

                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '0.2rem 0.45rem', fontSize: '0.72rem' }}
                      value={incident.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        onChangeStatus(incident.id, e.target.value);
                      }}
                      aria-label={`Change status for incident ${incident.id}`}
                    >
                      <option value="New">New</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
