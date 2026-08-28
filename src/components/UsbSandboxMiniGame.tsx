import React, { useState } from 'react';
import { HardDrive, ShieldCheck, ShieldAlert, AlertTriangle, ArrowLeft, Bug, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UsbScenario } from '../data/extraScenarios';
import { audio } from '../utils/audio';

interface UsbSandboxMiniGameProps {
  scenario: UsbScenario;
  hasSandboxSkill: boolean;
  onComplete: (action: 'QUARANTINE' | 'PLUG_IN', pointsDelta: number, incident?: string) => void;
  onExit: () => void;
}

export const UsbSandboxMiniGame: React.FC<UsbSandboxMiniGameProps> = ({
  scenario,
  hasSandboxSkill,
  onComplete,
  onExit
}) => {
  const [showAnalysis, setShowAnalysis] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<'QUARANTINE' | 'PLUG_IN' | null>(null);

  const handleAction = (action: 'QUARANTINE' | 'PLUG_IN') => {
    setOutcome(action);
    setShowAnalysis(true);

    if (action === 'QUARANTINE') {
      audio.playSuccess();
      confetti({ particleCount: 30, spread: 50 });
      onComplete('QUARANTINE', 15);
    } else {
      if (scenario.isMalicious) {
        audio.playAlarm();
        onComplete(
          'PLUG_IN',
          0,
          `Rogue USB Baiting Breach: Malicious USB containing payload "${scenario.fileList[0]}" was connected directly to an office workstation!`
        );
      } else {
        audio.playFailure();
        onComplete('PLUG_IN', 0);
      }
    }
  };

  return (
    <div id="usb-mini-game" className="fixed inset-0 z-50 bg-[#E4E3E0] text-[#141414] flex flex-col font-sans select-none overflow-hidden p-2 sm:p-6 md:p-8">
      {/* Background grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      {/* Main Terminal Window */}
      <div className="bg-[#141414] text-white flex-1 rounded-sm shadow-2xl flex flex-col border-[6px] border-[#333] relative z-10 overflow-hidden">
        {/* Top Terminal Bar */}
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
              HARDWARE_INSPECTOR: physical_media#quarantine [SECOPS PROTOCOL]
            </span>
          </div>
          <button
            onClick={onExit}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Leave on Floor (Esc)</span>
          </button>
        </div>

        {/* Main Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#1a1a1a] border border-white/15 rounded-none max-w-xl w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#141414] border border-white/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <HardDrive className="w-7 h-7 animate-pulse" />
              </div>
              <h2 className="text-base sm:text-lg font-bold font-mono text-white mb-1">{scenario.label}</h2>
              <div className="text-xs font-mono opacity-60">FOUND AT: {scenario.location}</div>
            </div>

            {/* Scanned file directory preview */}
            <div className="bg-black p-4 border border-white/10 mb-6 font-mono text-xs">
              <div className="opacity-60 font-bold mb-2 flex items-center justify-between text-[10px] uppercase tracking-wider">
                <span>DETECTED PARTITION CONTENT:</span>
                <span className="text-amber-400 font-bold">STATUS: UNTRUSTED</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {scenario.fileList.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/90">
                    <span className="opacity-40">📄</span>
                    <span className={file.endsWith('.vbs') || file.endsWith('.inf') ? 'text-red-400 font-bold' : ''}>
                      {file}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!showAnalysis ? (
              <div className="space-y-2.5 font-mono">
                <button
                  id="btn-quarantine-usb"
                  onClick={() => handleAction('QUARANTINE')}
                  className="w-full py-3.5 bg-white text-[#141414] hover:bg-white/90 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>SURRENDER TO SECOPS FARADAY BIN (RECOMMENDED)</span>
                </button>

                <button
                  id="btn-plugin-usb"
                  onClick={() => handleAction('PLUG_IN')}
                  className="w-full py-3.5 bg-[#2a1315] hover:bg-[#381a1d] border border-red-600/50 text-red-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>PLUG INTO WORKSTATION TO "SEE WHAT'S ON IT"</span>
                </button>
              </div>
            ) : (
              <div className="animate-fadeIn font-mono">
                <div className={`p-4 border mb-4 ${
                  outcome === 'QUARANTINE'
                    ? 'bg-[#142318] border-[#22c55e] text-[#22c55e]'
                    : 'bg-[#2a1315] border-red-600 text-red-400'
                }`}>
                  <div className="font-bold text-xs mb-1">
                    {outcome === 'QUARANTINE' ? 'ZERO-TRUST DEFENSE! (+15 XP)' : 'CRITICAL BAITING FAILURE (0 XP EARNED)'}
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed font-mono mb-3">
                    {scenario.explanation}
                  </p>

                  {scenario.redFlags.length > 0 && (
                    <div className="space-y-1">
                      {scenario.redFlags.map((flag, fIdx) => (
                        <div key={fIdx} className="text-[11px] font-mono text-red-300 flex items-start gap-1">
                          <span>•</span> <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={onExit}
                  className="w-full py-3 bg-white text-[#141414] hover:bg-white/90 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Continue Patrol
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
