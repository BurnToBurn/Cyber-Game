import React, { useState } from 'react';
import { Award, ChevronDown, Shield, ShieldAlert, Sparkles, Trophy, Users } from 'lucide-react';
import { PlayerStats } from '../types';
import { PixelCharacter, PLAYABLE_OPERATIVES } from './PixelCharacter';

interface ThreatMeterProps {
  threatLevel: number;
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
  dailyMissionsTotalCount = 0,
  onOpenLeaderboard,
  playerRank = 1,
  onOpenTrophyRoom
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSkin = playerStats.characterSkin || 'player_alex';
  const activeOperative = PLAYABLE_OPERATIVES.find(op => op.id === activeSkin) || PLAYABLE_OPERATIVES[0];
  const threatColor = threatLevel >= 75
    ? 'bg-red-500'
    : threatLevel >= 45
      ? 'bg-amber-400'
      : 'bg-emerald-400';
  const threatLabel = threatLevel >= 75 ? 'High' : threatLevel >= 45 ? 'Rising' : 'Low';

  const menuItem = (label: string, detail: string, icon: React.ReactNode, onClick?: () => void) => (
    <button
      key={label}
      onClick={() => {
        onClick?.();
        setMenuOpen(false);
      }}
      disabled={!onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 transition hover:bg-slate-700/70 disabled:opacity-50"
    >
      <span className="text-sky-300">{icon}</span>
      <span className="flex-1">{label}</span>
      <span className="text-xs text-slate-400">{detail}</span>
    </button>
  );

  return (
    <header className="relative z-30 flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-slate-950/95 px-3 py-2 text-white shadow-lg sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenRoster}
          aria-label={`Change character, currently ${activeOperative.name}`}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-3 text-left transition hover:border-sky-400/60 hover:bg-white/10"
        >
          <span className="flex h-10 w-9 items-center justify-center overflow-hidden rounded-lg bg-slate-900">
            <PixelCharacter id={activeOperative.id} size="sm" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-xs font-semibold">{activeOperative.name}</span>
            <span className="block text-[11px] text-slate-400">Change character</span>
          </span>
        </button>
        <div className="min-w-0">
          <div className="truncate text-sm font-bold tracking-wide sm:text-base">CyberFloor</div>
          <div className="text-xs text-slate-400">Floor {playerStats.currentFloor}</div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:max-w-xs sm:gap-3">
        <Shield className={`h-4 w-4 shrink-0 ${threatLevel >= 75 ? 'text-red-400' : 'text-emerald-400'}`} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center justify-between text-[11px]">
            <span className="text-slate-300">Threat</span>
            <span className={threatLevel >= 75 ? 'text-red-300' : 'text-slate-300'}>{threatLabel}</span>
          </div>
          <div
            role="meter"
            aria-label="Threat level"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={threatLevel}
            className="h-1.5 overflow-hidden rounded-full bg-slate-700"
          >
            <div className={`h-full rounded-full transition-all ${threatColor}`} style={{ width: `${threatLevel}%` }} />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onOpenSkills}
          className="flex items-center gap-2 rounded-xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-400"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Skills</span>
          <span>{playerStats.credits}</span>
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(open => !open)}
            aria-expanded={menuOpen}
            aria-label="Open game menu"
            className="flex h-10 items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 text-sm transition hover:bg-white/10"
          >
            More <ChevronDown className="h-4 w-4" />
          </button>
          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-40 cursor-default"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              />
              <nav className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-2xl">
                {menuItem('Daily goals', `${dailyMissionsCompletedCount}/${dailyMissionsTotalCount}`, <Award className="h-4 w-4" />, onOpenDailyMissions)}
                {menuItem('Leaderboard', `#${playerRank}`, <Users className="h-4 w-4" />, onOpenLeaderboard)}
                {menuItem('Incidents', `${incidentCount}`, <ShieldAlert className="h-4 w-4" />, onOpenIncidents)}
                {menuItem('Badges', `${playerStats.badges.length}`, <Award className="h-4 w-4" />, onOpenBadges)}
                {menuItem('Collectibles', `${playerStats.collectedProps?.length || 0}`, <Trophy className="h-4 w-4" />, onOpenTrophyRoom)}
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
