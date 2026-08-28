import React, { useState } from 'react';
import { Lock, FileWarning, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CleanDeskScenario } from '../data/extraScenarios';
import { audio } from '../utils/audio';

interface CleanDeskMiniGameProps {
  scenario: CleanDeskScenario;
  onComplete: (action: 'SECURE' | 'IGNORE', pointsDelta: number, incident?: string) => void;
  onExit: () => void;
}

export const CleanDeskMiniGame: React.FC<CleanDeskMiniGameProps> = ({
  scenario,
  onComplete,
  onExit
}) => {
  const [resolved, setResolved] = useState<boolean>(false);
  const [actionOutcome, setActionOutcome] = useState<'SECURED_VIOLATION' | 'AUDITED_CLEAN' | 'MISSED_VIOLATION' | null>(null);

  const handleRemediate = () => {
    setResolved(true);
    if (scenario.hasViolation) {
      setActionOutcome('SECURED_VIOLATION');
      audio.playSuccess();
      confetti({ particleCount: 30, spread: 50 });
      onComplete('SECURE', scenario.points);
    } else {
      setActionOutcome('AUDITED_CLEAN');
      audio.playSuccess();
      onComplete('SECURE', scenario.points);
    }
  };

  const handleIgnore = () => {
    setResolved(true);
    if (scenario.hasViolation) {
      setActionOutcome('MISSED_VIOLATION');
      audio.playAlarm();
      onComplete(
        'IGNORE',
        0, // 0 XP earned for ignoring an active violation
        `Clean Desk Violation Ignored: ${scenario.violationDetail}`
      );
    } else {
      setActionOutcome('AUDITED_CLEAN');
      audio.playSuccess();
      onComplete('IGNORE', scenario.points);
    }
  };

  return (
    <div id="clean-desk-mini-game" className="fixed inset-0 z-50 bg-[#E4E3E0] text-[#141414] flex flex-col font-sans select-none overflow-hidden p-2 sm:p-6 md:p-8">
      {/* Background grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      {/* Main Terminal Window */}
      <div className="bg-[#141414] text-white flex-1 rounded-sm shadow-2xl flex flex-col border-[6px] border-[#333] relative z-10 overflow-hidden">
        {/* Top Bar */}
        <div className="h-9 bg-[#333] flex items-center px-4 justify-between shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={onExit}
                className="w-2.5 h-2.5 rounded-full bg-red-500 hover:brightness-125 cursor-pointer"
                title="Close [ESC]"
              />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-[11px] font-mono opacity-70 font-bold uppercase tracking-wider hidden sm:inline">
              WORKSPACE_AUDIT: desk_hygiene#inspect [POLICY 8.4]
            </span>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Exit Inspection (Esc)</span>
          </button>
        </div>

        {/* Center Panel */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-white/15 rounded-none max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="w-10 h-10 bg-[#141414] border border-white/20 text-amber-400 flex items-center justify-center">
                <FileWarning className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold font-mono text-white">{scenario.title}</h2>
                <div className="text-[10px] font-mono opacity-60 uppercase">PHYSICAL SECURITY PROTOCOL CHECK</div>
              </div>
            </div>

            <div className="p-4 bg-black border border-white/10 text-xs font-mono text-white/90 leading-relaxed mb-6">
              {scenario.description}
            </div>

            {!resolved ? (
              <div className="space-y-2.5 font-mono">
                <button
                  id="btn-remediate-desk"
                  onClick={handleRemediate}
                  className="w-full py-3.5 bg-white text-[#141414] hover:bg-white/90 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>{scenario.remediationAction}</span>
                </button>

                <button
                  id="btn-ignore-desk"
                  onClick={handleIgnore}
                  className="w-full py-3 bg-[#222222] hover:bg-[#2c2c2c] border border-white/15 text-white/80 font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  Looks Compliant / Walk Away
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn font-mono">
                {actionOutcome === 'MISSED_VIOLATION' ? (
                  <div className="p-4 bg-[#2a1315] border border-red-600 text-red-400 mb-4">
                    <div className="font-bold text-xs mb-1 flex items-center gap-2">
                      <FileWarning className="w-4 h-4 text-red-400" />
                      <span>VIOLATION MISSED (0 XP EARNED)</span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed">
                      You walked away from an active compliance violation! Unlocked workstations and exposed customer PII allow unauthorized lateral snooping and violate GLBA regulations.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-[#142318] border border-[#22c55e] text-[#22c55e] mb-4">
                    <div className="font-bold text-xs mb-1 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {actionOutcome === 'SECURED_VIOLATION'
                          ? `POLICY ENFORCED (+${scenario.points} XP)`
                          : `COMPLIANCE VERIFIED (+${scenario.points} XP)`}
                      </span>
                    </div>
                    <p className="text-xs text-white/90 leading-relaxed">
                      {scenario.hasViolation
                        ? 'Proper physical hygiene enforced! Locking unattended workstations with [Win+L] prevents casual insider snooping and credential theft.'
                        : 'Verified workstation compliance! Diligent inspection ensures continuous security culture.'}
                    </p>
                  </div>
                )}

                <button
                  onClick={onExit}
                  className="w-full py-3 bg-white text-[#141414] hover:bg-white/90 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Return to Floor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
