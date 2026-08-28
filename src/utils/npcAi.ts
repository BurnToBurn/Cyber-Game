export type NpcDestinationType = 
  | 'STATION' 
  | 'COFFEE' 
  | 'BREAKROOM' 
  | 'RESTROOM' 
  | 'WATER_COOLER';

export type NpcAiState = 
  | 'WORKING_AT_STATION' 
  | 'WALKING_TO_DESTINATION' 
  | 'AT_COFFEE' 
  | 'AT_BREAKROOM' 
  | 'AT_RESTROOM' 
  | 'RETURNING_TO_STATION';

export interface NpcAiSchedule {
  npcId: string;
  dataId: string;
  name: string;
  role: string;
  stationName: string;
  homeStation: { x: number; y: number };
  currentPos: { x: number; y: number };
  facing: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  state: NpcAiState;
  stateTimer: number; // in seconds
  walkFrame: number;
  isMoving: boolean;
  path: { x: number; y: number }[];
  targetDestination: {
    x: number;
    y: number;
    type: NpcDestinationType;
    name: string;
  } | null;
  activityMessage: string;
  workingMessages: string[];
  wanderCooldown: number; // seconds before can wander again
}

// Predefined wandering destination hotspots on the bank floor
export const BANK_FLOOR_DESTINATIONS = {
  COFFEE_STATION: { x: 2, y: 9, type: 'COFFEE' as NpcDestinationType, name: 'Easton Nitro Cold Brew Machine' },
  BREAKROOM_TABLE: { x: 4, y: 10, type: 'BREAKROOM' as NpcDestinationType, name: 'Employee Break Lounge Table' },
  WATER_COOLER: { x: 2, y: 11, type: 'WATER_COOLER' as NpcDestinationType, name: 'Purified Water Cooler' },
  RESTROOM_ENTRANCE: { x: 2, y: 13, type: 'RESTROOM' as NpcDestinationType, name: 'Executive Restroom Suite' }
};

// Initial Workstation assignments per NPC
export const NPC_WORKSTATION_CONFIG: Record<string, {
  name: string;
  role: string;
  stationName: string;
  homeStation: { x: number; y: number };
  initialFacing: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  initialDelay: number;
  workingMessages: string[];
}> = {
  npc_bob: {
    name: 'Bob Miller',
    role: 'Commercial Treasury & Fedwire',
    stationName: 'Fedwire Terminal 4A',
    homeStation: { x: 8, y: 2 },
    initialFacing: 'RIGHT',
    initialDelay: 15, // will wander after 15s
    workingMessages: [
      'Reconciling Fedwire batch #4092...',
      'Auditing ISO 20022 wire XML hashes...',
      'Reviewing high-value NACHA settlement...',
      'Verifying dual-control tokens on Hogan Core...'
    ]
  },
  npc_linda: {
    name: 'Linda Chen',
    role: 'VP Governance & GLBA Compliance',
    stationName: 'GLBA Compliance Workstation',
    homeStation: { x: 12, y: 4 },
    initialFacing: 'DOWN',
    initialDelay: 28, // will wander after 28s
    workingMessages: [
      'Auditing GLBA clean desk policy...',
      'Inspecting customer PII escrow logs...',
      'Reviewing OCC regulatory exam filings...',
      'Checking department access permissions...'
    ]
  },
  npc_dave: {
    name: "Dave 'Root' Kowalski",
    role: 'Core Mainframe & ATM Switch',
    stationName: 'HSM Cryptographic Mainframe',
    homeStation: { x: 18, y: 3 },
    initialFacing: 'LEFT',
    initialDelay: 8, // will wander after 8s
    workingMessages: [
      'Monitoring Diebold ATM switch latency...',
      'Inspecting HSM encryption hardware keys...',
      'Running Hogan Mainframe diagnostics...',
      'Checking thermal load on Core racks...'
    ]
  },
  npc_marcus: {
    name: 'Marcus Vance',
    role: 'Cyber Defense SOC Lead',
    stationName: 'SOC Perimeter Threat Console',
    homeStation: { x: 2, y: 2 },
    initialFacing: 'DOWN',
    initialDelay: 38, // will wander after 38s
    workingMessages: [
      'Monitoring DEFCON perimeter threat logs...',
      'Hunting active BEC spearphishing lures...',
      'Tracking inbound vishing caller telemetry...',
      'Coordinating SecOps response team...'
    ]
  },
  npc_karen: {
    name: 'Karen Sterling',
    role: 'Executive Board Risk Liaison',
    stationName: 'Executive Boardroom Table',
    homeStation: { x: 15, y: 10 },
    initialFacing: 'UP',
    initialDelay: 22, // will wander after 22s
    workingMessages: [
      'Prepping board risk & OCC exam docket...',
      'Reviewing wire dual-control signoffs...',
      'Liaising with executive risk council...',
      'Authorizing floor elevator security clearance...'
    ]
  }
};

/**
 * Breadth-First Search (BFS) shortest-path algorithm for grid navigation
 */
