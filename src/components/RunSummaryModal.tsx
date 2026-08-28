import React from 'react';
import { Trophy, Award, ArrowRight, RotateCcw, ShieldCheck, Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PlayerStats, MatrixScore } from '../types';
import { audio } from '../utils/audio';

interface RunSummaryModalProps {
  playerStats: PlayerStats;
  matrixScore: MatrixScore;
  threatLevel: number;
  onNextFloor: () => void;
  onRestartGame: () => void;
}

export const RunSummaryModal: React.FC<RunSummaryModalProps> = ({
  playerStats,
  matrixScore,
  threatLevel,
  onNextFloor,
  onRestartGame
}) => {
  const isFloorClear = threatLevel < 50;

  React.useEffect(() => {
    if (isFloorClear) {
      audio.playBadgeUnlock();
      confetti({ particleCount: 70, spread: 80 });
    }
  }, [isFloorClear]);

  // Confusion matrix accuracy calculation
  const totalCalls = matrixScore.truePositives + matrixScore.trueNegatives + matrixScore.falsePositives + matrixScore.falseNegatives;
  const accuracy = totalCalls > 0
    ? Math.round(((matrixScore.truePositives + matrixScore.trueNegatives) / totalCalls) * 100)
    : 100;

  return (
    <div id="run-summary-modal" className="fixed inset-0 z-50 bg-[#E4E3E0]/90 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
      {/* Background grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      <div className="bg-[#141414] text-white border-[6px] border-[#333] rounded-sm max-w-xl w-full p-6 shadow-2xl text-center relative z-10">
        {/* Banner */}
        <div className="w-14 h-14 bg-[#1e1e1e] border border-white/20 text-white flex items-center justify-center mx-auto mb-4">
          {isFloorClear ? <Trophy className="w-7 h-7 text-amber-400" /> : <Flame className="w-7 h-7 text-red-500" />}
        </div>

        <h2 className="text-lg sm:text-xl font-black font-mono tracking-tight text-white mb-1">
          {isFloorClear ? `FLOOR ${playerStats.currentFloor} AUDIT COMPLETED` : `SECURITY OVERRUN // RUN TERMINATED`}
        </h2>
        <div className="text-xs font-mono opacity-60 mb-6">
          {isFloorClear
            ? 'Threat contained. Elevator access granted to the next corporate division.'
            : 'Corporate network compromised by excessive unmitigated incidents.'}
        </div>

        {/* 2x2 Matrix Performance Card */}
        <div className="bg-black p-4 border border-white/15 mb-6 text-left font-mono">
          <div className="text-[10px] font-bold opacity-60 mb-3 uppercase tracking-wider flex items-center justify-between">
            <span>2x2 CALIBRATION MATRIX:</span>
            <span className="text-[#38bdf8] font-bold">Accuracy: {accuracy}%</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <div className="p-2.5 bg-[#142318] border border-[#22c55e]/40">
              <div className="text-[#22c55e] font-bold text-base">{matrixScore.truePositives}</div>
              <div className="text-[10px] opacity-80">True Positives (Caught Phish)</div>
            </div>
            <div className="p-2.5 bg-[#12232f] border border-[#38bdf8]/40">
              <div className="text-[#38bdf8] font-bold text-base">{matrixScore.trueNegatives}</div>
              <div className="text-[10px] opacity-80">True Negatives (Allowed Clean)</div>
            </div>
            <div className="p-2.5 bg-[#2b2510] border border-amber-500/40">
              <div className="text-amber-400 font-bold text-base">{matrixScore.falsePositives}</div>
              <div className="text-[10px] opacity-80">False Positives (Paranoia Flags)</div>
            </div>
            <div className="p-2.5 bg-[#2a1315] border border-red-600/40">
              <div className="text-red-400 font-bold text-base">{matrixScore.falseNegatives}</div>
              <div className="text-[10px] opacity-80">False Negatives (Missed Threats)</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10 opacity-90">
            <span>TOTAL SCORE: <strong className="text-[#22c55e]">{matrixScore.totalScore} PTS</strong></span>
            <span>XP CREDITS: <strong className="text-amber-300">+{playerStats.credits} XP</strong></span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 font-mono">
          <button
            onClick={onRestartGame}
            className="flex-1 py-3 bg-[#222222] hover:bg-[#2c2c2c] text-white/90 text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/15"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Run</span>
          </button>

          <button
            onClick={onNextFloor}
            className="flex-1 py-3 bg-white text-[#141414] hover:bg-white/90 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Next Floor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
