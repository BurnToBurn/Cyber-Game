import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowLeft, Bug, CheckCircle2, Clock } from 'lucide-react';
import { IncidentRecord } from '../types';

interface IncidentCorkboardProps {
  incidents: IncidentRecord[];
  threatLevel: number;
  onClose: () => void;
}

export const IncidentCorkboard: React.FC<IncidentCorkboardProps> = ({
  incidents,
  threatLevel,
  onClose
}) => {
  return (
    <div id="incident-corkboard-modal" className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">HUNTINGTON CYBER DEFENSE WAR ROOM</h2>
              <div className="text-xs font-mono text-slate-400">
                LIVE BANK INCIDENT TRACKER • DEFCON THREAT LEVEL: {threatLevel}%
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {incidents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-200 mb-1">NO ACTIVE INCIDENTS</h3>
            <p className="text-xs text-slate-400 max-w-md font-mono">
              The office network is calm. All incoming lures and suspicious vectors have been safely mitigated or not yet triggered.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-slate-950 border border-rose-900/50 shadow-inner text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-rose-950 border-l border-b border-rose-800 text-[10px] font-mono text-rose-400 font-bold uppercase">
                  {inc.severity} SEVERITY
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {inc.timestamp}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400">[{inc.type}]</span>
                </div>

                <h4 className="text-sm font-bold text-slate-100 mb-1.5">{inc.title}</h4>
                <p className="text-xs text-slate-300 mb-3 font-sans leading-relaxed">
                  {inc.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 flex items-start gap-2">
                  <span className="font-bold text-cyan-400">REMEDIATION:</span>
                  <span>{inc.lessonLearned}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
