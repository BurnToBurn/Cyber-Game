import React, { useState } from 'react';
import { 
  Sparkles, Shield, Search, PhoneCall, Coffee, 
  ShieldAlert, Flame, Check, ArrowLeft, Zap, 
  FileCode, AlertCircle, Radio, ShieldCheck, 
  UserCheck, Award, Eye, TrendingUp, Lock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SkillNode, PlayerStats, SkillBranch } from '../types';
import { audio } from '../utils/audio';

interface SkillTreeModalProps {
  skills: SkillNode[];
  playerStats: PlayerStats;
  onUnlockSkill: (skillId: string, cost: number) => void;
  onClose: () => void;
}

export const SkillTreeModal: React.FC<SkillTreeModalProps> = ({
  skills,
  playerStats,
  onUnlockSkill,
  onClose
}) => {
  const [selectedBranch, setSelectedBranch] = useState<SkillBranch | 'ALL'>('ALL');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="w-5 h-5" />;
      case 'FileCode': return <FileCode className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'AlertCircle': return <AlertCircle className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'PhoneCall': return <PhoneCall className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Coffee': return <Coffee className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Eye': return <Eye className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  const branches: Array<{ id: SkillBranch | 'ALL'; label: string; desc: string; color: string }> = [
    { id: 'ALL', label: 'FULL MATRIX', desc: 'All defensive specializations', color: 'border-white' },
    { id: 'AWARENESS', label: '1. AWARENESS', desc: 'Phishing detection, header crypto & payload inspection', color: 'border-[#38bdf8]' },
    { id: 'COMMUNICATION', label: '2. COMMUNICATION', desc: 'Vishing de-escalation, directory lookup & radar', color: 'border-amber-400' },
    { id: 'EFFICIENCY', label: '3. EFFICIENCY', desc: 'Traversal speed, rapid triage hotkeys & incident shield', color: 'border-[#22c55e]' },
  ];

  const filteredSkills = selectedBranch === 'ALL'
    ? skills
    : skills.filter(s => s.branch === selectedBranch);

  return (
    <div id="skill-tree-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 md:p-8 font-tech select-none overflow-hidden animate-fadeIn">
      {/* Background CRT & Grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-30" />
      <div className="absolute inset-0 crt-overlay pointer-events-none" />

      {/* Main Container */}
      <div className="bg-[#0b0f19] text-white flex-1 rounded-sm shadow-2xl flex flex-col border-4 border-[#334155] relative z-10 max-w-5xl max-h-[92vh] overflow-hidden">
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
              SECURITY_TREE: operative_capabilities#spec_matrix
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[#070a12] border-2 border-[#fbbf24] text-yellow-300 font-pixel text-[9px] shadow-sm">
              AVAILABLE XP: {playerStats.credits}
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#0f172a] hover:bg-[#334155] text-slate-300 font-pixel text-[9px] uppercase border border-[#475569] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>EXIT (Esc)</span>
            </button>
          </div>
        </div>

        {/* Branch Filter Tabs */}
        <div className="bg-[#070a12] border-b-2 border-[#1e293b] p-2 sm:px-6 flex flex-wrap gap-2 shrink-0">
          {branches.map(b => (
            <button
              key={b.id}
              onClick={() => {
                audio.playClick();
                setSelectedBranch(b.id);
              }}
              className={`px-3 py-2 font-pixel text-[9px] uppercase tracking-wider transition-all cursor-pointer border-2 ${
                selectedBranch === b.id
                  ? 'bg-[#0284c7] text-white border-[#38bdf8] shadow-md'
                  : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:bg-[#1e293b] hover:text-white'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Branch Explainer Banner */}
        <div className="bg-[#0f172a] px-4 py-2 sm:px-6 border-b border-[#1e293b] text-xs font-tech text-slate-300 flex items-center justify-between">
          <span>
            {selectedBranch === 'ALL' && 'Showing complete defensive skill matrix across all 3 disciplines.'}
            {selectedBranch === 'AWARENESS' && 'Awareness Branch: Sharpen detection of deceptive domains, forged headers, and weaponized attachments.'}
            {selectedBranch === 'COMMUNICATION' && 'Communication Branch: Master dialogue tactics, caller identity lookup, and social engineering de-escalation.'}
            {selectedBranch === 'EFFICIENCY' && 'Efficiency Branch: Accelerate movement speed, streamline triage hotkeys, and unlock incident breach shields.'}
          </span>
          <span className="hidden md:inline text-yellow-400 font-pixel text-[9px]">
            UNLOCKED: {playerStats.unlockedSkills.length} / {skills.length}
          </span>
        </div>

        {/* Skill Matrix Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredSkills.map((skill) => {
            const isUnlocked = playerStats.unlockedSkills.includes(skill.id);
            const canAfford = playerStats.credits >= skill.cost;
            const hasPrerequisite = !skill.prerequisiteId || playerStats.unlockedSkills.includes(skill.prerequisiteId);
            const prereqSkill = skill.prerequisiteId ? skills.find(s => s.id === skill.prerequisiteId) : null;
            const isAvailable = !isUnlocked && hasPrerequisite;

            const branchBadgeColor = 
              skill.branch === 'AWARENESS' ? 'text-[#38bdf8] border-[#38bdf8]/40 bg-[#38bdf8]/10' :
              skill.branch === 'COMMUNICATION' ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' :
              'text-[#22c55e] border-[#22c55e]/40 bg-[#22c55e]/10';

            return (
              <div
                key={skill.id}
                className={`p-4 border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono ${
                  isUnlocked
                    ? 'bg-[#142318] border-[#22c55e] text-white'
                    : isAvailable && canAfford
                    ? 'bg-[#1e1e1e] border-white/30 hover:border-white text-white shadow-md'
                    : isAvailable
                    ? 'bg-[#181818] border-white/15 text-white/80'
                    : 'bg-[#111111] border-white/5 opacity-50 text-white/50'
                }`}
              >
                {/* Left Column: Icon & Meta */}
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-3 border shrink-0 ${
                    isUnlocked
                      ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
                      : isAvailable && canAfford
                      ? 'bg-black border-white/30 text-amber-400'
                      : 'bg-black border-white/10 text-white/40'
                  }`}>
                    {getIcon(skill.icon)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white">{skill.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 border font-bold uppercase ${branchBadgeColor}`}>
                        {skill.branch} • TIER {skill.tier}
                      </span>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed font-sans">{skill.description}</p>
                    
                    <div className="text-[11px] text-[#38bdf8] font-bold pt-1">
                      ⚡ Benefit: {skill.effectDescription}
                    </div>

                    {/* Prerequisite warning if locked */}
                    {!hasPrerequisite && prereqSkill && (
                      <div className="text-[10px] text-amber-400/90 flex items-center gap-1 pt-0.5">
                        <Lock className="w-3 h-3" />
                        <span>Requires Prerequisite: "{prereqSkill.name}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="shrink-0 w-full sm:w-auto flex justify-end">
                  {isUnlocked ? (
                    <div className="flex items-center gap-1.5 px-4 py-2 bg-[#22c55e]/20 border border-[#22c55e] text-[#22c55e] text-xs font-bold uppercase tracking-wider">
                      <Check className="w-4 h-4" />
                      <span>UNLOCKED</span>
                    </div>
                  ) : !hasPrerequisite ? (
                    <div className="px-4 py-2 bg-black border border-white/10 text-white/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>TIER LOCKED</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (canAfford) {
                          audio.playBadgeUnlock();
                          confetti({ particleCount: 40, spread: 60 });
                          onUnlockSkill(skill.id, skill.cost);
                        } else {
                          audio.playFailure();
                        }
                      }}
                      disabled={!canAfford}
                      className={`w-full sm:w-auto px-5 py-2.5 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-white text-[#141414] hover:bg-white/90 shadow-md'
                          : 'bg-[#222222] text-white/40 cursor-not-allowed border border-white/10'
                      }`}
                    >
                      Unlock ({skill.cost} XP)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
