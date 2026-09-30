import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MapGrid, OfficeEntity, PlayerStats, TileType, Position, MultiplayerOperative 
} from '../types';
import { 
  Terminal, PhoneCall, HardDrive, Lock, Coffee, DoorOpen,
  Zap, Volume2, VolumeX, Award, Handshake
} from 'lucide-react';
import { audio } from '../utils/audio';
import { PixelCharacter } from './PixelCharacter';
import { OperativeSelectModal } from './OperativeSelectModal';
import { INITIAL_PEER_OPERATIVES } from '../data/leaderboardData';
import { 
  NpcAiSchedule, 
  createInitialNpcAiState, 
  findPath, 
  pickRandomDestination
} from '../utils/npcAi';

interface OfficeHubProps {
  mapGrid: MapGrid;
  playerStats: PlayerStats;
  threatLevel: number;
  onInteractEntity: (entity: OfficeEntity) => void;
  onToggleSound: () => void;
  soundEnabled: boolean;
  onSelectSkin?: (skinId: string) => void;
  onHighFivePeer?: (peerName: string) => void;
}

export const OfficeHub: React.FC<OfficeHubProps> = ({
  mapGrid,
  playerStats,
  threatLevel,
  onInteractEntity,
  onToggleSound,
  soundEnabled,
  onSelectSkin,
  onHighFivePeer
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
  const [tileSize, setTileSize] = useState(32);
  const stageRef = useRef<HTMLDivElement>(null);
  
  // UI & Viewport Controls
  const [flashSiren, setFlashSiren] = useState<boolean>(false);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [easterEggToast, setEasterEggToast] = useState<string | null>(null);

  // Other security staff roam the floor.
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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const gap = 2;
      const frameSpace = 32;
      const widthFit = (entry.contentRect.width - frameSpace - (mapGrid.width - 1) * gap) / mapGrid.width;
      const heightFit = (entry.contentRect.height - frameSpace - (mapGrid.height - 1) * gap) / mapGrid.height;
      setTileSize(Math.max(1, Math.min(56, Math.floor(Math.min(widthFit, heightFit)))));
    });

    resizeObserver.observe(stage);
    return () => resizeObserver.disconnect();
  }, [mapGrid.height, mapGrid.width]);

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

          if (shouldWander) {
            const wanderDest = pickRandomDestination();
            nextX = wanderDest.x + 0.5;
            nextY = wanderDest.y + 0.5;
            nextFacing = nextX > peer.pos.x ? 'RIGHT' : 'LEFT';
          }

          return {
            ...peer,
            pos: { x: nextX, y: nextY },
            facing: nextFacing,
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

  // Small details in the room can be inspected for extra XP.
  const handlePropClick = (propName: string, message: string) => {
    audio.playClick();
    setEasterEggToast(message);
    setTimeout(() => setEasterEggToast(null), 3500);
  };

  return (
    <div id="office-hub-viewport" className="relative flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden select-none bg-[#090d16]">
      {/* Background Animated Retro Sci-Fi Grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none z-0 opacity-40" />

      {/* Dynamic Emergency Lighting & Alarm Strobe */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-500 z-10"
        style={{ backgroundColor: getAtmosphereGlow() }}
      />

      <div className="absolute left-3 right-3 top-3 z-30 flex items-center justify-between gap-3 pointer-events-none">
        <div className="rounded-xl border border-white/10 bg-slate-950/85 px-3 py-2 shadow-lg">
          <div className="text-sm font-semibold text-white">Explore the floor</div>
          <div className="text-xs text-slate-300">Click a challenge to start</div>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="hidden rounded-lg border border-white/10 bg-slate-950/85 px-3 py-2 text-xs text-slate-300 md:block">
            Move with <kbd className="rounded bg-slate-700 px-1.5 py-0.5 text-white">WASD</kbd> or arrows
          </div>
          <div className="flex items-center rounded-lg border border-white/10 bg-slate-950/85 p-1">
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.3, prev + 0.1))}
              className="rounded px-2 py-1 text-sm text-slate-200 hover:bg-white/10"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.1))}
              className="rounded px-2 py-1 text-sm text-slate-200 hover:bg-white/10"
              aria-label="Zoom out"
            >
              −
            </button>
          </div>
          <button
            onClick={onToggleSound}
            className="rounded-lg border border-white/10 bg-slate-950/85 p-2 text-slate-200 hover:bg-white/10"
            aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* Main Ortho 2D Stage Canvas */}
      <div 
        ref={stageRef}
        className="relative mt-14 flex-1 min-h-0 w-full max-w-6xl flex items-center justify-center overflow-hidden sm:mt-16"
      >
        {/* Ortho 2D Stage Frame */}
        <div
          className="relative transition-all duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Office Floor Tile Grid */}
          <div
            className="grid gap-[2px] bg-[#0c101d] p-3 border-2 border-[#1e293b] rounded-sm relative shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${mapGrid.width}, ${tileSize}px)`,
              gridTemplateRows: `repeat(${mapGrid.height}, ${tileSize}px)`
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
                    className={`flex items-center justify-center relative cursor-pointer select-none transition-all duration-150 ${
                      tile === 'WALL'
                        ? 'bg-[#080d18] border border-[#1e293b]'
                        : tile === 'CARPET'
                        ? 'bg-[#152336] hover:bg-[#1c304a] border border-[#1e293b]/60'
                        : tile === 'WINDOW'
                        ? 'bg-[#0e2a47] border-b-4 border-[#38bdf8] overflow-hidden'
                        : tile === 'RESTROOM'
                        ? 'bg-[#1e1b4b] border border-[#818cf8]/40'
                        : 'bg-[#101927] hover:bg-[#18263a] border border-[#1e293b]/40'
                    }`}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      zIndex: 1
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
                      >
                        <div className="flex gap-1 items-center mb-0.5">
                          <div className="w-2.5 h-2 bg-[#0284c7] border border-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
                          <div className="w-2.5 h-2 bg-[#10b981] border border-[#34d399] shadow-[0_0_6px_#10b981]" />
                        </div>
                        <div className="w-5 h-1 bg-[#1e293b] rounded-[1px]" />
                      </div>
                    )}

                    {/* Desk stapler */}
                    {tile === 'DESK_STAPLER' && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropClick('Stapler', 'A stapler in the wrong drawer. (+10 XP)');
                        }}
                        className="flex flex-col items-center justify-center cursor-pointer group"
                        title="Inspect stapler"
                      >
                        <div className="w-7 h-7 bg-amber-400/80 border-2 border-amber-300 rounded-lg flex items-center justify-center shadow-[0_0_10px_#f59e0b] group-hover:scale-110 transition-transform">
                          <span className="text-xs">📎</span>
                        </div>
                      </div>
                    )}

                    {/* Security award display */}
                    {tile === 'AWARD_DISPLAY' && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePropClick('Security award', 'A reminder of the team’s best work. (+15 XP)');
                        }}
                        className="flex flex-col items-center justify-center cursor-pointer group animate-bob"
                        title="Inspect security awards"
                      >
                        <div className="w-7 h-7 bg-gradient-to-t from-amber-600 to-yellow-300 border-2 border-yellow-200 rounded-sm flex items-center justify-center shadow-[0_0_12px_#fbbf24] group-hover:scale-115 transition-transform">
                          <Award className="w-4 h-4 text-slate-950" />
                        </div>
                      </div>
                    )}

                    {/* Paper stacks */}
                    {tile === 'PAPER_STACK' && (
                      <div 
                        className="w-[85%] h-[85%] bg-slate-100 border-2 border-slate-400 rounded-sm flex flex-col items-center justify-center p-0.5 shadow-md"
                      >
                        <div className="w-5 h-2 bg-blue-600 text-[5px] text-white font-bold flex items-center justify-center">
                          FILES
                        </div>
                      </div>
                    )}

                    {/* SERVER RACK */}
                    {tile === 'SERVER' && (
                      <div 
                        className="w-[85%] h-[85%] bg-[#080d1a] border-2 border-[#0284c7] rounded-sm flex flex-col items-center justify-between p-1 shadow-[0_0_12px_rgba(2,132,199,0.3)]"
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
                      >
                        <span className="text-xs filter drop-shadow">🚻</span>
                        <span className="text-[6px] font-pixel text-[#c7d2fe]">RESTROOM</span>
                      </div>
                    )}

                    {/* POTTED PLANT */}
                    {tile === 'PLANT' && (
                      <div 
                        className="flex flex-col items-center justify-center animate-bob"
                      >
                        <span className="text-sm sm:text-base filter drop-shadow-md">🪴</span>
                      </div>
                    )}

                    {/* Coffee station */}
                    {tile === 'COFFEE_STATION' && (
                      <div 
                        className="flex flex-col items-center justify-center relative"
                      >
                        <div className="absolute -top-3 w-1.5 h-1.5 bg-white/70 rounded-full animate-steam" />
                        <span className="text-sm sm:text-base filter drop-shadow-md">☕</span>
                      </div>
                    )}

                    {/* WATER COOLER */}
                    {tile === 'WATER_COOLER' && (
                      <div 
                        className="flex flex-col items-center justify-center"
                      >
                        <span className="text-sm sm:text-base filter drop-shadow-md">🚰</span>
                      </div>
                    )}

                    {/* WHITEBOARD & PRINTER */}
                    {tile === 'WHITEBOARD' && (
                      <div 
                        className="w-[85%] h-[85%] bg-white border-2 border-slate-400 flex items-center justify-center shadow-sm"
                      >
                        <span className="text-[10px]">📊</span>
                      </div>
                    )}
                    {tile === 'PRINTER' && (
                      <div 
                        className="w-[85%] h-[85%] bg-slate-800 border-2 border-slate-600 flex items-center justify-center shadow-sm"
                      >
                        <span className="text-xs">🖨️</span>
                      </div>
                    )}

                    {/* ELEVATOR */}
                    {tile === 'ELEVATOR' && (
                      <div 
                        className="w-full h-full bg-[#064e3b] border-2 border-[#10b981] flex flex-col items-center justify-center text-xs relative overflow-hidden shadow-[0_0_12px_rgba(16,185,129,0.4)]"
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
                  className="absolute pointer-events-auto cursor-pointer flex flex-col items-center justify-center"
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: Math.floor(entity.y * 10) + 20
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
                    </div>
                  )}

                  {/* PHONE (Vishing Challenge) */}
                  {entity.type === 'PHONE' && (
                    <div className="relative flex flex-col items-center animate-bob">
                      <div className="w-8 h-8 bg-[#d97706] border-2 border-[#fbbf24] rounded-sm flex items-center justify-center text-white shadow-[0_0_14px_#d97706] animate-pulse">
                        <PhoneCall className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* USB DROP */}
                  {entity.type === 'USB_DROP' && (
                    <div className="relative flex flex-col items-center animate-bob">
                      <div className="w-7 h-7 bg-[#4f46e5] border-2 border-[#818cf8] rounded-sm flex items-center justify-center text-white shadow-[0_0_12px_#4f46e5]">
                        <HardDrive className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  )}

                  {/* UNLOCKED PC (Clean Desk Violation) */}
                  {entity.type === 'UNLOCKED_PC' && (
                    <div className="relative flex flex-col items-center animate-bob">
                      <div className="w-7 h-7 bg-[#dc2626] border-2 border-[#f87171] rounded-sm flex items-center justify-center text-white shadow-[0_0_12px_#dc2626]">
                        <Lock className="w-3.5 h-3.5 text-white" />
                      </div>
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

                  {/* Coworkers */}
                  {entity.type === 'NPC_COWORKER' && (() => {
                    const npcSchedule = npcSchedules.find(n => n.dataId === entity.dataId);
                    const isPanicked = threatLevel >= 75;

                    return (
                      <div className="relative flex items-center justify-center">
                        <PixelCharacter
                          id={entity.dataId || 'npc_bob'}
                          direction={npcSchedule?.facing || 'DOWN'}
                          size="md"
                          isMoving={npcSchedule?.isMoving || false}
                          walkFrame={npcSchedule?.walkFrame || 0}
                          mood={isPanicked ? 'PANICKED' : 'CALM'}
                        />
                      </div>
                    );
                  })()}

                  {/* ELEVATOR EXIT */}
                  {entity.type === 'ELEVATOR_EXIT' && (
                    <div className="relative flex flex-col items-center animate-bounce">
                      <div className="w-8 h-8 bg-[#059669] border-2 border-[#34d399] rounded-sm flex items-center justify-center text-white shadow-[0_0_14px_#059669]">
                        <DoorOpen className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Discoverable security collectibles */}
                  {entity.type === 'COLLECTIBLE_PROP' && entity.collectible && entity.status === 'ACTIVE' && (
                    <div 
                      className="relative flex flex-col items-center group cursor-pointer animate-bob"
                      title={`${entity.collectible.title} (${entity.collectible.rarity})`}
                    >
                      {/* Collectible marker */}
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
                    </div>
                  )}
                </div>
              );
            })}

            {/* ============================================================= */}
            {/* Roaming security staff */}
            {/* ============================================================= */}
            {peerOperatives.map(peer => {
              const isNearby = nearbyPeer?.id === peer.id;
              const leftPercent = (peer.pos.x / mapGrid.width) * 100;
              const topPercent = (peer.pos.y / mapGrid.height) * 100;

              return (
                <div
                  key={peer.id}
                  onClick={() => setInspectedPeer(peer)}
                  className="absolute pointer-events-auto cursor-pointer flex flex-col items-center justify-center transition-all duration-300"
                  style={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: Math.floor(peer.pos.y * 10) + 30
                  }}
                >
                  {/* Proximity Ring */}
                  {isNearby && (
                    <div className="absolute -inset-2 rounded-full border-2 border-sky-400 animate-pulseGlow shadow-[0_0_10px_#38bdf8]" />
                  )}

                  <div className="relative hover:scale-110 transition-transform">
                    <PixelCharacter
                      id={peer.avatarSkin}
                      direction={peer.facing}
                      size="md"
                      isMoving={peer.isMoving}
                      walkFrame={peer.walkFrame}
                    />
                  </div>
                </div>
              );
            })}

            {/* ============================================================= */}
            {/* FREEFORM PLAYER SPRITE (Smooth Continuous Position) */}
            {/* ============================================================= */}
            <div
              className="absolute pointer-events-none flex flex-col items-center justify-center transition-transform"
              style={{
                left: `${(playerPos.x / mapGrid.width) * 100}%`,
                top: `${(playerPos.y / mapGrid.height) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: Math.floor(playerPos.y * 10) + 50
              }}
            >
              {/* Coffee Speed Aura */}
              {playerStats.coffeeBuffDuration > 0 && (
                <div className="absolute inset-0 rounded-full border-2 border-amber-300 animate-ping opacity-70" />
              )}

              {/* Player character */}
              <div className={`relative transition-transform duration-100 ${isMoving ? 'scale-105' : 'animate-bob'}`}>
                <PixelCharacter
                  id={playerStats.characterSkin || 'player_alex'}
                  direction={playerDir}
                  size="md"
                  isMoving={isMoving}
                  walkFrame={walkFrame}
                />
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

      {/* Nearby interaction prompt */}
      {nearbyEntity && (
        <div className="absolute bottom-4 z-40">
          <button
            id="btn-interact-prompt"
            onClick={() => {
              audio.playClick();
              onInteractEntity(nearbyEntity);
            }}
            className="flex items-center gap-3 rounded-xl border border-sky-300/40 bg-slate-950/95 px-5 py-3 text-left text-white shadow-2xl transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-white">
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">
                {nearbyEntity.name}
              </div>
              <div className="text-xs text-slate-300">Click or press E to interact</div>
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
