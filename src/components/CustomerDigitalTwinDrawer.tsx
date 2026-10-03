import React, { useState } from 'react';
import { CustomerAccount } from '../types/customer';
import { 
  X, 
  Building2, 
  MapPin, 
  TrendingDown, 
  Clock, 
  Calendar, 
  User, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle,
  Activity,
  FileText,
  Sparkles,
  Smile,
  Copy,
  Check,
  Zap
} from 'lucide-react';

interface CustomerDigitalTwinDrawerProps {
  customer: CustomerAccount | null;
  onClose: () => void;
  onDispatchAction: (customer: CustomerAccount, actionTitle: string) => void;
  plainEnglishMode?: boolean;
}

export const CustomerDigitalTwinDrawer: React.FC<CustomerDigitalTwinDrawerProps> = ({
  customer,
  onClose,
  onDispatchAction,
  plainEnglishMode = false
}) => {
  const [eli5Story, setEli5Story] = useState<string | null>(null);
  const [loadingStory, setLoadingStory] = useState<boolean>(false);
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [loadingEmail, setLoadingEmail] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  if (!customer) return null;

  const baselineRisk = 18.2;
  const predictedRiskPct = +(customer.churnProbability * 100).toFixed(1);

  // Fetch playful ELI5 story from backend
  const handleFetchStory = async () => {
    setLoadingStory(true);
    try {
      const res = await fetch('/api/gemini/explain-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer })
      });
      const data = await res.json();
      setEli5Story(data.story || 'Could not fetch story.');
    } catch (e) {
      setEli5Story('🍪 ' + customer.name + ' hasn\'t stopped by in ' + customer.recencyDays + ' days! If we send them a friendly note and solve their tickets, they\'ll be back with a big smile!');
    } finally {
      setLoadingStory(false);
    }
  };

  // Generate AI Email
  const handleGenerateEmail = async () => {
    setLoadingEmail(true);
    try {
      const res = await fetch('/api/gemini/generate-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer, tone: 'Warm, empathetic, executive' })
      });
      const data = await res.json();
      setEmailDraft(`Subject: ${data.emailSubject}\n\n${data.emailBody}`);
    } catch (e) {
      setEmailDraft(`Subject: Partnership check-in for ${customer.name}\n\nHi team, checking in to ensure everything is running smoothly!`);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleCopy = () => {
    if (emailDraft) {
      navigator.clipboard.writeText(emailDraft);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0C1019] border-l border-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 bg-[#0E1422] sticky top-0 z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                {customer.id}
              </span>
              <span className="text-xs text-slate-400">{customer.tier} Tier</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{customer.industry}</span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              <span>{customer.name}</span>
            </h2>

            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {customer.city}, {customer.country} ({customer.region})
              </span>
              <span>·</span>
              <span className="text-slate-300 font-mono">domain: {customer.domain}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Playful Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleFetchStory}
              disabled={loadingStory}
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Smile className="w-4 h-4 text-amber-400" />
              <span>{loadingStory ? 'Writing Fun Story...' : 'Explain Like I\'m 5 🍪'}</span>
            </button>

            <button
              onClick={handleGenerateEmail}
              disabled={loadingEmail}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{loadingEmail ? 'Drafting...' : 'Write AI Rescue Email ✉️'}</span>
            </button>
          </div>

          {/* ELI5 Fun Story Card if generated */}
          {eli5Story && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs space-y-2 animate-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-amber-400" />
                  <span>The Story of {customer.name} (In Simple Words)</span>
                </span>
                <button
                  onClick={() => setEli5Story(null)}
                  className="text-amber-400/60 hover:text-amber-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-amber-100/90 leading-relaxed whitespace-pre-line text-[12px]">
                {eli5Story}
              </p>
            </div>
          )}

          {/* Generated AI Email Card if generated */}
          {emailDraft && (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs space-y-2.5 animate-in slide-in-from-top duration-300">
              <div className="flex items-center justify-between text-cyan-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Gemini Personalized Outreach Email</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setEmailDraft(null)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <pre className="text-slate-200 whitespace-pre-line font-sans text-[11.5px] leading-relaxed bg-slate-900/80 p-3 rounded border border-slate-800 max-h-48 overflow-y-auto">
                {emailDraft}
              </pre>
            </div>
          )}

          {/* Key Metric Pulse Indicators */}
          <div className="grid grid-cols-3 gap-3">
            {/* Health Score Gauge */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {plainEnglishMode ? 'Happiness Score' : 'Health Score'}
              </span>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="3.2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={customer.healthScore >= 70 ? '#10B981' : customer.healthScore >= 45 ? '#F59E0B' : '#EF4444'}
                    strokeDasharray={`${customer.healthScore}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute font-mono text-xl font-bold text-white">
                  {customer.healthScore}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-2 font-mono">
                {customer.healthScore >= 70 ? '🌟 Rockstar' : customer.healthScore >= 45 ? '⚠️ Wobbly' : '🚨 Critical'}
              </span>
            </div>

            {/* Churn Probability */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {plainEnglishMode ? 'Risk of Leaving Us' : 'XGBoost Churn Risk'}
              </span>
              <div className="my-2">
                <div className={`text-2xl font-bold font-mono tabular-nums ${
                  customer.riskLevel === 'High' ? 'text-red-400' : customer.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {predictedRiskPct}%
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${customer.riskLevel === 'High' ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' : 'bg-emerald-500'}`} />
                  <span className="font-semibold">{customer.riskLevel} Danger Zone</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-1">
                Model: 95.4% Accuracy
              </div>
            </div>

            {/* Commercial ARR */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {plainEnglishMode ? 'Yearly Contract Spend' : 'Annual ARR'}
              </span>
              <div className="my-2">
                <div className="text-2xl font-bold text-white font-mono tabular-nums">
                  ${(customer.arr / 1000).toFixed(0)}k
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Monthly: ${(customer.mrr).toLocaleString()}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800 pt-1">
                LTV: ${(customer.monetary / 1000).toFixed(0)}k total
              </div>
            </div>
          </div>

          {/* Account Vital Matrix */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>{plainEnglishMode ? 'Activity & Relationship Health' : 'Behavioral & RFM Vitals'}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Days Inactive</span>
                <span className="font-mono text-white text-sm font-semibold">{customer.recencyDays} days</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Active Days (90d)</span>
                <span className="font-mono text-white text-sm font-semibold">{customer.activeDays} / 90</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Features Adopted</span>
                <span className="font-mono text-white text-sm font-semibold">{customer.productDiversity} modules</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Customer Cohort</span>
                <span className="font-mono text-cyan-400 text-sm font-semibold">{customer.segment}</span>
              </div>
            </div>
          </div>

          {/* Explainable AI: SHAP Feature Attribution Waterfall */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>{plainEnglishMode ? 'Why does the AI think this? (The Clues)' : 'Explainable AI: SHAP Feature Attribution'}</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                Baseline: {baselineRisk}%
              </span>
            </div>

            <p className="text-[11px] text-slate-400 mb-4">
              {plainEnglishMode 
                ? 'Green bars make the customer stay with us! Red bars are reasons they might leave.' 
                : `Feature contributions moving prediction from platform baseline toward ${predictedRiskPct}%.`}
            </p>

            <div className="space-y-3">
              {customer.shapAttributions.map((attr) => {
                const isPositiveRisk = attr.shapValue > 0;
                const absImpact = Math.min(100, Math.abs(attr.shapValue * 150));

                return (
                  <div key={attr.feature} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-300 font-medium">{attr.displayLabel}</span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-slate-400">({attr.actualValue})</span>
                        <span className={isPositiveRisk ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {isPositiveRisk ? `+${(attr.shapValue * 100).toFixed(1)}% risk` : `${(attr.shapValue * 100).toFixed(1)}% risk`}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex">
                      {isPositiveRisk ? (
                        <>
                          <div className="w-1/2 bg-transparent" />
                          <div
                            className="bg-red-500 h-full rounded-r"
                            style={{ width: `${Math.min(50, absImpact / 2)}%` }}
                          />
                        </>
                      ) : (
                        <>
                          <div className="w-1/2 flex justify-end">
                            <div
                              className="bg-emerald-500 h-full rounded-l"
                              style={{ width: `${Math.min(50, absImpact / 2)}%` }}
                            />
                          </div>
                          <div className="w-1/2 bg-transparent" />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Journey & Timeline */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer Milestone & Event Timeline</span>
            </h3>

            <div className="space-y-4 pl-2 border-l border-slate-800 relative ml-2">
              {customer.journeyEvents.map((evt) => (
                <div key={evt.id} className="relative pl-5 group">
                  <div
                    className={`absolute -left-[9px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#0C1019] ${
                      evt.sentiment === 'positive'
                        ? 'bg-emerald-500'
                        : evt.sentiment === 'negative'
                        ? 'bg-red-500'
                        : 'bg-cyan-500'
                    }`}
                  />
                  <div className="text-[11px] font-mono text-slate-500 mb-0.5">
                    {evt.timestamp}
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {evt.title}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0E1422] sticky bottom-0 z-10 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-200 block">Recommended Playbook:</span>
            <span className="text-cyan-300 truncate max-w-sm block">
              {customer.retentionRecommendation}
            </span>
          </div>

          <button
            onClick={() => {
              onDispatchAction(customer, customer.retentionRecommendation);
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <span>Dispatch Playbook</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
