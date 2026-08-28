import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapGrid, OfficeEntity, PlayerStats, TileType, Position, MultiplayerOperative 
} from '../types';
import { 
  Terminal, PhoneCall, HardDrive, Lock, Coffee, 
  Sparkles, DoorOpen, Play, ChevronUp, ChevronDown, 
  ChevronLeft, ChevronRight, Zap, Info, ShieldAlert, 
  Volume2, VolumeX, Eye, Compass, Layers, Monitor,
  Radio, User, HelpCircle, Activity, ZoomIn, ZoomOut,
  Users, UserCheck, Award, MessageSquare, Handshake, Target
} from 'lucide-react';
import { audio } from '../utils/audio';
import { PixelCharacter, PLAYABLE_OPERATIVES } from './PixelCharacter';
import { OperativeSelectModal } from './OperativeSelectModal';
import { INITIAL_PEER_OPERATIVES, OFFICE_PEER_SPEECH_QUOTES } from '../data/leaderboardData';
import { 
  NpcAiSchedule, 
  NpcAiState,
  createInitialNpcAiState, 
  findPath, 
  pickRandomDestination, 
  getNpcActivityTag 
} from '../utils/npcAi';

interface OfficeHubProps {
  mapGrid: MapGrid;
  playerStats: PlayerStats;
  threatLevel: number;
  onInteractEntity: (entity: OfficeEntity) => void;
  onFastDemoScript: () => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  onSelectSkin?: (skinId: string) => void;
  onOpenDailyMissions?: () => void;
  dailyCompletedCount?: number;
  dailyTotalCount?: number;
  onOpenLeaderboard?: () => void;
  onHighFivePeer?: (peerName: string) => void;
  onOpenTrophyRoom?: () => void;
}

