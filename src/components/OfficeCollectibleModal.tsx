import React, { useEffect } from 'react';
import { OfficeCollectibleData } from '../types';
import { Award, Sparkles, Coins, Zap, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OfficeCollectibleModalProps {
  collectible: OfficeCollectibleData;
  onClaim: () => void;
  onClose: () => void;
}

export const OfficeCollectibleModal: React.FC<OfficeCollectibleModalProps> = ({
  collectible,
  onClaim,
  onClose
}) => {
  useEffect(() => {
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.6 }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        onClaim();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClaim, onClose]);

  const rarityColor = {
    COMMON: 'border-blue-400 bg-blue-950/80 text-blue-300',
    RARE: 'border-purple-400 bg-purple-950/80 text-purple-300',
    LEGENDARY: 'border-amber-400 bg-amber-950/80 text-amber-300 animate-pulse'
  }[collectible.rarity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
      <div 
        className="w-full max-w-md bg-[#090d16] border-3 border-amber-400 rounded-sm shadow-[0_0_30px_rgba(245,158,11,0.4)] flex flex-col overflow-hidden text-slate-100 font-mono relative animate-scaleUp"
      >
        {/* CRT Scanline overlay */}
        <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />

        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-900/80 via-slate-900 to-amber-900/80 border-b-2 border-amber-500/60 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
            <span className="font-pixel text-xs text-amber-300 uppercase tracking-wider">
              OFFICE DESK DISCOVERY!
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Display Center */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          {/* Animated Item Showcase Box */}
          <div className="relative my-2">
            <div 
              className="w-24 h-24 rounded-lg flex items-center justify-center text-5xl shadow-2xl relative border-2 border-amber-300 animate-bob"
              style={{
                backgroundColor: `${collectible.sparkleColor}20`,
                boxShadow: `0 0 25px ${collectible.sparkleColor}60`
              }}
            >
              <span className="filter drop-shadow-lg transform scale-110">{collectible.iconEmoji}</span>
            </div>
            {/* Rarity Pill */}
            <div className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full border text-[9px] font-pixel uppercase font-bold tracking-wider ${rarityColor}`}>
              {collectible.rarity}
            </div>
          </div>

          {/* Title & Lore */}
          <div>
            <h2 className="text-xl font-bold font-tech text-white tracking-wide">
              {collectible.title}
            </h2>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {collectible.lore}
            </p>
          </div>

          {/* Item details */}
          <div className="w-full bg-[#030712] border-l-4 border-amber-400 p-3 text-left rounded-r shadow-inner">
            <div className="text-[10px] font-pixel text-amber-400 uppercase">
              {collectible.character}
            </div>
            <p className="text-xs italic text-amber-100/90 mt-0.5 font-sans">
              {collectible.quote}
            </p>
          </div>

          {/* Rewards Grid */}
          <div className="w-full grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#0f172a] border border-[#334155] p-2 rounded flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400 shrink-0" />
              <div className="text-left">
                <div className="text-[8px] font-pixel text-slate-400 uppercase">XP REWARD</div>
                <div className="font-bold text-sky-300 font-mono">+{collectible.rewardXp} XP</div>
              </div>
            </div>
            <div className="bg-[#0f172a] border border-[#334155] p-2 rounded flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left">
                  <div className="text-[8px] font-pixel text-slate-400 uppercase">BONUS TOKENS</div>
                  <div className="font-bold text-emerald-300 font-mono">+{collectible.rewardTokens}</div>
              </div>
            </div>
          </div>

          {collectible.awardTitle && (
            <div className="w-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-yellow-400/60 p-2 rounded flex items-center justify-center gap-2 text-yellow-300 text-xs font-pixel">
              <Award className="w-4 h-4 text-yellow-300" />
              <span>AWARDED: {collectible.awardTitle}</span>
            </div>
          )}
        </div>

        {/* Actions Bottom Bar */}
        <div className="p-4 bg-[#030712] border-t border-[#1e293b] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-3 py-2 border border-slate-700 hover:border-slate-500 text-slate-400 text-xs font-pixel transition-colors cursor-pointer"
          >
            DISMISS [ESC]
          </button>
          <button
            onClick={onClaim}
            className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold font-pixel text-xs py-2.5 px-4 rounded-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>COLLECT & CLAIM [ENTER / E]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
