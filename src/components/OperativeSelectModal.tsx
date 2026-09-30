import React from 'react';
import { ArrowLeft, Check, Shield, Zap, Sparkles, UserCheck } from 'lucide-react';
import { PLAYABLE_OPERATIVES, PixelCharacter, CharacterId } from './PixelCharacter';
import { audio } from '../utils/audio';

interface OperativeSelectModalProps {
  currentSkin: string;
  onSelectSkin: (skinId: string) => void;
  onClose: () => void;
}

export const OperativeSelectModal: React.FC<OperativeSelectModalProps> = ({
  currentSkin,
  onSelectSkin,
  onClose
}) => {
  return (
    <div id="operative-select-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 select-none overflow-hidden animate-fadeIn">
      {/* Background CRT & Grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-30" />
      <div className="absolute inset-0 crt-overlay pointer-events-none" />

      {/* Main Card */}
      <div className="bg-[#0b0f19] text-white flex-1 rounded-sm shadow-2xl flex flex-col border-4 border-[#334155] relative z-10 max-w-4xl max-h-[92vh] overflow-hidden">
        {/* Terminal Header */}
        <div className="h-10 bg-[#1e293b] flex items-center px-4 justify-between shrink-0 border-b-2 border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:brightness-125 cursor-pointer"
                title="Close [ESC]"
              />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="font-pixel text-[10px] text-[#38bdf8] uppercase tracking-wider hidden sm:inline">
              PERSONNEL_ROSTER: SECOPS_TACTICAL_OPERATIVES
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#0f172a] hover:bg-[#334155] text-slate-300 font-pixel text-[9px] uppercase border border-[#475569] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>EXIT (Esc)</span>
          </button>
        </div>

        {/* Banner */}
        <div className="bg-[#070a12] p-3 sm:px-6 border-b-2 border-[#1e293b] flex items-center justify-between">
          <div>
            <h2 className="font-arcade text-sm sm:text-base text-white">SELECT ACTIVE OPERATIVE</h2>
            <p className="font-tech text-xs text-slate-400">Choose your security specialist for floor patrols and challenges.</p>
          </div>
          <div className="font-pixel text-[8px] sm:text-[9px] px-2.5 py-1 bg-[#0284c7]/20 border border-[#38bdf8] text-[#38bdf8]">
            {PLAYABLE_OPERATIVES.length} SPECIALISTS READY
          </div>
        </div>

        {/* Grid of Operatives */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLAYABLE_OPERATIVES.map((op) => {
            const isSelected = (currentSkin || 'player_alex') === op.id;

            return (
              <div
                key={op.id}
                onClick={() => {
                  audio.playClick();
                  onSelectSkin(op.id);
                }}
                className={`p-4 rounded-sm border-3 transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0f172a] border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                    : 'bg-[#070a12] border-[#1e293b] hover:border-[#475569] hover:bg-[#0c1220]'
                }`}
              >
                {/* Active Indicator Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-[#0284c7] text-white font-pixel text-[8px] border border-[#38bdf8]">
                    <Check className="w-3 h-3" />
                    <span>ACTIVE</span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Portrait Box */}
                  <div 
                    className="w-20 h-24 bg-[#050811] border-2 rounded-sm flex items-center justify-center relative overflow-hidden shrink-0 shadow-md"
                    style={{ borderColor: op.accentColor }}
                  >
                    <PixelCharacter id={op.id} size="portrait" />
                  </div>

                  {/* Bio */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-arcade text-sm sm:text-base text-white truncate">{op.name}</h3>
                    </div>
                    <div className="font-pixel text-[8px] text-[#38bdf8] tracking-wider mt-0.5">
                      CALLSIGN: [{op.callsign}]
                    </div>
                    <div className="text-[11px] font-tech font-bold text-slate-300 mt-1">
                      {op.role}
                    </div>
                    <p className="text-[11px] font-tech text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {op.description}
                    </p>
                  </div>
                </div>

                {/* Specialty Banner */}
                <div className="mt-3 pt-2 border-t border-[#1e293b] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-300 font-pixel text-[8px]">
                    <Zap className="w-3 h-3" />
                    <span>{op.specialty}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audio.playClick();
                      onSelectSkin(op.id);
                    }}
                    className={`px-3 py-1 font-pixel text-[8px] uppercase border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0284c7] text-white border-[#38bdf8]'
                        : 'bg-[#1e293b] text-slate-300 border-[#475569] hover:bg-[#334155] hover:text-white'
                    }`}
                  >
                    {isSelected ? 'DEPLOYED' : 'DEPLOY'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="h-10 bg-[#070a12] border-t-2 border-[#1e293b] px-4 sm:px-6 flex items-center justify-between text-slate-400 font-tech text-xs shrink-0">
          <span>Tip: Each operative possesses a distinct pixel-art uniform, facial profile, and specialty.</span>
          <button
            onClick={onClose}
            className="font-pixel text-[9px] text-[#38bdf8] hover:underline cursor-pointer"
          >
            CONFIRM & RESUME PATROL [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
