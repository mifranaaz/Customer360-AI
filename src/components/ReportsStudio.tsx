import React, { useState } from 'react';
import { CustomerAccount, CustomerSegment, Region, RiskLevel } from '../types/customer';
import { CockpitAggregations } from '../data/customerEngine';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckSquare, 
  Square, 
  Calendar, 
  Building2, 
  TrendingDown, 
  ShieldCheck, 
  Filter, 
  Sparkles,
  Layers
} from 'lucide-react';

interface ReportsStudioProps {
  customers: CustomerAccount[];
  aggregations: CockpitAggregations;
  onSelectCustomer: (customer: CustomerAccount) => void;
}

export const ReportsStudio: React.FC<ReportsStudioProps> = ({
  customers,
  aggregations,
  onSelectCustomer
}) => {
  const [reportView, setReportView] = useState<'dossier' | 'exporter'>('dossier');
  const [filterRegion, setFilterRegion] = useState<Region | 'All'>('All');
  const [filterSegment, setFilterSegment] = useState<CustomerSegment | 'All'>('All');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'All'>('All');
  const [includeShap, setIncludeShap] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Filtered dataset for export
  const exportPool = customers.filter(c => {
    if (filterRegion !== 'All' && c.region !== filterRegion) return false;
    if (filterSegment !== 'All' && c.segment !== filterSegment) return false;
    if (filterRisk !== 'All' && c.riskLevel !== filterRisk) return false;
    return true;
  });

  // Client-side instant CSV export
  const handleExportCsv = () => {
    setExporting(true);
    setTimeout(() => {
      const headers = [
        'Account ID',
        'Company Name',
        'Account Code',
        'Domain',
        'Region',
        'Country',
        'City',
        'Tier',
        'Industry',
        'ARR ($)',
        'MRR ($)',
        'Recency (Days)',
        'Frequency',
        'Monetary Spend ($)',
        'RFM Score',
        'Segment',
        'Health Score',
        'XGBoost Churn Risk (%)',
        'Risk Level',
        'CS Owner',
        'Last Login Date',
        'Primary Risk Driver',
        'Retention Recommendation'
      ];

      const rows = exportPool.map(c => [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        c.code,
        c.domain,
        c.region,
        c.country,
        c.city,
        c.tier,
        `"${c.industry.replace(/"/g, '""')}"`,
        c.arr,
        c.mrr,
        c.recencyDays,
        c.frequency,
        c.monetary,
        c.rfmScore,
        c.segment,
        c.healthScore,
        (c.churnProbability * 100).toFixed(1),
        c.riskLevel,
        c.csOwner,
        c.lastLogin,
        `"${c.primaryRiskDriver.replace(/"/g, '""')}"`,
        `"${c.retentionRecommendation.replace(/"/g, '""')}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Customer360_Nexus_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    }, 400);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  // Top 10 critical at risk accounts for dossier
  const topCriticalRiskAccounts = customers
    .filter(c => c.riskLevel === 'High')
    .sort((a, b) => b.arr - a.arr)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar (hidden during print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800 no-print">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Executive Reports Studio & Structured Exporter</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate board-ready executive intelligence dossiers or export structured customer datasets
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setReportView('dossier')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                reportView === 'dossier' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Dossier (PDF View)
            </button>
            <button
              onClick={() => setReportView('exporter')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                reportView === 'exporter' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Data Exporter & CSV
            </button>
          </div>

          {reportView === 'dossier' ? (
            <button
              onClick={handlePrintDossier}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          ) : (
            <button
              onClick={handleExportCsv}
              disabled={exporting}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exporting ? 'Generating...' : `Export ${exportPool.length} Rows (CSV)`}</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: EXECUTIVE DOSSIER (Printable & Screen-Optimized) */}
      {reportView === 'dossier' && (
        <div className="bg-[#0B0F17] print:bg-white print:text-black rounded-2xl border border-slate-800 print:border-none p-8 max-w-5xl mx-auto shadow-2xl space-y-8">
          {/* Header Lockup */}
          <div className="border-b border-slate-800 print:border-slate-300 pb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
                <span className="text-sm font-semibold tracking-wider uppercase text-cyan-400 print:text-slate-700 font-mono">
                  CUSTOMER360 AI NEXUS INTELLIGENCE BRIEF
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white print:text-black tracking-tight">
                Enterprise Customer Health & Revenue Exposure Dossier
              </h1>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                Generated October 2026 · Machine Learning Model Version 2.4 (XGBoost + SHAP Explainability)
              </p>
            </div>

            <div className="text-right text-xs font-mono text-slate-400 print:text-slate-600 space-y-1">
              <div>CONFIDENTIALITY: RESTRICTED</div>
              <div>ACCOUNTS AUDITED: 4,312</div>
              <div>ACCURACY: 95.37% · AUC: 0.9946</div>
            </div>
          </div>

          {/* Executive Narrative */}
          <div className="p-4 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs leading-relaxed space-y-2">
            <h3 className="font-semibold text-slate-200 print:text-slate-900 text-sm">
              Executive Summary & Operational Posture
            </h3>
            <p className="text-slate-300 print:text-slate-700">
              Customer360 AI Nexus currently monitors <strong>4,312 enterprise customer accounts</strong> representing{' '}
              <strong>${(aggregations.totalArr / 1000000).toFixed(2)}M in aggregate Annual Recurring Revenue</strong>.
              Of this footprint, <strong>${(aggregations.atRiskArr / 1000000).toFixed(2)}M ({((aggregations.atRiskArr / aggregations.totalArr) * 100).toFixed(1)}%)</strong> is 
              classified in the High Churn Risk tier under calibrated XGBoost scoring. The average account health score across all territories stands at{' '}
              <strong>{aggregations.avgHealthScore} / 100</strong>.
            </p>
            <p className="text-slate-400 print:text-slate-600">
              Key churn accelerations are driven by recency inactivity gaps exceeding 45 days, unresolved tier-1 support tickets, and contracted product adoption stalls. Immediate priority is allocated to the top 10 accounts listed below under strict retention SLA covenants.
            </p>
          </div>

          {/* Key Metric Scorecard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <span className="text-[11px] font-mono text-slate-400 print:text-slate-600 uppercase block">Total Managed ARR</span>
              <span className="text-2xl font-bold font-mono text-white print:text-black">
                ${(aggregations.totalArr / 1000000).toFixed(2)}M
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Across 4,312 accounts</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 print:bg-slate-50 border border-red-950/80 print:border-red-300">
              <span className="text-[11px] font-mono text-red-400 print:text-red-700 uppercase block">High-Risk ARR Exposure</span>
              <span className="text-2xl font-bold font-mono text-red-400 print:text-red-600">
                ${(aggregations.atRiskArr / 1000000).toFixed(2)}M
              </span>
              <span className="text-[10px] text-red-400/80 block mt-1">{aggregations.atRiskAccountsCount} accounts requiring SLA action</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <span className="text-[11px] font-mono text-slate-400 print:text-slate-600 uppercase block">Mean Health Score</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 print:text-emerald-700">
                {aggregations.avgHealthScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">RFM + Activity Weighted</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 print:bg-slate-50 border border-slate-800 print:border-slate-200">
              <span className="text-[11px] font-mono text-slate-400 print:text-slate-600 uppercase block">Model Verification</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 print:text-blue-700">
                95.4%
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">ROC-AUC: 0.9946 · F1: 93.9%</span>
            </div>
          </div>

          {/* Regional Risk Exposure Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 print:text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>1. Regional Territory Exposure Breakdown</span>
            </h3>

            <div className="overflow-x-auto border border-slate-800 print:border-slate-300 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 print:bg-slate-100 text-slate-400 print:text-slate-700 border-b border-slate-800 print:border-slate-300 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Territory</th>
                    <th className="py-2.5 px-3">Accounts</th>
                    <th className="py-2.5 px-3">Total ARR</th>
                    <th className="py-2.5 px-3">High-Risk Exposure</th>
                    <th className="py-2.5 px-3">% At Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-slate-200 font-mono tabular-nums">
                  {(['North America', 'EMEA', 'APAC', 'LATAM'] as Region[]).map(reg => {
                    const r = aggregations.regionBreakdown[reg];
                    const pctRisk = r.arr ? ((r.atRiskArr / r.arr) * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={reg} className="hover:bg-slate-900/40 print:hover:bg-transparent">
                        <td className="py-2 px-3 font-sans font-medium text-white print:text-black">{reg}</td>
                        <td className="py-2 px-3 text-slate-300 print:text-slate-700">{r.count}</td>
                        <td className="py-2 px-3 text-slate-100 print:text-black font-semibold">${(r.arr / 1000000).toFixed(2)}M</td>
                        <td className="py-2 px-3 text-red-400 print:text-red-700 font-semibold">${(r.atRiskArr / 1000).toFixed(0)}k</td>
                        <td className="py-2 px-3 text-slate-300 print:text-slate-700">{pctRisk}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 10 High-Risk Enterprise Accounts Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 print:text-slate-800 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span>2. High-Impact Retention Target Accounts (Immediate SLA Focus)</span>
            </h3>

            <div className="overflow-x-auto border border-slate-800 print:border-slate-300 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 print:bg-slate-100 text-slate-400 print:text-slate-700 border-b border-slate-800 print:border-slate-300 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Account Name</th>
                    <th className="py-2.5 px-3">Segment</th>
                    <th className="py-2.5 px-3">ARR ($)</th>
                    <th className="py-2.5 px-3">Churn Risk</th>
                    <th className="py-2.5 px-3">Health</th>
                    <th className="py-2.5 px-3">Primary Risk Driver</th>
                    <th className="py-2.5 px-3">Recommended Playbook</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 print:divide-slate-200">
                  {topCriticalRiskAccounts.map((account) => (
                    <tr
                      key={account.id}
                      onClick={() => onSelectCustomer(account)}
                      className="hover:bg-slate-900/40 print:hover:bg-transparent cursor-pointer"
                    >
                      <td className="py-2 px-3 font-semibold text-white print:text-black">
                        <div>{account.name}</div>
                        <div className="text-[10px] text-slate-400 print:text-slate-600 font-mono">
                          {account.id} · {account.city}, {account.country}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-amber-300 print:text-amber-800 font-medium whitespace-nowrap">
                        {account.segment}
                      </td>
                      <td className="py-2 px-3 font-mono tabular-nums font-semibold text-slate-100 print:text-black whitespace-nowrap">
                        ${account.arr.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 font-mono tabular-nums text-red-400 print:text-red-700 font-semibold whitespace-nowrap">
                        {Math.round(account.churnProbability * 100)}%
                      </td>
                      <td className="py-2 px-3 font-mono tabular-nums text-slate-300 print:text-slate-800 whitespace-nowrap">
                        {account.healthScore} / 100
                      </td>
                      <td className="py-2 px-3 text-slate-400 print:text-slate-600 text-[11px] max-w-[180px] truncate" title={account.primaryRiskDriver}>
                        {account.primaryRiskDriver}
                      </td>
                      <td className="py-2 px-3 text-cyan-300 print:text-blue-800 text-[11px]">
                        {account.retentionRecommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signoff / Governance Footer */}
          <div className="border-t border-slate-800 print:border-slate-300 pt-6 text-[11px] text-slate-500 print:text-slate-600 flex items-center justify-between font-mono">
            <div>
              REPORT AUDIT HASH: NEX-706112238281-2026
            </div>
            <div>
              AUTHORIZED BY: REVENUE INTELLIGENCE COUNCIL
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: STRUCTURED DATA EXPORTER (CSV / EXCEL) */}
      {reportView === 'exporter' && (
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Granular Customer Dataset Exporter</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select specific filters and export all 4,312 customer records with RFM coordinates, health scores, and SHAP drivers.
            </p>
          </div>

          {/* Filter Matrix for Export */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Territory / Region
              </label>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value as Region | 'All')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Territories (Global)</option>
                <option value="North America">North America</option>
                <option value="EMEA">EMEA (Europe, Middle East, Africa)</option>
                <option value="APAC">APAC (Asia-Pacific)</option>
                <option value="LATAM">LATAM (Latin America)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                RFM Behavioral Segment
              </label>
              <select
                value={filterSegment}
                onChange={(e) => setFilterSegment(e.target.value as CustomerSegment | 'All')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Segments</option>
                <option value="Champions">Champions</option>
                <option value="Loyal Customers">Loyal Customers</option>
                <option value="Potential Loyalists">Potential Loyalists</option>
                <option value="Promising">Promising</option>
                <option value="Need Attention">Need Attention</option>
                <option value="At Risk">At Risk</option>
                <option value="Can't Lose Them">Can't Lose Them</option>
                <option value="Hibernating">Hibernating</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Churn Risk Classification
              </label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as RiskLevel | 'All')}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Risk Tiers</option>
                <option value="High">High Churn Risk Only (&gt;65%)</option>
                <option value="Medium">Medium Churn Risk (35-65%)</option>
                <option value="Low">Low Risk / Healthy (&lt;35%)</option>
              </select>
            </div>
          </div>

          {/* Export Summary Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">Target Records for Generation:</div>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {exportPool.length} of 4,312 Accounts
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Total Filtered ARR: ${(exportPool.reduce((acc, c) => acc + c.arr, 0) / 1000000).toFixed(2)}M
              </div>
            </div>

            <button
              onClick={handleExportCsv}
              disabled={exporting}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Processing Export...' : 'Download CSV Spreadsheet'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
