import React from 'react';
import { CustomerAccount, CommerceCategory, MembershipTier, BusinessImpactMetrics } from '../types/customer';
import { 
  DollarSign, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  Sparkles, 
  ShieldAlert, 
  ArrowUpRight, 
  CheckCircle2, 
  BarChart3, 
  Info,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface ExecutiveCockpitProps {
  metrics: BusinessImpactMetrics;
  topRiskAccounts: CustomerAccount[];
  onSelectCustomer: (customer: CustomerAccount) => void;
  onNavigateTab: (tab: any) => void;
}

export const ExecutiveCockpit: React.FC<ExecutiveCockpitProps> = ({
  metrics,
  topRiskAccounts,
  onSelectCustomer,
  onNavigateTab
}) => {
  const categoryList: CommerceCategory[] = [
    'Quick Commerce & Groceries',
    'Food & Dining Delivery',
    'Daily Essentials & Home',
    'Electronics & Gadgets',
    'Fashion & Apparel'
  ];

  return (
    <div className="space-y-6">
      {/* Required Transparency Demo Data Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-white font-medium">Enterprise Demo Dataset:</strong> Synthesized retail & quick-commerce benchmark (4,312 customers). Modeled after high-frequency ordering, 10-minute grocery, and delivery patterns for evaluation.
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800 whitespace-nowrap">
          Demo Benchmark Mode
        </span>
      </div>

      {/* Business Impact Scorecard: Customers at Risk, Revenue at Risk, Potential Retention Opportunities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Customers & Annual GMV */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Tracked Customers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-white tabular-nums">
              {metrics.totalCustomers.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Annual GMV: ${(metrics.totalAnnualGMV / 1000000).toFixed(2)}M
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-1 font-mono">
            Avg Spend / Customer: ${(metrics.totalAnnualGMV / metrics.totalCustomers).toFixed(0)}
          </div>
        </div>

        {/* Customers at Churn Risk */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-red-950/80 flex flex-col justify-between shadow-[0_0_15px_rgba(239,68,68,0.08)]">
          <div className="flex items-center justify-between text-xs text-red-400">
            <span>High Churn Risk Customers</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-red-400 tabular-nums">
              {metrics.highRiskCustomerCount.toLocaleString()} <span className="text-xs font-normal text-slate-400">accounts</span>
            </div>
            <div className="text-xs text-red-400/80 mt-0.5 font-mono">
              {((metrics.highRiskCustomerCount / metrics.totalCustomers) * 100).toFixed(1)}% of user base
            </div>
          </div>
          <div className="text-[10px] text-red-400/60 border-t border-red-950 pt-1 font-mono">
            Requires active retention outreach
          </div>
        </div>

        {/* Revenue at Risk (GMV Exposure) */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-red-950/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-red-400">
            <span>Annual Revenue at Risk</span>
            <DollarSign className="w-4 h-4 text-red-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-red-400 tabular-nums">
              ${(metrics.highRiskGmvExposure / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              {((metrics.highRiskGmvExposure / metrics.totalAnnualGMV) * 100).toFixed(1)}% of total platform GMV
            </div>
          </div>
          <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-1 font-mono">
            Annual spend from churning cohort
          </div>
        </div>

        {/* Potential Retention Opportunity */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-950/80 flex flex-col justify-between shadow-[0_0_15px_rgba(16,185,129,0.08)]">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>Potential Recoverable Value</span>
            <HeartHandshake className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              ${(metrics.potentialRecoverableGmv / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-emerald-300/80 mt-0.5">
              Based on ~74% AI retention win rate
            </div>
          </div>
          <div className="text-[10px] text-emerald-400/60 border-t border-emerald-950 pt-1 font-mono">
            Via personalized discounts & recovery
          </div>
        </div>
      </div>

      {/* Category Breakdown & Churn Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Churn Risk Exposure (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>Sector Churn Risk Exposure Breakdown</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Quick commerce, food delivery, and retail vertical distribution
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('rfm')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Explore Segments</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {categoryList.map(cat => {
              const data = metrics.categoryBreakdown[cat] || { count: 0, spend: 0, atRiskCount: 0 };
              const riskRate = data.count ? Math.round((data.atRiskCount / data.count) * 100) : 0;
              return (
                <div key={cat} className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{cat}</span>
                    <div className="flex items-center gap-3 font-mono tabular-nums text-slate-300">
                      <span>${(data.spend / 1000).toFixed(0)}k spend</span>
                      <span className={riskRate > 15 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                        {data.atRiskCount} at risk ({riskRate}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-l"
                      style={{ width: `${100 - riskRate}%` }}
                    />
                    <div
                      className="bg-red-500 h-full rounded-r"
                      style={{ width: `${riskRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Membership Tier Loyalty Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Membership Tier Retention Health</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">Loyalty Passes</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
              VIP Pass and Prime members have 3.2x higher lifetime order volume.
            </p>

            <div className="space-y-3">
              {(['VIP Gold / Pass', 'Prime Member', 'Select Member', 'Standard'] as MembershipTier[]).map(tier => {
                const data = metrics.tierBreakdown[tier] || { count: 0, spend: 0, atRiskCount: 0 };
                const pctOfTotal = Math.round((data.spend / (metrics.totalAnnualGMV || 1)) * 100);

                return (
                  <div key={tier} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-200">{tier}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {data.count} customers · {data.atRiskCount} at risk
                      </div>
                    </div>

                    <div className="text-right font-mono tabular-nums">
                      <div className="font-bold text-white">${(data.spend / 1000).toFixed(0)}k</div>
                      <div className="text-[10px] text-cyan-400">{pctOfTotal}% of GMV</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>VIP Pass Churn Rate: ~6.2%</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              High Loyalty Stickiness
            </span>
          </div>
        </div>
      </div>

      {/* High-Risk Customers Requiring Urgent Retention Interventions */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Priority High-Risk Customers & AI Prescribed Actions</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Customers showing high churn risk with their explicit churn reason and recommended recovery offer
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('360')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>Open Customer 360</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {topRiskAccounts.slice(0, 6).map(customer => (
            <div
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="p-4 rounded-xl bg-slate-950/80 border border-red-950/80 hover:border-red-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-slate-400 text-[11px]">{customer.id}</span>
                  <span className="text-red-400 font-mono font-bold text-[11px]">
                    {Math.round(customer.churnProbability * 100)}% Churn Risk
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs group-hover:text-cyan-400 transition-colors">
                  {customer.name}
                </h4>

                <div className="text-[11px] text-slate-400 mt-0.5">
                  {customer.city} · {customer.preferredCategory}
                </div>

                {/* Explicit Reason "WHY" */}
                <div className="mt-2 text-[11px] text-red-300/90 bg-red-950/30 p-2 rounded border border-red-900/40 line-clamp-2">
                  <strong>Why at risk:</strong> {customer.primaryRiskReason}
                </div>
              </div>

              {/* Recommended Action & Offer */}
              <div className="pt-2 border-t border-slate-900 text-xs">
                <span className="text-[10px] text-emerald-400 font-mono uppercase block font-semibold">
                  AI Recommended Offer:
                </span>
                <span className="text-slate-200 text-[11.5px] truncate block font-medium">
                  {customer.incentiveOffer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
