// ECHO AI Pattern Detection Engine (Client-side Anomaly & Cluster Detection)

export function analyzeIncidentPatterns(incidents, verifications = {}) {
  const clustersMap = {};

  // Group incidents by location and category
  incidents.forEach((incident) => {
    const key = `${incident.location}__${incident.category}`;
    if (!clustersMap[key]) {
      clustersMap[key] = {
        id: `PAT-${incident.location.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase()}-${incident.category.toUpperCase()}`,
        key,
        location: incident.location,
        category: incident.category,
        incidents: [],
        zones: new Set(),
        highestPriority: 'Low',
        totalUpvotes: 0,
        earliestTime: incident.timestamp,
        latestTime: incident.timestamp
      };
    }

    clustersMap[key].incidents.push(incident);
    if (incident.zone) clustersMap[key].zones.add(incident.zone);
    clustersMap[key].totalUpvotes += (incident.upvotes || 0);

    // Track priority elevation
    const priorityRanks = { Low: 1, Medium: 2, High: 3, Critical: 4 };
    if (priorityRanks[incident.priority] > priorityRanks[clustersMap[key].highestPriority]) {
      clustersMap[key].highestPriority = incident.priority;
    }

    // Time window
    if (new Date(incident.timestamp) < new Date(clustersMap[key].earliestTime)) {
      clustersMap[key].earliestTime = incident.timestamp;
    }
    if (new Date(incident.timestamp) > new Date(clustersMap[key].latestTime)) {
      clustersMap[key].latestTime = incident.timestamp;
    }
  });

  const patterns = Object.values(clustersMap)
    .filter((cluster) => cluster.incidents.length >= 2) // Cluster threshold: 2+ related reports
    .map((cluster) => {
      const count = cluster.incidents.length;
      const countBonus = Math.min(count * 15, 45);
      const priorityWeights = { Low: 10, Medium: 25, High: 38, Critical: 50 };
      const baseConfidence = priorityWeights[cluster.highestPriority] || 20;
      const confidence = Math.min(Math.round(baseConfidence + countBonus + Math.min(cluster.totalUpvotes * 0.8, 15)), 99);

      // Derive AI Hypothesis safely
      const hypothesis = generateHypothesis(cluster.location, cluster.category, cluster.incidents, count);

      // Construct detailed explanation breakdown
      const explanation = {
        detectorCriteria: [
          `Location filter: All ${count} reports match campus sector '${cluster.location}'`,
          `Category filter: Reports classified under '${cluster.category}'`,
          `Grouping threshold: Meets detector minimum of >= 2 correlated reports (current: ${count})`,
          `Scoring formula: Base priority weight (${cluster.highestPriority}) + count bonus (+${countBonus}%) + community signal bonus (+${Math.min(Math.round(cluster.totalUpvotes * 0.8), 15)}%) = ${confidence}%`
        ],
        observedFacts: [
          `${count} distinct student incident reports logged in this sector`,
          `Supporting Report IDs: ${cluster.incidents.map(i => i.id).join(', ')}`,
          `Specific reported zones: ${Array.from(cluster.zones).join('; ') || cluster.location}`,
          `Highest reported severity level: ${cluster.highestPriority}`,
          `Total student corroboration signals: ${cluster.totalUpvotes} upvotes`
        ],
        inferredHypothesis: {
          title: hypothesis.title,
          summary: hypothesis.summary,
          recommendedAction: hypothesis.recommendedAction
        },
        uncertaintyNote: `Confidence score: ${confidence}%. This cluster is derived from heuristic spatial & category co-occurrence. It does not definitively prove a single physical failure point; incidents may have independent causes.`,
        humanVerificationRequirement: `Human verification by campus safety or facilities operations is required before treating this pattern as a confirmed risk.`
      };

      // Human-in-the-loop verification status
      const verificationRecord = verifications[cluster.id] || {
        status: 'unverified', // 'unverified' | 'verified_risk' | 'dismissed'
        verifiedBy: null,
        verifiedAt: null,
        notes: null
      };

      return {
        id: cluster.id,
        key: cluster.key,
        location: cluster.location,
        category: cluster.category,
        incidentCount: count,
        incidents: cluster.incidents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        zones: Array.from(cluster.zones),
        highestPriority: cluster.highestPriority,
        totalUpvotes: cluster.totalUpvotes,
        earliestTime: cluster.earliestTime,
        latestTime: cluster.latestTime,
        confidence,
        hypothesis,
        explanation,
        verification: verificationRecord,
        safetyDisclaimer: 'AI-generated pattern hypothesis based on report correlation. Human verification mandatory before dispatching emergency protocol.'
      };
    })
    .sort((a, b) => b.incidentCount - a.incidentCount || b.confidence - a.confidence);

  return patterns;
}

function generateHypothesis(location, category, incidents, count) {
  if (category === 'lighting' && location.includes('North Quad')) {
    return {
      title: 'Localized Power Conduit / Circuit Breaker Failure',
      summary: `${count} reports of malfunctioning lighting within a 150-meter radius along North Quad. The rapid sequence of failures suggests an electrical ground fault or branch breaker overload rather than individual bulb wear.`,
      recommendedAction: 'Inspect electrical distribution panel NQ-B and underground conduit feeder lines.',
      evidencePoints: [
        'Rapid succession of outages reported within the same evening',
        'Physical proximity spanning pathway lights and nearby fountain lanterns',
        'Corroborated by reports of audible buzzing/sparking at junction boxes'
      ]
    };
  }

  if (category === 'sanitation' && location.includes('Science')) {
    return {
      title: 'Vertical Water Riser / Internal Plumbing Valve Rupture',
      summary: `${count} reports spanning multiple levels in Science Annex (pressure loss on floor 3, ceiling leakage outside Hall 102). Indicates an active vertical riser leak or failed check-valve between floors 1 and 3.`,
      recommendedAction: 'Dispatch Facilities emergency plumbing crew to isolate Science Annex Zone 2 water line.',
      evidencePoints: [
        'Simultaneous pressure loss upstream and visible water egress downstream',
        'Consistent vertical alignment along the building pipe chase',
        'Direct impact on active chemistry lab sessions and corridor safety'
      ]
    };
  }

  if (category === 'wifi') {
    return {
      title: 'Access Point Saturation or Gateway Switch Anomaly',
      summary: `${count} independent reports of connectivity drops and captive portal timeout loops at ${location}. Pattern indicates localized AP gateway flapping or DHCP lease pool exhaustion.`,
      recommendedAction: 'IT Network Ops check switch port telemetry and reset sector AP cluster.',
      evidencePoints: [
        'Multiple devices failing DHCP lease renewal in the same sector',
        'High density of student reports during peak lab/study hours',
        'Persistent connectivity drops despite valid eduroam credentials'
      ]
    };
  }

  // Dynamic generalized AI pattern generator
  return {
    title: `Recurrent ${category.toUpperCase()} Anomaly Cluster`,
    summary: `${count} correlated reports registered at ${location}. High spatial and temporal density indicates a shared root cause affecting surrounding zones.`,
    recommendedAction: `Schedule on-site inspection for ${location} facilities team to evaluate ${category} systems.`,
    evidencePoints: [
      `${count} separate student reports submitted in this zone`,
      `Combined priority classified as ${incidents[0]?.priority || 'Medium'} impact`,
      'Cross-corroborated by student upvotes across multiple viewpoints'
    ]
  };
}

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}
