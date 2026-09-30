import React, { useState } from 'react';
import { LeaderboardEntry, MultiplayerActivityFeedItem } from '../types';
import { PixelCharacter } from './PixelCharacter';
import { 
  Trophy, 
  Award, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  X, 
  Search, 
  Building2, 
  Flame, 
  Radio, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  activityFeed: MultiplayerActivityFeedItem[];
  currentScore: number;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  activityFeed,
  currentScore,
  onClose
}) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOperative, setSelectedOperative] = useState<LeaderboardEntry | null>(null);

  const filteredEntries = entries.filter(entry => {
    const matchesBranch = selectedBranch === 'ALL' || entry.branch.includes(selectedBranch);
    const matchesDept = selectedDepartment === 'ALL' || entry.department === selectedDepartment;
    const matchesSearch = entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesDept && matchesSearch;
  });

  const currentPlayer = entries.find(e => e.isCurrentPlayer) || entries[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border-2 border-sky-500/40 rounded-xl shadow-2xl overflow-hidden text-slate-100"
        id="leaderboard-modal"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/60 border-b border-sky-500/30">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-sky-500/20 border border-sky-500/40 rounded-lg text-sky-400 shadow-inner">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-100 font-mono">
                  SECURITY OPERATIONS // LEADERBOARD
                </h2>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center space-x-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse inline mr-1" />
                  Live Sync (10 Operatives)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Team rankings and security achievements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            id="close-leaderboard-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Standing Highlight Banner */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-900 border border-amber-500/40 rounded-lg flex items-center justify-center font-bold text-amber-400 text-lg">
              #{currentPlayer.rank}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-100">{currentPlayer.username}</span>
                <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  Your Standing
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentPlayer.branch} • {currentPlayer.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">All-Time Score</span>
              <span className="text-amber-400 font-bold text-sm">{currentScore || currentPlayer.totalScore} pts</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">Triage Accuracy</span>
              <span className="text-emerald-400 font-bold text-sm">{currentPlayer.triageAccuracy}%</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase">Behind #1</span>
              <span className="text-sky-400 font-bold text-sm">
                -{Math.max(0, 4850 - (currentScore || currentPlayer.totalScore))} pts
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-mono">Branch:</span>
            {['ALL', 'Security Operations', 'Infrastructure', 'Corporate'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBranch(b)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  selectedBranch === b 
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {b === 'ALL' ? 'All Branches' : b}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search operative or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48"
              />
            </div>
          </div>
        </div>

        {/* Main Content Area: Table + Live Activity Ticker */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Rankings Table */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Operative</th>
                  <th className="py-2.5 px-3">Department & Branch</th>
                  <th className="py-2.5 px-3 text-center">Clearance</th>
                  <th className="py-2.5 px-3 text-right">Daily XP</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 px-3">Achievement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredEntries.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  const rankBadgeColor = 
                    entry.rank === 1 ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' :
                    entry.rank === 2 ? 'bg-slate-300/20 text-slate-200 border-slate-300/50' :
                    entry.rank === 3 ? 'bg-amber-800/20 text-amber-500 border-amber-700/50' :
                    'bg-slate-950 text-slate-400 border-slate-800';

                  return (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedOperative(entry)}
                      className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                        entry.isCurrentPlayer ? 'bg-sky-950/30 border-l-2 border-l-sky-400' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs ${rankBadgeColor}`}>
                          {entry.rank === 1 ? '👑 1' : entry.rank}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                            <PixelCharacter id={entry.avatarSkin} size="sm" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-100 flex items-center space-x-1.5">
                              <span>{entry.username}</span>
                              {entry.isCurrentPlayer && (
                                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1 py-0.2 rounded border border-sky-500/30">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block font-sans truncate max-w-[180px]">
                              {entry.title}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[11px]">
                        <span className="text-slate-300 block font-semibold">{entry.department}</span>
                        <span className="text-slate-500 block font-sans text-[10px] truncate max-w-[140px]">
                          {entry.branch}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-sky-400 border border-slate-800 font-bold">
                          LVL {entry.clearanceLevel}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right text-emerald-400 font-bold">
                        +{entry.dailyXp}
                      </td>

                      <td className="py-3 px-3 text-right text-amber-400 font-bold">
                        {entry.totalScore}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <span className={`font-semibold ${
                          entry.triageAccuracy >= 95 ? 'text-emerald-400' :
                          entry.triageAccuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {entry.triageAccuracy}%
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        {entry.dundieAward ? (
                          <span className="text-[11px] font-sans text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 truncate max-w-[160px] inline-block">
                            {entry.dundieAward}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Right: Live Activity Ticker & Details Pane */}
          <div className="w-80 bg-slate-950/90 border-l border-slate-800 flex flex-col p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-300">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-bold">LIVE SOC FEED</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Real-time alerts</span>
            </div>

            {/* Activity Ticker Feed */}
            <div className="space-y-2.5 overflow-y-auto flex-1 custom-scrollbar pr-1">
              {activityFeed.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] space-y-1 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span className="font-bold text-sky-400">{item.username}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-snug">
                    {item.action}
                  </p>
                  <div className="flex items-center justify-between text-[10px] font-mono pt-0.5">
                    <span className="text-slate-500">{item.branch}</span>
                    <span className={item.points > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {item.points > 0 ? `+${item.points} XP` : `${item.points} XP`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Team achievement info */}
            <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-500/30 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-300 font-bold font-mono">
                <Award className="w-4 h-4" />
                <span>TEAM ACHIEVEMENTS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Earn points by practicing safe security habits and helping your team.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>CyberFloor • Security Operations</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