export const OfficeHub: React.FC<OfficeHubProps> = ({
  mapGrid,
  playerStats,
  threatLevel,
  onInteractEntity,
  onFastDemoScript,
  onToggleSound,
  soundEnabled,
  onSelectSkin,
  onOpenDailyMissions,
  dailyCompletedCount = 0,
  dailyTotalCount = 6,
  onOpenLeaderboard,
  onHighFivePeer,
  onOpenTrophyRoom
}) => {
  // =========================================================================
  // FREEFORM SMOOTH MOVEMENT ENGINE STATE
  // =========================================================================
  const [playerPos, setPlayerPos] = useState<Position>({
    x: mapGrid.playerSpawn.x + 0.5,
    y: mapGrid.playerSpawn.y + 0.5
  });
  const [playerDir, setPlayerDir] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('DOWN');
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [walkFrame, setWalkFrame] = useState<number>(0);
  
  // Click-to-move Target Waypoint
  const [targetWaypoint, setTargetWaypoint] = useState<Position | null>(null);
  
  // Virtual Touch / Joystick State for Mobile
  const [joystickVector, setJoystickVector] = useState<{ x: number; y: number } | null>(null);

  // Entities & Proximity Detection
  const [nearbyEntity, setNearbyEntity] = useState<OfficeEntity | null>(null);
  const [nearbyPeer, setNearbyPeer] = useState<MultiplayerOperative | null>(null);
  const [inspectedPeer, setInspectedPeer] = useState<MultiplayerOperative | null>(null);
  
  // UI & Viewport Controls
  const [flashSiren, setFlashSiren] = useState<boolean>(false);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [showNpcRosterDrawer, setShowNpcRosterDrawer] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'ISOMETRIC_25D' | 'ORTHO_2D'>('ISOMETRIC_25D');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [easterEggToast, setEasterEggToast] = useState<string | null>(null);

  // Multiplayer Peer Operatives State (Dwight, Jim, Pam, Michael roaming)
  const [peerOperatives, setPeerOperatives] = useState<MultiplayerOperative[]>(INITIAL_PEER_OPERATIVES);

  // Dynamic NPC AI Work & Wander Schedules
  const [npcSchedules, setNpcSchedules] = useState<NpcAiSchedule[]>(() => {
    return mapGrid.entities
      .filter(e => e.type === 'NPC_COWORKER' && e.dataId)
      .map(e => createInitialNpcAiState(e.dataId!, e.id));
  });

  // Track Keys pressed for continuous physics game loop
  const keysPressedRef = useRef<Set<string>>(new Set());
  const playerPosRef = useRef<Position>(playerPos);
  playerPosRef.current = playerPos;
  const lastStepAudioTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const lastLoopTimeRef = useRef<number>(performance.now());

  // Check collision for continuous coordinate (x, y) with player bounding box radius (0.35)
  const isPointWalkable = useCallback((x: number, y: number): boolean => {
    if (x < 0.3 || x >= mapGrid.width - 0.3 || y < 0.3 || y >= mapGrid.height - 0.3) {
      return false;
    }
    
    // Sample 4 corners of player bounding box
    const radius = 0.32;
    const checkPoints = [
      { cx: x - radius, cy: y - radius },
      { cx: x + radius, cy: y - radius },
      { cx: x - radius, cy: y + radius },
      { cx: x + radius, cy: y + radius }
    ];

    for (const pt of checkPoints) {
      const tileX = Math.floor(pt.cx);
      const tileY = Math.floor(pt.cy);
      if (tileX < 0 || tileX >= mapGrid.width || tileY < 0 || tileY >= mapGrid.height) {
        return false;
      }
      const tile = mapGrid.tiles[tileY][tileX];
      if (tile === 'WALL' || tile === 'WINDOW') {
        return false;
      }
    }
    return true;
  }, [mapGrid]);

  // Sync player spawn and NPC initial schedules if floor changes
  useEffect(() => {
    setPlayerPos({
      x: mapGrid.playerSpawn.x + 0.5,
      y: mapGrid.playerSpawn.y + 0.5
    });
    setTargetWaypoint(null);
    const newSchedules = mapGrid.entities
      .filter(e => e.type === 'NPC_COWORKER' && e.dataId)
      .map(e => createInitialNpcAiState(e.dataId!, e.id));
    setNpcSchedules(newSchedules);
  }, [mapGrid]);

  // Merge dynamic NPC positions into active entity list
  const activeEntities: OfficeEntity[] = mapGrid.entities.map(entity => {
    if (entity.type === 'NPC_COWORKER' && entity.dataId) {
      const npc = npcSchedules.find(n => n.dataId === entity.dataId);
      if (npc) {
        return {
          ...entity,
          x: npc.currentPos.x + 0.5,
          y: npc.currentPos.y + 0.5
        };
      }
    }
    return {
      ...entity,
      x: entity.x + 0.5,
      y: entity.y + 0.5
    };
  });

  // Proximity detection for interactive entities and peer operatives
  const checkProximity = useCallback((currX: number, currY: number) => {
    const range = playerStats.unlockedSkills.includes('skill_clean_desk_sweep') ? 1.5 : 1.25;
    
    // Check interactive entities
    const foundEntity = activeEntities.find(e => {
      const dist = Math.sqrt(Math.pow(e.x - currX, 2) + Math.pow(e.y - currY, 2));
      return dist <= range;
    });
    setNearbyEntity(foundEntity || null);

    // Check peer operatives
    const foundPeer = peerOperatives.find(p => {
      const dist = Math.sqrt(Math.pow(p.pos.x - currX, 2) + Math.pow(p.pos.y - currY, 2));
      return dist <= 1.4;
    });
    setNearbyPeer(foundPeer || null);
  }, [activeEntities, peerOperatives, playerStats.unlockedSkills]);

  // =========================================================================
  // CONTINUOUS 60FPS FREEFORM GAME LOOP
  // =========================================================================
  useEffect(() => {
    let walkCycleTimer = 0;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - lastLoopTimeRef.current) / 1000);
      lastLoopTimeRef.current = currentTime;

      const current = playerPosRef.current;
      let moveVx = 0;
      let moveVy = 0;

      // 1. Keyboard Input Vector
      const keys = keysPressedRef.current;
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) moveVy -= 1;
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) moveVy += 1;
      if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) moveVx -= 1;
      if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) moveVx += 1;

      // 2. Virtual Joystick Input (Mobile)
      if (joystickVector) {
        moveVx = joystickVector.x;
        moveVy = joystickVector.y;
      }

      // 3. Waypoint Navigation Vector
      if (targetWaypoint && moveVx === 0 && moveVy === 0) {
        const dx = targetWaypoint.x - current.x;
        const dy = targetWaypoint.y - current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.15) {
          moveVx = dx / dist;
          moveVy = dy / dist;
        } else {
          setTargetWaypoint(null);
        }
      }

      // Normalize diagonal speed
      const length = Math.sqrt(moveVx * moveVx + moveVy * moveVy);
      const isPlayerMoving = length > 0.05;

      if (isPlayerMoving) {
        const speed = playerStats.coffeeBuffDuration > 0 ? 5.2 : 3.8;
        const normVx = (moveVx / length) * speed * dt;
        const normVy = (moveVy / length) * speed * dt;

        // Facing direction calculation
        if (Math.abs(moveVx) > Math.abs(moveVy)) {
          setPlayerDir(moveVx > 0 ? 'RIGHT' : 'LEFT');
        } else {
          setPlayerDir(moveVy > 0 ? 'DOWN' : 'UP');
        }

        // Smooth Collision Resolution with Wall Sliding
        let nextX = current.x + normVx;
        let nextY = current.y + normVy;

        // Check combined movement
        if (isPointWalkable(nextX, nextY)) {
          setPlayerPos({ x: nextX, y: nextY });
        } else if (isPointWalkable(nextX, current.y)) {
          // Slide along X-axis
          setPlayerPos({ x: nextX, y: current.y });
        } else if (isPointWalkable(current.x, nextY)) {
          // Slide along Y-axis
          setPlayerPos({ x: current.x, y: nextY });
        }

        // Step Audio sound debouncing
        if (currentTime - lastStepAudioTimeRef.current > 260) {
          audio.playStep();
          lastStepAudioTimeRef.current = currentTime;
        }

        // Walk animation cycle
        walkCycleTimer += dt;
        if (walkCycleTimer > 0.12) {
          setWalkFrame(prev => (prev + 1) % 4);
          walkCycleTimer = 0;
        }

        setIsMoving(true);
        checkProximity(current.x, current.y);
      } else {
        setIsMoving(false);
      }

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPointWalkable, checkProximity, targetWaypoint, joystickVector, playerStats.coffeeBuffDuration]);

  // Keyboard Event Listeners (Key Down / Key Up)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'].includes(e.key)) {
        e.preventDefault();
        keysPressedRef.current.add(e.key);
        setTargetWaypoint(null); // Cancel click-to-move waypoint when using keys
      }

      if (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        if (nearbyEntity) {
          e.preventDefault();
          audio.playClick();
          onInteractEntity(nearbyEntity);
        } else if (nearbyPeer) {
          e.preventDefault();
          audio.playClick();
          setInspectedPeer(nearbyPeer);
        }
      }

      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setViewMode(prev => prev === 'ISOMETRIC_25D' ? 'ORTHO_2D' : 'ISOMETRIC_25D');
        audio.playClick();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyEntity, nearbyPeer, onInteractEntity]);

  // Threat level alarm strobe
  useEffect(() => {
    if (threatLevel >= 75) {
      const interval = setInterval(() => {
        setFlashSiren(prev => !prev);
      }, 600);
      return () => clearInterval(interval);
    } else {
      setFlashSiren(false);
    }
  }, [threatLevel]);

  // =========================================================================
  // MULTIPLAYER PEER OPERATIVES ROAMING & QUOTES AI LOOP
  // =========================================================================
  useEffect(() => {
    const peerInterval = setInterval(() => {
      setPeerOperatives(prevPeers => {
        return prevPeers.map(peer => {
          // 25% chance to wander or update speech bubble
          const shouldWander = Math.random() < 0.3;
          let nextX = peer.pos.x;
          let nextY = peer.pos.y;
          let nextFacing = peer.facing;
          let newSpeech = peer.speechBubble;

          if (shouldWander) {
            const wanderDest = pickRandomDestination();
            nextX = wanderDest.x + 0.5;
            nextY = wanderDest.y + 0.5;
            nextFacing = nextX > peer.pos.x ? 'RIGHT' : 'LEFT';
          }

          if (Math.random() < 0.2) {
            newSpeech = OFFICE_PEER_SPEECH_QUOTES[Math.floor(Math.random() * OFFICE_PEER_SPEECH_QUOTES.length)];
          }

          return {
            ...peer,
            pos: { x: nextX, y: nextY },
            facing: nextFacing,
            speechBubble: newSpeech,
            walkFrame: (peer.walkFrame + 1) % 4
          };
        });
      });
    }, 4500);

    return () => clearInterval(peerInterval);
  }, []);

  // Atmospheric lighting style
  const getAtmosphereGlow = () => {
    if (threatLevel >= 75) {
      return flashSiren ? 'rgba(239, 68, 68, 0.25)' : 'rgba(153, 27, 27, 0.15)';
    }
    if (threatLevel >= 50) {
      return 'rgba(245, 158, 11, 0.12)';
    }
    return 'rgba(56, 189, 248, 0.04)';
  };

  // Helper for NPC Details
  const getNpcDetails = (dataId?: string) => {
    switch (dataId) {
      case 'npc_bob':
        return { emoji: '💼', name: 'Bob Miller', role: 'Commercial Wire', color: '#f59e0b', tag: 'FINANCE' };
      case 'npc_linda':
        return { emoji: '📋', name: 'Linda Chen', role: 'VP Compliance', color: '#ec4899', tag: 'GLBA DIR' };
      case 'npc_dave':
        return { emoji: '🖥️', name: 'Dave Kowalski', role: 'Core Mainframe', color: '#06b6d4', tag: 'INFRA' };
      case 'npc_marcus':
        return { emoji: '🛡️', name: 'Marcus Vance', role: 'SecOps SOC Lead', color: '#10b981', tag: 'SECOPS' };
      case 'npc_karen':
        return { emoji: '📱', name: 'Karen Sterling', role: 'OCC Risk Liaison', color: '#8b5cf6', tag: 'EXEC' };
      default:
        return { emoji: '👤', name: 'Colleague', role: 'Employee', color: '#38bdf8', tag: 'STAFF' };
    }
  };

  // Easter egg triggers for Office props
  const handlePropClick = (propName: string, message: string) => {
    audio.playClick();
    setEasterEggToast(message);
    setTimeout(() => setEasterEggToast(null), 3500);
  };

  return (
    <div id="office-hub-viewport" className="relative flex-1 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none bg-[#090d16]">
      {/* Background Animated Retro Sci-Fi Grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none z-0 opacity-40" />

      {/* Dynamic Emergency Lighting & Alarm Strobe */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-500 z-10"
        style={{ backgroundColor: getAtmosphereGlow() }}
      />

      {/* CRT Scanline & Phosphor Overlay */}
      {crtEnabled && <div className="absolute inset-0 crt-overlay z-20 pointer-events-none" />}

      {/* Top Floating Arcade Control HUD */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-auto">
        {/* Left Side: Floor Tag & Freeform Movement Legend */}
        <div className="flex items-center gap-2">
          <div className="bg-[#0f172a] text-white px-3 py-1.5 border-2 border-[#334155] shadow-lg flex items-center gap-2.5 font-arcade text-xs">
            <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
            <span className="text-[#38bdf8] font-bold">FLOOR {playerStats.currentFloor}</span>
            <span className="text-white/40 hidden md:inline">|</span>
            <span className="text-amber-300 font-pixel text-[9px] hidden sm:inline">
              FREEFORM ROAMING ACTIVE
            </span>
          </div>

          {/* Colleague Schedule Drawer Toggle */}
          <button
            onClick={() => setShowNpcRosterDrawer(prev => !prev)}
            className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-slate-200 px-2.5 py-1.5 border-2 border-[#334155] font-pixel text-[9px] transition-all cursor-pointer shadow"
            title="Toggle Live Colleague Schedules"
          >
            <Users className="w-3 h-3 text-[#38bdf8]" />
            <span className="hidden sm:inline">OPERATIVES:</span>
            <span className="text-emerald-400 font-bold">{peerOperatives.length + npcSchedules.length} LIVE</span>
          </button>

          <div className="hidden lg:flex items-center gap-1.5 bg-[#0b0f19]/90 px-3 py-1.5 border border-white/10 text-[11px] font-tech text-slate-300 shadow">
            <span className="text-[#38bdf8] font-bold">[WASD / Click Floor]</span> Free Move
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-bold">[E / Space]</span> Interact
            <span className="text-slate-500">•</span>
            <span className="text-purple-400 font-bold">[V]</span> 2.5D Mode
          </div>
        </div>

        {/* Right Side: Navigation & Perspective Controls */}
        <div className="flex items-center gap-2">
          {/* Operative Roster Switcher */}
          <button
            id="btn-open-roster"
            onClick={() => {
              audio.playClick();
              setShowRosterModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-slate-200 hover:text-white font-pixel text-[9px] uppercase tracking-wider border-2 border-[#38bdf8] shadow-md transition-all cursor-pointer"
            title="Switch Active SecOps Specialist"
          >
            <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden sm:inline">OPERATIVE:</span>
            <span className="text-[#38bdf8]">
              {PLAYABLE_OPERATIVES.find(op => op.id === (playerStats.characterSkin || 'player_alex'))?.callsign || 'AGENT'}
            </span>
          </button>

          {/* Trophy Case & Dundie Awards Button */}
          <button
            id="btn-hub-trophy-case"
            onClick={() => {
              audio.playClick();
              if (onOpenTrophyRoom) onOpenTrophyRoom();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-amber-300 hover:text-amber-200 font-pixel text-[9px] uppercase tracking-wider border-2 border-amber-500/70 shadow-md transition-all cursor-pointer"
            title="View Discovered 'The Office' Desk Collectibles & Dundies"
          >
            <span className="text-xs">🏆</span>
            <span className="hidden sm:inline">PROPS:</span>
            <span className="text-yellow-400 font-bold">{(playerStats.collectedProps?.length || 0) + (playerStats.dundieAwards?.length || 0)}</span>
          </button>

          {/* Perspective View Mode Toggle */}
          <button
            onClick={() => {
              audio.playClick();
              setViewMode(prev => prev === 'ISOMETRIC_25D' ? 'ORTHO_2D' : 'ISOMETRIC_25D');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-pixel text-[9px] uppercase tracking-wider border-2 transition-all cursor-pointer shadow-md ${
              viewMode === 'ISOMETRIC_25D'
                ? 'bg-[#0284c7] text-white border-[#38bdf8] hover:bg-[#0369a1]'
                : 'bg-[#1e293b] text-slate-300 border-[#475569] hover:bg-[#334155]'
            }`}
            title="Toggle between 2.5D Isometric Diorama and Top-Down Ortho"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewMode === 'ISOMETRIC_25D' ? '2.5D DIORAMA' : 'ORTHO 2D'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-[#0f172a] border border-[#334155] p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.3, prev + 0.1))}
              className="p-1 hover:bg-[#1e293b] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.1))}
              className="p-1 hover:bg-[#1e293b] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* CRT Filter Toggle */}
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className={`p-1.5 border text-xs transition-colors cursor-pointer ${
              crtEnabled ? 'bg-[#0f172a] border-[#38bdf8] text-[#38bdf8]' : 'bg-[#0f172a] border-[#334155] text-slate-500'
            }`}
            title="Toggle CRT Scanlines"
          >
            <Monitor className="w-4 h-4" />
          </button>

          {/* 90-Second Demo Button */}
          <button
            id="btn-fast-demo"
            onClick={onFastDemoScript}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-pixel text-[8px] sm:text-[9px] uppercase tracking-widest border-2 border-[#f87171] shadow-lg transition-all cursor-pointer active:translate-y-0.5"
            title="Auto-trigger Demo Flow"
          >
            <Play className="w-3 h-3 fill-current text-white" />
            <span className="hidden sm:inline">DEMO</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 bg-[#0f172a] border-2 border-[#334155] text-slate-300 hover:text-white hover:border-[#38bdf8] transition-colors cursor-pointer"
            title="Toggle Sound FX"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 opacity-50" />}
          </button>
        </div>
      </div>

      {/* Floating Colleague Schedule Drawer */}
      {showNpcRosterDrawer && (
        <div className="absolute top-14 left-3 z-40 bg-[#0f172a]/95 border-2 border-[#38bdf8] p-3 shadow-2xl max-w-sm rounded-sm backdrop-blur-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-[#334155] mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#38bdf8]" />
              <span className="font-arcade text-xs text-white uppercase tracking-wider">Live Building Floor Sync</span>
            </div>
            <button 
              onClick={() => setShowNpcRosterDrawer(false)}
              className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {/* Live Peer Operatives (Dwight, Jim, Pam, Michael) */}
            <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              Scranton Branch Operatives (Active)
            </div>
            {peerOperatives.map(peer => (
              <div key={peer.id} className="bg-[#1e293b]/70 border border-amber-500/30 p-2 rounded flex flex-col gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>👑</span>
                    <span>{peer.username}</span>
                  </div>
                  <span className="font-pixel text-[7px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    LVL {peer.clearanceLevel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 italic font-mono pl-4">
                  "{peer.speechBubble || peer.statusMessage}"
                </div>
                <div className="text-[9px] text-slate-400 flex items-center justify-between pl-4 pt-0.5 border-t border-slate-700/50">
                  <span>{peer.role}</span>
                  <span className="text-amber-300">{peer.score} pts</span>
                </div>
              </div>
            ))}

            <div className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider pt-2">
              Department Staff Schedules
            </div>
            {npcSchedules.map(npc => {
              const tagInfo = getNpcActivityTag(npc.state, npc.targetDestination?.type);
              const npcMeta = getNpcDetails(npc.dataId);
              return (
                <div key={npc.npcId} className="bg-[#1e293b]/60 border border-[#334155] p-2 rounded flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <span>{npcMeta.emoji}</span>
                      <span>{npc.name}</span>
                    </div>
                    <span 
                      className="font-pixel text-[7px] px-1.5 py-0.5 rounded text-white"
                      style={{ backgroundColor: tagInfo.color }}
                    >
                      {tagInfo.icon} {tagInfo.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 italic font-mono pl-5">
                    "{npc.activityMessage}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main 2.5D Isometric Diorama Stage Canvas */}
      <div 
        className="relative flex-1 w-full max-w-6xl max-h-[82vh] flex items-center justify-center overflow-hidden isometric-stage mt-6 sm:mt-8"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        {/* Isometric Stage Frame */}
        <div
          className={`relative transition-all duration-500 ease-out ${
            viewMode === 'ISOMETRIC_25D' ? 'isometric-grid' : 'ortho-grid'
          }`}
          style={{ transformOrigin: 'center center' }}
        >
          {/* Foundation Base */}
          {viewMode === 'ISOMETRIC_25D' && (
            <div 
              className="absolute -inset-4 bg-[#070a12] border-4 border-[#1e293b] rounded-sm pointer-events-none"
              style={{
                transform: 'translateZ(-28px)',
                boxShadow: '-12px 12px 0px #030508, -24px 24px 32px rgba(0,0,0,0.8)'
              }}
            />
          )}

          {/* Office Floor Tile Grid */}
          <div
            className="grid gap-[2px] bg-[#0c101d] p-3 border-2 border-[#1e293b] rounded-sm relative"
            style={{
              gridTemplateColumns: `repeat(${mapGrid.width}, minmax(0, 1fr))`
            }}
          >
            {mapGrid.tiles.map((row, y) =>
              row.map((tile, x) => {
                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => {
                      if (isPointWalkable(x + 0.5, y + 0.5)) {
                        setTargetWaypoint({ x: x + 0.5, y: y + 0.5 });
                        audio.playClick();
                      }
                    }}
                    className={`w-9 h-9 sm:w-11 sm:h-11 md:w-13 md:h-13 lg:w-14 lg:h-14 flex items-center justify-center relative cursor-pointer select-none transition-all duration-150 ${
                      tile === 'WALL'
                        ? 'bg-[#080d18] border border-[#1e293b] iso-tile-wall'
                        : tile === 'CARPET'
                        ? 'bg-[#152336] hover:bg-[#1c304a] border border-[#1e293b]/60 iso-tile-slab'
                        : tile === 'WINDOW'
                        ? 'bg-[#0e2a47] border-b-4 border-[#38bdf8] overflow-hidden'
                        : tile === 'RESTROOM'
                        ? 'bg-[#1e1b4b] border border-[#818cf8]/40 iso-tile-slab'
                        : 'bg-[#101927] hover:bg-[#18263a] border border-[#1e293b]/40 iso-tile-slab'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      zIndex: (x + y) * 2
                    }}
                  >
                    {/* Carpet Texture */}
                    {tile === 'CARPET' && (
                      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:6px_6px]" />
                    )}

                    {/* Window Lights */}
                    {tile === 'WINDOW' && (
                      <div className="absolute inset-0 flex flex-col justify-end p-0.5 pointer-events-none">
                        <div className="w-full h-1/2 bg-gradient-to-t from-[#0284c7]/40 to-transparent flex items-end justify-around pb-0.5">
                          <div className="w-1 h-2 bg-[#fbbf24] animate-pulse" />
                          <div className="w-1 h-3 bg-[#38bdf8]" />
                          <div className="w-1 h-1.5 bg-[#ec4899]" />
                        </div>
                      </div>
                    )}

                    {/* DESK */}
                    {tile === 'DESK' && (
                      <div 
                        className="w-[90%] h-[90%] bg-[#2d1b10] border-2 border-[#6d4323] rounded-sm flex flex-col items-center justify-center p-0.5 shadow-md"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(10px)' : 'none' }}
                      >
                        <div className="flex gap-1 items-center mb-0.5">
                          <div className="w-2.5 h-2 bg-[#0284c7] border border-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
                          <div className="w-2.5 h-2 bg-[#10b981] border border-[#34d399] shadow-[0_0_6px_#10b981]" />
                        </div>
                        <div className="w-5 h-1 bg-[#1e293b] rounded-[1px]" />
                      </div>
                    )}

                    {/* THE OFFICE EASTER EGG: Jell-O Stapler Prank */}
                    {tile === 'JELLO_STAPLER' && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropClick('Jell-O Stapler', 'Dwight: "DAMMIT JIM! He put my stapler in Jell-O again!" (+10 XP)');
                        }}
                        className="flex flex-col items-center justify-center cursor-pointer group"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(12px)' : 'none' }}
                        title="Jim's Stapler in Jell-O Prank"
                      >
                        <div className="w-7 h-7 bg-amber-400/80 border-2 border-amber-300 rounded-lg flex items-center justify-center shadow-[0_0_10px_#f59e0b] group-hover:scale-110 transition-transform">
                          <span className="text-xs">🍮</span>
                        </div>
                        <span className="text-[6px] font-pixel text-amber-300 uppercase">JELL-O</span>
                      </div>
                    )}

                    {/* THE OFFICE EASTER EGG: Dundie Trophy Display */}
                    {tile === 'DUNDIE_DISPLAY' && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropClick('Dundie Trophy Display', 'Michael: "The Dundies are about celebrating the best in all of us!" (+15 XP)');
                        }}
                        className="flex flex-col items-center justify-center cursor-pointer group animate-bob"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(14px)' : 'none' }}
                        title="Dundie Awards Showcase"
                      >
                        <div className="w-7 h-7 bg-gradient-to-t from-amber-600 to-yellow-300 border-2 border-yellow-200 rounded-sm flex items-center justify-center shadow-[0_0_12px_#fbbf24] group-hover:scale-115 transition-transform">
                          <Award className="w-4 h-4 text-slate-950" />
                        </div>
                        <span className="text-[6px] font-pixel text-yellow-300">DUNDIES</span>
                      </div>
                    )}

                    {/* THE OFFICE: Dunder Mifflin Paper Stacks */}
                    {tile === 'PAPER_STACK' && (
                      <div 
                        className="w-[85%] h-[85%] bg-slate-100 border-2 border-slate-400 rounded-sm flex flex-col items-center justify-center p-0.5 shadow-md"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(8px)' : 'none' }}
                      >
                        <div className="w-5 h-2 bg-blue-600 text-[5px] text-white font-bold flex items-center justify-center">
                          DM 24LB
                        </div>
                      </div>
                    )}

                    {/* SERVER RACK */}
                    {tile === 'SERVER' && (
                      <div 
                        className="w-[85%] h-[85%] bg-[#080d1a] border-2 border-[#0284c7] rounded-sm flex flex-col items-center justify-between p-1 shadow-[0_0_12px_rgba(2,132,199,0.3)]"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(18px)' : 'none' }}
                      >
                        <div className="w-full flex justify-between px-0.5">
                          <div className="w-1 h-1 rounded-full bg-[#38bdf8] animate-ping" />
                          <div className="w-1 h-1 rounded-full bg-[#10b981]" />
                          <div className="w-1 h-1 rounded-full bg-[#fbbf24] animate-pulse" />
                        </div>
                        <div className="w-full space-y-0.5">
                          <div className="h-0.5 bg-[#1e293b] w-full" />
                          <div className="h-0.5 bg-[#0284c7]/50 w-full" />
                        </div>
                        <div className="w-2 h-2 rounded-full border border-[#38bdf8]/40 animate-spin" />
                      </div>
                    )}

                    {/* RESTROOM */}
                    {tile === 'RESTROOM' && (
                      <div 
                        className="w-[90%] h-[90%] bg-[#1e1b4b] border-2 border-[#818cf8]/70 rounded-sm flex flex-col items-center justify-center p-0.5 shadow-md relative overflow-hidden"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(10px)' : 'none' }}
                      >
                        <span className="text-xs filter drop-shadow">🚻</span>
                        <span className="text-[6px] font-pixel text-[#c7d2fe]">RESTROOM</span>
                      </div>
                    )}

                    {/* POTTED PLANT */}
                    {tile === 'PLANT' && (
                      <div 
                        className="flex flex-col items-center justify-center animate-bob"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(12px)' : 'none' }}
                      >
                        <span className="text-sm sm:text-base filter drop-shadow-md">🪴</span>
                      </div>
                    )}

                    {/* COFFEE STATION (World's Best Boss Mug) */}
                    {tile === 'COFFEE_STATION' && (
                      <div 
                        className="flex flex-col items-center justify-center relative"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(14px)' : 'none' }}
                      >
                        <div className="absolute -top-3 w-1.5 h-1.5 bg-white/70 rounded-full animate-steam" />
                        <span className="text-sm sm:text-base filter drop-shadow-md">☕</span>
                      </div>
                    )}

                    {/* WATER COOLER */}
                    {tile === 'WATER_COOLER' && (
                      <div 
                        className="flex flex-col items-center justify-center"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(12px)' : 'none' }}
                      >
                        <span className="text-sm sm:text-base filter drop-shadow-md">🚰</span>
                      </div>
                    )}

                    {/* WHITEBOARD & PRINTER */}
                    {tile === 'WHITEBOARD' && (
                      <div 
                        className="w-[85%] h-[85%] bg-white border-2 border-slate-400 flex items-center justify-center shadow-sm"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(14px)' : 'none' }}
                      >
                        <span className="text-[10px]">📊</span>
                      </div>
                    )}
                    {tile === 'PRINTER' && (
                      <div 
                        className="w-[85%] h-[85%] bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-sm"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(10px)' : 'none' }}
                      >
                        <span className="text-xs">🖨️</span>
                      </div>
                    )}

                    {/* ELEVATOR */}
                    {tile === 'ELEVATOR' && (
                      <div 
                        className="w-full h-full bg-[#064e3b] border-2 border-[#10b981] flex flex-col items-center justify-center text-xs relative overflow-hidden shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                        style={{ transform: viewMode === 'ISOMETRIC_25D' ? 'translateZ(8px)' : 'none' }}
                      >
                        <DoorOpen className="w-4 h-4 text-[#34d399]" />
                        <span className="text-[8px] font-pixel text-[#34d399]">EXIT</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* ============================================================= */}
            {/* FREEFORM TARGET WAYPOINT BEACON RING */}
            {/* ============================================================= */}
            {targetWaypoint && (
              <div
                className="absolute pointer-events-none z-20 flex items-center justify-center"
                style={{
                  left: `${(targetWaypoint.x / mapGrid.width) * 100}%`,
                  top: `${(targetWaypoint.y / mapGrid.height) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-8 h-8 rounded-full border-2 border-sky-400 animate-ping opacity-80 shadow-[0_0_12px_#38bdf8]" />
                <div className="absolute w-3 h-3 rounded-full bg-sky-400 shadow-lg" />
              </div>
            )}

            {/* ============================================================= */}
            {/* FREEFORM INTERACTIVE ENTITIES (Terminals, Phones, USBs, Clean Desk) */}
            {/* ============================================================= */}
            {activeEntities.map(entity => {
              const isNearby = nearbyEntity?.id === entity.id;
              const leftPercent = (entity.x / mapGrid.width) * 100;
              const topPercent = (entity.y / mapGrid.height) * 100;

              return (
                <div
                  key={entity.id}
                  onClick={() => onInteractEntity(entity)}
                  className="absolute pointer-events-auto cursor-pointer z-25 flex flex-col items-center justify-center"
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: `translate(-50%, -50%) ${viewMode === 'ISOMETRIC_25D' ? 'translateZ(22px)' : ''}`
                  }}
                >
                  {/* Proximity Pulsing Ring */}
                  {isNearby && (
                    <div className="absolute -inset-2 rounded-full border-2 border-amber-400 animate-pulseGlow shadow-[0_0_10px_#fbbf24]" />
                  )}

                  {/* TERMINAL (Phishing Station) */}
                  {entity.type === 'TERMINAL' && (
                    <div className="relative flex flex-col items-center animate-bob">
                      <div className="w-8 h-8 bg-[#0284c7] border-2 border-[#38bdf8] rounded-sm flex items-center justify-center text-white shadow-[0_0_14px_#0284c7]">
                        <Terminal className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute -top-4 font-pixel text-[7px] bg-[#0284c7] text-white px-1 border border-white whitespace-nowrap">
                        INBOX
                      </span>
                    </div>
                  )}

                  {/* PHONE (Vishing Challenge) */}
                  {entity.type === 'PHONE' && (
                    <div className="relative flex flex-col items-center animate-bob">
                      <div className="w-8 h-8 bg-[#d97706] border-2 border-[#fbbf24] rounded-sm flex items-center justify-center text-white shadow-[0_0_14px_#d97706] animate-pulse">
                        <PhoneCall className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute -top-4 font-pixel text-[7px] bg-[#d97706] text-white px-1 border border-white whitespace-nowrap">
                        VOIP
                      </span>
                    </div>
                  )}

                  {/* USB DROP */}
                  {entity.type === 'USB_DROP' && (
                    <div className="relative flex flex-col items-center animate-bob">
                      <div className="w-7 h-7 bg-[#4f46e5] border-2 border-[#818cf8] rounded-sm flex items-center justify-center text-white shadow-[0_0_12px_#4f46e5]">
                        <HardDrive className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="absolute -top-4 font-pixel text-[7px] bg-[#4f46e5] text-white px-1 border border-white whitespace-nowrap">
                        USB
                      </span>
                    </div>
                  )}

                  {/* UNLOCKED PC (Clean Desk Violation) */}
                  {entity.type === 'UNLOCKED_PC' && (
                    <div className="relative flex flex-col items-center animate-bob">
                      <div className="w-7 h-7 bg-[#dc2626] border-2 border-[#f87171] rounded-sm flex items-center justify-center text-white shadow-[0_0_12px_#dc2626]">
                        <Lock className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="absolute -top-4 font-pixel text-[7px] bg-[#dc2626] text-white px-1 border border-white whitespace-nowrap">
                        LOCK
                      </span>
                    </div>
                  )}

                  {/* COFFEE MACHINE */}
                  {entity.type === 'COFFEE_MACHINE' && (
                    <div className="relative flex flex-col items-center animate-bob">
                      <div className="w-8 h-8 bg-[#b45309] border-2 border-[#fde047] rounded-sm flex items-center justify-center text-white shadow-[0_0_12px_#b45309]">
                        <Coffee className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* NPC COWORKERS */}
                  {entity.type === 'NPC_COWORKER' && (() => {
                    const npcMeta = getNpcDetails(entity.dataId);
                    const npcSchedule = npcSchedules.find(n => n.dataId === entity.dataId);
                    const isPanicked = threatLevel >= 75;
                    const tagInfo = npcSchedule ? getNpcActivityTag(npcSchedule.state, npcSchedule.targetDestination?.type) : { tag: npcMeta.tag, icon: '👤', color: npcMeta.color };

                    return (
                      <div className="relative flex flex-col items-center group">
                        <div className={`transition-transform duration-150 group-hover:scale-115 ${npcSchedule?.isMoving ? 'scale-105' : 'animate-bob'}`}>
                          <PixelCharacter 
                            id={entity.dataId || 'npc_bob'}
                            direction={npcSchedule?.facing || 'DOWN'}
                            size="md"
                            isMoving={npcSchedule?.isMoving || false}
                            walkFrame={npcSchedule?.walkFrame || 0}
                            mood={isPanicked ? 'PANICKED' : 'CALM'}
                          />
                        </div>
                        <div 
                          className="absolute -top-6 font-pixel text-[7px] px-1.5 py-0.5 rounded-[1px] border border-white text-white whitespace-nowrap shadow-md flex items-center gap-1"
                          style={{ backgroundColor: tagInfo.color }}
                        >
                          <span>{tagInfo.icon}</span>
                          <span>{tagInfo.tag}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* ELEVATOR EXIT */}
                  {entity.type === 'ELEVATOR_EXIT' && (
                    <div className="relative flex flex-col items-center animate-bounce">
                      <div className="w-8 h-8 bg-[#059669] border-2 border-[#34d399] rounded-sm flex items-center justify-center text-white shadow-[0_0_14px_#059669]">
                        <DoorOpen className="w-4 h-4 text-white" />
                      </div>
                      <span className="absolute -top-4 font-pixel text-[7px] bg-[#059669] text-white px-1 border border-white whitespace-nowrap">
                        EXIT
                      </span>
                    </div>
                  )}

                  {/* PROCEDURAL 'THE OFFICE' DESK COLLECTIBLES (Jell-O Staplers, Beet Carvings, Dundies, Bobbleheads) */}
                  {entity.type === 'COLLECTIBLE_PROP' && entity.collectible && entity.status === 'ACTIVE' && (
                    <div 
                      className="relative flex flex-col items-center group cursor-pointer animate-bob"
                      title={`${entity.collectible.title} (${entity.collectible.rarity})`}
                    >
                      {/* Floating Animated Prop Badge with glow and bounce */}
                      <div 
                        className="relative flex items-center justify-center rounded-lg p-1.5 transition-all group-hover:scale-125 duration-200"
                        style={{
                          backgroundColor: `${entity.collectible.sparkleColor}30`,
                          border: `2px solid ${entity.collectible.sparkleColor}`,
                          boxShadow: `0 0 16px ${entity.collectible.sparkleColor}`
                        }}
                      >
                        <span className="text-base sm:text-lg filter drop-shadow-md">{entity.collectible.iconEmoji}</span>
                        <div 
                          className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
                          style={{ backgroundColor: entity.collectible.sparkleColor }}
                        />
                      </div>
                      <span 
                        className="absolute -top-4 font-pixel text-[6px] px-1 py-0.2 rounded border text-slate-950 font-bold whitespace-nowrap shadow-md"
                        style={{
                          backgroundColor: entity.collectible.sparkleColor,
                          borderColor: '#ffffff'
                        }}
                      >
                        {entity.collectible.title.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* ============================================================= */}
            {/* MULTIPLAYER PEER OPERATIVES (Dwight, Jim, Pam, Michael) */}
            {/* ============================================================= */}
            {peerOperatives.map(peer => {
              const isNearby = nearbyPeer?.id === peer.id;
              const leftPercent = (peer.pos.x / mapGrid.width) * 100;
              const topPercent = (peer.pos.y / mapGrid.height) * 100;

              return (
                <div
                  key={peer.id}
                  onClick={() => setInspectedPeer(peer)}
                  className="absolute pointer-events-auto cursor-pointer z-30 flex flex-col items-center justify-center transition-all duration-300"
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: `translate(-50%, -50%) ${viewMode === 'ISOMETRIC_25D' ? 'translateZ(26px)' : ''}`
                  }}
                >
                  {/* Proximity Ring */}
                  {isNearby && (
                    <div className="absolute -inset-2 rounded-full border-2 border-sky-400 animate-pulseGlow shadow-[0_0_10px_#38bdf8]" />
                  )}

                  {/* Speech Bubble */}
                  {peer.speechBubble && (
                    <div className="absolute -top-10 bg-slate-900 text-amber-300 font-pixel text-[7px] px-2 py-0.5 rounded border border-amber-500/50 shadow-lg whitespace-nowrap animate-bounce flex items-center gap-1">
                      <MessageSquare className="w-2.5 h-2.5 text-amber-400" />
                      <span>{peer.speechBubble}</span>
                    </div>
                  )}

                  <div className="relative hover:scale-110 transition-transform">
                    <PixelCharacter
                      id={peer.avatarSkin}
                      direction={peer.facing}
                      size="md"
                      isMoving={peer.isMoving}
                      walkFrame={peer.walkFrame}
                    />
                    {/* Operative Name Label */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-700 text-slate-200 font-pixel text-[6px] px-1 py-0.2 rounded whitespace-nowrap shadow">
                      {peer.username.split('_')[0]} (LVL {peer.clearanceLevel})
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ============================================================= */}
            {/* FREEFORM PLAYER SPRITE (Smooth Continuous Position) */}
            {/* ============================================================= */}
            <div
              className="absolute pointer-events-none z-35 flex flex-col items-center justify-center transition-transform"
              style={{
                left: `${(playerPos.x / mapGrid.width) * 100}%`,
                top: `${(playerPos.y / mapGrid.height) * 100}%`,
                transform: `translate(-50%, -50%) ${viewMode === 'ISOMETRIC_25D' ? 'translateZ(28px)' : ''}`
              }}
            >
              {/* Coffee Speed Aura */}
              {playerStats.coffeeBuffDuration > 0 && (
                <div className="absolute inset-0 rounded-full border-2 border-amber-300 animate-ping opacity-70" />
              )}

              {/* Freeform Operative Character Sprite */}
              <div className={`relative transition-transform duration-100 ${isMoving ? 'scale-105' : 'animate-bob'}`}>
                <PixelCharacter
                  id={playerStats.characterSkin || 'player_alex'}
                  direction={playerDir}
                  size="md"
                  isMoving={isMoving}
                  walkFrame={walkFrame}
                />
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#0284c7] border border-white text-white font-pixel text-[6px] px-1 py-0.2 rounded-[1px] whitespace-nowrap shadow">
                  {PLAYABLE_OPERATIVES.find(op => op.id === (playerStats.characterSkin || 'player_alex'))?.callsign || 'YOU'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Easter Egg Floating Banner Toast */}
      {easterEggToast && (
        <div className="absolute top-20 z-50 bg-slate-900 border-2 border-amber-500 text-amber-300 font-mono text-xs px-4 py-2 rounded-lg shadow-2xl animate-bounce">
          {easterEggToast}
        </div>
      )}

      {/* Proximity Interaction Prompt Toast */}
      {nearbyEntity && (
        <div className="absolute bottom-14 sm:bottom-18 z-40 animate-bounce">
          <button
            id="btn-interact-prompt"
            onClick={() => {
              audio.playClick();
              onInteractEntity(nearbyEntity);
            }}
            className="flex items-center gap-3 px-6 py-3 bg-[#0f172a] hover:bg-[#1e293b] text-white font-arcade text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xl border-4 border-[#38bdf8] rounded-sm cursor-pointer active:translate-y-1"
          >
            <div className="w-7 h-7 bg-[#0284c7] border border-white flex items-center justify-center text-white">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-left">
              <div className="text-[9px] font-pixel text-[#38bdf8]">PRESS [E] OR [SPACE] TO ENGAGE</div>
              <div className="text-white text-xs sm:text-sm font-bold tracking-wide">
                {nearbyEntity.name}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Peer Operative Inspection Card Modal */}
      {inspectedPeer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border-2 border-amber-500 rounded-xl p-5 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-14 bg-slate-950 border border-amber-500/40 rounded-lg flex items-center justify-center overflow-hidden">
                  <PixelCharacter id={inspectedPeer.avatarSkin} size="sm" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-300 font-mono flex items-center gap-1.5">
                    <span>{inspectedPeer.username}</span>
                    <span className="text-xs px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded">
                      LVL {inspectedPeer.clearanceLevel}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">{inspectedPeer.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setInspectedPeer(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-amber-400 font-bold">{inspectedPeer.dundieAward}</div>
              <div className="text-slate-300 italic">"{inspectedPeer.statusMessage}"</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
              <button
                onClick={() => {
                  audio.playSuccess();
                  if (onHighFivePeer) onHighFivePeer(inspectedPeer.username);
                  setInspectedPeer(null);
                  handlePropClick('High Five', `You gave ${inspectedPeer.username} a high five! (+15 XP)`);
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 shadow-md"
              >
                <Handshake className="w-4 h-4" />
                <span>Give High Five (+15 XP)</span>
              </button>
              <button
                onClick={() => setInspectedPeer(null)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Operative Selection Modal */}
      {showRosterModal && (
        <OperativeSelectModal
          currentSkin={playerStats.characterSkin || 'player_alex'}
          onSelectSkin={(skinId) => {
            if (onSelectSkin) {
              onSelectSkin(skinId);
            }
          }}
          onClose={() => setShowRosterModal(false)}
        />
      )}
    </div>
  );
};
