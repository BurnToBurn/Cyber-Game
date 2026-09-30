import React from 'react';

export type CharacterId = 
  | 'player_alex' 
  | 'player_maya' 
  | 'player_jordan' 
  | 'player_samira'
  | 'npc_bob' 
  | 'npc_linda' 
  | 'npc_dave' 
  | 'npc_marcus' 
  | 'npc_karen';

const LEGACY_OPERATIVE_IDS = new Set([
  'player_dwight',
  'player_jim',
  'player_pam',
  'player_michael',
  'player_stanley',
  'player_angela',
  'player_kevin'
]);

export interface OperativeProfile {
  id: CharacterId;
  name: string;
  callsign: string;
  role: string;
  color: string;
  accentColor: string;
  description: string;
  specialty: string;
  quote?: string;
}

export const PLAYABLE_OPERATIVES: OperativeProfile[] = [
  {
    id: 'player_alex',
    name: 'Alex Chen',
    callsign: 'ANALYST',
    role: 'Security analyst',
    color: '#00693e',
    accentColor: '#34d399',
    description: 'Investigates suspicious messages and protects company accounts.',
    specialty: 'Phishing investigation'
  },
  {
    id: 'player_maya',
    name: 'Maya Lin',
    callsign: 'FORENSICS',
    role: 'Malware analyst',
    color: '#d946ef',
    accentColor: '#f472b6',
    description: 'Examines suspicious files in a safe environment.',
    specialty: 'Malware analysis'
  },
  {
    id: 'player_jordan',
    name: 'Jordan Cruz',
    callsign: 'RESPONSE',
    role: 'Incident responder',
    color: '#d97706',
    accentColor: '#fbbf24',
    description: 'Coordinates the response when an attack is detected.',
    specialty: 'Incident response'
  },
  {
    id: 'player_samira',
    name: 'Samira Khan',
    callsign: 'DEFENDER',
    role: 'Security engineer',
    color: '#059669',
    accentColor: '#6ee7b7',
    description: 'Helps secure devices, accounts, and the workplace.',
    specialty: 'Security operations'
  }
];

interface PixelCharacterProps {
  id: CharacterId | string;
  direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  size?: 'sm' | 'md' | 'lg' | 'portrait';
  isMoving?: boolean;
  walkFrame?: number;
  mood?: 'CALM' | 'PANICKED' | 'SUSPICIOUS' | 'GRATEFUL' | 'CYNICAL';
  className?: string;
}