export function findPath(
  start: { x: number; y: number },
  target: { x: number; y: number },
  isWalkable: (x: number, y: number) => boolean,
  width: number,
  height: number
): { x: number; y: number }[] {
  if (start.x === target.x && start.y === target.y) return [];

  // If target itself is not walkable, find the closest walkable neighboring tile
  let effectiveTarget = target;
  if (!isWalkable(target.x, target.y)) {
    const neighbors = [
      { x: target.x + 1, y: target.y },
      { x: target.x - 1, y: target.y },
      { x: target.x, y: target.y + 1 },
      { x: target.x, y: target.y - 1 }
    ].filter(n => isWalkable(n.x, n.y));

    if (neighbors.length > 0) {
      effectiveTarget = neighbors[0];
    } else {
      return [];
    }
  }

  const queue: { x: number; y: number; path: { x: number; y: number }[] }[] = [
    { x: start.x, y: start.y, path: [] }
  ];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  const directions = [
    { dx: 0, dy: -1 }, // UP
    { dx: 0, dy: 1 },  // DOWN
    { dx: -1, dy: 0 }, // LEFT
    { dx: 1, dy: 0 }   // RIGHT
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.x === effectiveTarget.x && current.y === effectiveTarget.y) {
      return current.path;
    }

    for (const dir of directions) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;
      const key = `${nx},${ny}`;

      if (
        nx >= 0 && nx < width &&
        ny >= 0 && ny < height &&
        !visited.has(key) &&
        isWalkable(nx, ny)
      ) {
        visited.add(key);
        queue.push({
          x: nx,
          y: ny,
          path: [...current.path, { x: nx, y: ny }]
        });
      }
    }
  }

  return [];
}

/**
 * Initialize NPC AI state records for the floor
 */
export function createInitialNpcAiState(dataId: string, entityId: string): NpcAiSchedule {
  const config = NPC_WORKSTATION_CONFIG[dataId] || {
    name: 'Colleague',
    role: 'Staff',
    stationName: 'Workstation',
    homeStation: { x: 8, y: 2 },
    initialFacing: 'DOWN' as const,
    initialDelay: 20,
    workingMessages: ['Working at station...']
  };

  const initialMsg = config.workingMessages[Math.floor(Math.random() * config.workingMessages.length)];

  return {
    npcId: entityId,
    dataId,
    name: config.name,
    role: config.role,
    stationName: config.stationName,
    homeStation: config.homeStation,
    currentPos: { ...config.homeStation },
    facing: config.initialFacing,
    state: 'WORKING_AT_STATION',
    stateTimer: config.initialDelay,
    walkFrame: 0,
    isMoving: false,
    path: [],
    targetDestination: null,
    activityMessage: initialMsg,
    workingMessages: config.workingMessages,
    wanderCooldown: 25
  };
}

/**
 * Choose a random break destination (Coffee, Breakroom, Restroom, Water Cooler)
 */
export function pickRandomDestination(): {
  x: number;
  y: number;
  type: NpcDestinationType;
  name: string;
} {
  const destinations = [
    BANK_FLOOR_DESTINATIONS.COFFEE_STATION,
    BANK_FLOOR_DESTINATIONS.BREAKROOM_TABLE,
    BANK_FLOOR_DESTINATIONS.WATER_COOLER,
    BANK_FLOOR_DESTINATIONS.RESTROOM_ENTRANCE
  ];
  return destinations[Math.floor(Math.random() * destinations.length)];
}

/**
 * Get human-readable activity tag for UI badge
 */
export function getNpcActivityTag(state: NpcAiState, destinationType?: NpcDestinationType | null): {
  tag: string;
  icon: string;
  color: string;
} {
  switch (state) {
    case 'WORKING_AT_STATION':
      return { tag: 'AT WORKSTATION', icon: '💻', color: '#0284c7' };
    case 'WALKING_TO_DESTINATION':
      if (destinationType === 'COFFEE') return { tag: 'HEADING TO COFFEE', icon: '☕', color: '#d97706' };
      if (destinationType === 'RESTROOM') return { tag: 'HEADING TO RESTROOM', icon: '🚻', color: '#8b5cf6' };
      if (destinationType === 'WATER_COOLER') return { tag: 'HEADING TO WATER', icon: '🚰', color: '#06b6d4' };
      return { tag: 'WALKING TO BREAK', icon: '🚶', color: '#10b981' };
    case 'AT_COFFEE':
      return { tag: 'GRABBING NITRO COLD BREW', icon: '☕', color: '#d97706' };
    case 'AT_BREAKROOM':
      return { tag: 'BREAKROOM LOUNGE', icon: '🥪', color: '#10b981' };
    case 'AT_RESTROOM':
      return { tag: 'RESTROOM BREAK', icon: '🚻', color: '#8b5cf6' };
    case 'RETURNING_TO_STATION':
      return { tag: 'RETURNING TO DESK', icon: '💼', color: '#0284c7' };
    default:
      return { tag: 'ON DUTY', icon: '👤', color: '#64748b' };
  }
}
