import React, { useState, useMemo } from 'react';
import { CustomerAccount } from '../types/customer';
import { 
  Sparkles, 
  Gamepad2, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  HeartHandshake, 
  TrendingUp, 
  Copy, 
  Check, 
  BookOpen, 
  DollarSign, 
  Gift
} from 'lucide-react';

interface PlayfulAnalyticsHubProps {
  customers: CustomerAccount[];
  onSelectCustomer: (customer: CustomerAccount) => void;
  plainEnglishMode: boolean;
}

export const PlayfulAnalyticsHub: React.FC<PlayfulAnalyticsHubProps> = ({
  customers,
  onSelectCustomer,
  plainEnglishMode
}) => {
  // Sandbox Simulator State
  const defaultSimCustomer = useMemo(() => {
    return customers.find(c => c.riskLevel === 'High' && c.annualSpend > 2000) || customers[0];
  }, [customers]);

  const [simCustomer, setSimCustomer] = useState<CustomerAccount>(defaultSimCustomer);
  const [sliderInactivity, setSliderInactivity] = useState<number>(simCustomer?.recencyDays || 45);
  const [sliderComplaintsResolved, setSliderComplaintsResolved] = useState<number>(2);
  const [sliderPromoDiscount, setSliderPromoDiscount] = useState<number>(15); // e.g. 15% off basket
  const [vipPassUpgrade, setVipPassUpgrade] = useState<boolean>(false);

  // Playbook generator state
  const [playbookLoading, setPlaybookLoading] = useState<boolean>(false);
  const [generatedPlaybook, setGeneratedPlaybook] = useState<{
    emailSubject: string;
    emailBody: string;
    immediateActions: string[];
    estimatedRecoveryProbability: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Scatter plot filters
  const [scatterCategory, setScatterCategory] = useState<string>('All');
  const [hoveredScatterPoint, setHoveredScatterPoint] = useState<CustomerAccount | null>(null);

  // Real-time calculation of simulated churn & health
  const simulatedOutcome = useMemo(() => {
    let riskReduction = 0;

    // Inactivity reduction boost
    const daysReduced = Math.max(0, simCustomer.recencyDays - sliderInactivity);
    riskReduction += +(daysReduced * 0.005).toFixed(2);

    // Complaint resolution boost
    riskReduction += +(sliderComplaintsResolved * 0.08).toFixed(2);

    // Basket promo discount boost
    riskReduction += +((sliderPromoDiscount / 100) * 0.4).toFixed(2);

    // VIP Pass Upgrade boost
    if (vipPassUpgrade) riskReduction += 0.16;

    const initialChurn = simCustomer.churnProbability;
    const newChurn = Math.max(0.06, +(initialChurn - riskReduction).toFixed(2));
    const churnDrop = +(initialChurn - newChurn).toFixed(2);
    const gmvSaved = churnDrop > 0 ? Math.round(simCustomer.annualSpend * churnDrop) : 0;
    const newHealth = Math.round((1 - newChurn) * 100);

    return {
      newHealth,
      newChurn,
      initialChurn,
      churnDrop,
      gmvSaved,
      isRescued: newChurn < 0.35 && initialChurn >= 0.60
    };
  }, [simCustomer, sliderInactivity, sliderComplaintsResolved, sliderPromoDiscount, vipPassUpgrade]);

  const handleSelectSimCustomer = (cust: CustomerAccount) => {
    setSimCustomer(cust);
    setSliderInactivity(cust.recencyDays);
    setSliderComplaintsResolved(cust.complaints.length > 0 ? cust.complaints.length : 1);
    setSliderPromoDiscount(20);
    setVipPassUpgrade(false);
    setGeneratedPlaybook(null);
  };

  const handleGenerateAiPlaybook = async () => {
    setPlaybookLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: simCustomer.name,
            domain: simCustomer.email,
            arr: simCustomer.annualSpend,
            healthScore: Math.round((1 - simCustomer.churnProbability) * 100),
            churnProbability: simCustomer.churnProbability,
            segment: simCustomer.preferredCategory,
            recencyDays: simCustomer.recencyDays,
            primaryRiskDriver: simCustomer.primaryRiskReason
          },
          tone: plainEnglishMode ? 'Empathetic, clear, and customer-first' : 'E-commerce retention strategy'
        })
      });
      const data = await res.json();
      setGeneratedPlaybook(data);
    } catch (err) {
      console.error('Failed to generate playbook:', err);
    } finally {
      setPlaybookLoading(false);
    }
  };

  const handleCopyEmail = () => {
    if (generatedPlaybook) {
      navigator.clipboard.writeText(`Subject: ${generatedPlaybook.emailSubject}\n\n${generatedPlaybook.emailBody}`);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const scatterAccounts = useMemo(() => {
    const list = customers.filter(c => scatterCategory === 'All' || c.preferredCategory === scatterCategory);
    return list.slice(0, 140);
  }, [customers, scatterCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/50 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Interactive Customer Rescue Sandbox</span>
            </span>
            <span className="text-xs text-slate-400">· Anyone can understand & simulate retention</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {plainEnglishMode ? '🎮 The Customer Rescue Sandbox & Visual Hub' : 'Interactive Churn Simulation & Visual Analytics'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {plainEnglishMode 
              ? 'Test what happens when we apologize for a late delivery, offer a fresh coupon, or grant VIP Gold Pass status! Watch their churn risk drop in real time.'
              : 'Interactive counterfactual modeling: simulate the impact of personalized promotions, delivery recovery credits, and loyalty upgrades.'}
          </p>
        </div>

        <div className="text-center px-4 py-2.5 bg-slate-900/90 rounded-xl border border-slate-800 self-start md:self-auto">
          <span className="text-[10px] text-slate-400 uppercase block font-mono">SIMULATING CUSTOMER</span>
          <span className="text-xs font-bold text-cyan-400 truncate max-w-[170px] block">
            {simCustomer.name}
          </span>
        </div>
      </div>

      {/* SECTION 1: SIMULATOR SLIDERS & REAL-TIME OUTCOME */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>"What-If" Customer Retention Simulator</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  Live Calculator
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Adjust retention levers below to see the simulated churn impact and protected annual revenue.
              </p>
            </div>
          </div>

          {/* Quick Account Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Customer:</span>
            <select
              value={simCustomer.id}
              onChange={(e) => {
                const found = customers.find(c => c.id === e.target.value);
                if (found) handleSelectSimCustomer(found);
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {customers.filter(c => c.riskLevel === 'High').slice(0, 10).map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name} (${c.annualSpend} spend · {Math.round(c.churnProbability * 100)}% Churn)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Slider 1: Days Inactive */}
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-white">
                  {plainEnglishMode ? '1. Re-engage Customer (Days Inactive Reset)' : 'Order Recency Inactivity Days'}
                </label>
                <span className="font-mono text-cyan-300 font-bold">
                  {sliderInactivity === 1 ? 'Today (Active!)' : `${sliderInactivity} days ago`}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={simCustomer.recencyDays}
                value={sliderInactivity}
                onChange={(e) => setSliderInactivity(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>1 day (Recent Order)</span>
                <span>Original: {simCustomer.recencyDays} days</span>
              </div>
            </div>

            {/* Slider 2: Complaint Resolutions */}
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-white">
                  {plainEnglishMode ? '2. Service Recovery & Apology Vouchers' : 'Resolved Complaints & SLA Credits'}
                </label>
                <span className="font-mono text-red-300 font-bold">
                  {sliderComplaintsResolved} complaints credited
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={sliderComplaintsResolved}
                onChange={(e) => setSliderComplaintsResolved(parseInt(e.target.value, 10))}
                className="w-full accent-red-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>0 Credits</span>
                <span>4 Resolved with Direct Refund Credit</span>
              </div>
            </div>

            {/* Slider 3: Personalized Basket Discount */}
            <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-white">
                  {plainEnglishMode ? '3. Personalized Basket Discount Incentive' : 'Targeted Retention Discount %'}
                </label>
                <span className="font-mono text-emerald-300 font-bold">
                  {sliderPromoDiscount}% Off Next Order
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={sliderPromoDiscount}
                onChange={(e) => setSliderPromoDiscount(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>5% Subtle Incentive</span>
                <span>40% High-Impact Comeback Offer</span>
              </div>
            </div>

            {/* Toggle 4: VIP Gold / Pass Upgrade */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div>
                <div className="text-xs font-semibold text-white">
                  4. Upgrade to VIP Gold / Pass (Free Delivery for 90 Days)
                </div>
                <div className="text-[11px] text-slate-400">
                  Guarantees zero delivery fees and locks in weekly recurring grocery/food orders
                </div>
              </div>

              <button
                onClick={() => setVipPassUpgrade(!vipPassUpgrade)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  vipPassUpgrade
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {vipPassUpgrade ? 'VIP Pass Active' : 'Off'}
              </button>
            </div>
          </div>

          {/* Right: Live Churn Speedometer & Rescued Dollars (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
            {simulatedOutcome.isRescued && (
              <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none animate-pulse" />
            )}

            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Simulated Churn Probability
            </span>

            {/* SVG Speedometer */}
            <div className="relative w-44 h-44 my-2 flex items-center justify-center">
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
                  stroke={simulatedOutcome.newChurn < 0.35 ? '#10B981' : simulatedOutcome.newChurn < 0.60 ? '#F59E0B' : '#EF4444'}
                  strokeDasharray={`${simulatedOutcome.newChurn * 100}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-extrabold font-mono tabular-nums ${
                  simulatedOutcome.newChurn < 0.35 ? 'text-emerald-400' : simulatedOutcome.newChurn < 0.60 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {Math.round(simulatedOutcome.newChurn * 100)}%
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  was {Math.round(simulatedOutcome.initialChurn * 100)}%
                </span>
              </div>
            </div>

            <div className="mt-2">
              {simulatedOutcome.isRescued ? (
                <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-bounce">
                  🎉 Customer Rescued from Churn!
                </div>
              ) : simulatedOutcome.newChurn < 0.45 ? (
                <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-medium">
                  Stabilized & Returning
                </div>
              ) : (
                <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium">
                  Progress Made · Needs Stronger Offer
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-900 w-full grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-[10px] text-slate-500 block">HEALTH INDEX</span>
                <span className="text-sm font-bold text-emerald-400">
                  {simulatedOutcome.newHealth} <span className="text-[10px] text-slate-500">/ 100</span>
                </span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-[10px] text-slate-500 block">ANNUAL GMV SAVED</span>
                <span className="text-sm font-bold text-white">
                  ${simulatedOutcome.gmvSaved.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerateAiPlaybook}
              disabled={playbookLoading}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{playbookLoading ? 'Gemini Crafting Message...' : 'Generate AI Outreach Campaign'}</span>
            </button>
          </div>
        </div>

        {/* AI-Generated Playbook */}
        {generatedPlaybook && (
          <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Gemini Generated Retention Recovery Campaign
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  {generatedPlaybook.estimatedRecoveryProbability}
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2">
                <div className="text-slate-400 font-mono text-[11px]">
                  <strong>Subject:</strong> {generatedPlaybook.emailSubject}
                </div>
                <div className="text-slate-200 whitespace-pre-line leading-relaxed text-[11.5px] max-h-48 overflow-y-auto">
                  {generatedPlaybook.emailBody}
                </div>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-2.5">
                <span className="font-semibold text-cyan-300 text-xs block">
                  Prescribed Marketing/CRM Actions:
                </span>
                <ul className="space-y-2">
                  {generatedPlaybook.immediateActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-[11.5px]">
                      <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center shrink-0 font-mono text-[10px]">
                        {i + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: SCATTER PLOT (ANNUAL SPEND vs CHURN RISK) */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Interactive Scatter Plot: Annual Spend vs. Churn Probability</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Top-Right Red Cluster = Highest Spend accounts at imminent churn risk!
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 text-[11px]">Category:</span>
            {['All', 'Quick Commerce & Groceries', 'Food & Dining Delivery', 'Electronics & Gadgets'].map(cat => (
              <button
                key={cat}
                onClick={() => setScatterCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  scatterCategory === cat ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Scatter SVG */}
        <div className="relative bg-[#070A10] rounded-xl border border-slate-800 p-4 aspect-[2.4/1] max-h-[380px] w-full">
          <svg viewBox="0 0 800 320" className="w-full h-full select-none">
            {/* Grid */}
            {[0, 20, 40, 60, 80, 100].map(c => {
              const x = 50 + (c / 100) * 720;
              return (
                <g key={`x-${c}`}>
                  <line x1={x} y1="20" x2={x} y2="280" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <text x={x} y="295" textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="monospace">
                    {c}% Churn
                  </text>
                </g>
              );
            })}

            {[0, 1000, 2500, 4000, 6000].map(spend => {
              const y = 280 - (spend / 6000) * 260;
              return (
                <g key={`y-${spend}`}>
                  <line x1="50" y1={y} x2="770" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <text x="42" y={y + 3} textAnchor="end" fill="#64748B" fontSize="9" fontFamily="monospace">
                    ${spend}
                  </text>
                </g>
              );
            })}

            {/* Danger Zone: Top-Right High Spend + High Churn */}
            <rect x="480" y="20" width="290" height="150" fill="rgba(239,68,68,0.05)" rx="4" />
            <text x="495" y="40" fill="#EF4444" opacity="0.7" fontSize="10" fontFamily="sans-serif" fontWeight="600">
              🚨 Danger Zone (High Spend &gt;$2k + Churn &gt;60%)
            </text>

            {/* Safe Zone: Bottom-Left */}
            <rect x="50" y="150" width="300" height="130" fill="rgba(16,185,129,0.03)" rx="4" />

            {/* Bubbles */}
            {scatterAccounts.map(account => {
              const cx = 50 + account.churnProbability * 720;
              const cy = Math.max(25, 280 - (account.annualSpend / 6000) * 260);
              const r = Math.max(4, Math.min(10, Math.round(account.lifetimeOrders / 12)));
              const isHovered = hoveredScatterPoint?.id === account.id;

              const fillColor = account.riskLevel === 'High'
                ? '#EF4444'
                : account.riskLevel === 'Medium'
                ? '#F59E0B'
                : '#10B981';

              return (
                <circle
                  key={account.id}
                  cx={cx}
                  cy={cy}
                  r={isHovered ? r + 4 : r}
                  fill={fillColor}
                  fillOpacity={isHovered ? '1' : '0.8'}
                  stroke="#FFFFFF"
                  strokeWidth={isHovered ? '2' : '0.5'}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredScatterPoint(account)}
                  onMouseLeave={() => setHoveredScatterPoint(null)}
                  onClick={() => onSelectCustomer(account)}
                />
              );
            })}
          </svg>

          {/* Hover Card */}
          {hoveredScatterPoint && (
            <div
              className="absolute z-30 bg-slate-900/95 border border-slate-700 rounded-xl p-3 shadow-2xl text-xs w-64 pointer-events-none backdrop-blur-md"
              style={{
                left: `${Math.min(75, Math.max(10, hoveredScatterPoint.churnProbability * 100))}%`,
                top: `${Math.min(65, Math.max(15, (1 - hoveredScatterPoint.annualSpend / 6000) * 100))}%`,
                transform: 'translate(-50%, -115%)'
              }}
            >
              <div className="font-bold text-white text-xs truncate">{hoveredScatterPoint.name}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {hoveredScatterPoint.city} · {hoveredScatterPoint.membershipTier}
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-800 flex justify-between font-mono">
                <span className="text-white font-bold">${hoveredScatterPoint.annualSpend.toLocaleString()} Spend</span>
                <span className={hoveredScatterPoint.riskLevel === 'High' ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {Math.round(hoveredScatterPoint.churnProbability * 100)}% Churn
                </span>
              </div>
              <div className="text-[10px] text-cyan-300 mt-1">Click to open Customer 360°</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
