import React from 'react';
import { Shield, ShieldAlert, AlertTriangle, Flame, Coffee, Award, Sparkles, Zap, Coins, Users, Clock } from 'lucide-react';
import { PlayerStats } from '../types';
import { PixelCharacter, PLAYABLE_OPERATIVES } from './PixelCharacter';

interface ThreatMeterProps {
  threatLevel: number; // 0 to 100
  playerStats: PlayerStats;
  onOpenSkills: () => void;
  onOpenBadges: () => void;
  onOpenIncidents: () => void;
  incidentCount: number;
  onOpenRoster?: () => void;
  onOpenDailyMissions?: () => void;
  dailyMissionsCompletedCount?: number;
  dailyMissionsTotalCount?: number;
  onOpenLeaderboard?: () => void;
  playerRank?: number;
  workdaySeconds?: number;
  onOpenTrophyRoom?: () => void;
}

export const ThreatMeter: React.FC<ThreatMeterProps> = ({
  threatLevel,
  playerStats,
  onOpenSkills,
  onOpenBadges,
  onOpenIncidents,
  incidentCount,
  onOpenRoster,
  onOpenDailyMissions,
  dailyMissionsCompletedCount = 0,
  dailyMissionsTotalCount = 6,
  onOpenLeaderboard,
  playerRank = 4,
  workdaySeconds,
  onOpenTrophyRoom
}) => {
  // Current Operative Details
  const activeSkin = playerStats.characterSkin || 'player_alex';
  const activeOperative = PLAYABLE_OPERATIVES.find(op => op.id === activeSkin) || PLAYABLE_OPERATIVES[0];

  // 5 DEFCON Ticks
  const activeTicks = Math.ceil(threatLevel / 20);

  const getThreatStatus = () => {
    if (threatLevel < 25) return { text: 'THREAT: OPTIMAL', color: 'text-emerald-400', bg: 'bg-emerald-500' };
    if (threatLevel < 50) return { text: 'THREAT: GUARDED', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    if (threatLevel < 75) return { text: 'THREAT: ELEVATED', color: 'text-amber-500', bg: 'bg-amber-500' };
    return { text: 'THREAT LEVEL MIDNIGHT!', color: 'text-red-500', bg: 'bg-red-600' };
  };

  const threat = getThreatStatus();

  return (
    <header
      id="threat-meter-panel"
      className="h-16 border-b-4 border-[#1e293b] bg-[#0b0f19] px-3 sm:px-5 flex items-center justify-between z-30 shrink-0 text-white select-none shadow-xl relative"
    >
      {/* Left: Retro Arcade Title & Operative Badge */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Operative Portrait Frame */}
        <div 
          onClick={onOpenRoster}
          className="flex items-center gap-2 bg-[#070a12] p-1 border-2 border-[#334155] hover:border-[#38bdf8] rounded-sm transition-all cursor-pointer group shadow-md"
          title="Click to switch active SecOps Operative"
        >
          <div 
            className="w-10 h-11 bg-[#050811] border border-white/20 flex items-center justify-center relative overflow-hidden"
            style={{ borderColor: activeOperative.accentColor }}
          >
            <PixelCharacter id={activeOperative.id} size="sm" />
          </div>
          <div className="pr-1.5 hidden sm:block">
            <div className="font-pixel text-[7px] text-[#38bdf8] uppercase">
              AGENT [{activeOperative.callsign}]
            </div>
            <div className="text-[10px] font-tech text-white font-bold truncate max-w-[90px]">
              {activeOperative.name}
            </div>
          </div>
        </div>

        <div>
          <div className="font-arcade text-xs sm:text-sm tracking-wider text-white font-bold flex items-center gap-1.5">
            <span className="text-[#fbbf24]">SCRANTON</span>
            <span className="text-slate-300">SECOPS</span>
            <span className="text-[8px] font-pixel text-[#38bdf8] px-1 py-0.2 bg-[#0284c7]/30 border border-[#38bdf8]/40 hidden md:inline">
              1725 SLOUGH AVE
            </span>
          </div>
          <div className="text-[9px] font-pixel text-slate-400">
            FLOOR {playerStats.currentFloor} • LVL {playerStats.securityClearance}
          </div>
        </div>

        {/* Coffee Hyper-Focus Indicator */}
        {playerStats.coffeeBuffDuration > 0 && (
          <div className="hidden xl:flex items-center gap-1.5 bg-[#b45309] text-white px-2 py-0.5 text-[8px] font-pixel border border-[#fbbf24] shadow-md animate-pulse">
            <Coffee className="w-3 h-3 text-yellow-300" />
            <span>SPEED: {playerStats.coffeeBuffDuration}S</span>
          </div>
        )}
      </div>

      {/* Center: Segmented 5-Bar Arcade Threat Meter & Day Clock */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Hub Workday Clock */}
        {workdaySeconds !== undefined && (
          <div 
            className="hidden lg:flex items-center gap-1.5 bg-[#070a12] px-2.5 py-1 border-2 border-[#334155] rounded-sm"
            title="Workday Hub Timer (pauses inside mini-games so learning is never rushed)"
          >
            <Clock className={`w-3.5 h-3.5 ${workdaySeconds <= 60 ? 'text-red-400 animate-pulse' : 'text-sky-400'}`} />
            <div className="flex flex-col">
              <span className="text-[7px] font-pixel text-slate-400 uppercase leading-none">WORKDAY SHIFT</span>
              <span className={`text-[10px] font-pixel font-bold leading-tight ${workdaySeconds <= 60 ? 'text-red-400 font-bold animate-pulse' : 'text-slate-200'}`}>
                {Math.floor(workdaySeconds / 60).toString().padStart(2, '0')}:{(workdaySeconds % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center">
          <div className="text-[8px] font-pixel text-slate-400 uppercase tracking-wider mb-0.5 hidden sm:block">
            {threatLevel >= 75 ? '⚠️ ALARM MODE' : 'DEFCON DEFENSE GRID'}
          </div>
          <div className="flex items-center gap-1 bg-[#070a12] p-1 border-2 border-[#1e293b] rounded-sm">
            {[1, 2, 3, 4, 5].map((tick) => {
              const isFilled = tick <= activeTicks;
              return (
                <div
                  key={tick}
                  className={`w-3 sm:w-4 h-2.5 sm:h-3 transition-all duration-300 border border-black/40 ${
                    isFilled ? threat.bg : 'bg-[#1e293b]/40'
                  } ${isFilled && threatLevel >= 75 ? 'animate-pulse' : ''}`}
                />
              );
            })}
            <span className={`text-[8px] sm:text-[9px] font-pixel font-bold ml-1.5 ${threat.color}`}>
              {threatLevel}% [{threat.text}]
            </span>
          </div>
        </div>
      </div>

      {/* Right: Modern Retro Navigation & Feature Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Daily Missions Button (24h Refresh) */}
        <button
          id="btn-open-daily-missions"
          onClick={onOpenDailyMissions}
          className="flex items-center gap-1.5 px-2.5 py-1.5 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider bg-[#0f172a] hover:bg-[#1e293b] text-amber-300 border-2 border-amber-500/50 hover:border-amber-400 transition-all cursor-pointer shadow-md"
          title="Daily Missions (24h Refresh)"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">DAILY:</span>
          <span className="text-amber-300 font-bold">{dailyMissionsCompletedCount}/{dailyMissionsTotalCount}</span>
        </button>

        {/* Leaderboard Button (Multi-user) */}
        <button
          id="btn-open-leaderboard"
          onClick={onOpenLeaderboard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider bg-[#0f172a] hover:bg-[#1e293b] text-sky-300 border-2 border-sky-500/50 hover:border-sky-400 transition-all cursor-pointer shadow-md"
          title="Multi-User Operative Leaderboard"
        >
          <Users className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">RANK</span>
          <span className="text-sky-300 font-bold">#{playerRank}</span>
        </button>

        {/* Incidents Button */}
        <button
          id="btn-open-incidents"
          onClick={onOpenIncidents}
          className={`flex items-center gap-1 px-2 py-1.5 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider border-2 transition-all cursor-pointer shadow-md ${
            incidentCount > 0
              ? 'bg-[#dc2626] text-white border-[#f87171] hover:bg-[#b91c1c] animate-pulse'
              : 'bg-[#0f172a] text-slate-300 border-[#334155] hover:border-[#38bdf8] hover:text-white'
          }`}
          title="View Active Security Incidents"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">LOGS</span>
          <span>({incidentCount})</span>
        </button>

        {/* Badges Button */}
        <button
          id="btn-open-badges"
          onClick={onOpenBadges}
          className="flex items-center gap-1 px-2 py-1.5 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider bg-[#0f172a] border-2 border-[#334155] text-slate-300 hover:border-[#fbbf24] hover:text-amber-300 transition-all cursor-pointer shadow-md"
          title="View Badges & Lanyard"
        >
          <Award className="w-3.5 h-3.5 text-[#fbbf24]" />
          <span className="hidden xl:inline">BADGES</span>
          <span>({playerStats.badges.length})</span>
        </button>

        {/* Office Desk Collectibles & Dundies Trophy Case */}
        <button
          id="btn-open-trophy-case"
          onClick={onOpenTrophyRoom}
          className="flex items-center gap-1 px-2 py-1.5 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider bg-[#0f172a] border-2 border-amber-500/60 text-amber-300 hover:border-amber-400 hover:text-yellow-300 transition-all cursor-pointer shadow-md"
          title="View The Office Desk Collectibles & Dundie Awards"
        >
          <span className="text-xs">🏆</span>
          <span className="hidden lg:inline">DUNDIES</span>
          <span className="text-yellow-400 font-bold">({(playerStats.collectedProps?.length || 0) + (playerStats.dundieAwards?.length || 0)})</span>
        </button>

        {/* Skills & XP Coin Button */}
        <button
          id="btn-open-skills"
          onClick={onOpenSkills}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] uppercase tracking-wider bg-[#0284c7] hover:bg-[#0369a1] text-white border-2 border-[#38bdf8] transition-all cursor-pointer shadow-md active:translate-y-0.5"
          title="Skill Tree & Perks"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span className="hidden sm:inline">SKILLS</span>
          <span className="text-yellow-300 font-bold">{playerStats.credits} XP</span>
        </button>
      </div>
    </header>
  );
};
