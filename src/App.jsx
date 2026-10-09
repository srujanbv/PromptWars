import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import EvidenceAlert from './components/EvidenceAlert';
import PatternRadar from './components/PatternRadar';
import IncidentList from './components/IncidentList';
import IncidentForm from './components/IncidentForm';
import VerificationModal from './components/VerificationModal';
import IncidentDetailModal from './components/IncidentDetailModal';
import DemoPresetModal from './components/DemoPresetModal';
import { INITIAL_INCIDENTS } from './data/initialData';
import { analyzeIncidentPatterns } from './utils/patternEngine';
import { CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';

const STORAGE_KEY_INCIDENTS = 'echo_campus_incidents_v1';
const STORAGE_KEY_VERIFICATIONS = 'echo_campus_verifications_v1';
const STORAGE_KEY_THEME = 'echo_theme_preference';

export default function App() {
  // Theme state ('system' | 'light' | 'dark')
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_THEME) || 'system';
    } catch {
      return 'system';
    }
  });

  // Apply active theme to documentElement
  useEffect(() => {
    const applyTheme = () => {
      let resolved = themeMode;
      if (themeMode === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.style.colorScheme = resolved;
    };

    applyTheme();

    try {
      localStorage.setItem(STORAGE_KEY_THEME, themeMode);
    } catch (e) {
      console.error('Failed to save theme preference', e);
    }

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [themeMode]);

  // 1. State & LocalStorage Persistence
  const [incidents, setIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INCIDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load incidents from localStorage', e);
    }
    return INITIAL_INCIDENTS;
  });

  const [verifications, setVerifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VERIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load verifications from localStorage', e);
    }
    return {};
  });

  // UI Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [patternToVerify, setPatternToVerify] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INCIDENTS, JSON.stringify(incidents));
    } catch (e) {
      console.error('Failed to save incidents', e);
    }
  }, [incidents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VERIFICATIONS, JSON.stringify(verifications));
    } catch (e) {
      console.error('Failed to save verifications', e);
    }
  }, [verifications]);

  // 2. Client-side AI Pattern Analysis Engine
  const patterns = useMemo(() => {
    return analyzeIncidentPatterns(incidents, verifications);
  }, [incidents, verifications]);

  // Primary active pattern for the top Evidence Alert
  const topEvidencePattern = useMemo(() => {
    // Prioritize unverified high-incident pattern first, then verified
    const unverified = patterns.find(p => p.verification?.status === 'unverified');
    return unverified || patterns[0] || null;
  }, [patterns]);

  // 3. Toast notifications helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // 4. Handlers
  const handleCreateIncident = (newIncident) => {
    setIncidents(prev => [newIncident, ...prev]);
    addToast(`Report ${newIncident.id} logged. AI Pattern Radar scanning...`, 'success');
  };

  const handleUpvoteIncident = (id) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return { ...inc, upvotes: (inc.upvotes || 0) + 1 };
      }
      return inc;
    }));
    addToast('Corroboration logged (+1 student signal)', 'success');
  };

  const handleChangeStatus = (id, newStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        return { ...inc, status: newStatus };
      }
      return inc;
    }));
    addToast(`Incident ${id} marked as ${newStatus}`, 'info');
  };

  const handleSaveVerification = (patternId, verificationData) => {
    setVerifications(prev => ({
      ...prev,
      [patternId]: verificationData
    }));
    
    if (verificationData.status === 'verified_risk') {
      addToast(`Pattern ${patternId} confirmed as Verified Campus Risk`, 'alert');
    } else {
      addToast(`Pattern ${patternId} marked as Dismissed`, 'info');
    }
  };

  const handleInjectScenario = (preset) => {
    const newIncident = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: preset.title,
      category: preset.category,
      location: preset.location,
      zone: preset.zone,
      priority: preset.priority,
      status: 'New',
      timestamp: new Date().toISOString(),
      description: preset.description,
      reportedBy: 'Demo Scenario Trigger',
      upvotes: 3
    };
    handleCreateIncident(newIncident);
  };

  const handleResetData = () => {
    setIncidents(INITIAL_INCIDENTS);
    setVerifications({});
    localStorage.removeItem(STORAGE_KEY_INCIDENTS);
    localStorage.removeItem(STORAGE_KEY_VERIFICATIONS);
    addToast('Dashboard reset to initial 6 demo sample incidents', 'info');
  };

  // Find linked pattern for modal
  const linkedPatternForSelected = useMemo(() => {
    if (!selectedIncident) return null;
    return patterns.find(p => p.incidents.some(i => i.id === selectedIncident.id));
  }, [selectedIncident, patterns]);

  const verifiedCount = patterns.filter(p => p.verification?.status === 'verified_risk').length;

  return (
    <div className="app-layout">
      {/* Top Bar */}
      <Navbar
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        onResetData={handleResetData}
        clusterCount={patterns.length}
        verifiedCount={verifiedCount}
        themeMode={themeMode}
        onThemeChange={setThemeMode}
      />

      <main className="main-content">
        {/* KPI Metrics */}
        <StatsOverview
          incidents={incidents}
          patterns={patterns}
        />

        {/* Evidence-Based Alert Banner (Triggered when 2+ correlated reports exist) */}
        {topEvidencePattern && (
          <EvidenceAlert
            pattern={topEvidencePattern}
            onVerifyPattern={(pat) => setPatternToVerify(pat)}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
          />
        )}

        {/* Primary 2-Column Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column: Pattern Radar & Hotspot Clusters */}
          <PatternRadar
            patterns={patterns}
            onVerifyPattern={(pat) => setPatternToVerify(pat)}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
          />

          {/* Right Column: Live Incident Log & Submission Feed */}
          <IncidentList
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onUpvoteIncident={handleUpvoteIncident}
            onChangeStatus={handleChangeStatus}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        </div>
      </main>

      {/* Student Incident Report Modal */}
      <IncidentForm
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitIncident={handleCreateIncident}
      />

      {/* Human-in-the-loop Verification Modal */}
      <VerificationModal
        isOpen={!!patternToVerify}
        pattern={patternToVerify}
        onClose={() => setPatternToVerify(null)}
        onSaveVerification={handleSaveVerification}
      />

      {/* Incident Detail Drawer */}
      <IncidentDetailModal
        isOpen={!!selectedIncident}
        incident={selectedIncident}
        linkedPattern={linkedPatternForSelected}
        onClose={() => setSelectedIncident(null)}
        onUpvote={handleUpvoteIncident}
        onChangeStatus={handleChangeStatus}
        onVerifyPattern={(pat) => setPatternToVerify(pat)}
      />

      {/* Hackathon Demo Preset Scenarios Modal */}
      <DemoPresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onInjectScenario={handleInjectScenario}
      />

      {/* Floating Toast Notifications */}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'alert' && <AlertTriangle size={18} color="var(--amber-400)" />}
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--emerald-400)" />}
            {toast.type === 'info' && <Info size={18} color="var(--cyan-400)" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
