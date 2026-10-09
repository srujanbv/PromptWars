export const CATEGORIES = [
  { id: 'lighting', label: 'Lighting & Safety', color: '#a855f7', icon: 'Lightbulb' },
  { id: 'infrastructure', label: 'Infrastructure & Hazard', color: '#f59e0b', icon: 'AlertTriangle' },
  { id: 'wifi', label: 'Wi-Fi & Network', color: '#06b6d4', icon: 'Wifi' },
  { id: 'sanitation', label: 'Sanitation & Plumbing', color: '#38bdf8', icon: 'Droplets' },
  { id: 'access', label: 'Access & Security', color: '#ec4899', icon: 'Lock' },
  { id: 'noise', label: 'Noise & Disturbance', color: '#84cc16', icon: 'Volume2' }
];

export const CAMPUS_LOCATIONS = [
  'North Quad Walkway',
  'Science Annex',
  'Library Quad',
  'Engineering Hall B2',
  'West Dorms & Annex',
  'Student Union Plaza',
  'East Parking Lot C',
  'Dining Commons'
];

export const INITIAL_INCIDENTS = [
  {
    id: 'INC-2041',
    title: 'Flickering overhead floodlight near North Quad Walkway',
    category: 'lighting',
    location: 'North Quad Walkway',
    zone: 'Near Pillar 3 & Birch Trees',
    priority: 'Medium',
    status: 'Investigating',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    description: 'The main tall lamppost along the student walkway is rapidly blinking and buzzing. Area gets pitch black when it goes off.',
    reportedBy: 'Student #412 (Verified)',
    upvotes: 6,
    impact: 'Low visibility for pedestrians after sunset'
  },
  {
    id: 'INC-2042',
    title: 'Total lighting blackout on Pathway B near North Quad',
    category: 'lighting',
    location: 'North Quad Walkway',
    zone: 'Pathway B connecting Library to North Quad',
    priority: 'High',
    status: 'New',
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 mins ago
    description: 'All three ground walkway bollards are completely dead. Extremely dark stretch between the dorms and dining hall.',
    reportedBy: 'Student #893',
    upvotes: 11,
    impact: 'Walking hazard, students taking alternate longer routes'
  },
  {
    id: 'INC-2043',
    title: 'Sparking ground lantern near North Quad fountain',
    category: 'lighting',
    location: 'North Quad Walkway',
    zone: 'East side of fountain basin',
    priority: 'High',
    status: 'Under Review',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    description: 'Heard a loud pop and saw small sparks from the base of the lantern post. Looks like water may have leaked into the wiring box.',
    reportedBy: 'RA Marcus T.',
    upvotes: 14,
    impact: 'Electrical hazard near pedestrian traffic'
  },
  {
    id: 'INC-2038',
    title: 'Major water pressure drop and discolored water in 3rd floor restrooms',
    category: 'sanitation',
    location: 'Science Annex',
    zone: 'West Wing Restrooms (Floors 2-3)',
    priority: 'High',
    status: 'Investigating',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    description: 'Sinks on 3rd floor are sputtering rust-tinted water and toilets are slow to fill. Chemistry lab students noticed weak tap pressure.',
    reportedBy: 'Lab Assistant Sarah',
    upvotes: 8,
    impact: 'Disrupted lab preparations & sanitation'
  },
  {
    id: 'INC-2039',
    title: 'Ceiling drip & wet floor outside Chemistry Lecture Hall 102',
    category: 'sanitation',
    location: 'Science Annex',
    zone: '1st Floor Hallway ceiling below 2nd floor pipe shaft',
    priority: 'Medium',
    status: 'New',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    description: 'Water dripping consistently from acoustic ceiling tiles right in front of Room 102. Slippery floor tile hazard.',
    reportedBy: 'Student #108',
    upvotes: 4,
    impact: 'Slip & fall hazard near high traffic hall'
  },
  {
    id: 'INC-2035',
    title: 'Frequent Wi-Fi packet drops and captive portal loops in Basement',
    category: 'wifi',
    location: 'Engineering Hall B2',
    zone: 'Robotics & Hardware Labs',
    priority: 'Medium',
    status: 'Investigating',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    description: 'Campus eduroam and guest Wi-Fi dropping every 3 minutes. Can not download repo code or submit assignments during lab session.',
    reportedBy: 'IEEE Student Chapter',
    upvotes: 19,
    impact: 'Academic coursework disruption'
  },
  {
    id: 'INC-2030',
    title: 'Keycard magnetic lock latch failing to engage after 8 PM',
    category: 'access',
    location: 'West Dorms & Annex',
    zone: 'Side Entrance Gate C',
    priority: 'High',
    status: 'New',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // 5 hours ago
    description: 'The magnetic reader flashes green but the latch mechanism sticks open. Anyone can pull the door open without a student ID swipe.',
    reportedBy: 'Dorm Resident Alex P.',
    upvotes: 9,
    impact: 'Dorm perimeter security concern'
  }
];

export const DEMO_PRESETS = [
  {
    label: 'Corroborate North Quad Electrical Anomaly',
    title: 'Buzzing junction box and total light blackout near North Quad benches',
    category: 'lighting',
    location: 'North Quad Walkway',
    zone: 'Bench seating area near North Path',
    priority: 'High',
    description: 'Third light post this evening is completely dark. High-pitched electrical hum coming from the ground enclosure.',
    urgency: 'High'
  },
  {
    label: 'Trigger Science Annex Pipe Burst Cluster',
    title: 'Flooding in Science Annex basement corridor',
    category: 'sanitation',
    location: 'Science Annex',
    zone: 'Basement Storage & Mechanical Room B4',
    priority: 'Critical',
    description: 'Standing water about 2 inches deep accumulating rapidly under the supply pipe junction. Needs urgent shutoff.',
    urgency: 'Critical'
  },
  {
    label: 'Report Wi-Fi Dead Zone in Library',
    title: 'Library 3rd floor quiet study Wi-Fi down',
    category: 'wifi',
    location: 'Library Quad',
    zone: '3rd Floor South Wing Stacks',
    priority: 'Medium',
    description: 'No access point broadcast detected on 3rd floor study carrels. Over 30 students disconnected.',
    urgency: 'Medium'
  }
];
