import React, { useEffect, useState } from 'react';
import { CustomerAccount, RetentionTask } from '../types/customer';
import { ShieldAlert, AlertTriangle, Activity, X, ArrowUpRight, Flame, Clock } from 'lucide-react';

interface WarRoomModeProps {
  onClose: () => void;
  tasks: RetentionTask[];
  customers: CustomerAccount[];
  onSelectCustomer: (customer: CustomerAccount) => void;
}

export const WarRoomMode: React.FC<WarRoomModeProps> = ({
  onClose,
  tasks,
  customers,
  onSelectCustomer
}) => {
  const [pulseSeconds, setPulseSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseSeconds(p => p + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const urgentTasks = tasks
    .filter(t => t.priority === 'Urgent' || t.status === 'Pending')
    .slice(0, 4);

  const highImpactRisks = customers
    .filter(c => c.riskLevel === 'High')
    .sort((a, b) => b.arr - a.arr)
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 bg-[#070A10]/95 backdrop-blur-xl p-6 overflow-y-auto flex flex-col justify-between animate-in fade-in duration-300">
      {/* Top War Room Banner */}
      <div className="flex items-center justify-between border-b border-red-900/60 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_#ef4444] animate-ping"></span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-mono text-red-400 tracking-tight">
                EXECUTIVE WAR ROOM · ACTIVE CHURN INTERVENTION COCKPIT
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono">
                BROADCAST LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              REAL-TIME OPERATIONAL RETENTION SLA SURVEILLANCE · UPTIME {Math.floor(pulseSeconds / 60)}m {pulseSeconds % 60}s
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
        >
          <X className="w-4 h-4" />
          <span>Exit War Room</span>
        </button>
      </div>

      {/* Main War Room Content */}
      <div className="my-6 space-y-6">
        {/* Urgent Live Alert Ticker */}
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-red-400 animate-bounce" />
            <div>
              <div className="text-sm font-bold text-red-200">
                CRITICAL THREAT: $8.39M IN ANNUAL ARR UNDER IMMEDIATE CHURN PROBABILITY ESCALATION
              </div>
              <div className="text-xs text-red-300/80">
                18 Enterprise contracts require executive outreach within the next 12 hours to maintain SLA covenants.
              </div>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-xs text-red-400 uppercase block">Total Exposure</span>
            <span className="text-2xl font-bold text-white">$8,392,000</span>
          </div>
        </div>

        {/* 2-Column Grid: Urgent SLA Tasks & Top Exposure Accounts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Urgent SLA Tasks */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>SLA Critical Task Dispatch Desk</span>
            </h3>

            <div className="space-y-3">
              {urgentTasks.map(t => (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-red-400 font-bold">{t.id}</span>
                      <span className="font-semibold text-white text-xs">{t.customerName}</span>
                      <span className="text-slate-500 font-mono text-[11px]">${(t.customerArr / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{t.actionTitle}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">Owner: {t.owner} · SLA: {t.slaHoursRemaining}h remaining</div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-mono">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Marquee At-Risk Accounts */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Highest Value Accounts in Risk Corridor</span>
            </h3>

            <div className="space-y-3">
              {highImpactRisks.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectCustomer(c);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-slate-950/80 border border-red-950/60 hover:border-red-500/60 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <div className="font-semibold text-white text-xs group-hover:text-cyan-400 transition-colors">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {c.city}, {c.country} · {c.primaryRiskDriver}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-white">${(c.arr / 1000).toFixed(0)}k ARR</div>
                    <div className="text-xs text-red-400 font-semibold">{Math.round(c.churnProbability * 100)}% Churn</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer ticker */}
      <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs font-mono text-slate-500">
        <div>LIVE TELEMETRY: XGBOOST MODEL ACTIVE · REFRESH INTERVAL: NOMINAL</div>
        <div>CUSTOMER360 AI NEXUS ENGINE</div>
      </div>
    </div>
  );
};
