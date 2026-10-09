import React, { useState } from 'react';
import { Search, Filter, MapPin, ThumbsUp, Clock, Plus, Lightbulb, AlertTriangle, Wifi, Droplets, Lock, Volume2 } from 'lucide-react';
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

  return (
    <div className="incident-feed-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <Filter size={20} color="var(--purple-400)" />
            <span>Campus Incident Log ({filteredIncidents.length})</span>
          </h2>
          <p className="section-subtitle">
            Live crowdsourced student reports with real-time status and corroboration tracking
          </p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={onOpenReport}>
          <Plus size={15} />
          <span>New Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="incident-controls">
        <div className="search-input-wrapper">
          <Search size={16} className="search-input-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search reports by keyword, building, incident ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="filter-pills-row" role="tablist">
          <button
            className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Categories ({incidents.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = incidents.filter(i => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Secondary Priority & Status filters */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select 
            className="form-select" 
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>

          <select 
            className="form-select" 
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="New">Status: New</option>
            <option value="Investigating">Status: Investigating</option>
            <option value="Under Review">Status: Under Review</option>
            <option value="Resolved">Status: Resolved</option>
          </select>
        </div>
      </div>

      {/* Incident List Cards */}
      <div className="incidents-container">
        {filteredIncidents.length === 0 ? (
          <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
            No incidents found matching the selected filters.
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="incident-id-badge">{incident.id}</span>
                    <span 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.3rem', 
                        fontSize: '0.72rem', 
                        fontWeight: 600, 
                        color: catObj?.color || '#94a3b8' 
                      }}
                    >
                      <IconComp size={13} color={catObj?.color} />
                      {catObj?.label || incident.category}
                    </span>
                  </div>

                  <span className={`priority-tag priority-${incident.priority}`}>
                    {incident.priority}
                  </span>
                </div>

                <h3 className="incident-title">{incident.title}</h3>

                <div className="incident-location-line">
                  <MapPin size={13} color="var(--cyan-400)" />
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
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={12} />
                      {formatTimeAgo(incident.timestamp)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      className="upvote-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvoteIncident(incident.id);
                      }}
                      title="Corroborate this incident ('Me Too')"
                    >
                      <ThumbsUp size={13} />
                      <span>{incident.upvotes || 0} Corroborate</span>
                    </button>

                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
                      value={incident.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        onChangeStatus(incident.id, e.target.value);
                      }}
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
