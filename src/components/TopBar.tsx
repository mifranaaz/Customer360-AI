import React from 'react';
import { UserPersona } from '../types/customer';
import { ShieldAlert, Sparkles, UserCheck, Gamepad2, Smile, User, LayoutDashboard, Globe, FileText, ShoppingBag } from 'lucide-react';

export type ActiveTab = 'overview' | '360' | 'rfm' | 'geo' | 'sandbox' | 'retention' | 'reports';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activePersona: UserPersona;
  setActivePersona: (persona: UserPersona) => void;
  warRoomActive: boolean;
  setWarRoomActive: (active: boolean) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  urgentTasksCount: number;
  plainEnglishMode: boolean;
  setPlainEnglishMode: (plain: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  activePersona,
  setActivePersona,
  warRoomActive,
  setWarRoomActive,
  copilotOpen,
  setCopilotOpen,
  urgentTasksCount,
  plainEnglishMode,
  setPlainEnglishMode
}) => {
  const personas: UserPersona[] = [
    'CRO / Executive',
    'Customer Success Lead',
    'Retention Specialist',
    'Data Analyst'
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800 px-6 py-2.5 flex items-center justify-between no-print">
      {/* Zone 1: Single text element Brand Zone */}
      <div className="flex items-center gap-3">
        <a 
          href="#home"
          onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
          className="text-base font-semibold tracking-tight text-white hover:text-cyan-400 transition-colors flex items-center gap-2.5"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
          <span>Customer360 AI Nexus</span>
        </a>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {plainEnglishMode ? 'Executive Summary' : 'Executive Dashboard'}
        </button>

        <button
          onClick={() => setActiveTab('360')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === '360'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span>Customer 360°</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'sandbox'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{plainEnglishMode ? 'Rescue Sandbox' : 'AI Simulator & Charts'}</span>
        </button>

        <button
          onClick={() => setActiveTab('rfm')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rfm'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>{plainEnglishMode ? 'Customer Groups (RFM)' : 'RFM Segments'}</span>
        </button>

        <button
          onClick={() => setActiveTab('retention')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'retention'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Retention Campaigns</span>
          {urgentTasksCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 bg-red-950 text-red-400 rounded border border-red-800 font-mono">
              {urgentTasksCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'reports'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Reports & CSV
        </button>
      </nav>

      {/* Zone 3: Primary operational actions */}
      <div className="flex items-center gap-2">
        {/* Friendly ELI5 / Plain English Mode Toggle */}
        <button
          onClick={() => setPlainEnglishMode(!plainEnglishMode)}
          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
            plainEnglishMode
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Plain English (ELI5) Mode for simplified explanations"
        >
          <Smile className={`w-3.5 h-3.5 ${plainEnglishMode ? 'text-emerald-400' : 'text-slate-400'}`} />
          <span className="hidden sm:inline">{plainEnglishMode ? 'Plain English ON' : 'Plain English'}</span>
        </button>

        {/* Persona Switcher */}
        <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
          <UserCheck className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
          <select
            value={activePersona}
            onChange={(e) => setActivePersona(e.target.value as UserPersona)}
            className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            {personas.map((p) => (
              <option key={p} value={p} className="bg-slate-900 text-slate-200">
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* AI Copilot Toggle */}
        <button
          onClick={() => setCopilotOpen(!copilotOpen)}
          className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
            copilotOpen
              ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
          title="Toggle Nexus AI Copilot"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-cyan-300 hidden sm:inline">Ask AI</span>
        </button>
      </div>
    </header>
  );
};
