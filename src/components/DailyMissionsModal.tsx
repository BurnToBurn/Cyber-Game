import React, { useEffect, useState } from 'react';
import { DailyMission, DailyMissionProgress } from '../types';
import { getFormattedCountdownToReset } from '../data/dailyMissions';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Mail, 
  Lock, 
  PhoneCall, 
  HardDrive, 
  Coffee, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Flame, 
  Coins
} from 'lucide-react';

interface DailyMissionsModalProps {
  progress: DailyMissionProgress;
  onClose: () => void;
  onClaimMission: (missionId: string) => void;
  onClaimAllBonus: () => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  progress,
  onClose,
  onClaimMission,
  onClaimAllBonus
}) => {
  const [countdown, setCountdown] = useState<string>(getFormattedCountdownToReset());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getFormattedCountdownToReset());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'MailCheck': return <Mail className="w-5 h-5 text-sky-400" />;
      case 'Lock': return <Lock className="w-5 h-5 text-amber-400" />;
      case 'PhoneCall': return <PhoneCall className="w-5 h-5 text-emerald-400" />;
      case 'HardDrive': return <HardDrive className="w-5 h-5 text-purple-400" />;
      case 'Coffee': return <Coffee className="w-5 h-5 text-orange-400" />;
      case 'Users': return <Users className="w-5 h-5 text-pink-400" />;
      default: return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  const completedCount = progress.missions.filter(m => m.completed).length;
  const totalMissions = progress.missions.length;
  const allMissionsCompleted = completedCount === totalMissions && totalMissions > 0;
  const progressPercent = Math.round((completedCount / totalMissions) * 100) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border-2 border-amber-500/40 rounded-xl shadow-2xl overflow-hidden text-slate-100"
        id="daily-missions-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-b border-amber-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight text-amber-300 font-mono">
                  SCRANTON SECOPS // DAILY MISSIONS
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-orange-400 inline mr-0.5" />
                  {progress.streakDays} Day Streak
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authorized 24-Hour Security Directives • Dunder Mifflin Scranton Branch
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* 24-Hour Reset Countdown */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-950/80 border border-slate-700 rounded-lg text-xs font-mono">
              <Clock className="w-4 h-4 text-sky-400 animate-pulse" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Refreshes In</span>
                <span className="text-amber-300 font-bold tracking-wider">{countdown}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              id="close-daily-missions-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Daily Progress Banner & Dundie Bonus */}
        <div className="p-6 bg-slate-950/60 border-b border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-sm font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-slate-300 font-semibold">Today's Clearance Progress:</span>
              <span className="text-amber-400 font-bold">{completedCount} of {totalMissions} Completed</span>
            </div>
            <span className="text-xs text-slate-400">{progressPercent}% Fulfilled</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Grand Dundie Bonus Card */}
          <div className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
            allMissionsCompleted 
              ? 'bg-amber-950/40 border-amber-400/50 shadow-lg shadow-amber-950/50' 
              : 'bg-slate-900/80 border-slate-800 opacity-90'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="text-sm font-bold text-amber-300 flex items-center space-x-1.5">
                  <span>Grand Daily Dundie Package</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                    +300 XP & 50 Schrute Bucks
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Complete all 6 daily security assignments to earn the prestigious daily branch honors.
                </p>
              </div>
            </div>

            <div>
              {progress.allCompletedBonusClaimed ? (
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Claimed!</span>
                </div>
              ) : allMissionsCompleted ? (
                <button
                  onClick={onClaimAllBonus}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:shadow-amber-500/30 transition-all flex items-center space-x-1.5 animate-bounce"
                  id="claim-grand-dundie-btn"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Claim Dundie Bonus!</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-slate-500">
                  {totalMissions - completedCount} tasks remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Missions List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 custom-scrollbar">
          {progress.missions.map((mission) => {
            const isFinished = mission.currentCount >= mission.targetCount;
            const cardPercent = Math.min(100, Math.round((mission.currentCount / mission.targetCount) * 100));

            return (
              <div
                key={mission.id}
                className={`p-4 rounded-xl border transition-all ${
                  mission.claimed 
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-75'
                    : isFinished 
                    ? 'bg-emerald-950/30 border-emerald-500/40 shadow-md shadow-emerald-950/30' 
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                }`}
                id={`mission-card-${mission.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Icon & Details */}
                  <div className="flex items-start space-x-3.5 flex-1">
                    <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg shrink-0 mt-0.5">
                      {getMissionIcon(mission.icon)}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-100 text-sm">{mission.title}</h4>
                        {mission.claimed && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded">
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{mission.description}</p>
                      
                      {mission.officeQuote && (
                        <p className="text-[11px] italic text-amber-400/80 font-serif border-l-2 border-amber-500/40 pl-2 py-0.5">
                          {mission.officeQuote}
                        </p>
                      )}

                      {/* Progress Bar within card */}
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-slate-400">
                          <span>Progress: {mission.currentCount} / {mission.targetCount}</span>
                          <span>{cardPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              isFinished ? 'bg-emerald-400' : 'bg-sky-400'
                            }`}
                            style={{ width: `${cardPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rewards & Action */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0 min-w-[130px] border-l border-slate-800/80 pl-4">
                    <div className="text-right space-y-0.5">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">Reward</span>
                      <div className="flex items-center justify-end space-x-1 text-xs font-bold text-amber-300">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>+{mission.rewardXp} XP</span>
                      </div>
                      {mission.rewardSchruteBucks && (
                        <span className="text-[10px] font-mono text-emerald-400 block">
                          +{mission.rewardSchruteBucks} Schrute Bucks
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      {mission.claimed ? (
                        <span className="text-xs font-mono text-slate-500 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Claimed</span>
                        </span>
                      ) : isFinished ? (
                        <button
                          onClick={() => onClaimMission(mission.id)}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center space-x-1 animate-pulse"
                          id={`claim-btn-${mission.id}`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Claim</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-slate-500 bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
                          {mission.currentCount}/{mission.targetCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Missions reset automatically at midnight daily.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            id="close-daily-missions-footer-btn"
          >
            Back to Office Floor
          </button>
        </div>
      </div>
    </div>
  );
};
