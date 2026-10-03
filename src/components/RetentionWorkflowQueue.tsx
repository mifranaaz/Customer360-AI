import React, { useState } from 'react';
import { RetentionTask, CustomerAccount } from '../types/customer';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Send, 
  Gift, 
  MessageSquare, 
  PhoneCall, 
  ExternalLink,
  Tag,
  Sparkles,
  Check
} from 'lucide-react';

interface RetentionWorkflowQueueProps {
  tasks: RetentionTask[];
  customers: CustomerAccount[];
  onUpdateTaskStatus: (taskId: string, newStatus: RetentionTask['status']) => void;
  onSelectCustomer: (customer: CustomerAccount) => void;
}

export const RetentionWorkflowQueue: React.FC<RetentionWorkflowQueueProps> = ({
  tasks,
  customers,
  onUpdateTaskStatus,
  onSelectCustomer
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | RetentionTask['status']>('All');

  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    return true;
  });

  const urgentCount = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length;
  const inFlightCount = tasks.filter(t => t.status === 'In Progress' || t.status === 'Intervention Sent').length;
  const resolvedCount = tasks.filter(t => t.status === 'Resolved').length;
  const totalProtectedSpend = tasks
    .filter(t => t.status === 'Resolved' || t.status === 'Intervention Sent')
    .reduce((acc, t) => acc + t.customerSpend, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>AI Retention Operations Queue & Campaign Dispatch</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeted customer recovery campaigns: Service vouchers, loyalty passes, and re-engagement offers
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['All', 'Pending', 'In Progress', 'Intervention Sent', 'Resolved'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                statusFilter === st ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-red-950/80">
          <div className="text-[11px] font-mono text-red-400 uppercase">Urgent SLA Breaches</div>
          <div className="text-2xl font-bold font-mono text-red-400 mt-1">
            {urgentCount} <span className="text-xs font-normal text-slate-400">cases</span>
          </div>
          <div className="text-[10px] text-red-400/80 mt-1 font-mono">Action required &lt;12 hours</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-cyan-400 uppercase">In Active Flight</div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
            {inFlightCount} <span className="text-xs font-normal text-slate-400">campaigns</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Dispatched to CRM/Channels</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Successfully Recovered</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {resolvedCount} <span className="text-xs font-normal text-slate-400">customers</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Re-ordered within SLA window</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Revenue Protected</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            ${(totalProtectedSpend / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">Annual GMV exposure</div>
        </div>
      </div>

      {/* Retention Task Cards List */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No retention tasks match the selected criteria.
          </div>
        ) : (
          filteredTasks.map(task => {
            const customer = customers.find(c => c.id === task.customerId);
            const isUrgent = task.priority === 'Urgent';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all bg-slate-900/80 ${
                  isUrgent && task.status !== 'Resolved'
                    ? 'border-red-900/80 shadow-[0_0_12px_rgba(239,68,68,0.12)]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Customer Info, Action & WHY Rationale */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {task.id}
                      </span>
                      <button
                        onClick={() => customer && onSelectCustomer(customer)}
                        className="text-sm font-bold text-white hover:text-cyan-400 transition-colors flex items-center gap-1.5"
                      >
                        <span>{task.customerName}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </button>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs font-mono text-red-400 font-semibold">
                        {Math.round(task.churnProbability * 100)}% Churn
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs font-mono text-white font-semibold">
                        ${task.customerSpend.toLocaleString()} Annual Spend
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {task.channel}
                      </span>
                    </div>

                    {/* Action Title */}
                    <div className="text-xs font-semibold text-slate-200">
                      {task.actionTitle}
                    </div>

                    {/* Offer */}
                    <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-800/40 w-fit">
                      <Gift className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-medium">Offer: {task.offer}</span>
                    </div>

                    {/* Explicit WHY Rationale */}
                    <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                      <strong className="text-amber-400 font-mono text-[10px] uppercase block">Why this was generated:</strong>
                      {task.rationale}
                    </div>

                    {/* SLA countdown */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className={`w-3 h-3 ${isUrgent ? 'text-red-400' : 'text-slate-400'}`} />
                        <span className={isUrgent ? 'text-red-400 font-bold' : ''}>
                          SLA Window: {task.slaHoursRemaining}h remaining
                        </span>
                      </span>
                      <span>·</span>
                      <span>Desk: {task.owner}</span>
                    </div>
                  </div>

                  {/* Right: Operational Status Handlers */}
                  <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
                    <span className={`text-xs px-2.5 py-1 rounded font-medium ${
                      task.status === 'Resolved'
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                        : task.status === 'Intervention Sent'
                        ? 'bg-blue-950/80 text-blue-300 border border-blue-800/80'
                        : task.status === 'In Progress'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}>
                      {task.status}
                    </span>

                    {task.status === 'Pending' && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'In Progress')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition-colors"
                      >
                        Claim & Prepare
                      </button>
                    )}

                    {task.status === 'In Progress' && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'Intervention Sent')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 transition-colors flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Dispatch to {task.channel}</span>
                      </button>
                    )}

                    {task.status === 'Intervention Sent' && (
                      <button
                        onClick={() => onUpdateTaskStatus(task.id, 'Resolved')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Customer Re-ordered (Resolve)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
