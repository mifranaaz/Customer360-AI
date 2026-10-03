import React, { useState, useMemo } from 'react';
import { CustomerAccount, CustomerSegment } from '../types/customer';
import { 
  Users, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpDown, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  ExternalLink,
  ShieldAlert,
  SlidersHorizontal,
  Download
} from 'lucide-react';

interface RfmMatrixStudioProps {
  customers: CustomerAccount[];
  onSelectCustomer: (customer: CustomerAccount) => void;
  onExportFiltered?: (filtered: CustomerAccount[]) => void;
}

const SEGMENT_COLORS: Record<CustomerSegment, { bg: string; border: string; text: string; accent: string }> = {
  'Champions': { bg: 'bg-emerald-950/40', border: 'border-emerald-700/60', text: 'text-emerald-300', accent: '#10B981' },
  'Loyal Customers': { bg: 'bg-teal-950/40', border: 'border-teal-700/60', text: 'text-teal-300', accent: '#14B8A6' },
  'Potential Loyalists': { bg: 'bg-cyan-950/40', border: 'border-cyan-700/60', text: 'text-cyan-300', accent: '#06B6D4' },
  'Promising': { bg: 'bg-blue-950/40', border: 'border-blue-700/60', text: 'text-blue-300', accent: '#3B82F6' },
  'Need Attention': { bg: 'bg-amber-950/40', border: 'border-amber-700/60', text: 'text-amber-300', accent: '#F59E0B' },
  'At Risk': { bg: 'bg-orange-950/40', border: 'border-orange-700/60', text: 'text-orange-300', accent: '#F97316' },
  "Can't Lose Them": { bg: 'bg-red-950/50', border: 'border-red-700/80', text: 'text-red-300', accent: '#EF4444' },
  'Hibernating': { bg: 'bg-slate-900', border: 'border-slate-800', text: 'text-slate-400', accent: '#64748B' }
};

