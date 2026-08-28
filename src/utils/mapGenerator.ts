import { MapGrid, TileType, OfficeEntity } from '../types';
import { generateRandomOfficeCollectibles } from '../data/officeCollectibles';

export function getFloorTitle(floorNumber: number): string {
  const titles = [
    'Floor 1: Dunder Mifflin Scranton Branch (1725 Slough Ave • Sales & Reception)',
    'Floor 2: Commercial Treasury & Accounting Floor (Fedwire & Ledger Vault)',
    'Floor 3: Scranton Server Annex & HSM Cryptographic Vault (Air-Gapped)',
    'Floor 4: Regional SOC & "Threat Level Midnight" Cyber Defense Center',
    'Floor 5: Corporate Boardroom & Executive CISO Suite (NYC 6th Floor)'
  ];
  return titles[Math.min(titles.length - 1, floorNumber - 1)] || `Floor ${floorNumber}: Advanced Cyber Defense Enclave`;
}

export function generateOfficeFloor(floorNumber: number): MapGrid {
  const width = 22;
  const height = 15;

  // Initialize with walls
  const tiles: TileType[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 'WALL' as TileType)
  );

  // Carve main banking zones:
  // 1. Reception & Security Checkpoint (Left: x: 1..6, y: 1..6)
  // 2. Commercial Banking Cubicle Farm (Center: x: 7..15, y: 1..8)
  // 3. Easton Breakroom & Coffee Lounge (Bottom Left: x: 1..7, y: 8..13)
  // 4. Core Mainframe / HSM Server Vault (Right top: x: 16..20, y: 1..7)
  // 5. Boardroom & Regulatory Elevator Zone (Right bottom: x: 9..20, y: 9..13)
  // 6. Connecting Corridors

  // Carve Reception
  for (let y = 1; y <= 6; y++) {
    for (let x = 1; x <= 6; x++) {
      tiles[y][x] = (x === 1 || y === 1 || x === 6 || y === 6) ? 'FLOOR' : 'CARPET';
    }
  }

  // Carve Cubicle Zone
  for (let y = 1; y <= 8; y++) {
    for (let x = 7; x <= 15; x++) {
      tiles[y][x] = 'FLOOR';
    }
  }

  // Carve Breakroom
  for (let y = 8; y <= 13; y++) {
    for (let x = 1; x <= 7; x++) {
      tiles[y][x] = 'FLOOR';
    }
  }

  // Carve Server Room
  for (let y = 1; y <= 7; y++) {
    for (let x = 16; x <= 20; x++) {
      tiles[y][x] = 'CARPET';
    }
  }

  // Carve Boardroom & Elevator Hall
  for (let y = 9; y <= 13; y++) {
    for (let x = 9; x <= 20; x++) {
      tiles[y][x] = (x >= 12 && x <= 18 && y >= 10 && y <= 12) ? 'CARPET' : 'FLOOR';
    }
  }

  // Corridors & connections
  for (let x = 1; x <= 20; x++) {
    tiles[7][x] = 'FLOOR'; // Main horizontal hallway
  }
  for (let y = 1; y <= 13; y++) {
    tiles[y][8] = 'FLOOR'; // Main vertical hallway
    tiles[y][15] = 'FLOOR'; // Server hall
  }

  // Specific furniture placements
  // Plants
  tiles[1][1] = 'PLANT';
  tiles[1][20] = 'PLANT';
  tiles[13][1] = 'PLANT';
  tiles[13][20] = 'PLANT';

  // Windows along top wall
  tiles[0][3] = 'WINDOW';
  tiles[0][11] = 'WINDOW';
  tiles[0][18] = 'WINDOW';

  // Desks in Commercial Banking Zone
  tiles[2][9] = 'DESK';
  tiles[2][10] = 'DESK';
  tiles[2][13] = 'DESK';
  tiles[2][14] = 'DESK';

  tiles[4][9] = 'DESK';
  tiles[4][10] = 'DESK';
  tiles[4][13] = 'DESK';
  tiles[4][14] = 'DESK';

  // Server Racks in Core Banking / HSM Vault
  tiles[2][17] = 'SERVER';
  tiles[2][19] = 'SERVER';
  tiles[4][17] = 'SERVER';
  tiles[4][19] = 'SERVER';

  // Breakroom Coffee & Water Cooler & Restroom Suite
  tiles[9][1] = 'COFFEE_STATION';
  tiles[11][1] = 'WATER_COOLER';
  tiles[9][4] = 'DESK'; // Breakroom Cafe Table
  tiles[9][5] = 'DESK'; // Breakroom Cafe Table

  // Restroom Suite (Executive & Staff Washroom)
  tiles[12][1] = 'RESTROOM';
  tiles[13][1] = 'RESTROOM';
  tiles[12][2] = 'RESTROOM';
  tiles[13][2] = 'FLOOR'; // Entrance aisle

  // Boardroom Whiteboard & Large Table
  tiles[9][15] = 'WHITEBOARD';
  tiles[11][14] = 'DESK';
  tiles[11][15] = 'DESK';
  tiles[11][16] = 'DESK';

  // High-Speed Bank Printer in hallway
  tiles[6][14] = 'PRINTER';

  // The Office Special Prop Tiles
  tiles[2][10] = 'JELLO_STAPLER'; // Jim's classic prank stapler
  tiles[11][16] = 'DUNDIE_DISPLAY'; // Dundie trophy collection
  tiles[1][19] = 'PAPER_STACK'; // Dunder Mifflin 24lb bond paper
  tiles[12][6] = 'PAPER_STACK';

  // Elevator at the far right
  const elevatorPos = { x: 20, y: 11 };
  tiles[elevatorPos.y][elevatorPos.x] = 'ELEVATOR';

  // Player spawn in reception
  const playerSpawn = { x: 3, y: 4 };

  // Entities generation based on floor
  const entities: OfficeEntity[] = [];

  // 1. Phishing Terminal in Commercial Banking Cubicle area
  entities.push({
    id: `terminal_floor_${floorNumber}_1`,
    type: 'TERMINAL',
    x: 10,
    y: 3,
    name: 'Commercial Lending Terminal #4A (Hogan Core)',
    description: 'Blinking unread email notification regarding pending commercial wire instructions.',
    status: 'ACTIVE',
    difficulty: Math.min(3, floorNumber) as 1 | 2 | 3
  });

  // 2. Second Terminal in Mainframe / Treasury Area
  entities.push({
    id: `terminal_floor_${floorNumber}_2`,
    type: 'TERMINAL',
    x: 18,
    y: 5,
    name: 'Huntington Cyber Defense & Fedwire Audit Console',
    description: 'High-priority suspicious settlement alert flagged by automated perimeter filter.',
    status: 'ACTIVE',
    difficulty: Math.min(3, floorNumber + 1) as 1 | 2 | 3
  });

  // 3. Ringing Desk Phone
  entities.push({
    id: `phone_floor_${floorNumber}_1`,
    type: 'PHONE',
    x: 13,
    y: 3,
    name: 'Ringing Branch Desk Phone (Ext. 4091)',
    description: 'A high-pressure caller is on the line demanding urgent core banking verification.',
    status: 'ACTIVE',
    difficulty: Math.min(3, floorNumber) as 1 | 2 | 3
  });

  // 4. Coffee Machine in breakroom
  entities.push({
    id: `coffee_floor_${floorNumber}`,
    type: 'COFFEE_MACHINE',
    x: 1,
    y: 9,
    name: 'Easton Nitro Cold Brew Machine',
    description: 'Fresh roast. Restores stamina and grants hyperfocus inspection vision.',
    status: 'ACTIVE'
  });

  // 5. USB Drop on breakroom floor
  entities.push({
    id: `usb_floor_${floorNumber}`,
    type: 'USB_DROP',
    x: 4,
    y: 11,
    name: 'Dropped Flash Drive (Label: HNB_Commercial_Loans_Q4)',
    description: 'A metallic USB flash drive with handwritten banking label found on the rug.',
    status: 'ACTIVE'
  });

  // 6. Unlocked PC / Clean Desk Spot in Cubicle
  entities.push({
    id: `cleandesk_floor_${floorNumber}`,
    type: 'UNLOCKED_PC',
    x: 9,
    y: 5,
    name: 'Unlocked Commercial Lending Workstation (GLBA Violation)',
    description: 'Monitor displaying unmasked customer SSNs and loan records with a password sticky note.',
    status: 'ACTIVE'
  });

  // 7. Elevator Exit Entity
  entities.push({
    id: `elevator_exit_${floorNumber}`,
    type: 'ELEVATOR_EXIT',
    x: elevatorPos.x,
    y: elevatorPos.y,
    name: `Floor ${floorNumber} Secure Elevator to ${floorNumber < 5 ? `Floor ${floorNumber + 1}` : 'Executive CISO Suite'}`,
    description: 'Requires completing bank defense objectives and maintaining low threat level.',
    status: 'LOCKED'
  });

  // 8. Office Coworkers / NPCs
  // Bob Miller (Commercial Wire & Treasury) in cubicles
  entities.push({
    id: `npc_bob_${floorNumber}`,
    type: 'NPC_COWORKER',
    x: 8,
    y: 2,
    name: 'Bob Miller (Commercial Treasury)',
    description: 'Stressed wire officer managing end-of-day Fedwire and NACHA batch reconciliation.',
    status: 'ACTIVE',
    dataId: 'npc_bob'
  });

  // Linda Chen (VP Regulatory Compliance & GLBA) at compliance desk
  entities.push({
    id: `npc_linda_${floorNumber}`,
    type: 'NPC_COWORKER',
    x: 12,
    y: 4,
    name: 'Linda Chen (VP Compliance & GLBA)',
    description: 'Risk director auditing clean desk policy and customer PII data protection.',
    status: 'ACTIVE',
    dataId: 'npc_linda'
  });

  // Dave 'Root' Kowalski in Server Room
  entities.push({
    id: `npc_dave_${floorNumber}`,
    type: 'NPC_COWORKER',
    x: 18,
    y: 3,
    name: "Dave 'Root' (Core Mainframe & ATM Switch)",
    description: 'Veteran infrastructure engineer guarding hardware security modules and Diebold ATM switches.',
    status: 'ACTIVE',
    dataId: 'npc_dave'
  });

  // Marcus Vance (Huntington Cyber Defense Commander) in Strategy/Reception area
  entities.push({
    id: `npc_marcus_${floorNumber}`,
    type: 'NPC_COWORKER',
    x: 2,
    y: 2,
    name: 'Marcus Vance (Cyber Defense SOC Lead)',
    description: 'Tactical incident commander tracking bank DEFCON threat level and vishing attacks.',
    status: 'ACTIVE',
    dataId: 'npc_marcus'
  });

  // Karen Sterling (Executive Treasury Liaison) at Boardroom station
  entities.push({
    id: `npc_karen_${floorNumber}`,
    type: 'NPC_COWORKER',
    x: 15,
    y: 10,
    name: 'Karen Sterling (Board Risk Liaison)',
    description: 'Executive liaison managing OCC examination clearance and elevator gate security.',
    status: 'ACTIVE',
    dataId: 'npc_karen'
  });

  // 9. Procedurally Placed Randomized 'The Office' Desk Collectibles
  // Gather all desk locations and open floor/carpet spaces
  const deskLocations: { x: number; y: number }[] = [];
  const openTileLocations: { x: number; y: number }[] = [];
  const blockedPositions = new Set<string>();

  // Mark all existing entity positions as blocked
  entities.forEach(e => {
    blockedPositions.add(`${e.x},${e.y}`);
  });
  blockedPositions.add(`${playerSpawn.x},${playerSpawn.y}`);
  blockedPositions.add(`${elevatorPos.x},${elevatorPos.y}`);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const tile = tiles[y][x];
      if (tile === 'DESK') {
        deskLocations.push({ x, y });
      } else if (tile === 'FLOOR' || tile === 'CARPET') {
        openTileLocations.push({ x, y });
      }
    }
  }

  // Generate 3 to 5 randomized collectibles (Staplers in Jell-O, Beet Carvings, Dundie Trophies, etc.)
  const officeCollectibles = generateRandomOfficeCollectibles(
    floorNumber,
    deskLocations,
    openTileLocations,
    blockedPositions
  );

  entities.push(...officeCollectibles);

  return {
    width,
    height,
    tiles,
    entities,
    playerSpawn,
    elevatorPos
  };
}
