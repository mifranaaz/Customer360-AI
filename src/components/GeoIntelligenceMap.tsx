import React, { useState } from 'react';
import { CustomerAccount, Region } from '../types/customer';
import { Globe, MapPin, Building2, TrendingDown, ArrowUpRight, DollarSign } from 'lucide-react';

interface GeoIntelligenceMapProps {
  customers: CustomerAccount[];
  selectedRegion: Region | 'All';
  onSelectRegion: (region: Region | 'All') => void;
  onSelectCustomer: (customer: CustomerAccount) => void;
}

interface HubCity {
  name: string;
  country: string;
  region: Region;
  x: number; // SVG coordinates (0-1000)
  y: number; // SVG coordinates (0-500)
}

const HUB_CITIES: HubCity[] = [
  { name: 'San Francisco', country: 'United States', region: 'North America', x: 170, y: 195 },
  { name: 'New York', country: 'United States', region: 'North America', x: 285, y: 185 },
  { name: 'Austin', country: 'United States', region: 'North America', x: 235, y: 225 },
  { name: 'Seattle', country: 'United States', region: 'North America', x: 185, y: 155 },
  { name: 'Toronto', country: 'Canada', region: 'North America', x: 275, y: 165 },
  { name: 'London', country: 'United Kingdom', region: 'EMEA', x: 495, y: 150 },
  { name: 'Berlin', country: 'Germany', region: 'EMEA', x: 535, y: 145 },
  { name: 'Paris', country: 'France', region: 'EMEA', x: 505, y: 170 },
  { name: 'Amsterdam', country: 'Netherlands', region: 'EMEA', x: 518, y: 153 },
  { name: 'Zurich', country: 'Switzerland', region: 'EMEA', x: 525, y: 175 },
  { name: 'Tokyo', country: 'Japan', region: 'APAC', x: 865, y: 200 },
  { name: 'Singapore', country: 'Singapore', region: 'APAC', x: 775, y: 310 },
  { name: 'Sydney', country: 'Australia', region: 'APAC', x: 890, y: 410 },
  { name: 'Bengaluru', country: 'India', region: 'APAC', x: 710, y: 265 },
  { name: 'São Paulo', country: 'Brazil', region: 'LATAM', x: 360, y: 380 },
  { name: 'Mexico City', country: 'Mexico', region: 'LATAM', x: 215, y: 250 },
  { name: 'Buenos Aires', country: 'Argentina', region: 'LATAM', x: 335, y: 430 }
];

