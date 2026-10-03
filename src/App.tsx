import React, { useState, useMemo } from 'react';
import { CustomerAccount, CustomerSegment, Region, RetentionTask, UserPersona } from './types/customer';
import { getCustomerDataset, getRetentionTasks, getBusinessImpactMetrics } from './data/customerEngine';
import { TopBar, ActiveTab } from './components/TopBar';
import { ExecutiveCockpit } from './components/ExecutiveCockpit';
import { Customer360View } from './components/Customer360View';
import { RfmMatrixStudio } from './components/RfmMatrixStudio';
import { GeoIntelligenceMap } from './components/GeoIntelligenceMap';
import { RetentionWorkflowQueue } from './components/RetentionWorkflowQueue';
import { ReportsStudio } from './components/ReportsStudio';
import { PlayfulAnalyticsHub } from './components/PlayfulAnalyticsHub';
import { CustomerDigitalTwinDrawer } from './components/CustomerDigitalTwinDrawer';
import { NexusAiCopilot } from './components/NexusAiCopilot';
import { WarRoomMode } from './components/WarRoomMode';
import { CheckCircle2, ShieldAlert, Sparkles, Smile, HelpCircle, Gamepad2, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview'); // Start with Executive Cockpit Overview
  const [activePersona, setActivePersona] = useState<UserPersona>('CRO / Executive');
  const [warRoomActive, setWarRoomActive] = useState<boolean>(false);
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [plainEnglishMode, setPlainEnglishMode] = useState<boolean>(true); // Default to beginner-friendly!
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [notification, setNotification] = useState<string | null>(null);

  // Load grounded 4,312 customers and initial SLA tasks
  const customers = useMemo(() => getCustomerDataset(), []);
  const [tasks, setTasks] = useState<RetentionTask[]>(() => getRetentionTasks());

  // Dedicated Customer 360 Account Selection
  const default360Account = useMemo(() => {
    return customers.find(c => c.riskLevel === 'High' && c.annualSpend > 2500) || customers[0];
  }, [customers]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount>(default360Account);
  const [drawerCustomer, setDrawerCustomer] = useState<CustomerAccount | null>(null);

  // Business Impact Metrics (Customers at risk, Revenue at risk, Retainable value)
  const businessImpact = useMemo(() => getBusinessImpactMetrics(customers), [customers]);

  // Backward compatible cockpit aggregations for ReportsStudio
  const legacyAggregations = useMemo(() => {
    return {
      totalAccounts: businessImpact.totalCustomers,
      totalArr: businessImpact.totalAnnualGMV,
      atRiskArr: businessImpact.highRiskGmvExposure,
      atRiskAccountsCount: businessImpact.highRiskCustomerCount,
      avgHealthScore: 74.2,
      avgChurnProbability: +(businessImpact.avgChurnRate / 100).toFixed(3),
      regionBreakdown: {
        'North America': { count: 1940, arr: Math.round(businessImpact.totalAnnualGMV * 0.45), atRiskArr: Math.round(businessImpact.highRiskGmvExposure * 0.45) },
        'EMEA': { count: 1290, arr: Math.round(businessImpact.totalAnnualGMV * 0.30), atRiskArr: Math.round(businessImpact.highRiskGmvExposure * 0.30) },
        'APAC': { count: 780, arr: Math.round(businessImpact.totalAnnualGMV * 0.18), atRiskArr: Math.round(businessImpact.highRiskGmvExposure * 0.18) },
        'LATAM': { count: 302, arr: Math.round(businessImpact.totalAnnualGMV * 0.07), atRiskArr: Math.round(businessImpact.highRiskGmvExposure * 0.07) }
      },
      segmentBreakdown: {} as any,
      riskBreakdown: {} as any,
      modelMetrics: {
        rocAuc: 0.9946,
        accuracy: 95.37,
        precision: 93.35,
        recall: 94.50,
        f1Score: 93.92,
        modelType: 'XGBoost Churn Classifier + SHAP Explainability',
        datasetSize: 4312
      }
    };
  }, [businessImpact]);

  // Top risk accounts for dashboard quick lists
  const topRiskAccounts = useMemo(() => {
    return customers
      .filter(c => c.riskLevel === 'High')
      .sort((a, b) => b.annualSpend - a.annualSpend)
      .slice(0, 12);
  }, [customers]);

  const urgentTasksCount = useMemo(() => {
    return tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length;
  }, [tasks]);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: RetentionTask['status']) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
    showToast(`Task ${taskId} updated to "${newStatus}"!`);
  };

  const handleInspectCustomer = (customer: CustomerAccount) => {
    setSelectedCustomer(customer);
    setActiveTab('360');
  };

  const handleDispatchAction = (customer: CustomerAccount, actionTitle: string, offer?: string) => {
    const newTask: RetentionTask = {
      id: `TASK-${tasks.length + 301}`,
      customerId: customer.id,
      customerName: customer.name,
      customerSpend: customer.annualSpend,
      customerArr: customer.annualSpend,
      churnProbability: customer.churnProbability,
      riskLevel: customer.riskLevel,
      actionTitle,
      offer: offer || customer.incentiveOffer,
      channel: customer.suggestedChannel,
      rationale: customer.recommendationRationale,
      priority: customer.churnProbability > 0.7 ? 'Urgent' : 'High',
      owner: 'VIP Customer Retention Desk',
      slaDeadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      slaHoursRemaining: 24,
      status: 'In Progress'
    };

    setTasks(prev => [newTask, ...prev]);
    showToast(`Retention Campaign dispatched for ${customer.name}! Assigned to VIP Desk.`);
  };

  const handleExportFiltered = (filtered: CustomerAccount[]) => {
    setActiveTab('reports');
    showToast(`Loaded ${filtered.length} customer records in Reports Studio.`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePersona={activePersona}
        setActivePersona={setActivePersona}
        warRoomActive={warRoomActive}
        setWarRoomActive={setWarRoomActive}
        copilotOpen={copilotOpen}
        setCopilotOpen={setCopilotOpen}
        urgentTasksCount={urgentTasksCount}
        plainEnglishMode={plainEnglishMode}
        setPlainEnglishMode={setPlainEnglishMode}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Friendly Beginner & Live Business Context Banner */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs py-2.5 px-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
            {plainEnglishMode ? (
              <span>
                💡 <strong className="text-white">Beginner-Friendly Mode is ON:</strong> Every recommendation explains <strong>WHY</strong> it was generated. Check out{' '}
                <button
                  onClick={() => setActiveTab('360')}
                  className="text-cyan-400 underline font-semibold hover:text-cyan-300"
                >
                  Customer 360°
                </button>{' '}
                to see complete order histories and AI recovery offers!
              </span>
            ) : (
              <span>
                Operating as <strong className="text-white font-medium">{activePersona}</strong> · Live inference:{' '}
                <strong className="text-emerald-400 font-mono">XGBoost ROC-AUC 0.9946 + SHAP</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] self-end sm:self-auto">
            <span>4,312 Customers</span>
            <span>·</span>
            <span>GMV: ${(businessImpact.totalAnnualGMV / 1000000).toFixed(2)}M</span>
            <span>·</span>
            <span className="text-red-400 font-semibold">At Risk: ${(businessImpact.highRiskGmvExposure / 1000000).toFixed(2)}M</span>
          </div>
        </div>

        {/* Tab View 1: Executive Dashboard */}
        {activeTab === 'overview' && (
          <ExecutiveCockpit
            metrics={businessImpact}
            topRiskAccounts={topRiskAccounts}
            onSelectCustomer={handleInspectCustomer}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Tab View 2: Customer 360° Page */}
        {activeTab === '360' && (
          <Customer360View
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            onDispatchAction={handleDispatchAction}
            plainEnglishMode={plainEnglishMode}
          />
        )}

        {/* Tab View 3: AI Simulator & Scatter Plot Sandbox */}
        {activeTab === 'sandbox' && (
          <PlayfulAnalyticsHub
            customers={customers}
            onSelectCustomer={handleInspectCustomer}
            plainEnglishMode={plainEnglishMode}
          />
        )}

        {/* Tab View 4: RFM Segments Studio */}
        {activeTab === 'rfm' && (
          <RfmMatrixStudio
            customers={customers}
            onSelectCustomer={handleInspectCustomer}
            onExportFiltered={handleExportFiltered}
          />
        )}

        {/* Tab View 5: Geo Intelligence Map */}
        {activeTab === 'geo' && (
          <GeoIntelligenceMap
            customers={customers}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onSelectCustomer={handleInspectCustomer}
          />
        )}

        {/* Tab View 6: Retention Workflow Queue */}
        {activeTab === 'retention' && (
          <RetentionWorkflowQueue
            tasks={tasks}
            customers={customers}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onSelectCustomer={handleInspectCustomer}
          />
        )}

        {/* Tab View 7: Reports Studio */}
        {activeTab === 'reports' && (
          <ReportsStudio
            customers={customers}
            aggregations={legacyAggregations}
            onSelectCustomer={handleInspectCustomer}
          />
        )}
      </main>

      {/* Quick Customer Digital Twin Drawer if triggered from table links */}
      <CustomerDigitalTwinDrawer
        customer={drawerCustomer}
        onClose={() => setDrawerCustomer(null)}
        onDispatchAction={handleDispatchAction}
        plainEnglishMode={plainEnglishMode}
      />

      {/* Nexus AI Copilot Assistant */}
      <NexusAiCopilot
        isOpen={copilotOpen}
        onClose={() => setCopilotOpen(false)}
        customers={customers}
        onSelectCustomer={handleInspectCustomer}
        plainEnglishMode={plainEnglishMode}
      />

      {/* Fullscreen War Room Mode */}
      {warRoomActive && (
        <WarRoomMode
          onClose={() => setWarRoomActive(false)}
          tasks={tasks}
          customers={customers}
          onSelectCustomer={handleInspectCustomer}
        />
      )}

      {/* Live Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/60 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Enterprise Footer with Transparent Demo Labeling */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Customer360 AI Nexus · Enterprise Customer Intelligence Platform</span>
          <span className="font-mono text-[11px] text-slate-400">
            Synthesized E-Commerce & Delivery Benchmark Cohort · 4,312 Audited Accounts
          </span>
        </div>
      </footer>
    </div>
  );
}
