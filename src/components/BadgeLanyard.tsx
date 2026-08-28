import React from 'react';
import { Award, Shield, CheckCircle2, PhoneOff, ShieldCheck, Crown, ArrowLeft, Fish } from 'lucide-react';
import { Badge, PlayerStats } from '../types';

interface BadgeLanyardProps {
  badges: Badge[];
  playerStats: PlayerStats;
  onClose: () => void;
}

export const BadgeLanyard: React.FC<BadgeLanyardProps> = ({
  badges,
  playerStats,
  onClose
}) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fish': return <Fish className="w-6 h-6 text-cyan-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
      case 'PhoneOff': return <PhoneOff className="w-6 h-6 text-amber-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-indigo-400" />;
      case 'Award': return <Award className="w-6 h-6 text-yellow-400" />;
      case 'Crown': return <Crown className="w-6 h-6 text-purple-400" />;
      default: return <Shield className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div id="badge-lanyard-modal" className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">SECURITY LANYARD & BADGES</h2>
              <div className="text-xs font-mono text-slate-400">OFFICIAL SECOPS MERIT ACCREDITATION</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Physical ID Card Mockup */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-2 border-slate-700 rounded-xl p-4 mb-6 shadow-inner flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-lg">
              LVL {playerStats.securityClearance}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-100">SECURITY OFFICER ID #ACME-8902</div>
              <div className="text-xs font-mono text-cyan-300">STATUS: ACTIVE PATROL (FLOOR {playerStats.currentFloor})</div>
              <div className="text-[10px] font-mono text-slate-500">ACME CORP THREAT MITIGATION DIVISION</div>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-amber-400 font-bold">
            {playerStats.badges.length} / {badges.length} UNLOCKED
          </div>
        </div>

        {/* Badges List */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pr-1">
          {badges.map((badge) => {
            const isUnlocked = playerStats.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-slate-800/90 border-slate-700 shadow-md'
                    : 'bg-slate-900/30 border-slate-800/40 opacity-40 grayscale'
                }`}
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${
                  isUnlocked ? 'bg-slate-900 border-slate-700' : 'bg-slate-950 border-slate-800'
                }`}>
                  {getBadgeIcon(badge.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-xs text-slate-200">{badge.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-amber-400 border border-slate-800">
                      {badge.rarity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-tight mb-1.5">
                    {badge.description}
                  </p>
                  <div className="text-[10px] font-mono text-slate-500">
                    Criteria: {badge.criteria}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
