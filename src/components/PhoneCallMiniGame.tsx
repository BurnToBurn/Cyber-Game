import React, { useState, useEffect } from 'react';
import { 
  Phone, PhoneCall, PhoneOff, AlertTriangle, ShieldCheck, 
  ShieldAlert, Volume2, UserCheck, Sparkles, ArrowLeft, 
  Info, Activity, Radio, Shield, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhoneScenario, DialogueChoice, DialogueNode } from '../types';
import { audio } from '../utils/audio';

interface PhoneCallMiniGameProps {
  scenario: PhoneScenario;
  hasCallerLookupSkill: boolean;
  hasSocialRadar: boolean;
  hasDeescalation: boolean;
  hasExecutiveVerification: boolean;
  hasSecOpsPushback: boolean;
  onComplete: (
    outcome: 'CAUGHT_ATTACKER' | 'FELL_FOR_PRETEXT' | 'POLITE_REFUSAL' | 'VERIFIED_LEGITIMATE',
    pointsDelta: number,
    incidentNote?: string
  ) => void;
  onExit: () => void;
}

export const PhoneCallMiniGame: React.FC<PhoneCallMiniGameProps> = ({
  scenario,
  hasCallerLookupSkill,
  hasSocialRadar,
  hasDeescalation,
  hasExecutiveVerification,
  hasSecOpsPushback,
  onComplete,
  onExit
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(scenario.initialNodeId);
  const [suspicion, setSuspicion] = useState<number>(30); // 0 to 100
  const [trust, setTrust] = useState<number>(50); // 0 to 100
  const [history, setHistory] = useState<Array<{ speaker: string; text: string }>>([]);
  const [showDebrief, setShowDebrief] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<'CAUGHT_ATTACKER' | 'FELL_FOR_PRETEXT' | 'POLITE_REFUSAL' | 'VERIFIED_LEGITIMATE' | null>(null);

  const currentNode: DialogueNode = scenario.nodes[currentNodeId] || scenario.nodes[scenario.initialNodeId];

  // Initial speech
  useEffect(() => {
    if (currentNode && history.length === 0) {
      setHistory([{ speaker: currentNode.speaker, text: currentNode.dialogue }]);
      audio.playPhoneRing();
    }
  }, []);

  const handleChoice = (choice: DialogueChoice) => {
    audio.playClick();

    // De-escalation skill reduces suspicion penalty
    const suspicionDelta = hasDeescalation && choice.suspicionChange > 0
      ? Math.round(choice.suspicionChange * 0.7)
      : choice.suspicionChange;

    const newSuspicion = Math.min(100, Math.max(0, suspicion + suspicionDelta));
    const newTrust = Math.min(100, Math.max(0, trust + choice.trustChange));
    setSuspicion(newSuspicion);
    setTrust(newTrust);

    // Append player's choice and the transition response
    const updatedHistory = [
      ...history,
      { speaker: 'You (Security Operative)', text: choice.text },
      { speaker: currentNode.speaker, text: choice.response }
    ];

    if (choice.nextNodeId) {
      const nextNode = scenario.nodes[choice.nextNodeId];
      if (nextNode) {
        if (nextNode.dialogue && nextNode.dialogue !== choice.response) {
          updatedHistory.push({ speaker: nextNode.speaker, text: nextNode.dialogue });
        }
        setHistory(updatedHistory);
        setCurrentNodeId(choice.nextNodeId);

        if (nextNode.isEndNode && nextNode.outcome) {
          handleEnd(nextNode.outcome, nextNode);
        }
      }
    }
  };

  const handleEnd = (
    finalOutcome: 'CAUGHT_ATTACKER' | 'FELL_FOR_PRETEXT' | 'POLITE_REFUSAL' | 'VERIFIED_LEGITIMATE',
    endNode: DialogueNode
  ) => {
    setOutcome(finalOutcome);
    setShowDebrief(true);

    let points = 0;
    let incidentText: string | undefined = undefined;

    if (finalOutcome === 'CAUGHT_ATTACKER' || finalOutcome === 'VERIFIED_LEGITIMATE') {
      points = 15;
      if (hasSecOpsPushback) points = Math.round(points * 1.35);
      audio.playSuccess();
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } else if (finalOutcome === 'FELL_FOR_PRETEXT') {
      points = 0; // 0 XP earned for falling for attacker pretext
      audio.playAlarm();
      incidentText = `Vishing Attack Succeeded: Employee bypassed security protocol on incoming call from "${scenario.callerName}".`;
    } else {
      points = 0; // 0 XP earned for false alarm refusal
      audio.playFailure();
    }

    onComplete(finalOutcome, points, incidentText);
  };

  return (
    <div id="phone-call-mini-game" className="fixed inset-0 z-50 bg-[#E4E3E0] text-[#141414] flex flex-col font-sans select-none overflow-hidden p-2 sm:p-6 md:p-8">
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
              VOIP_INTERCEPTOR: voice_session#4892 [SIMULATION CHANNEL]
            </span>
          </div>

          <button
            onClick={onExit}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Exit Call (Esc)</span>
          </button>
        </div>

        {/* Main Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Caller Telemetry */}
          <div className="w-full md:w-80 bg-[#111111] border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-5 flex flex-col justify-between overflow-y-auto shrink-0">
            <div>
              {/* Caller ID Box */}
              <div className="bg-black border border-white/10 p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono uppercase opacity-50 font-bold tracking-wider">
                    VOIP Handset Line 1
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <span className="text-[10px] font-mono text-green-400 font-bold">CONNECTED</span>
                  </div>
                </div>

                <div className="text-base font-bold font-mono text-white mb-0.5">
                  {scenario.callerName}
                </div>
                <div className="text-xs font-mono opacity-70 mb-2">
                  {scenario.callerNumber}
                </div>

                <div className="text-[11px] font-mono text-[#38bdf8] font-bold">
                  Claimed Org: {scenario.departmentClaimed}
                </div>

                {/* Caller ID Lookup Skill */}
                {hasCallerLookupSkill && (
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] font-mono font-bold">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    {scenario.isSocialEngineering ? (
                      <span className="text-red-400">ACTIVE DIRECTORY: UNREGISTERED / EXTERNAL SPOOF</span>
                    ) : (
                      <span className="text-[#22c55e]">ACTIVE DIRECTORY: VERIFIED INTERNAL EXTENSION</span>
                    )}
                  </div>
                )}

                {/* Social Engineering Radar Skill */}
                {hasSocialRadar && (
                  <div className="mt-2 pt-2 border-t border-white/10 text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-300" />
                    <span>TACTIC DETECTED: [{scenario.tacticUsed}]</span>
                  </div>
                )}
              </div>

              {/* Stress & Suspicion Gauges */}
              <div className="space-y-3 font-mono text-xs mb-4">
                <div>
                  <div className="flex justify-between text-[10px] opacity-70 mb-1">
                    <span>CALLER AGITATION / SUSPICION</span>
                    <span>{suspicion}%</span>
                  </div>
                  <div className="h-2 bg-white/10 w-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        suspicion >= 75 ? 'bg-red-600' : suspicion >= 45 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${suspicion}%` }}
                    />
                  </div>
                  {hasDeescalation && (
                    <div className="text-[9px] text-emerald-400 mt-0.5">
                      ✓ De-escalation Protocol Active (-30% suspicion surge)
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-[10px] opacity-70 mb-1">
                    <span>CALLER TRUST / COOPERATION</span>
                    <span>{trust}%</span>
                  </div>
                  <div className="h-2 bg-white/10 w-full overflow-hidden">
                    <div
                      className="h-full bg-[#38bdf8] transition-all duration-300"
                      style={{ width: `${trust}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[9px] font-mono opacity-40 text-center border-t border-white/10 pt-3">
              ZERO-TRUST VISHING MITIGATION PROTOCOL
            </div>
          </div>

          {/* Right Column: Audio Transcript & Dialogue Options */}
          <div className="flex-1 bg-[#141414] p-4 md:p-6 flex flex-col justify-between overflow-hidden">
            {/* Scrollable Conversation Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {history.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.speaker.includes('You') ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="text-[10px] font-mono opacity-50 mb-1 px-1">
                    {msg.speaker}
                  </div>
                  <div
                    className={`max-w-[85%] p-3 text-xs leading-relaxed font-mono ${
                      msg.speaker.includes('You')
                        ? 'bg-[#3b82f6] text-white font-bold border border-[#3b82f6]'
                        : 'bg-[#1e1e1e] text-white/90 border border-white/15'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Response Options */}
            {!showDebrief && currentNode.choices && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <div className="text-[10px] font-mono font-bold opacity-50 uppercase tracking-widest">
                  Select Your Response:
                </div>
                {currentNode.choices.map((choice, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left p-3 bg-[#1a1a1a] hover:bg-[#252525] active:bg-[#303030] border border-white/15 hover:border-white/40 text-white text-xs font-mono transition-all flex items-start gap-2.5 cursor-pointer"
                  >
                    <span className="text-[#38bdf8] font-bold shrink-0">[{cIdx + 1}]</span>
                    <span className="leading-snug">{choice.text}</span>
                  </button>
                ))}

                {/* VIP Out-of-Band Verification Option if unlocked */}
                {hasExecutiveVerification && scenario.tacticUsed === 'AUTHORITY' && (
                  <button
                    onClick={() => {
                      handleChoice({
                        text: "[VIP OUT-OF-BAND PROTOCOL]: I am initiating a secondary verification ping to the executive's direct corporate cell to confirm this request.",
                        response: "Uh... wait, don't do that! Never mind, I'll contact them through regular channels... *CLICK*",
                        nextNodeId: 'end_out_of_band',
                        suspicionChange: -20,
                        trustChange: 10
                      });
                      handleEnd('CAUGHT_ATTACKER', {
                        id: 'end_out_of_band',
                        speaker: scenario.callerName,
                        dialogue: "Caller panicked and terminated connection upon out-of-band challenge.",
                        choices: [],
                        isEndNode: true,
                        outcome: 'CAUGHT_ATTACKER',
                        debrief: "VIP Out-of-Band Verification forced the attacker to abandon their pretext immediately."
                      });
                    }}
                    className="w-full text-left p-3 bg-[#132838] hover:bg-[#1a384f] border-2 border-[#38bdf8] text-[#38bdf8] font-bold text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                    <span>[PERK ACTIVATED]: Demand VIP Out-of-Band Secondary Authorization</span>
                  </button>
                )}
              </div>
            )}

            {/* Debrief & Outcome Display */}
            {showDebrief && (
              <div className="bg-[#1a1a1a] border-2 border-white/20 p-5 mt-2 animate-fadeIn text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 font-mono text-xs font-bold uppercase tracking-wider ${
                    outcome === 'CAUGHT_ATTACKER' || outcome === 'VERIFIED_LEGITIMATE'
                      ? 'bg-emerald-950 text-[#22c55e] border border-emerald-700'
                      : 'bg-red-950 text-red-400 border border-red-700'
                  }`}>
                    {outcome === 'CAUGHT_ATTACKER' && `VISHING ATTACK INTERCEPTED (+${hasSecOpsPushback ? 20 : 15} XP)`}
                    {outcome === 'VERIFIED_LEGITIMATE' && `LEGITIMATE CALL VERIFIED (+${hasSecOpsPushback ? 20 : 15} XP)`}
                    {outcome === 'FELL_FOR_PRETEXT' && 'SECURITY BREACH (0 XP EARNED) — PRETEXT ACCEPTED'}
                    {outcome === 'POLITE_REFUSAL' && 'FALSE ALARM (0 XP EARNED) — OVER-DEFENSIVE REFUSAL'}
                  </div>
                </div>

                <div className="text-xs font-mono text-white/90 leading-relaxed mb-4">
                  {scenario.overallExplanation}
                </div>

                <div className="flex justify-end">
                  <button
                    id="btn-finish-phone-call"
                    onClick={onExit}
                    className="px-6 py-2.5 bg-white text-[#141414] hover:bg-white/90 font-mono font-bold text-xs uppercase tracking-widest cursor-pointer"
                  >
                    Finish Call & Return to Floor
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
