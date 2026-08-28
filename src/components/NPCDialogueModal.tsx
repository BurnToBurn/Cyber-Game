import React, { useState, useEffect } from 'react';
import { 
  User, MessageSquare, ArrowLeft, Zap, Sparkles, 
  AlertTriangle, CheckCircle, ShieldAlert, Award,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OfficeNPC, NPCDialogueState, NPCDialogueOption, SideObjective } from '../types';
import { audio } from '../utils/audio';
import { PixelCharacter } from './PixelCharacter';

interface NPCDialogueModalProps {
  npc: OfficeNPC;
  threatLevel: number;
  unlockedSkills: string[];
  activeObjectives: string[];
  completedObjectives: string[];
  onAcceptObjective: (objective: SideObjective) => void;
  onClose: () => void;
}

export const NPCDialogueModal: React.FC<NPCDialogueModalProps> = ({
  npc,
  threatLevel,
  unlockedSkills,
  activeObjectives,
  completedObjectives,
  onAcceptObjective,
  onClose
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(npc.initialDialogueId);
  const [history, setHistory] = useState<Array<{ speaker: string; text: string; isPlayer: boolean }>>([]);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);

  const currentNode: NPCDialogueState = npc.dialogueTree[currentNodeId] || npc.dialogueTree[npc.initialDialogueId];

  // Determine threat-reactive line if available
  const getFullDialogue = () => {
    if (threatLevel >= 75 && currentNode.threatSpecificDialogue?.criticalThreat) {
      return currentNode.threatSpecificDialogue.criticalThreat;
    }
    if (threatLevel >= 50 && currentNode.threatSpecificDialogue?.highThreat) {
      return currentNode.threatSpecificDialogue.highThreat;
    }
    return currentNode.text;
  };

  const fullText = getFullDialogue();

  // Typewriter effect for authentic retro arcade dialogue
  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      index++;
      setDisplayedText(fullText.substring(0, index));
      if (index % 3 === 0) {
        audio.playClick();
      }
      if (index >= fullText.length) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [currentNodeId, threatLevel]);

  const handleSelectOption = (option: NPCDialogueOption) => {
    audio.playClick();

    // Append to conversation transcript
    setHistory(prev => [
      ...prev,
      { speaker: 'You (SecOps Operative)', text: option.text, isPlayer: true },
      { speaker: `${npc.name} (${npc.role})`, text: option.response, isPlayer: false }
    ]);

    if (option.triggerHint) {
      setActiveHint(option.triggerHint);
    }

    // Grant objective if present and not already active or completed
    if (option.grantObjective) {
      const objId = option.grantObjective.id;
      const isAlreadyActive = activeObjectives.includes(objId);
      const isCompleted = completedObjectives.includes(objId);

      if (!isAlreadyActive && !isCompleted) {
        onAcceptObjective(option.grantObjective);
        audio.playBadgeUnlock();
        confetti({ particleCount: 30, spread: 50 });
      }
    }

    if (option.nextNodeId && npc.dialogueTree[option.nextNodeId]) {
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const getMoodTag = () => {
    if (threatLevel >= 75) {
      return { text: 'MOOD: PANICKED', bg: 'bg-red-600', color: 'text-white' };
    }
    switch (currentNode.speakerMood) {
      case 'PANICKED':
        return { text: 'MOOD: PANICKED', bg: 'bg-red-600', color: 'text-white' };
      case 'SUSPICIOUS':
        return { text: 'MOOD: ANXIOUS', bg: 'bg-amber-600', color: 'text-white' };
      case 'GRATEFUL':
        return { text: 'MOOD: RELIEVED', bg: 'bg-emerald-600', color: 'text-white' };
      case 'CYNICAL':
        return { text: 'MOOD: CYNICAL', bg: 'bg-indigo-600', color: 'text-white' };
      default:
        return { text: 'MOOD: FOCUSED', bg: 'bg-slate-700', color: 'text-slate-200' };
    }
  };

  const mood = getMoodTag();

  return (
    <div id="npc-dialogue-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 md:p-8 select-none overflow-hidden animate-fadeIn">
      {/* Background CRT and Grid Overlay */}
      <div className="absolute inset-0 grid-lines pointer-events-none opacity-30" />
      <div className="absolute inset-0 crt-overlay pointer-events-none" />

      {/* Main Dave the Diver Style Dialogue Card */}
      <div className="bg-[#0b0f19] text-white flex-1 rounded-sm shadow-2xl flex flex-col border-4 border-[#334155] relative z-10 max-w-4xl max-h-[92vh] overflow-hidden">
        {/* Top Retro Bar */}
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
              COWORKER_INTERVIEW: {npc.name.toUpperCase()} [{npc.department.toUpperCase()}]
            </span>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#0f172a] hover:bg-[#334155] text-slate-300 font-pixel text-[9px] uppercase border border-[#475569] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>EXIT [ESC]</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Animated Character Portrait Banner (Dave the Diver Style) */}
          <div className="w-full md:w-72 bg-[#070a12] border-b md:border-b-0 md:border-r-2 border-[#1e293b] p-4 md:p-5 flex flex-col justify-between overflow-y-auto shrink-0">
            <div>
              {/* Character Cutout Card */}
              <div className="bg-[#0f172a] border-2 border-[#334155] p-4 text-center mb-4 shadow-lg relative overflow-hidden">
                {/* Background decorative pixel stripes */}
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,#38bdf8_0,#38bdf8_10px,transparent_10px,transparent_20px)]" />

                {/* Animated Character Avatar */}
                <div className="w-24 h-28 bg-[#070a12] border-4 border-[#38bdf8] mx-auto flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(56,189,248,0.3)] relative overflow-hidden animate-bob">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#38bdf8]/10 to-transparent pointer-events-none" />
                  <PixelCharacter 
                    id={npc.id} 
                    size="portrait" 
                    mood={currentNode.speakerMood} 
                  />
                </div>

                <h3 className="font-arcade text-base text-white tracking-wide">{npc.name}</h3>
                <div className="font-pixel text-[9px] text-[#38bdf8] mt-1">{npc.role}</div>
                <div className="text-[10px] font-tech text-slate-400 mt-0.5">{npc.department}</div>

                {/* Mood Tag */}
                <div className="mt-3 flex justify-center">
                  <span className={`font-pixel text-[8px] px-2 py-1 ${mood.bg} ${mood.color} border border-white/20 shadow-sm`}>
                    {mood.text}
                  </span>
                </div>
              </div>

              {/* Station & Dossier Info */}
              <div className="space-y-2 font-tech text-xs mb-3">
                <div className="p-2.5 bg-[#0b0f19] border border-[#1e293b]">
                  <div className="font-pixel text-[8px] text-slate-400 uppercase">OFFICE STATION:</div>
                  <div className="text-white font-bold text-xs mt-0.5">{npc.location}</div>
                </div>

                <div className="p-2.5 bg-[#0b0f19] border border-[#1e293b]">
                  <div className="font-pixel text-[8px] text-slate-400 uppercase">PERSONALITY & VULNERABILITY:</div>
                  <div className="text-slate-300 text-xs mt-0.5 leading-relaxed">{npc.personality}</div>
                </div>
              </div>

              {/* Threat Alert in Dialogue */}
              {threatLevel >= 50 && (
                <div className={`p-2.5 border-2 font-pixel text-[8px] flex items-start gap-2 ${
                  threatLevel >= 75 ? 'bg-red-950/80 border-red-500 text-red-300' : 'bg-amber-950/80 border-amber-500 text-amber-300'
                }`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    {threatLevel >= 75 ? 'ALARM LEVEL: CRITICAL. Panicked coworker.' : 'ALARM LEVEL: ELEVATED.'}
                  </div>
                </div>
              )}
            </div>

            <div className="font-pixel text-[7px] text-slate-500 text-center border-t border-[#1e293b] pt-3 mt-3">
              ZERO-TRUST SEC-OPS INTELLIGENCE
            </div>
          </div>

          {/* Right Column: Dialogue Stream & Interactive Action Responses */}
          <div className="flex-1 bg-[#090d16] p-4 md:p-6 flex flex-col justify-between overflow-hidden">
            {/* Scrollable Conversation Stream */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 mb-4">
              {/* NPC Active Prompt Box (Chunky Retro Style) */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#1e293b] border-2 border-[#38bdf8] flex items-center justify-center shrink-0 text-lg shadow-md">
                  {npc.avatar}
                </div>
                <div className="flex-1 bg-[#0f172a] border-2 border-[#38bdf8] p-4 text-xs sm:text-sm font-tech leading-relaxed text-white shadow-xl relative">
                  <div className="font-pixel text-[9px] text-[#38bdf8] mb-1.5 uppercase tracking-wider">
                    {npc.name} [{npc.role}]:
                  </div>
                  <p className="font-retro text-base sm:text-lg leading-snug text-slate-100 min-h-[48px]">
                    {displayedText}
                    {isTyping && <span className="inline-block w-2 h-4 bg-[#38bdf8] ml-1 animate-pulse" />}
                  </p>
                </div>
              </div>

              {/* Conversation History */}
              {history.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.isPlayer ? 'items-end' : 'items-start'}`}
                >
                  <div className="font-pixel text-[8px] text-slate-500 mb-1 px-1">
                    {msg.speaker}
                  </div>
                  <div
                    className={`max-w-[85%] p-3 text-xs sm:text-sm font-tech leading-relaxed ${
                      msg.isPlayer
                        ? 'bg-[#0284c7] text-white font-bold border-2 border-[#38bdf8] shadow-md'
                        : 'bg-[#1e293b] text-slate-200 border-2 border-[#334155]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Unlocked Security Hint */}
              {activeHint && (
                <div className="p-3 bg-[#0c2a47] border-2 border-[#38bdf8] text-[#38bdf8] font-tech text-xs flex items-start gap-2.5 animate-fadeIn shadow-lg">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-yellow-300" />
                  <div>
                    <span className="font-pixel text-[9px] text-yellow-300 block mb-0.5">SECURITY ADVICE UNLOCKED:</span>
                    <span className="text-white text-xs">{activeHint}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Response Options */}
            <div className="pt-3 border-t-2 border-[#1e293b] space-y-2">
              <div className="font-pixel text-[8px] text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>SELECT YOUR RESPONSE:</span>
                <span className="text-[#38bdf8]">[{currentNode.options.length} OPTIONS]</span>
              </div>

              {currentNode.options.map((option, optIdx) => (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-left p-3 bg-[#0f172a] hover:bg-[#1e293b] active:bg-[#334155] border-2 border-[#334155] hover:border-[#38bdf8] text-white font-tech text-xs sm:text-sm transition-all flex items-start justify-between gap-3 cursor-pointer group shadow-md"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-pixel text-[9px] text-[#38bdf8] shrink-0 mt-0.5">
                      [{optIdx + 1}]
                    </span>
                    <span className="leading-snug text-slate-200 group-hover:text-white font-bold">
                      {option.text}
                    </span>
                  </div>

                  {option.grantObjective && (
                    <span className="shrink-0 px-2 py-0.5 bg-[#b45309] text-yellow-300 border border-[#fbbf24] font-pixel text-[8px] uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      +{option.grantObjective.rewardXp} XP QUEST
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