export const GeoIntelligenceMap: React.FC<GeoIntelligenceMapProps> = ({
  customers,
  selectedRegion,
  onSelectRegion,
  onSelectCustomer
}) => {
  const [hoveredHub, setHoveredHub] = useState<HubCity | null>(null);
  const [metricView, setMetricView] = useState<'exposure' | 'accounts' | 'health'>('exposure');

  // Compute hub-specific live real metrics
  const hubStats = React.useMemo(() => {
    const stats: Record<string, { count: number; totalArr: number; atRiskArr: number; avgHealth: number; topAccount?: CustomerAccount }> = {};
    
    HUB_CITIES.forEach(hub => {
      const cityCusts = customers.filter(c => c.city.toLowerCase() === hub.name.toLowerCase());
      const count = cityCusts.length;
      const totalArr = cityCusts.reduce((acc, c) => acc + c.arr, 0);
      const atRiskArr = cityCusts.filter(c => c.riskLevel === 'High').reduce((acc, c) => acc + c.arr, 0);
      const avgHealth = count ? Math.round(cityCusts.reduce((acc, c) => acc + c.healthScore, 0) / count) : 0;
      const topAccount = cityCusts.sort((a, b) => b.arr - a.arr)[0];

      stats[hub.name] = { count, totalArr, atRiskArr, avgHealth, topAccount };
    });
    return stats;
  }, [customers]);

  // Regional summaries
  const regionTotals = React.useMemo(() => {
    const res: Record<Region, { count: number; arr: number; atRiskArr: number; avgHealth: number }> = {
      'North America': { count: 0, arr: 0, atRiskArr: 0, avgHealth: 0 },
      'EMEA': { count: 0, arr: 0, atRiskArr: 0, avgHealth: 0 },
      'APAC': { count: 0, arr: 0, atRiskArr: 0, avgHealth: 0 },
      'LATAM': { count: 0, arr: 0, atRiskArr: 0, avgHealth: 0 }
    };

    const healthSums: Record<Region, number> = { 'North America': 0, 'EMEA': 0, 'APAC': 0, 'LATAM': 0 };

    customers.forEach(c => {
      res[c.region].count++;
      res[c.region].arr += c.arr;
      healthSums[c.region] += c.healthScore;
      if (c.riskLevel === 'High') {
        res[c.region].atRiskArr += c.arr;
      }
    });

    (Object.keys(res) as Region[]).forEach(reg => {
      res[reg].avgHealth = res[reg].count ? Math.round(healthSums[reg] / res[reg].count) : 0;
    });

    return res;
  }, [customers]);

  const activeHubs = selectedRegion === 'All' 
    ? HUB_CITIES 
    : HUB_CITIES.filter(h => h.region === selectedRegion);

  // Top at-risk accounts in currently selected view
  const topRegionalRisks = React.useMemo(() => {
    const list = selectedRegion === 'All' 
      ? customers 
      : customers.filter(c => c.region === selectedRegion);
    return list
      .filter(c => c.riskLevel === 'High')
      .sort((a, b) => b.arr - a.arr)
      .slice(0, 5);
  }, [customers, selectedRegion]);

  return (
    <div className="space-y-6">
      {/* Header with region filters & metric view selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Geo Intelligence & Global Risk Topography</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Geographic clustering across 4,312 customer accounts · Interactive territory filtering
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Metric toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setMetricView('exposure')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                metricView === 'exposure' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Risk Exposure ($)
            </button>
            <button
              onClick={() => setMetricView('accounts')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                metricView === 'accounts' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Account Density
            </button>
            <button
              onClick={() => setMetricView('health')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                metricView === 'health' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Health Index
            </button>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['All', 'North America', 'EMEA', 'APAC', 'LATAM'] as const).map(reg => (
              <button
                key={reg}
                onClick={() => onSelectRegion(reg)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedRegion === reg
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Regional Quick Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {(['North America', 'EMEA', 'APAC', 'LATAM'] as Region[]).map(reg => {
          const isSelected = selectedRegion === reg || selectedRegion === 'All';
          const rData = regionTotals[reg];
          return (
            <div
              key={reg}
              onClick={() => onSelectRegion(selectedRegion === reg ? 'All' : reg)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-slate-900 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
              } ${!isSelected ? 'opacity-50' : 'opacity-100'}`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">{reg}</span>
                <span className="font-mono tabular-nums text-slate-400">{rData.count} accounts</span>
              </div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                ${(rData.arr / 1000000).toFixed(2)}M <span className="text-xs font-normal text-slate-400">ARR</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800">
                <span className="text-red-400 font-mono tabular-nums">
                  ${(rData.atRiskArr / 1000).toFixed(0)}k at risk
                </span>
                <span className={`font-mono tabular-nums ${rData.avgHealth >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {rData.avgHealth} avg health
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aesthetic World Vector Projection SVG */}
      <div className="relative bg-[#070A10] rounded-2xl border border-slate-800/80 p-4 overflow-hidden shadow-2xl">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full aspect-[2/1] max-h-[520px] relative">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full select-none"
            style={{ filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.05))' }}
          >
            <defs>
              {/* Grid pattern */}
              <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
              </pattern>

              {/* Marker glow filters */}
              <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Grid */}
            <rect width="1000" height="500" fill="url(#geo-grid)" />

            {/* World Landmass Silhouettes (Accurate stylized vector paths) */}
            {/* North America */}
            <path
              d="M 120,80 L 260,70 L 320,110 L 330,160 L 290,190 L 260,240 L 210,260 L 190,290 L 170,260 L 140,210 L 110,150 Z"
              fill={selectedRegion === 'North America' || selectedRegion === 'All' ? '#172234' : '#0F1722'}
              stroke="#1E2E48"
              strokeWidth="1.2"
              className="transition-colors duration-300"
            />
            {/* Greenland */}
            <path
              d="M 340,40 L 400,35 L 390,75 L 350,85 Z"
              fill="#101926"
              stroke="#1E2E48"
              strokeWidth="0.8"
            />
            {/* South America */}
            <path
              d="M 230,270 L 280,280 L 370,320 L 390,390 L 350,470 L 310,480 L 290,380 L 250,320 Z"
              fill={selectedRegion === 'LATAM' || selectedRegion === 'All' ? '#172234' : '#0F1722'}
              stroke="#1E2E48"
              strokeWidth="1.2"
              className="transition-colors duration-300"
            />
            {/* Europe */}
            <path
              d="M 470,110 L 560,95 L 610,135 L 580,185 L 530,195 L 480,180 L 470,140 Z"
              fill={selectedRegion === 'EMEA' || selectedRegion === 'All' ? '#172234' : '#0F1722'}
              stroke="#1E2E48"
              strokeWidth="1.2"
              className="transition-colors duration-300"
            />
            {/* UK & Ireland */}
            <path
              d="M 480,135 L 498,130 L 495,160 L 485,155 Z"
              fill={selectedRegion === 'EMEA' || selectedRegion === 'All' ? '#1D2B42' : '#0F1722'}
              stroke="#243756"
              strokeWidth="1"
            />
            {/* Africa */}
            <path
              d="M 465,200 L 580,195 L 630,270 L 600,380 L 540,430 L 480,360 L 460,250 Z"
              fill={selectedRegion === 'EMEA' || selectedRegion === 'All' ? '#141D2B' : '#0F1722'}
              stroke="#1E2E48"
              strokeWidth="1.2"
              className="transition-colors duration-300"
            />
            {/* Asia Mainland */}
            <path
              d="M 580,90 L 800,80 L 920,130 L 880,230 L 790,260 L 730,310 L 680,270 L 620,210 Z"
              fill={selectedRegion === 'APAC' || selectedRegion === 'All' ? '#172234' : '#0F1722'}
              stroke="#1E2E48"
              strokeWidth="1.2"
              className="transition-colors duration-300"
            />
            {/* Japan */}
            <path
              d="M 855,180 L 880,185 L 865,225 L 850,215 Z"
              fill={selectedRegion === 'APAC' || selectedRegion === 'All' ? '#203049' : '#0F1722'}
              stroke="#294063"
              strokeWidth="1"
            />
            {/* Southeast Asia Islands */}
            <path
              d="M 750,300 L 810,310 L 790,340 L 740,320 Z"
              fill={selectedRegion === 'APAC' || selectedRegion === 'All' ? '#172234' : '#0F1722'}
              stroke="#1E2E48"
              strokeWidth="0.8"
            />
            {/* Australia */}
            <path
              d="M 810,360 L 920,360 L 910,450 L 820,440 Z"
              fill={selectedRegion === 'APAC' || selectedRegion === 'All' ? '#172234' : '#0F1722'}
              stroke="#1E2E48"
              strokeWidth="1.2"
              className="transition-colors duration-300"
            />
            {/* New Zealand */}
            <path
              d="M 940,430 L 955,435 L 945,465 Z"
              fill="#121B27"
              stroke="#1E2E48"
              strokeWidth="0.8"
            />

            {/* Flight/Traffic Arcs connecting key financial capitals */}
            <g opacity="0.35" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1" fill="none" strokeDasharray="4 6">
              <path d="M 170,195 Q 330,120 495,150" /> {/* SF to London */}
              <path d="M 285,185 Q 390,130 505,170" /> {/* NY to Paris */}
              <path d="M 495,150 Q 640,160 865,200" /> {/* London to Tokyo */}
              <path d="M 865,200 Q 820,260 775,310" /> {/* Tokyo to Singapore */}
              <path d="M 775,310 Q 840,360 890,410" /> {/* Singapore to Sydney */}
              <path d="M 285,185 Q 320,290 360,380" /> {/* NY to Sao Paulo */}
            </g>

            {/* Interactive Hub Pins */}
            {activeHubs.map(hub => {
              const stats = hubStats[hub.name] || { count: 0, totalArr: 0, atRiskArr: 0, avgHealth: 50 };
              const isHovered = hoveredHub?.name === hub.name;

              // Radius and color calculated from selected metric
              let markerColor = '#06B6D4'; // default cyan
              let markerFilter = 'url(#glow-cyan)';
              let radius = 5;

              if (metricView === 'exposure') {
                if (stats.atRiskArr > 200000) {
                  markerColor = '#EF4444';
                  markerFilter = 'url(#glow-red)';
                  radius = 7;
                } else if (stats.atRiskArr > 80000) {
                  markerColor = '#F59E0B';
                  radius = 6;
                } else {
                  markerColor = '#10B981';
                  radius = 5;
                }
              } else if (metricView === 'accounts') {
                radius = Math.max(4, Math.min(9, Math.round(stats.count / 35)));
                markerColor = '#38BDF8';
              } else {
                markerColor = stats.avgHealth >= 75 ? '#10B981' : stats.avgHealth >= 55 ? '#F59E0B' : '#EF4444';
                radius = 5.5;
              }

              return (
                <g
                  key={hub.name}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredHub(hub)}
                  onMouseLeave={() => setHoveredHub(null)}
                  onClick={() => {
                    if (stats.topAccount) {
                      onSelectCustomer(stats.topAccount);
                    }
                  }}
                >
                  {/* Pulsing ring for high-risk or hovered pins */}
                  {(isHovered || (metricView === 'exposure' && stats.atRiskArr > 150000)) && (
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={radius + 6}
                      fill="none"
                      stroke={markerColor}
                      strokeWidth="1.5"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Core marker circle */}
                  <circle
                    cx={hub.x}
                    cy={hub.y}
                    r={isHovered ? radius + 3 : radius}
                    fill={markerColor}
                    filter={markerFilter}
                    stroke="#FFFFFF"
                    strokeWidth={isHovered ? '2' : '1'}
                  />

                  {/* City Label */}
                  <text
                    x={hub.x}
                    y={hub.y - 10}
                    textAnchor="middle"
                    fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                    fontSize={isHovered ? '11' : '9.5'}
                    fontWeight={isHovered ? '600' : '400'}
                    className="pointer-events-none select-none transition-all"
                  >
                    {hub.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Hover Tooltip Card */}
          {hoveredHub && hubStats[hoveredHub.name] && (
            <div
              className="absolute pointer-events-none z-30 bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs w-64 backdrop-blur-md transition-all"
              style={{
                left: `${Math.min(75, Math.max(10, (hoveredHub.x / 1000) * 100))}%`,
                top: `${Math.min(70, Math.max(10, (hoveredHub.y / 500) * 100))}%`,
                transform: 'translate(-50%, -115%)'
              }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {hoveredHub.name}
                </span>
                <span className="text-[10px] text-slate-400">{hoveredHub.country}</span>
              </div>

              <div className="space-y-1.5 font-mono tabular-nums">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">Active Accounts:</span>
                  <span>{hubStats[hoveredHub.name].count}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">Total Managed ARR:</span>
                  <span>${(hubStats[hoveredHub.name].totalArr / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span className="text-slate-400 font-sans">High-Risk ARR Exposure:</span>
                  <span>${(hubStats[hoveredHub.name].atRiskArr / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span className="text-slate-400 font-sans">Avg Health Index:</span>
                  <span>{hubStats[hoveredHub.name].avgHealth} / 100</span>
                </div>
              </div>

              {hubStats[hoveredHub.name].topAccount && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-cyan-300">
                  <span className="truncate max-w-[140px] font-sans">
                    {hubStats[hoveredHub.name].topAccount?.name}
                  </span>
                  <span className="flex items-center gap-0.5">
                    Inspect <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom map legend & projection notes */}
        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]"></span>
              <span>High Churn Risk Area (&gt;$200k ARR)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>Moderate Risk Cluster</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Nominal Health Territory</span>
            </span>
          </div>

          <div className="text-slate-500 font-mono text-[10px]">
            Equirectangular Projection · Click node to inspect marquee digital twin
          </div>
        </div>
      </div>

      {/* Top At-Risk Accounts in Current Territory */}
      <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span>High-Priority Churn Exposures in {selectedRegion}</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Sorted by Annual Revenue Exposure
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {topRegionalRisks.map(account => (
            <div
              key={account.id}
              onClick={() => onSelectCustomer(account)}
              className="bg-slate-950/80 p-3 rounded-lg border border-red-950/60 hover:border-red-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="text-[10px] text-slate-500 font-mono">{account.id}</span>
                <span className="text-red-400 font-mono text-[10px]">
                  {Math.round(account.churnProbability * 100)}% Churn
                </span>
              </div>
              <div className="font-semibold text-slate-200 text-xs truncate group-hover:text-cyan-400 transition-colors">
                {account.name}
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5 truncate">
                {account.city}, {account.country}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-xs font-mono tabular-nums">
                <span className="text-white font-bold">${(account.arr / 1000).toFixed(0)}k ARR</span>
                <span className="text-amber-400 text-[11px]">{account.healthScore} Health</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
