import React, { useState, useEffect } from 'react';
import { 
  Mail, ShieldAlert, CheckCircle2, AlertTriangle, ArrowLeft, 
  ExternalLink, FileText, Info, Search, ShieldCheck, Eye, 
  CornerDownRight, Bug, Sparkles, Terminal as TerminalIcon, 
  Zap, Lock, Radio 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhishingEmail, MatrixOutcome, MatrixScore } from '../types';
import { audio } from '../utils/audio';

interface PhishingTerminalProps {
  emails: PhishingEmail[];
  matrixScore: MatrixScore;
  hasDomainInspector: boolean;
  hasHeaderCrypto: boolean;
  hasSandbox: boolean;
  hasUrgencyClassifier: boolean;
  hasRapidTriage: boolean;
  hasThreatIntelFeed: boolean;
  onDecision: (
    email: PhishingEmail,
    action: 'REPORT_PHISHING' | 'MARK_SAFE',
    outcome: MatrixOutcome,
    pointsDelta: number
  ) => void;
  onExit: () => void;
}

export const PhishingTerminal: React.FC<PhishingTerminalProps> = ({
  emails,
  matrixScore,
  hasDomainInspector,
  hasHeaderCrypto,
  hasSandbox,
  hasUrgencyClassifier,
  hasRapidTriage,
  hasThreatIntelFeed,
  onDecision,
  onExit
}) => {
  const [selectedEmailIndex, setSelectedEmailIndex] = useState<number>(0);
  const [showHeaders, setShowHeaders] = useState<boolean>(hasHeaderCrypto);
  const [hoveredLinkUrl, setHoveredLinkUrl] = useState<string | null>(null);
  const [sandboxedAttachment, setSandboxedAttachment] = useState<string | null>(null);
  const [debriefOutcome, setDebriefOutcome] = useState<{
    email: PhishingEmail;
    outcome: MatrixOutcome;
    pointsDelta: number;
    actionTaken: 'REPORT_PHISHING' | 'MARK_SAFE';
  } | null>(null);

  const currentEmail = emails[selectedEmailIndex] || emails[0];

  const handleAction = (action: 'REPORT_PHISHING' | 'MARK_SAFE') => {
    if (!currentEmail || debriefOutcome) return;

    let outcome: MatrixOutcome;
    let pointsDelta: number;

    if (action === 'REPORT_PHISHING') {
      if (currentEmail.isPhishing) {
        outcome = 'TRUE_POSITIVE';
        pointsDelta = 10;
        if (hasThreatIntelFeed) pointsDelta = Math.round(pointsDelta * 1.25);
        audio.playSuccess();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } else {
        outcome = 'FALSE_POSITIVE';
        pointsDelta = -5;
        audio.playFailure();
      }
    } else {
      // MARK_SAFE
      if (!currentEmail.isPhishing) {
        outcome = 'TRUE_NEGATIVE';
        pointsDelta = 10;
        audio.playSuccess();
      } else {
        outcome = 'FALSE_NEGATIVE';
        pointsDelta = -15;
        audio.playAlarm();
      }
    }

    setDebriefOutcome({
      email: currentEmail,
      outcome,
      pointsDelta,
      actionTaken: action
    });

    onDecision(currentEmail, action, outcome, pointsDelta);
  };

  const handleNextEmail = () => {
    setDebriefOutcome(null);
    setShowHeaders(hasHeaderCrypto);
    setHoveredLinkUrl(null);
    setSandboxedAttachment(null);

    if (selectedEmailIndex + 1 < emails.length) {
      setSelectedEmailIndex(prev => prev + 1);
    } else {
      // Finished all emails in this batch
      onExit();
    }
  };

  // Keyboard Hotkey Support (Rapid Triage Perk)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (debriefOutcome) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNextEmail();
        }
        return;
      }

      if (hasRapidTriage) {
        if (e.key === '1') {
          e.preventDefault();
          handleAction('REPORT_PHISHING');
        } else if (e.key === '2') {
          e.preventDefault();
          handleAction('MARK_SAFE');
        } else if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (selectedEmailIndex > 0) {
            setSelectedEmailIndex(prev => prev - 1);
            audio.playClick();
          }
        } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
          e.preventDefault();
          if (selectedEmailIndex + 1 < emails.length) {
            setSelectedEmailIndex(prev => prev + 1);
            audio.playClick();
          }
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasRapidTriage, debriefOutcome, selectedEmailIndex, currentEmail]);

  // Helper for domain analysis
  const getDomainFromEmail = (address: string) => {
    const parts = address.split('@');
    return parts[1] || address;
  };

  const isSuspiciousTLD = (domain: string) => {
    return (
      domain.endsWith('.ru') ||
      domain.endsWith('.xyz') ||
      domain.endsWith('.top') ||
      domain.endsWith('.tk') ||
      domain.endsWith('.cc') ||
      domain.endsWith('.info') ||
      domain.includes('huntington-bank') ||
      domain.includes('hnb-rewards') ||
      domain.includes('dieb0ld') ||
      domain.includes('clearing.net') ||
      domain.includes('paypa1') ||
      domain.includes('c0rp')
    );
  };

  return (
    <div id="phishing-terminal-view" className="fixed inset-0 z-50 bg-[#E4E3E0] text-[#141414] flex flex-col font-sans select-none overflow-hidden p-2 sm:p-6 md:p-8">
      {/* Background grid */}
      <div className="absolute inset-0 grid-lines pointer-events-none" />

      {/* Main Terminal Window Frame */}
      <div className="bg-[#141414] text-white flex-1 rounded-sm shadow-2xl flex flex-col border-[6px] border-[#00693e] relative z-10 overflow-hidden">
        {/* Top Terminal Bar */}
        <div className="h-9 bg-[#00693e] flex items-center px-4 justify-between shrink-0 select-none">
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
            <span className="text-[11px] font-mono text-emerald-100 font-bold uppercase tracking-wider hidden sm:inline">
              HUNTINGTON SEC-OPS // analyst@huntington.com [FEDWIRE & CORE TRIAGE]
            </span>
          </div>

          {/* 2x2 Matrix Performance Telemetry */}
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <div className="bg-[#1e1e1e] px-2.5 py-1 border border-white/10 flex gap-2 sm:gap-3">
              <span className="text-[#22c55e] font-bold" title="True Positives (Caught Phish)">
                TP: {matrixScore.truePositives}
              </span>
              <span className="text-[#38bdf8] font-bold" title="True Negatives (Allowed Safe)">
                TN: {matrixScore.trueNegatives}
              </span>
              <span className="text-yellow-400 font-bold" title="False Positives (Flagged Clean)">
                FP: {matrixScore.falsePositives}
              </span>
              <span className="text-red-500 font-bold" title="False Negatives (Missed Threat)">
                FN: {matrixScore.falseNegatives}
              </span>
            </div>
            <button
              onClick={onExit}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Quit (Esc)</span>
            </button>
          </div>
        </div>

        {/* Mail Client Inner Panes */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Inbox Sidebar */}
          <div className="w-72 sm:w-80 border-r border-white/10 flex flex-col bg-[#111111] shrink-0 overflow-hidden">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest font-mono">
                Inbox Queue ({emails.length})
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40 font-bold uppercase">
                Item {selectedEmailIndex + 1}/{emails.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {emails.map((email, idx) => {
                const isSelected = idx === selectedEmailIndex;
                return (
                  <div
                    key={email.id}
                    onClick={() => {
                      audio.playClick();
                      setSelectedEmailIndex(idx);
                      setDebriefOutcome(null);
                      setShowHeaders(hasHeaderCrypto);
                    }}
                    className={`p-3.5 cursor-pointer transition-all text-left ${
                      isSelected
                        ? 'bg-white/10 border-l-4 border-[#3b82f6]'
                        : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold truncate text-white">{email.sender.displayName}</span>
                      <span className="text-[10px] opacity-50 font-mono">{email.timestamp}</span>
                    </div>
                    <div className="text-xs text-white/90 truncate mb-1">{email.subject}</div>
                    <div className="text-[10px] opacity-60 line-clamp-1 font-mono">{email.body.substring(0, 60)}...</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[9px] font-mono text-[#3b82f6] font-bold">
                        DIFFICULTY: {email.difficulty}
                      </span>
                      <span className="text-[9px] font-mono text-white/40 uppercase">
                        [{email.category}]
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rapid Triage Hotkeys Prompt Bar */}
            {hasRapidTriage && (
              <div className="p-2.5 bg-black border-t border-white/10 text-[10px] font-mono text-white/70 flex items-center justify-between">
                <span className="text-[#22c55e] font-bold">[1] REPORT</span>
                <span className="text-[#38bdf8] font-bold">[2] SAFE</span>
                <span className="text-white/40">[W/S] NAV</span>
              </div>
            )}
          </div>

          {/* Right Reading & Inspection Pane */}
          <div className="flex-1 flex flex-col bg-[#141414] overflow-hidden relative">
            {currentEmail ? (
              <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
                {/* Email Header Banner */}
                <div className="mb-6">
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold mb-1 tracking-tight text-white">
                        {currentEmail.subject}
                      </h2>
                      <div className="text-xs opacity-70 font-mono flex items-center gap-2 flex-wrap">
                        <span>From: {currentEmail.sender.displayName}</span>
                        <span className={`px-1.5 py-0.5 text-[11px] border font-bold ${
                          hasDomainInspector && (currentEmail.sender.address.includes('verify') || currentEmail.sender.address.includes('c0rp') || currentEmail.sender.address.includes('vault') || isSuspiciousTLD(currentEmail.sender.address))
                            ? 'bg-red-500/20 text-red-400 border-red-500'
                            : 'bg-white/5 text-white/70 border-white/10'
                        }`}>
                          &lt;{currentEmail.sender.address}&gt;
                        </span>

                        {hasDomainInspector && (
                          <span className="text-[10px] text-amber-300 font-mono font-bold">
                            [PRO INSPECT: {getDomainFromEmail(currentEmail.sender.address)}]
                          </span>
                        )}

                        {hasThreatIntelFeed && isSuspiciousTLD(getDomainFromEmail(currentEmail.sender.address)) && (
                          <span className="text-[10px] bg-red-950 text-red-300 border border-red-600 px-2 py-0.5 font-bold animate-pulse">
                            ⚠️ CTI THREAT INTEL: HIGH RISK TLD
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {hasUrgencyClassifier && (currentEmail.subject.toLowerCase().includes('urgent') || currentEmail.subject.toLowerCase().includes('immediate') || currentEmail.subject.toLowerCase().includes('alert') || currentEmail.subject.toLowerCase().includes('action required')) && (
                        <div className="bg-amber-500/20 text-amber-300 px-2 py-1 text-[10px] font-mono font-bold border border-amber-500/50 uppercase flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-300" />
                          <span>SYNTHETIC URGENCY FLAGGED</span>
                        </div>
                      )}

                      <button
                        id="btn-inspect-headers"
                        onClick={() => {
                          audio.playClick();
                          setShowHeaders(!showHeaders);
                        }}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] uppercase font-bold border border-white/20 transition-all cursor-pointer"
                      >
                        {showHeaders ? 'Hide Headers' : 'Inspect Headers'}
                      </button>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-white/10" />

                  {/* Extended Header Diagnostics Panel */}
                  {showHeaders && (
                    <div className="mt-3 p-3 bg-black/60 border border-white/10 text-xs font-mono space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-[11px] text-white/70 pb-1 border-b border-white/10">
                        <span className="text-[#38bdf8] font-bold">ROUTING & CRYPTO TELEMETRY</span>
                        <span className={`px-1.5 py-0.2 text-[10px] font-bold ${
                          currentEmail.sender.spfDkimStatus === 'PASS'
                            ? 'text-[#22c55e]'
                            : currentEmail.sender.spfDkimStatus === 'FAIL'
                            ? 'text-red-400'
                            : 'text-amber-400'
                        }`}>
                          SPF/DKIM/DMARC: {currentEmail.sender.spfDkimStatus}
                        </span>
                      </div>
                      {currentEmail.sender.replyTo && (
                        <div className="text-red-400 text-[11px]">
                          <span className="opacity-50">Hidden Reply-To Mismatch:</span> {currentEmail.sender.replyTo}
                        </div>
                      )}
                      <div className="text-[10px] opacity-60">
                        Originating Server: mail-gw-{getDomainFromEmail(currentEmail.sender.address)} [Auth Verified: {currentEmail.sender.spfDkimStatus}]
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Body */}
                <div className="flex-1 font-mono text-sm leading-relaxed opacity-90 whitespace-pre-line mb-6">
                  {currentEmail.body}

                  {/* Interactive Hyperlinks */}
                  {currentEmail.links.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                        Attached Hyperlinks (Hover to inspect true destination endpoint):
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {currentEmail.links.map((link, lIdx) => (
                          <div
                            key={lIdx}
                            onMouseEnter={() => setHoveredLinkUrl(link.targetUrl)}
                            onMouseLeave={() => setHoveredLinkUrl(null)}
                            className="inline-block relative group"
                          >
                            <span className="text-[#3b82f6] underline cursor-help text-xs font-bold font-mono">
                              {link.text}
                            </span>
                            <span className="absolute left-0 -top-7 bg-white text-black text-[10px] px-2 py-0.5 hidden group-hover:block whitespace-nowrap shadow-lg font-mono font-bold z-30 border border-[#141414]">
                              Real Destination: {link.targetUrl}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attachments */}
                  {currentEmail.attachments && currentEmail.attachments.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                        Attachments:
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {currentEmail.attachments.map((att, aIdx) => (
                          <div
                            key={aIdx}
                            className="p-2.5 bg-white/5 border border-white/10 flex items-center gap-3 text-xs"
                          >
                            <FileText className="w-4 h-4 text-amber-400" />
                            <div>
                              <div className="font-bold">{att.name}</div>
                              <div className="text-[9px] opacity-60 font-mono">{att.size} • {att.type}</div>
                            </div>
                            {hasSandbox && (
                              <button
                                onClick={() => {
                                  audio.playTerminalDing();
                                  setSandboxedAttachment(
                                    att.isMalicious
                                      ? `SANDBOX THREAT DETECTED: Malicious macro payload detected in "${att.name}"`
                                      : `SANDBOX CLEAN: Verified harmless document hash.`
                                  );
                                }}
                                className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-bold uppercase cursor-pointer"
                              >
                                Sandbox Detonation
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sandbox Telemetry Alert */}
                  {sandboxedAttachment && (
                    <div className="mt-3 p-2.5 bg-black border border-amber-500/50 text-xs font-mono text-amber-300 flex items-center justify-between animate-fadeIn">
                      <span>{sandboxedAttachment}</span>
                      <button
                        onClick={() => setSandboxedAttachment(null)}
                        className="text-white/60 hover:text-white px-2 text-xs font-bold"
                      >
                        [X]
                      </button>
                    </div>
                  )}
                </div>

                {/* Real-time Target URL Readout */}
                <div className="h-8 mb-6 px-3 bg-[#111111] border border-white/10 flex items-center gap-2 text-xs font-mono">
                  <span className="opacity-50 text-[10px] uppercase font-bold">ENDPOINT TELEMETRY:</span>
                  {hoveredLinkUrl ? (
                    <span className="font-bold text-[#38bdf8] truncate font-mono">
                      {hoveredLinkUrl}
                    </span>
                  ) : (
                    <span className="opacity-40 italic text-[11px]">
                      Hover mouse over any link above to reveal true destination URL
                    </span>
                  )}
                </div>

                {/* High Density Bottom Action Buttons */}
                <div className="mt-auto flex gap-4 pt-2">
                  <button
                    id="btn-mark-safe"
                    onClick={() => handleAction('MARK_SAFE')}
                    className="bg-[#22c55e] text-white px-6 py-3 font-bold text-xs uppercase tracking-widest hover:brightness-110 flex-1 cursor-pointer transition-all border border-[#22c55e] shadow-lg text-center"
                  >
                    Mark Safe / Archive {hasRapidTriage && '[2]'}
                  </button>

                  <button
                    id="btn-report-phishing"
                    onClick={() => handleAction('REPORT_PHISHING')}
                    className="bg-red-600 text-white px-6 py-3 font-bold text-xs uppercase tracking-widest hover:brightness-110 flex-1 cursor-pointer transition-all border border-red-600 shadow-lg text-center"
                  >
                    Report Phishing {hasRapidTriage && '[1]'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center opacity-50 font-mono">
                SELECT AN EMAIL FROM THE INBOX QUEUE.
              </div>
            )}

            {/* Educational Debrief Modal */}
            {debriefOutcome && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
                <div className="bg-[#141414] text-white border-[4px] border-[#333] max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] text-left">
                  {/* Result Title */}
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
                    <div>
                      <div className="text-[10px] font-mono font-bold tracking-widest opacity-50 uppercase">
                        2x2 MATRIX EVALUATION RESULT
                      </div>
                      <div className={`text-lg font-black font-mono tracking-tight ${
                        debriefOutcome.outcome === 'TRUE_POSITIVE' || debriefOutcome.outcome === 'TRUE_NEGATIVE'
                          ? 'text-[#22c55e]'
                          : debriefOutcome.outcome === 'FALSE_POSITIVE'
                          ? 'text-yellow-400'
                          : 'text-red-500'
                      }`}>
                        {debriefOutcome.outcome === 'TRUE_POSITIVE' && `TRUE POSITIVE (+${debriefOutcome.pointsDelta} XP) — THREAT NEUTRALIZED!`}
                        {debriefOutcome.outcome === 'TRUE_NEGATIVE' && `TRUE NEGATIVE (+${debriefOutcome.pointsDelta} XP) — LEGITIMATE EMAIL ALLOWED!`}
                        {debriefOutcome.outcome === 'FALSE_POSITIVE' && 'FALSE POSITIVE (0 XP EARNED) — OVER-FLAGGED CLEAN EMAIL'}
                        {debriefOutcome.outcome === 'FALSE_NEGATIVE' && 'FALSE NEGATIVE (0 XP EARNED) — ACTIVE SECURITY BREACH!'}
                      </div>
                    </div>
                  </div>

                  {/* Teaching Takeaway */}
                  <div className="mb-4 bg-black/50 p-4 border border-white/10">
                    <div className="text-[10px] font-mono font-bold text-[#38bdf8] mb-1 uppercase tracking-widest">
                      SECURITY ANALYSIS & RATIONALE:
                    </div>
                    <p className="text-xs font-mono text-white/90 leading-relaxed">
                      {debriefOutcome.email.explanation}
                    </p>
                  </div>

                  {/* Red Flags Pill Breakdown */}
                  {debriefOutcome.email.redFlags.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] font-mono font-bold text-red-400 mb-1.5 uppercase">
                        Identified Red Flags:
                      </div>
                      <div className="space-y-1">
                        {debriefOutcome.email.redFlags.map((flag, fIdx) => (
                          <div
                            key={fIdx}
                            className="text-xs font-mono text-red-300 bg-red-950/30 border border-red-800/40 px-3 py-1"
                          >
                            • {flag}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clean Signals */}
                  {debriefOutcome.email.cleanSignals.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10px] font-mono font-bold text-[#22c55e] mb-1.5 uppercase">
                        Clean / Legitimate Signals:
                      </div>
                      <div className="space-y-1">
                        {debriefOutcome.email.cleanSignals.map((signal, sIdx) => (
                          <div
                            key={sIdx}
                            className="text-xs font-mono text-emerald-300 bg-emerald-950/30 border border-emerald-800/40 px-3 py-1"
                          >
                            • {signal}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Next button */}
                  <div className="mt-6 flex justify-end">
                    <button
                      id="btn-next-email"
                      onClick={handleNextEmail}
                      className="px-6 py-2.5 bg-white text-[#141414] hover:bg-white/90 font-mono font-bold text-xs uppercase tracking-widest cursor-pointer"
                    >
                      {selectedEmailIndex + 1 < emails.length ? 'Continue Next Email (Enter)' : 'Finish Terminal Session (Enter)'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