export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  id,
  direction = 'DOWN',
  size = 'md',
  isMoving = false,
  walkFrame = 0,
  mood = 'CALM',
  className = ''
}) => {
  // Normalize id
  const requestedId = id.startsWith('npc_') ? id : id.startsWith('player_') ? id : `player_${id}`;
  const charId = LEGACY_OPERATIVE_IDS.has(requestedId) ? 'player_alex' : requestedId;

  const isFlipped = direction === 'LEFT';

  // Size definitions in pixels
  const dimensions = {
    sm: { width: 28, height: 36, viewBox: '0 0 24 32' },
    md: { width: 40, height: 50, viewBox: '0 0 24 32' },
    lg: { width: 56, height: 70, viewBox: '0 0 24 32' },
    portrait: { width: 96, height: 112, viewBox: '0 0 24 32' }
  }[size];

  // Walking bounce / step bob calculation
  const walkBobY = isMoving ? (walkFrame % 2 === 0 ? -1 : 1) : 0;
  const walkLegOffset = isMoving ? (walkFrame % 2 === 0 ? 1 : -1) : 0;

  // Render character specific pixel art layers
  const renderCharacterPixels = () => {
    switch (charId) {
      // ==========================================
      // Legacy avatar
      // ==========================================
      case 'player_dwight':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />
            {/* Brown Slacks & Shoes */}
            <rect x={7 - walkLegOffset} y="22" width="3" height="7" fill="#451a03" />
            <rect x={14 + walkLegOffset} y="22" width="3" height="7" fill="#451a03" />
            <rect x={6 - walkLegOffset} y="27" width="4" height="3" fill="#1c1917" />
            <rect x={14 + walkLegOffset} y="27" width="4" height="3" fill="#1c1917" />

            {/* Torso: Iconic Mustard Yellow Short-Sleeve Button-Up */}
            <rect x="6" y={14 + walkBobY} width="12" height="9" fill="#ca8a04" rx="1" />
            <rect x="8" y={14 + walkBobY} width="8" height="8" fill="#a16207" />
            {/* Dark Brown Necktie */}
            <polygon points={`11,${14 + walkBobY} 13,${14 + walkBobY} 13.5,${21 + walkBobY} 12,${23 + walkBobY} 10.5,${21 + walkBobY}`} fill="#451a03" />
            {/* Sheriff Deputy / Security Badge */}
            <rect x="7" y={15 + walkBobY} width="2.5" height="2.5" fill="#facc15" stroke="#713f12" strokeWidth="0.4" />

            {/* Short Sleeves & Forearms */}
            <rect x="4" y={14 + walkBobY} width="2.5" height="4" fill="#ca8a04" />
            <rect x="4" y={18 + walkBobY} width="2.5" height="4" fill="#fed7aa" />
            <rect x="17.5" y={14 + walkBobY} width="2.5" height="4" fill="#ca8a04" />
            <rect x="17.5" y={18 + walkBobY} width="2.5" height="4" fill="#fed7aa" />

            {/* Head & Skin */}
            <rect x="7" y={6 + walkBobY} width="10" height="9" fill="#fed7aa" rx="1" />
            {/* Center-Parted Brown Hair */}
            <rect x="6" y={4 + walkBobY} width="12" height="3" fill="#5c2c16" />
            <rect x="6" y={6 + walkBobY} width="2" height="4" fill="#5c2c16" />
            <rect x="16" y={6 + walkBobY} width="2" height="4" fill="#5c2c16" />
            <line x1="12" y1={4 + walkBobY} x2="12" y2={7 + walkBobY} stroke="#fed7aa" strokeWidth="0.8" />

            {/* Wire-Rimmed Aviator Glasses */}
            <rect x="8" y={8.5 + walkBobY} width="3.2" height="2.8" fill="#fef08a" opacity="0.3" stroke="#854d0e" strokeWidth="0.6" />
            <rect x="12.8" y={8.5 + walkBobY} width="3.2" height="2.8" fill="#fef08a" opacity="0.3" stroke="#854d0e" strokeWidth="0.6" />
            <line x1="11.2" y1={9.5 + walkBobY} x2="12.8" y2={9.5 + walkBobY} stroke="#854d0e" strokeWidth="0.6" />
            
            {/* Serious Intense Eyes & Stern Mouth */}
            <rect x="9" y={9.5 + walkBobY} width="1.2" height="1.2" fill="#1c1917" />
            <rect x="13.8" y={9.5 + walkBobY} width="1.2" height="1.2" fill="#1c1917" />
            <line x1="10" y1={13 + walkBobY} x2="14" y2={13 + walkBobY} stroke="#78350f" strokeWidth="0.8" />
          </g>
        );

      // ==========================================
      // Legacy avatar
      // ==========================================
      case 'player_jim':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />
            {/* Dark Slacks & Dress Shoes */}
            <rect x={7 - walkLegOffset} y="22" width="3" height="7" fill="#1e293b" />
            <rect x={14 + walkLegOffset} y="22" width="3" height="7" fill="#1e293b" />
            <rect x={6 - walkLegOffset} y="27" width="4" height="3" fill="#0f172a" />
            <rect x={14 + walkLegOffset} y="27" width="4" height="3" fill="#0f172a" />

            {/* Torso: Light Blue Oxford Shirt */}
            <rect x="6" y={14 + walkBobY} width="12" height="9" fill="#93c5fd" rx="1" />
            <polygon points={`9,${14 + walkBobY} 15,${14 + walkBobY} 12,${17 + walkBobY}`} fill="#ffffff" />
            {/* Loosened Dark Tie */}
            <polygon points={`11,${16 + walkBobY} 13,${16 + walkBobY} 13.5,${21 + walkBobY} 12,${23 + walkBobY} 10.5,${21 + walkBobY}`} fill="#1e3a8a" />

            {/* Sleeves (Rolled Up) */}
            <rect x="4" y={14 + walkBobY} width="2.5" height="4" fill="#93c5fd" />
            <rect x="4" y={18 + walkBobY} width="2.5" height="4" fill="#fed7aa" />
            <rect x="17.5" y={14 + walkBobY} width="2.5" height="4" fill="#93c5fd" />
            <rect x="17.5" y={18 + walkBobY} width="2.5" height="4" fill="#fed7aa" />

            {/* Head & Messy Hair */}
            <rect x="7" y={6 + walkBobY} width="10" height="9" fill="#fed7aa" rx="1" />
            <path d={`M 5 ${5 + walkBobY} Q 12 ${2 + walkBobY} 19 ${5 + walkBobY} L 18 ${8 + walkBobY} L 16 ${6 + walkBobY} L 8 ${6 + walkBobY} L 6 ${8 + walkBobY} Z`} fill="#451a03" />
            <rect x="6" y={4 + walkBobY} width="12" height="3" fill="#451a03" />
            <rect x="16" y={4 + walkBobY} width="3" height="3" fill="#451a03" />

            {/* Facial features */}
            <rect x="8.5" y={9 + walkBobY} width="1.8" height="1.5" fill="#1c1917" />
            <rect x="13.5" y={9 + walkBobY} width="1.8" height="1.5" fill="#1c1917" />
            <line x1="10" y1={12.5 + walkBobY} x2="14" y2={12 + walkBobY} stroke="#78350f" strokeWidth="0.8" />
          </g>
        );

      // ==========================================
      // Legacy avatar
      // ==========================================
      case 'player_pam':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />
            {/* Grey Pencil Skirt & Tights */}
            <rect x="7.5" y="21" width="9" height="5" fill="#475569" />
            <rect x={7.5 - walkLegOffset} y="25" width="2.5" height="4" fill="#fed7aa" />
            <rect x={14 + walkLegOffset} y="25" width="2.5" height="4" fill="#fed7aa" />
            <rect x={6.5 - walkLegOffset} y="28" width="3.5" height="2" fill="#ffffff" />
            <rect x={13.5 + walkLegOffset} y="28" width="3.5" height="2" fill="#ffffff" />

            {/* Torso: Pastel Pink Knit Cardigan over White Blouse */}
            <rect x="6" y={13 + walkBobY} width="12" height="9" fill="#f472b6" rx="1" />
            <polygon points={`9,${13 + walkBobY} 15,${13 + walkBobY} 12,${18 + walkBobY}`} fill="#ffffff" />
            {/* Lanyard and badge */}
            <line x1="12" y1={13 + walkBobY} x2="12" y2={19 + walkBobY} stroke="#3b82f6" strokeWidth="0.7" />
            <rect x="11" y={19 + walkBobY} width="2" height="2.5" fill="#e2e8f0" stroke="#1e3a8a" strokeWidth="0.3" />

            {/* Arms */}
            <rect x="4" y={14 + walkBobY} width="2.5" height="6" fill="#f472b6" />
            <rect x="4" y={20 + walkBobY} width="2.5" height="2" fill="#fed7aa" />
            <rect x="17.5" y={14 + walkBobY} width="2.5" height="6" fill="#f472b6" />
            <rect x="17.5" y={20 + walkBobY} width="2.5" height="2" fill="#fed7aa" />

            {/* Head & Soft Auburn Wavy Hair */}
            <rect x="7" y={6 + walkBobY} width="10" height="8.5" fill="#fed7aa" rx="1" />
            <rect x="5.5" y={3.5 + walkBobY} width="13" height="4" fill="#9a3412" rx="1" />
            <rect x="5" y={5 + walkBobY} width="3" height="7" fill="#9a3412" rx="1" />
            <rect x="16" y={5 + walkBobY} width="3" height="7" fill="#9a3412" rx="1" />

            {/* Gentle Warm Eyes & Smile */}
            <rect x="8.5" y={9 + walkBobY} width="1.8" height="1.5" fill="#1c1917" />
            <rect x="13.5" y={9 + walkBobY} width="1.8" height="1.5" fill="#1c1917" />
            <rect x="10.5" y={12.5 + walkBobY} width="3" height="1" fill="#be185d" />
          </g>
        );

      // ==========================================
      // Legacy avatar
      // ==========================================
      case 'player_michael':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />
            {/* Navy Slacks & Shiny Oxford Shoes */}
            <rect x={7 - walkLegOffset} y="22" width="3" height="7" fill="#172554" />
            <rect x={14 + walkLegOffset} y="22" width="3" height="7" fill="#172554" />
            <rect x={6 - walkLegOffset} y="27" width="4" height="3" fill="#0f172a" />
            <rect x={14 + walkLegOffset} y="27" width="4" height="3" fill="#0f172a" />

            {/* Torso: Tailored Navy Suit Jacket with Blue/White Striped Tie */}
            <rect x="5.5" y={13 + walkBobY} width="13" height="10" fill="#1e3a8a" rx="1" />
            <polygon points={`9,${13 + walkBobY} 15,${13 + walkBobY} 12,${18 + walkBobY}`} fill="#ffffff" />
            <polygon points={`11,${14 + walkBobY} 13,${14 + walkBobY} 13.5,${21 + walkBobY} 12,${23 + walkBobY} 10.5,${21 + walkBobY}`} fill="#2563eb" />
            <line x1="11" y1={16 + walkBobY} x2="13" y2={16 + walkBobY} stroke="#ffffff" strokeWidth="0.5" />

            {/* Coffee mug */}
            <rect x="3.5" y={14 + walkBobY} width="2.5" height="6" fill="#1e3a8a" />
            <rect x="3.5" y={20 + walkBobY} width="2.5" height="2" fill="#fed7aa" />
            
            <rect x="18" y={14 + walkBobY} width="2.5" height="4" fill="#1e3a8a" />
            {/* White Ceramic Coffee Mug */}
            <rect x="17.5" y={17 + walkBobY} width="3.5" height="4.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.5" rx="0.5" />
            <rect x="18" y={18 + walkBobY} width="2.5" height="1.5" fill="#1e3a8a" />
            <circle cx="21.5" cy={19 + walkBobY} r="1" fill="none" stroke="#cbd5e1" strokeWidth="0.6" />

            {/* Head & Slicked Back Black Hair */}
            <rect x="7" y={6 + walkBobY} width="10" height="8.5" fill="#fed7aa" rx="1" />
            <rect x="6.5" y={3 + walkBobY} width="11" height="4" fill="#18181b" rx="1" />
            <path d={`M 6 ${5 + walkBobY} Q 12 ${2 + walkBobY} 18 ${5 + walkBobY}`} fill="#27272a" />

            {/* Expressive Enthusiastic Eyes & Grin */}
            <rect x="8.5" y={8.5 + walkBobY} width="1.8" height="1.5" fill="#18181b" />
            <rect x="13.5" y={8.5 + walkBobY} width="1.8" height="1.5" fill="#18181b" />
            <rect x="10" y={12 + walkBobY} width="4" height="1.2" fill="#be123c" />
          </g>
        );

      // ==========================================
      // Legacy avatar
      // ==========================================
      case 'player_stanley':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />
            <rect x={6.5 - walkLegOffset} y="22" width="3.5" height="7" fill="#451a03" />
            <rect x={14 + walkLegOffset} y="22" width="3.5" height="7" fill="#451a03" />
            <rect x={5.5 - walkLegOffset} y="27" width="4.5" height="3" fill="#1c1917" />
            <rect x={14 + walkLegOffset} y="27" width="4.5" height="3" fill="#1c1917" />

            {/* Torso: Rich Tan/Brown Suit with Gold Pattern Tie */}
            <rect x="5" y={13 + walkBobY} width="14" height="10" fill="#78350f" rx="1" />
            <polygon points={`9,${13 + walkBobY} 15,${13 + walkBobY} 12,${18 + walkBobY}`} fill="#fef08a" />
            <polygon points={`11,${14 + walkBobY} 13,${14 + walkBobY} 13.5,${21 + walkBobY} 12,${23 + walkBobY} 10.5,${21 + walkBobY}`} fill="#ca8a04" />

            {/* Arms holding Crossword Booklet */}
            <rect x="3" y={14 + walkBobY} width="3" height="6" fill="#78350f" />
            <rect x="18" y={14 + walkBobY} width="3" height="6" fill="#78350f" />
            {/* Crossword puzzle grid */}
            <rect x="16" y={17 + walkBobY} width="4" height="4" fill="#ffffff" stroke="#1c1917" strokeWidth="0.4" />
            <line x1="18" y1={17 + walkBobY} x2="18" y2={21 + walkBobY} stroke="#1c1917" strokeWidth="0.3" />

            {/* Head & Rich Dark Skin */}
            <rect x="7" y={6 + walkBobY} width="10" height="8.5" fill="#451a03" rx="1" />
            {/* Balding Hairline */}
            <rect x="6.5" y={4 + walkBobY} width="11" height="2.5" fill="#18181b" />
            <rect x="6" y={5 + walkBobY} width="2" height="4" fill="#18181b" />
            <rect x="16" y={5 + walkBobY} width="2" height="4" fill="#18181b" />

            {/* Stanley's Iconic Thick Mustache & Unamused Eyes */}
            <rect x="8.5" y={8.5 + walkBobY} width="1.8" height="1.2" fill="#18181b" />
            <rect x="13.5" y={8.5 + walkBobY} width="1.8" height="1.2" fill="#18181b" />
            <rect x="8" y={11.5 + walkBobY} width="8" height="2.2" fill="#18181b" rx="1" />
          </g>
        );

      // ==========================================
      // PLAYER 1: Alex Chen (Cyber Tactical Vest + Visor)
      // ==========================================
      case 'player_alex':
        return (
          <g>
            {/* Shadow */}
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* Legs & Shoes */}
            <rect x={7 - walkLegOffset} y="22" width="3" height="7" fill="#0f172a" />
            <rect x={14 + walkLegOffset} y="22" width="3" height="7" fill="#0f172a" />
            <rect x={6 - walkLegOffset} y="27" width="4" height="3" fill="#38bdf8" />
            <rect x={14 + walkLegOffset} y="27" width="4" height="3" fill="#38bdf8" />

            {/* Torso: Tactical Cyber Vest */}
            <rect x="6" y={14 + walkBobY} width="12" height="9" fill="#0284c7" rx="1" />
            <rect x="8" y={14 + walkBobY} width="8" height="8" fill="#0369a1" />
            <rect x="10" y={15 + walkBobY} width="4" height="7" fill="#0f172a" />
            {/* Lanyard & Holo-Badge */}
            <line x1="12" y1={14 + walkBobY} x2="12" y2={19 + walkBobY} stroke="#fbbf24" strokeWidth="0.8" />
            <rect x="11" y={19 + walkBobY} width="2" height="2.5" fill="#38bdf8" />

            {/* Arms & Hands */}
            <rect x="4" y={15 + walkBobY} width="2.5" height="6" fill="#0284c7" />
            <rect x="4" y={20 + walkBobY} width="2.5" height="2" fill="#fbcfe8" />
            <rect x="17.5" y={15 + walkBobY} width="2.5" height="6" fill="#0284c7" />
            <rect x="17.5" y={20 + walkBobY} width="2.5" height="2" fill="#fbcfe8" />

            {/* Head & Skin */}
            <rect x="7" y={6 + walkBobY} width="10" height="9" fill="#fbcfe8" rx="1" />
            {/* Dark Spiky Hair */}
            <path d={`M 6 ${6 + walkBobY} L 18 ${6 + walkBobY} L 18 ${8 + walkBobY} L 16 ${10 + walkBobY} L 8 ${10 + walkBobY} L 6 ${8 + walkBobY} Z`} fill="#1e1b4b" />
            <rect x="6" y={4 + walkBobY} width="12" height="3" fill="#1e1b4b" />
            <rect x="7" y={3 + walkBobY} width="7" height="2" fill="#1e1b4b" />

            {/* Tactical Cyber Visor / Headset */}
            <rect x="8" y={8 + walkBobY} width="8" height="3" fill="#0f172a" />
            <rect x="9" y={8.5 + walkBobY} width="6" height="2" fill="#38bdf8" />
            <rect x="16" y={7 + walkBobY} width="1.5" height="4" fill="#fbbf24" />
            <line x1="16" y1={10 + walkBobY} x2="13" y2={12 + walkBobY} stroke="#fbbf24" strokeWidth="0.7" />

            {/* Eyes & Mouth */}
            {direction === 'DOWN' && (
              <>
                <rect x="11" y={12 + walkBobY} width="2" height="1" fill="#9f1239" />
              </>
            )}
          </g>
        );

      // ==========================================
      // PLAYER 2: Maya Lin (Magenta Forensics Trench + Ponytail)
      // ==========================================
      case 'player_maya':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* High Ponytail (Swings) */}
            <rect x={isFlipped ? 16 : 4} y={3 + walkBobY} width="4" height="8" fill="#78350f" rx="1" />
            <rect x={isFlipped ? 17 : 3} y={7 + walkBobY} width="3" height="6" fill="#78350f" />

            {/* Legs & High-Tech Boots */}
            <rect x={7 - walkLegOffset} y="22" width="3" height="7" fill="#1e1b4b" />
            <rect x={14 + walkLegOffset} y="22" width="3" height="7" fill="#1e1b4b" />
            <rect x={6 - walkLegOffset} y="27" width="4" height="3" fill="#c026d3" />
            <rect x={14 + walkLegOffset} y="27" width="4" height="3" fill="#c026d3" />

            {/* Torso: Magenta Tech Coat */}
            <rect x="6" y={14 + walkBobY} width="12" height="9" fill="#c026d3" rx="1" />
            <rect x="9" y={14 + walkBobY} width="6" height="8" fill="#1e1b4b" />
            {/* Neon Cyan Diagnostics Trim */}
            <line x1="7" y1={14 + walkBobY} x2="7" y2={22 + walkBobY} stroke="#22d3ee" strokeWidth="0.8" />
            <line x1="17" y1={14 + walkBobY} x2="17" y2={22 + walkBobY} stroke="#22d3ee" strokeWidth="0.8" />

            {/* Tablet Holster */}
            <rect x="17" y={17 + walkBobY} width="2" height="4" fill="#38bdf8" />

            {/* Arms & Hands */}
            <rect x="4" y={15 + walkBobY} width="2.5" height="6" fill="#a21caf" />
            <rect x="4" y={20 + walkBobY} width="2.5" height="2" fill="#fed7aa" />
            <rect x="17.5" y={15 + walkBobY} width="2.5" height="6" fill="#a21caf" />
            <rect x="17.5" y={20 + walkBobY} width="2.5" height="2" fill="#fed7aa" />

            {/* Head & Skin */}
            <rect x="7" y={6 + walkBobY} width="10" height="9" fill="#fed7aa" rx="1" />
            {/* Auburn Hair */}
            <rect x="6" y={4 + walkBobY} width="12" height="3.5" fill="#9a3412" />
            <rect x="6" y={6 + walkBobY} width="2.5" height="4" fill="#9a3412" />
            <rect x="15.5" y={6 + walkBobY} width="2.5" height="4" fill="#9a3412" />

            {/* Cyber Forensics Goggles (Resting on forehead or eyes) */}
            <rect x="7" y={7 + walkBobY} width="10" height="3" fill="#4a044e" />
            <rect x="8.5" y={7.5 + walkBobY} width="3" height="2" fill="#22d3ee" />
            <rect x="12.5" y={7.5 + walkBobY} width="3" height="2" fill="#22d3ee" />

            {/* Expressive Eyes & Smile */}
            <rect x="9" y={10.5 + walkBobY} width="1.5" height="1.5" fill="#1e1b4b" />
            <rect x="13.5" y={10.5 + walkBobY} width="1.5" height="1.5" fill="#1e1b4b" />
            <rect x="11" y={13 + walkBobY} width="2" height="0.8" fill="#e11d48" />
          </g>
        );

      // ==========================================
      // PLAYER 3: Jordan Cruz (Hazard Yellow Bomber + Fade)
      // ==========================================
      case 'player_jordan':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* Cargo Pants & Sneakers */}
            <rect x={7 - walkLegOffset} y="22" width="3.5" height="7" fill="#1c1917" />
            <rect x={13.5 + walkLegOffset} y="22" width="3.5" height="7" fill="#1c1917" />
            <rect x={6 - walkLegOffset} y="27" width="4.5" height="3" fill="#f59e0b" />
            <rect x={13.5 + walkLegOffset} y="27" width="4.5" height="3" fill="#f59e0b" />

            {/* Torso: Amber Hazard Bomber Jacket */}
            <rect x="5" y={13 + walkBobY} width="14" height="10" fill="#d97706" rx="2" />
            <rect x="9" y={14 + walkBobY} width="6" height="8" fill="#1c1917" />
            {/* White/Black Hazard Stripe */}
            <rect x="6" y={17 + walkBobY} width="3" height="1.5" fill="#fef08a" />
            <rect x="15" y={17 + walkBobY} width="3" height="1.5" fill="#fef08a" />

            {/* Arms */}
            <rect x="3" y={14 + walkBobY} width="3" height="7" fill="#b45309" rx="1" />
            <rect x="3" y={20 + walkBobY} width="3" height="2" fill="#78350f" />
            <rect x="18" y={14 + walkBobY} width="3" height="7" fill="#b45309" rx="1" />
            <rect x="18" y={20 + walkBobY} width="3" height="2" fill="#78350f" />

            {/* Head & Rich Skin Tone */}
            <rect x="7" y={6 + walkBobY} width="10" height="8.5" fill="#78350f" rx="1" />
            {/* Dreadlocks / High Fade Top */}
            <rect x="6" y={3 + walkBobY} width="12" height="4" fill="#18181b" rx="1" />
            <rect x="7" y={1.5 + walkBobY} width="10" height="2.5" fill="#27272a" />
            {/* Golden Eyepiece Monocle */}
            <circle cx="9.5" cy={9.5 + walkBobY} r="2" fill="#fbbf24" stroke="#78350f" strokeWidth="0.5" />
            <circle cx="9.5" cy={9.5 + walkBobY} r="1" fill="#fef08a" />
            {/* Right Eye & Beard Stubble */}
            <rect x="13.5" y={9 + walkBobY} width="1.5" height="1.5" fill="#18181b" />
            <rect x="9" y={12 + walkBobY} width="6" height="2" fill="#27272a" opacity="0.6" />
          </g>
        );

      // ==========================================
      // PLAYER 4: Samira Khan (Emerald Tactical Hood + Comm)
      // ==========================================
      case 'player_samira':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* Leggings & Stealth Boots */}
            <rect x={7 - walkLegOffset} y="22" width="3" height="7" fill="#0f172a" />
            <rect x={14 + walkLegOffset} y="22" width="3" height="7" fill="#0f172a" />
            <rect x={6.5 - walkLegOffset} y="27" width="4" height="3" fill="#10b981" />
            <rect x={13.5 + walkLegOffset} y="27" width="4" height="3" fill="#10b981" />

            {/* Emerald Tactical Windbreaker */}
            <rect x="6" y={14 + walkBobY} width="12" height="9" fill="#059669" rx="1" />
            <rect x="8" y={14 + walkBobY} width="8" height="8" fill="#047857" />
            <rect x="10" y={15 + walkBobY} width="4" height="7" fill="#064e3b" />

            {/* Arms */}
            <rect x="4" y={15 + walkBobY} width="2.5" height="6" fill="#059669" />
            <rect x="4" y={20 + walkBobY} width="2.5" height="2" fill="#d97706" />
            <rect x="17.5" y={15 + walkBobY} width="2.5" height="6" fill="#059669" />
            <rect x="17.5" y={20 + walkBobY} width="2.5" height="2" fill="#d97706" />

            {/* Head & Olive Skin */}
            <rect x="7" y={6 + walkBobY} width="10" height="9" fill="#d97706" rx="1" />
            {/* Dark Cropped Hair & Headband */}
            <rect x="6" y={4 + walkBobY} width="12" height="3" fill="#18181b" />
            <rect x="6" y={6 + walkBobY} width="12" height="1.5" fill="#34d399" />

            {/* Gold Hoop Earring & Comm Earpiece */}
            <circle cx="6.5" cy={10 + walkBobY} r="1" fill="#fbbf24" />
            <rect x="16.5" y={8.5 + walkBobY} width="1.5" height="2.5" fill="#065f46" />

            {/* Sharp Eyes & Determined Expression */}
            <rect x="8.5" y={9.5 + walkBobY} width="2" height="1.2" fill="#18181b" />
            <rect x="13.5" y={9.5 + walkBobY} width="2" height="1.2" fill="#18181b" />
            <rect x="10.5" y={12.5 + walkBobY} width="3" height="1" fill="#881337" />
          </g>
        );

      // ==========================================
      // NPC 1: Bob Miller (Accountant - Glasses, Tie, Suspenders, Sweating)
      // ==========================================
      case 'npc_bob':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* Brown Office Slacks & Loafers */}
            <rect x={7 - walkLegOffset} y="22" width="3" height="7" fill="#451a03" />
            <rect x={14 + walkLegOffset} y="22" width="3" height="7" fill="#451a03" />
            <rect x={6 - walkLegOffset} y="27" width="4" height="3" fill="#292524" />
            <rect x={14 + walkLegOffset} y="27" width="4" height="3" fill="#292524" />

            {/* Shirt: Mustard Yellow with Suspenders */}
            <rect x="6" y={14 + walkBobY} width="12" height="9" fill="#fef08a" rx="1" />
            {/* Brown Suspenders */}
            <rect x="8" y={14 + walkBobY} width="1.5" height="8.5" fill="#78350f" />
            <rect x="14.5" y={14 + walkBobY} width="1.5" height="8.5" fill="#78350f" />
            {/* Red Striped Necktie */}
            <polygon points={`11,${14 + walkBobY} 13,${14 + walkBobY} 13.5,${20 + walkBobY} 12,${22 + walkBobY} 10.5,${20 + walkBobY}`} fill="#dc2626" />
            <line x1="11" y1={16 + walkBobY} x2="13" y2={16 + walkBobY} stroke="#fef08a" strokeWidth="0.5" />
            <line x1="11" y1={18 + walkBobY} x2="13" y2={18 + walkBobY} stroke="#fef08a" strokeWidth="0.5" />

            {/* Arms & Hands (Holding Pen/Paper) */}
            <rect x="4" y={15 + walkBobY} width="2.5" height="6" fill="#fef08a" />
            <rect x="4" y={20 + walkBobY} width="2.5" height="2" fill="#fed7aa" />
            <rect x="17.5" y={15 + walkBobY} width="2.5" height="6" fill="#fef08a" />
            <rect x="17.5" y={20 + walkBobY} width="2.5" height="2" fill="#fed7aa" />

            {/* Head & Balding Hair */}
            <rect x="7" y={6 + walkBobY} width="10" height="9" fill="#fed7aa" rx="1" />
            {/* Balding Dome with Side Tufts */}
            <rect x="6" y={7 + walkBobY} width="2" height="5" fill="#78350f" />
            <rect x="16" y={7 + walkBobY} width="2" height="5" fill="#78350f" />
            <path d={`M 7 ${6 + walkBobY} Q 12 ${4 + walkBobY} 17 ${6 + walkBobY}`} stroke="#78350f" strokeWidth="1" fill="none" />

            {/* Thick Rectangular Glasses */}
            <rect x="8" y={8.5 + walkBobY} width="3.5" height="3" fill="#ffffff" stroke="#1c1917" strokeWidth="0.8" />
            <rect x="12.5" y={8.5 + walkBobY} width="3.5" height="3" fill="#ffffff" stroke="#1c1917" strokeWidth="0.8" />
            <line x1="11.5" y1={9.5 + walkBobY} x2="12.5" y2={9.5 + walkBobY} stroke="#1c1917" strokeWidth="0.8" />
            {/* Anxious Dot Eyes */}
            <circle cx="9.8" cy={10 + walkBobY} r="0.8" fill="#1c1917" />
            <circle cx="14.2" cy={10 + walkBobY} r="0.8" fill="#1c1917" />

            {/* Quivering Mouth */}
            <line x1="10.5" y1={13 + walkBobY} x2="13.5" y2={13.5 + walkBobY} stroke="#b91c1c" strokeWidth="0.8" />

            {/* Animated Blue Panic Sweat Drop */}
            {(mood === 'PANICKED' || mood === 'SUSPICIOUS') && (
              <circle cx="17.5" cy={6 + walkBobY} r="1.2" fill="#38bdf8" className="animate-bounce" />
            )}
          </g>
        );

      // ==========================================
      // NPC 2: Linda Hayes (HR Specialist - Blonde Bob, Pink Suit, Pearl Necklace)
      // ==========================================
      case 'npc_linda':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* Smart Navy Pencil Skirt & Heels */}
            <rect x="8" y="21" width="8" height="5" fill="#1e1b4b" />
            <rect x={8 - walkLegOffset} y="25" width="2.5" height="4" fill="#fed7aa" />
            <rect x={13.5 + walkLegOffset} y="25" width="2.5" height="4" fill="#fed7aa" />
            <rect x={7.5 - walkLegOffset} y="28" width="3" height="2" fill="#be185d" />
            <rect x={13 + walkLegOffset} y="28" width="3" height="2" fill="#be185d" />

            {/* Torso: Magenta/Coral Tailored Blazer */}
            <rect x="6" y={13 + walkBobY} width="12" height="9" fill="#db2777" rx="1" />
            {/* White V-Neck Blouse & Pearl Necklace */}
            <polygon points={`9,${13 + walkBobY} 15,${13 + walkBobY} 12,${18 + walkBobY}`} fill="#ffffff" />
            <circle cx="10.5" cy={15 + walkBobY} r="0.6" fill="#f1f5f9" />
            <circle cx="12" cy={16 + walkBobY} r="0.6" fill="#f1f5f9" />
            <circle cx="13.5" cy={15 + walkBobY} r="0.6" fill="#f1f5f9" />
            {/* HR Clipboard */}
            <rect x="4" y={16 + walkBobY} width="3.5" height="5" fill="#78350f" stroke="#e2e8f0" strokeWidth="0.4" />

            {/* Arms */}
            <rect x="4" y={14 + walkBobY} width="2.5" height="5" fill="#be185d" />
            <rect x="17.5" y={14 + walkBobY} width="2.5" height="6" fill="#be185d" />
            <rect x="17.5" y={19 + walkBobY} width="2.5" height="2" fill="#fed7aa" />

            {/* Head & Skin */}
            <rect x="7" y={6 + walkBobY} width="10" height="8.5" fill="#fed7aa" rx="1" />
            {/* Golden Blonde Sleek Bob Haircut */}
            <rect x="6" y={3 + walkBobY} width="12" height="4.5" fill="#facc15" rx="1" />
            <rect x="5.5" y={5 + walkBobY} width="3" height="6" fill="#facc15" rx="1" />
            <rect x="15.5" y={5 + walkBobY} width="3" height="6" fill="#facc15" rx="1" />

            {/* Refined Eyes & Coral Lips */}
            <rect x="8.5" y={9 + walkBobY} width="2" height="1.2" fill="#0f172a" />
            <rect x="13.5" y={9 + walkBobY} width="2" height="1.2" fill="#0f172a" />
            <circle cx="9.2" cy={9.3 + walkBobY} r="0.4" fill="#ffffff" />
            <circle cx="14.2" cy={9.3 + walkBobY} r="0.4" fill="#ffffff" />
            <rect x="10.5" y={12 + walkBobY} width="3" height="1" fill="#f43f5e" />
          </g>
        );

      // ==========================================
      // NPC 3: Dave Kowalski (SysAdmin - Bushy Beard, Beanie, Plaid Flannel, Cables)
      // ==========================================
      case 'npc_dave':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* Rugged Jeans & Work Boots */}
            <rect x={6.5 - walkLegOffset} y="22" width="3.5" height="7" fill="#1e3a8a" />
            <rect x={14 + walkLegOffset} y="22" width="3.5" height="7" fill="#1e3a8a" />
            <rect x={5.5 - walkLegOffset} y="27" width="4.5" height="3" fill="#78350f" />
            <rect x={14 + walkLegOffset} y="27" width="4.5" height="3" fill="#78350f" />

            {/* Torso: Green Plaid Flannel */}
            <rect x="5" y={13 + walkBobY} width="14" height="10" fill="#065f46" rx="1" />
            {/* Plaid Grid Pattern */}
            <line x1="8" y1={13 + walkBobY} x2="8" y2={22 + walkBobY} stroke="#10b981" strokeWidth="0.8" />
            <line x1="16" y1={13 + walkBobY} x2="16" y2={22 + walkBobY} stroke="#10b981" strokeWidth="0.8" />
            <line x1="5" y1={17 + walkBobY} x2="19" y2={17 + walkBobY} stroke="#10b981" strokeWidth="0.8" />
            <rect x="10" y={14 + walkBobY} width="4" height="8" fill="#111827" />

            {/* Coiled Yellow Ethernet Cable around shoulder */}
            <path d={`M 5 ${15 + walkBobY} Q 10 ${13 + walkBobY} 13 ${18 + walkBobY} Q 15 ${21 + walkBobY} 18 ${16 + walkBobY}`} fill="none" stroke="#facc15" strokeWidth="1.2" />
            <rect x="18" y={15 + walkBobY} width="2" height="2" fill="#facc15" />

            {/* Arms */}
            <rect x="3" y={14 + walkBobY} width="3" height="6" fill="#047857" />
            <rect x="3" y={19 + walkBobY} width="3" height="3" fill="#fed7aa" />
            <rect x="18" y={14 + walkBobY} width="3" height="6" fill="#047857" />
            <rect x="18" y={19 + walkBobY} width="3" height="3" fill="#fed7aa" />

            {/* Head & Skin */}
            <rect x="7" y={6 + walkBobY} width="10" height="9" fill="#fed7aa" rx="1" />
            {/* Charcoal Knitted Beanie */}
            <rect x="6" y={2 + walkBobY} width="12" height="5" fill="#334155" rx="2" />
            <rect x="5.5" y={5.5 + walkBobY} width="13" height="1.8" fill="#475569" />

            {/* Bushy Beard & Mustache */}
            <rect x="6.5" y={9 + walkBobY} width="11" height="6.5" fill="#713f12" rx="2" />
            <rect x="8" y={10 + walkBobY} width="8" height="2" fill="#854d0e" />

            {/* Tired IT Guy Eyes */}
            <rect x="8.5" y={8 + walkBobY} width="2" height="1.2" fill="#18181b" />
            <rect x="13.5" y={8 + walkBobY} width="2" height="1.2" fill="#18181b" />
          </g>
        );

      // ==========================================
      // NPC 4: Marcus Vance (SecOps Director - Sunglasses, Black Tactical Turtle, Radio)
      // ==========================================
      case 'npc_marcus':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* Tactical Black Pants & Combat Boots */}
            <rect x={6.5 - walkLegOffset} y="22" width="3.5" height="7" fill="#090d16" />
            <rect x={14 + walkLegOffset} y="22" width="3.5" height="7" fill="#090d16" />
            <rect x={5.5 - walkLegOffset} y="27" width="4.5" height="3" fill="#1e293b" />
            <rect x={14 + walkLegOffset} y="27" width="4.5" height="3" fill="#1e293b" />

            {/* Torso: Broad Black Tactical Turtleneck */}
            <rect x="5" y={13 + walkBobY} width="14" height="10" fill="#0f172a" rx="1" />
            <rect x="8" y={12 + walkBobY} width="8" height="3" fill="#020617" />
            {/* Gold SecOps Crest */}
            <polygon points={`12,${16 + walkBobY} 14,${18 + walkBobY} 12,${20 + walkBobY} 10,${18 + walkBobY}`} fill="#fbbf24" />

            {/* Shoulder Walkie-Talkie with Blinking Red Antenna */}
            <rect x="4" y={12 + walkBobY} width="2.5" height="4" fill="#1e293b" />
            <line x1="5.2" y1={12 + walkBobY} x2="5.2" y2={8 + walkBobY} stroke="#475569" strokeWidth="0.8" />
            <circle cx="5.2" cy={8 + walkBobY} r="0.8" fill="#ef4444" className="animate-ping" />

            {/* Arms */}
            <rect x="3" y={14 + walkBobY} width="3" height="7" fill="#0f172a" />
            <rect x="3" y={20 + walkBobY} width="3" height="2" fill="#52525b" />
            <rect x="18" y={14 + walkBobY} width="3" height="7" fill="#0f172a" />
            <rect x="18" y={20 + walkBobY} width="3" height="2" fill="#52525b" />

            {/* Head & Square Strong Jaw */}
            <rect x="7" y={6 + walkBobY} width="10" height="8.5" fill="#fcd34d" rx="1" />
            {/* Close-cropped Dark Military Buzzcut */}
            <rect x="6.5" y={3.5 + walkBobY} width="11" height="3.5" fill="#18181b" rx="1" />

            {/* Aviator Sunglasses */}
            <polygon points={`7.5,${8 + walkBobY} 11.5,${8 + walkBobY} 11,${11 + walkBobY} 8,${11 + walkBobY}`} fill="#020617" stroke="#fbbf24" strokeWidth="0.4" />
            <polygon points={`12.5,${8 + walkBobY} 16.5,${8 + walkBobY} 16,${11 + walkBobY} 13,${11 + walkBobY}`} fill="#020617" stroke="#fbbf24" strokeWidth="0.4" />
            <line x1="11.5" y1={8.5 + walkBobY} x2="12.5" y2={8.5 + walkBobY} stroke="#fbbf24" strokeWidth="0.6" />

            {/* Firm Smirk / Comm Chin */}
            <line x1="10" y1={13 + walkBobY} x2="14" y2={13 + walkBobY} stroke="#78350f" strokeWidth="0.8" />
          </g>
        );

      // ==========================================
      // NPC 5: Karen Fletcher (Executive VP - Royal Purple Suit, Gold Earrings, Smartphone)
      // ==========================================
      case 'npc_karen':
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />

            {/* Purple Executive Slacks & Designer Heels */}
            <rect x={7 - walkLegOffset} y="22" width="3" height="7" fill="#581c87" />
            <rect x={14 + walkLegOffset} y="22" width="3" height="7" fill="#581c87" />
            <rect x={6 - walkLegOffset} y="27" width="4" height="3" fill="#fbbf24" />
            <rect x={14 + walkLegOffset} y="27" width="4" height="3" fill="#fbbf24" />

            {/* Torso: Luxury Purple Blazer with Gold Lapels */}
            <rect x="5.5" y={13 + walkBobY} width="13" height="10" fill="#6b21a8" rx="1" />
            <polygon points={`8.5,${13 + walkBobY} 15.5,${13 + walkBobY} 12,${19 + walkBobY}`} fill="#fbbf24" />
            <polygon points={`9.5,${13 + walkBobY} 14.5,${13 + walkBobY} 12,${18 + walkBobY}`} fill="#1e1b4b" />

            {/* Arms & Gold Luxury Smartphone */}
            <rect x="3.5" y={14 + walkBobY} width="2.5" height="6" fill="#581c87" />
            <rect x="3.5" y={19 + walkBobY} width="2.5" height="2" fill="#fed7aa" />
            {/* Right hand holding phone */}
            <rect x="18" y={14 + walkBobY} width="2.5" height="4" fill="#581c87" />
            <rect x="17.5" y={17 + walkBobY} width="3" height="5" fill="#fbbf24" rx="0.5" />
            <rect x="18" y={17.5 + walkBobY} width="2" height="4" fill="#38bdf8" />

            {/* Head & Skin */}
            <rect x="7" y={6 + walkBobY} width="10" height="8.5" fill="#fed7aa" rx="1" />
            {/* Sleek Jet-Black Asymmetrical Cut */}
            <rect x="6" y={3 + walkBobY} width="12" height="4.5" fill="#09090b" rx="1" />
            <rect x="5.5" y={5 + walkBobY} width="3" height="7" fill="#09090b" rx="1" />
            <rect x="15.5" y={5 + walkBobY} width="3" height="5" fill="#09090b" rx="1" />

            {/* Gold Hoop Earrings */}
            <circle cx="5.5" cy={10.5 + walkBobY} r="0.8" fill="#fbbf24" />
            <circle cx="18.5" cy={10.5 + walkBobY} r="0.8" fill="#fbbf24" />

            {/* High-Contrast Executive Eyes & Lipstick */}
            <rect x="8.5" y={9 + walkBobY} width="2" height="1.2" fill="#09090b" />
            <rect x="13.5" y={9 + walkBobY} width="2" height="1.2" fill="#09090b" />
            <rect x="10.5" y={12.5 + walkBobY} width="3" height="1" fill="#be123c" />
          </g>
        );

      default:
        // Default generic staff
        return (
          <g>
            <ellipse cx="12" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.5)" />
            <rect x="7" y="22" width="3" height="7" fill="#1e293b" />
            <rect x="14" y="22" width="3" height="7" fill="#1e293b" />
            <rect x="6" y="14" width="12" height="9" fill="#0284c7" rx="1" />
            <rect x="7" y="6" width="10" height="9" fill="#fed7aa" rx="1" />
            <rect x="6" y="4" width="12" height="3" fill="#1e293b" />
          </g>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none relative ${className}`}
      style={{
        transform: isFlipped ? 'scaleX(-1)' : 'none',
        transition: 'transform 0.15s ease'
      }}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={dimensions.viewBox}
        className="filter drop-shadow-md"
        style={{
          shapeRendering: 'crispEdges'
        }}
      >
        {renderCharacterPixels()}
      </svg>
    </div>
  );
};