export const RfmMatrixStudio: React.FC<RfmMatrixStudioProps> = ({
  customers,
  onSelectCustomer,
  onExportFiltered
}) => {
  const [selectedSegment, setSelectedSegment] = useState<CustomerSegment | 'All'>('All');
  const [selectedRfmCell, setSelectedRfmCell] = useState<{ r: number; fm: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'All' | 'Enterprise' | 'Mid-Market' | 'Growth'>('All');
  const [riskFilter, setRiskFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [sortField, setSortField] = useState<keyof CustomerAccount>('arr');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Pre-calculate 5x5 RFM grid cells
  const rfmGrid = useMemo(() => {
    // r from 5 down to 1 (Y-axis), fm from 1 to 5 (X-axis)
    const grid: Record<string, { r: number; fm: number; count: number; totalArr: number; highRiskCount: number; segment: CustomerSegment }> = {};

    for (let r = 1; r <= 5; r++) {
      for (let fm = 1; fm <= 5; fm++) {
        // Representative segment
        let seg: CustomerSegment = 'Hibernating';
        if (r >= 4 && fm >= 4) seg = 'Champions';
        else if (r >= 3 && fm >= 3) seg = 'Loyal Customers';
        else if (r >= 4 && fm <= 3) seg = 'Potential Loyalists';
        else if (r === 3 && fm <= 2) seg = 'Promising';
        else if (r === 2 && fm >= 2 && fm <= 3) seg = 'Need Attention';
        else if (r <= 2 && fm >= 4) seg = "Can't Lose Them";
        else if (r <= 2 && fm >= 2) seg = 'At Risk';

        grid[`${r}_${fm}`] = { r, fm, count: 0, totalArr: 0, highRiskCount: 0, segment: seg };
      }
    }

    customers.forEach(c => {
      const fm = Math.max(1, Math.min(5, Math.round((c.rfmF + c.rfmM) / 2)));
      const key = `${c.rfmR}_${fm}`;
      if (grid[key]) {
        grid[key].count++;
        grid[key].totalArr += c.arr;
        if (c.riskLevel === 'High') {
          grid[key].highRiskCount++;
        }
      }
    });

    return grid;
  }, [customers]);

  // Segment summary stats
  const segmentStats = useMemo(() => {
    const stats: Record<CustomerSegment, { count: number; totalArr: number; avgHealth: number; atRiskArr: number; highRiskCount: number }> = {
      'Champions': { count: 0, totalArr: 0, avgHealth: 0, atRiskArr: 0, highRiskCount: 0 },
      'Loyal Customers': { count: 0, totalArr: 0, avgHealth: 0, atRiskArr: 0, highRiskCount: 0 },
      'Potential Loyalists': { count: 0, totalArr: 0, avgHealth: 0, atRiskArr: 0, highRiskCount: 0 },
      'Promising': { count: 0, totalArr: 0, avgHealth: 0, atRiskArr: 0, highRiskCount: 0 },
      'Need Attention': { count: 0, totalArr: 0, avgHealth: 0, atRiskArr: 0, highRiskCount: 0 },
      'At Risk': { count: 0, totalArr: 0, avgHealth: 0, atRiskArr: 0, highRiskCount: 0 },
      "Can't Lose Them": { count: 0, totalArr: 0, avgHealth: 0, atRiskArr: 0, highRiskCount: 0 },
      'Hibernating': { count: 0, totalArr: 0, avgHealth: 0, atRiskArr: 0, highRiskCount: 0 }
    };

    const healthSums: Record<CustomerSegment, number> = {
      'Champions': 0, 'Loyal Customers': 0, 'Potential Loyalists': 0, 'Promising': 0,
      'Need Attention': 0, 'At Risk': 0, "Can't Lose Them": 0, 'Hibernating': 0
    };

    customers.forEach(c => {
      const s = stats[c.segment];
      s.count++;
      s.totalArr += c.arr;
      healthSums[c.segment] += c.healthScore;
      if (c.riskLevel === 'High') {
        s.atRiskArr += c.arr;
        s.highRiskCount++;
      }
    });

    (Object.keys(stats) as CustomerSegment[]).forEach(seg => {
      if (stats[seg].count > 0) {
        stats[seg].avgHealth = Math.round(healthSums[seg] / stats[seg].count);
      }
    });

    return stats;
  }, [customers]);

  // Filter and sort customer accounts
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      if (selectedSegment !== 'All' && c.segment !== selectedSegment) return false;
      if (selectedRfmCell) {
        const fm = Math.round((c.rfmF + c.rfmM) / 2);
        if (c.rfmR !== selectedRfmCell.r || fm !== selectedRfmCell.fm) return false;
      }
      if (tierFilter !== 'All' && c.tier !== tierFilter) return false;
      if (riskFilter !== 'All' && c.riskLevel !== riskFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesCity = c.city.toLowerCase().includes(q);
        const matchesIndustry = c.industry.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesCity && !matchesIndustry) return false;
      }
      return true;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [customers, selectedSegment, selectedRfmCell, tierFilter, riskFilter, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage]);

  const handleSort = (field: keyof CustomerAccount) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleClearFilters = () => {
    setSelectedSegment('All');
    setSelectedRfmCell(null);
    setSearchQuery('');
    setTierFilter('All');
    setRiskFilter('All');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Deep RFM Segmentation Studio & Behavioral Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            5×5 Recency vs Frequency/Monetary matrix mapped to 8 enterprise behavioral cohorts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onExportFiltered && (
            <button
              onClick={() => onExportFiltered(filteredCustomers)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Cohort ({filteredCustomers.length})</span>
            </button>
          )}

          {(selectedSegment !== 'All' || selectedRfmCell || searchQuery || tierFilter !== 'All' || riskFilter !== 'All') && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-950/60 text-red-300 hover:bg-red-900/60 border border-red-800/60 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Segment Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {(Object.keys(SEGMENT_COLORS) as CustomerSegment[]).map(seg => {
          const stats = segmentStats[seg];
          const isSelected = selectedSegment === seg;
          const colorMeta = SEGMENT_COLORS[seg];

          return (
            <div
              key={seg}
              onClick={() => {
                setSelectedSegment(isSelected ? 'All' : seg);
                setSelectedRfmCell(null);
                setCurrentPage(1);
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-slate-800/90 ring-2 ring-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colorMeta.accent }}></span>
                <span className={`text-[11px] font-semibold truncate ${colorMeta.text}`}>
                  {seg}
                </span>
              </div>

              <div className="text-sm font-bold text-white font-mono tabular-nums">
                {stats.count} <span className="text-[10px] font-normal text-slate-400">accts</span>
              </div>

              <div className="mt-1.5 text-[10px] text-slate-400 font-mono tabular-nums flex items-center justify-between border-t border-slate-800/80 pt-1">
                <span>${(stats.totalArr / 1000000).toFixed(1)}M</span>
                <span className={stats.highRiskCount > 0 ? 'text-red-400 font-bold' : 'text-slate-500'}>
                  {stats.highRiskCount > 0 ? `${stats.highRiskCount} risk` : 'ok'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Studio Area: 5x5 RFM Matrix on Left, Cohort Diagnostics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive 5x5 RFM Heat Matrix (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Interactive 5×5 RFM Grid
              </h3>
              <p className="text-[11px] text-slate-400">
                Select a cell to isolate matching account cohorts
              </p>
            </div>

            {selectedRfmCell && (
              <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                Cell Active: R={selectedRfmCell.r} · FM={selectedRfmCell.fm}
              </span>
            )}
          </div>

          <div className="relative">
            {/* Y-Axis Label: Recency */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] uppercase font-mono tracking-widest text-slate-400 whitespace-nowrap">
              Recency (Days Active) ➔
            </div>

            {/* Matrix Container */}
            <div className="pl-4">
              <div className="grid grid-cols-5 gap-2">
                {[5, 4, 3, 2, 1].map(r => (
                  <React.Fragment key={`row-${r}`}>
                    {[1, 2, 3, 4, 5].map(fm => {
                      const cellKey = `${r}_${fm}`;
                      const cell = rfmGrid[cellKey];
                      const isCellSelected = selectedRfmCell?.r === r && selectedRfmCell?.fm === fm;
                      const segMeta = SEGMENT_COLORS[cell.segment];

                      return (
                        <div
                          key={cellKey}
                          onClick={() => {
                            if (isCellSelected) {
                              setSelectedRfmCell(null);
                            } else {
                              setSelectedRfmCell({ r, fm });
                              setSelectedSegment('All');
                            }
                            setCurrentPage(1);
                          }}
                          className={`relative p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between h-20 ${
                            isCellSelected
                              ? 'ring-2 ring-cyan-400 border-white bg-slate-800 shadow-[0_0_15px_rgba(6,182,212,0.3)] z-10'
                              : `${segMeta.bg} ${segMeta.border} hover:border-slate-500`
                          }`}
                        >
                          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                            <span>R{r}·FM{fm}</span>
                            {cell.highRiskCount > 0 && (
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                            )}
                          </div>

                          <div className="my-0.5">
                            <div className="text-xs font-bold text-white font-mono tabular-nums">
                              {cell.count}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono tabular-nums truncate">
                              ${(cell.totalArr / 1000).toFixed(0)}k
                            </div>
                          </div>

                          <div className={`text-[8.5px] truncate font-medium ${segMeta.text}`}>
                            {cell.segment}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>

              {/* X-Axis Label: Frequency & Monetary */}
              <div className="mt-3 text-center text-[10px] uppercase font-mono tracking-widest text-slate-400">
                Frequency & Monetary Velocity (Spend / Frequency) ➔
              </div>
            </div>
          </div>
        </div>

        {/* Right: Cohort Insights & Strategy Panel (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Retention Strategy & Playbook Guidance</span>
            </h3>

            {selectedSegment === 'Champions' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-200">
                  <span className="font-semibold block text-emerald-300 mb-1">Champions Cohort</span>
                  Highest revenue contributors, regular interaction cadence, and superior health scores.
                </div>
                <div className="text-slate-300 space-y-1.5">
                  <p className="font-semibold text-slate-200 text-xs">Recommended Commercial Playbook:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11.5px]">
                    <li>Early-access programs for upcoming enterprise capabilities.</li>
                    <li>Invite executive leadership to Customer Advisory Board.</li>
                    <li>Leverage as candidate case studies and referral champions.</li>
                  </ul>
                </div>
              </div>
            )}

            {(selectedSegment === 'At Risk' || selectedSegment === "Can't Lose Them") && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200">
                  <span className="font-semibold block text-red-300 mb-1 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Immediate Retention SLA Warning
                  </span>
                  Historically high value accounts showing sharp recency decline and inactive admin seats.
                </div>
                <div className="text-slate-300 space-y-1.5">
                  <p className="font-semibold text-slate-200 text-xs">Prescribed Intervention Workflow:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11.5px]">
                    <li>Direct CRO / Executive Sponsor phone outreach within 24 hours.</li>
                    <li>Technical Account Manager review of open Jira / Zendesk tickets.</li>
                    <li>Deliver custom commercial concession or multi-year bridge terms.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedSegment === 'Potential Loyalists' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
                  <span className="font-semibold block text-cyan-300 mb-1">Potential Loyalists</span>
                  Recent adoption with moderate volume; high expansion potential.
                </div>
                <div className="text-slate-300 space-y-1.5">
                  <p className="font-semibold text-slate-200 text-xs">Growth Playbook:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11.5px]">
                    <li>Offer tailored onboarding workshops for ancillary departments.</li>
                    <li>Introduce tiered volume discount incentives.</li>
                  </ul>
                </div>
              </div>
            )}

            {selectedSegment === 'All' && !selectedRfmCell && (
              <div className="space-y-3 text-xs text-slate-400">
                <p>
                  Customer360 AI Nexus uses non-linear RFM weighting combined with XGBoost churn inference to segment all 4,312 enterprise accounts.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Total Tracked ARR</span>
                    <span className="text-base font-bold text-white font-mono">$48.2M</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">High Risk Exposure</span>
                    <span className="text-base font-bold text-red-400 font-mono">$8.4M</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Mean Health Score</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">74.2 / 100</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">XGBoost ROC-AUC</span>
                    <span className="text-base font-bold text-cyan-400 font-mono">0.9946</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Filtered Pool: {filteredCustomers.length} accounts</span>
            <span className="font-mono text-cyan-300">
              ${(filteredCustomers.reduce((acc, c) => acc + c.arr, 0) / 1000000).toFixed(2)}M ARR
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Customers Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, ID, city, or industry..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Tier Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-500 px-2 text-[11px]">Tier:</span>
              {(['All', 'Enterprise', 'Mid-Market', 'Growth'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => { setTierFilter(tier); setCurrentPage(1); }}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                    tierFilter === tier ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {/* Risk Filter */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-500 px-2 text-[11px]">Risk:</span>
              {(['All', 'High', 'Medium', 'Low'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => { setRiskFilter(risk); setCurrentPage(1); }}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                    riskFilter === risk ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Accounts High-Density Data Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 select-none">
              <tr>
                <th className="py-3 px-3.5 font-medium cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Account Name & Code</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium">Segment</th>
                <th className="py-3 px-3 font-medium cursor-pointer" onClick={() => handleSort('arr')}>
                  <div className="flex items-center gap-1">
                    <span>Annual ARR</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium cursor-pointer" onClick={() => handleSort('healthScore')}>
                  <div className="flex items-center gap-1">
                    <span>Health Index</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium cursor-pointer" onClick={() => handleSort('churnProbability')}>
                  <div className="flex items-center gap-1">
                    <span>Churn Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium cursor-pointer" onClick={() => handleSort('recencyDays')}>
                  <div className="flex items-center gap-1">
                    <span>Recency</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-medium">Primary Risk Factor</th>
                <th className="py-3 px-3.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No customer accounts match your current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((account) => {
                  const segColor = SEGMENT_COLORS[account.segment];
                  return (
                    <tr
                      key={account.id}
                      onClick={() => onSelectCustomer(account)}
                      className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-3.5">
                        <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                          <span>{account.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                          <span>{account.id}</span>
                          <span aria-hidden="true">·</span>
                          <span>{account.city}, {account.country}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-400">{account.tier}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`text-[11px] font-medium ${segColor.text}`}>
                          {account.segment}
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Score {account.rfmScore}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap font-mono tabular-nums font-semibold text-slate-100">
                        ${account.arr.toLocaleString()}
                        <div className="text-[10px] text-slate-400 font-normal">
                          MRR: ${(account.arr / 12).toFixed(0)}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                account.healthScore >= 70 ? 'bg-emerald-400' : account.healthScore >= 45 ? 'bg-amber-400' : 'bg-red-500'
                              }`}
                              style={{ width: `${account.healthScore}%` }}
                            />
                          </div>
                          <span className="font-mono tabular-nums text-slate-200">
                            {account.healthScore}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono tabular-nums">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              account.riskLevel === 'High' ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' : account.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span className={account.riskLevel === 'High' ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                            {Math.round(account.churnProbability * 100)}%
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-300 font-mono tabular-nums">
                        {account.recencyDays}d ago
                      </td>

                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-[200px]" title={account.primaryRiskDriver}>
                        {account.primaryRiskDriver}
                      </td>

                      <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCustomer(account);
                          }}
                          className="px-2.5 py-1 text-[11px] rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors inline-flex items-center gap-1"
                        >
                          <span>Twin</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination & Count Footnote */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <div>
            Showing <span className="font-mono text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-mono text-white">{Math.min(currentPage * pageSize, filteredCustomers.length)}</span> of{' '}
            <span className="font-mono text-white">{filteredCustomers.length}</span> matching accounts
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200"
            >
              Previous
            </button>
            <span className="px-2 font-mono text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
