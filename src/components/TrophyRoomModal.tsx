import React from 'react';
import { PlayerStats } from '../types';
import { OFFICE_COLLECTIBLE_CATALOG } from '../data/officeCollectibles';
import { Award, Trophy, Coins, Zap, Check, Lock, Sparkles, X } from 'lucide-react';

interface TrophyRoomModalProps {
  playerStats: PlayerStats;
  onClose: () => void;
}

export const TrophyRoomModal: React.FC<TrophyRoomModalProps> = ({
  playerStats,
  onClose
}) => {
  const collectedList = playerStats.collectedProps || [];
  const awardList = playerStats.awards || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-[#090d16] border-2 border-amber-500/80 rounded-sm shadow-[0_0_40px_rgba(245,158,11,0.3)] flex flex-col max-h-[90vh] overflow-hidden text-slate-100 font-mono">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b-2 border-amber-500/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-base font-bold font-tech text-amber-300 uppercase tracking-wider flex items-center gap-2">
                Awards & Collectibles
              </h2>
              <p className="text-[10px] text-slate-400 font-pixel">
                FOUND: {collectedList.length} / {OFFICE_COLLECTIBLE_CATALOG.length} • {awardList.length} AWARDS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Currency & Stat Banner */}
        <div className="bg-[#030712] border-b border-[#1e293b] p-3 px-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Bonus tokens:</span>
            <span className="font-bold text-emerald-300 font-mono text-sm">{playerStats.bonusTokens || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400">Total SecOps XP:</span>
            <span className="font-bold text-sky-300 font-mono text-sm">{playerStats.xp} XP</span>
          </div>
        </div>

        {/* Content Body: Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {/* Awards */}
          <div>
            <div className="flex items-center gap-2 text-xs font-pixel text-yellow-400 uppercase tracking-wider mb-3">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Awards ({awardList.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {awardList.map((award, idx) => (
                <div 
                  key={idx}
                  className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-yellow-500/40 p-2.5 rounded-sm flex items-center gap-3 shadow-md"
                >
                  <div className="w-8 h-8 rounded bg-yellow-400/20 border border-yellow-300/60 flex items-center justify-center text-lg shrink-0">
                    🏆
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-yellow-200 truncate">{award}</div>
                    <div className="text-[9px] text-slate-400">Team recognition</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collectibles */}
          <div>
            <div className="flex items-center gap-2 text-xs font-pixel text-amber-400 uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Workplace collectibles</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OFFICE_COLLECTIBLE_CATALOG.map((item) => {
                const isCollected = collectedList.some(
                  name => name.toLowerCase() === item.title.toLowerCase() || name.toLowerCase() === item.collectibleType.toLowerCase()
                );

                return (
                  <div
                    key={item.collectibleType}
                    className={`p-3 rounded border transition-all ${
                      isCollected 
                        ? 'bg-[#0f172a] border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
                        : 'bg-[#060913]/60 border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className={`w-11 h-11 rounded flex items-center justify-center text-2xl border shrink-0 ${
                          isCollected 
                            ? 'border-amber-400 bg-amber-400/10' 
                            : 'border-slate-700 bg-slate-900/60 grayscale'
                        }`}
                      >
                        {isCollected ? item.iconEmoji : '❓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-xs font-bold truncate ${isCollected ? 'text-slate-100' : 'text-slate-500'}`}>
                            {isCollected ? item.title : 'Undiscovered collectible'}
                          </h4>
                          {isCollected && (
                            <span className="text-[8px] font-pixel px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              FOUND
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">
                          {isCollected ? item.lore : 'Search desk spaces and tables on upcoming procedural floors.'}
                        </p>
                        {isCollected && (
                          <div className="mt-2 text-[9px] italic text-amber-200/80 bg-slate-950/60 p-1.5 rounded border-l-2 border-amber-400 font-sans">
                            {item.quote}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#030712] border-t border-[#1e293b] flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400 font-pixel">
            PRO-TIP: Look for animated props sitting on cubicle desks and breakroom counters!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-pixel text-xs rounded transition-colors cursor-pointer"
          >
            CLOSE CASE [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
