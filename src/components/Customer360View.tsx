import React, { useState } from 'react';
import { CustomerAccount } from '../types/customer';
import { 
  User, 
  ShoppingBag, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Layers, 
  ArrowRight,
  TrendingDown,
  Gift,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface Customer360ViewProps {
  customers: CustomerAccount[];
  selectedCustomer: CustomerAccount;
  onSelectCustomer: (customer: CustomerAccount) => void;
  onDispatchAction: (customer: CustomerAccount, actionTitle: string, offer: string) => void;
  plainEnglishMode: boolean;
}

export const Customer360View: React.FC<Customer360ViewProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onDispatchAction,
  plainEnglishMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<{
    subject: string;
    body: string;
    rationale: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Search results for customer selector
  const searchResults = customers.filter(c => {
    if (filterRisk !== 'All' && c.riskLevel !== filterRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.preferredCategory.toLowerCase().includes(q)
      );
    }
    return true;
  }).slice(0, 15);

  const handleGenerateAiMessage = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: selectedCustomer.name,
            domain: selectedCustomer.email,
            arr: selectedCustomer.annualSpend,
            healthScore: Math.round((1 - selectedCustomer.churnProbability) * 100),
            churnProbability: selectedCustomer.churnProbability,
            segment: selectedCustomer.preferredCategory,
            recencyDays: selectedCustomer.recencyDays,
            primaryRiskDriver: selectedCustomer.primaryRiskReason
          },
          tone: 'Empathetic, personal, and customer-first'
        })
      });
      const data = await res.json();
      setGeneratedMessage({
        subject: data.emailSubject || `A special gift for you, ${selectedCustomer.name.split(' ')[0]}!`,
        body: data.emailBody || `Hi ${selectedCustomer.name.split(' ')[0]},\n\nWe noticed you haven't ordered recently. Here is ${selectedCustomer.incentiveOffer} to welcome you back!`,
        rationale: selectedCustomer.recommendationRationale
      });
    } catch (e) {
      setGeneratedMessage({
        subject: `We've missed you! Special offer for ${selectedCustomer.name.split(' ')[0]}`,
        body: `Hi ${selectedCustomer.name.split(' ')[0]},\n\nWe noticed it's been ${selectedCustomer.recencyDays} days since your last order. As one of our valued ${selectedCustomer.membershipTier} members, we'd love to treat you to:\n\n👉 ${selectedCustomer.incentiveOffer}\n\nSimply tap the link in your app to claim!\n\nWarmly,\nYour Customer Care Team`,
        rationale: selectedCustomer.recommendationRationale
      });
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCopyMessage = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(`${generatedMessage.subject}\n\n${generatedMessage.body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search & Customer Selector Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Customer 360° Intelligence & Retention Profile</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comprehensive purchase history, complaint sentiment, churn risk diagnosis, and AI retention action plan
            </p>
          </div>

          {/* Quick Risk Filters */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-500 px-2 text-[11px]">Filter Risk:</span>
            {(['All', 'High', 'Medium', 'Low'] as const).map(risk => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  filterRisk === risk ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar & Switcher Dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer by name, ID, city, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="w-full sm:w-80">
            <select
              value={selectedCustomer.id}
              onChange={(e) => {
                const found = customers.find(c => c.id === e.target.value);
                if (found) onSelectCustomer(found);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {searchResults.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-slate-200">
                  {c.name} ({c.riskLevel} Risk · ${c.annualSpend} spend)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Customer 360 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Profile & Churn Diagnosis (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Card */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {selectedCustomer.id}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    selectedCustomer.membershipTier === 'VIP Gold / Pass'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                      : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                  }`}>
                    {selectedCustomer.membershipTier}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  {selectedCustomer.name}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedCustomer.area}, {selectedCustomer.city}</span>
                </div>
              </div>

              {/* Wallet Badge */}
              <div className="text-right bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Wallet Credits</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  ${selectedCustomer.walletBalance}
                </span>
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedCustomer.phone}</span>
              </div>
            </div>

            {/* Spending & Order Vitals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono tabular-nums">
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Annual Spend</span>
                <span className="font-bold text-white text-sm">${selectedCustomer.annualSpend.toLocaleString()}</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Avg Basket (AOV)</span>
                <span className="font-bold text-white text-sm">${selectedCustomer.avgBasketSize}</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Lifetime Orders</span>
                <span className="font-bold text-white text-sm">{selectedCustomer.lifetimeOrders} orders</span>
              </div>
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Last Order</span>
                <span className={`font-bold text-sm ${selectedCustomer.recencyDays > 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {selectedCustomer.recencyDays}d ago
                </span>
              </div>
            </div>
          </div>

          {/* Customer-Level Churn Risk Diagnosis Box with Clear Reasons */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`w-4 h-4 ${
                  selectedCustomer.riskLevel === 'High' ? 'text-red-400' : selectedCustomer.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }`} />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Customer Churn Risk Diagnosis
                </h4>
              </div>

              <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase font-mono ${
                selectedCustomer.riskLevel === 'High'
                  ? 'bg-red-950/90 text-red-300 border border-red-700/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                  : selectedCustomer.riskLevel === 'Medium'
                  ? 'bg-amber-950/90 text-amber-300 border border-amber-700/80'
                  : 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/80'
              }`}>
                {selectedCustomer.riskLevel} Risk ({Math.round(selectedCustomer.churnProbability * 100)}%)
              </span>
            </div>

            {/* Explicit Reason "WHY" */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider block font-mono">
                Primary Reason for Risk Assessment:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedCustomer.primaryRiskReason}
              </p>
            </div>

            {/* Measurable Risk Factors */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                Identified Risk Signals:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCustomer.riskFactors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/40 font-mono"
                  >
                    {factor}
                  </span>
                ))}
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {selectedCustomer.activeAppDaysPast30} app opens in 30d
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {selectedCustomer.cartAbandonmentCount} abandoned carts
                </span>
              </div>
            </div>

            {/* SHAP Feature Contribution Bars */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                AI Feature Attribution (SHAP Signals):
              </span>

              <div className="space-y-2.5">
                {selectedCustomer.shapAttributions.map((attr) => {
                  const isRisk = attr.shapValue > 0;
                  return (
                    <div key={attr.feature} className="text-xs">
                      <div className="flex justify-between text-[11.5px] mb-1">
                        <span className="text-slate-300">{attr.displayLabel}</span>
                        <span className={`font-mono font-semibold ${isRisk ? 'text-red-400' : 'text-emerald-400'}`}>
                          {isRisk ? `+${(attr.shapValue * 100).toFixed(0)}% risk` : `${(attr.shapValue * 100).toFixed(0)}% safe`}
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isRisk ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, Math.abs(attr.shapValue * 200))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Retention Action Plan & Full Order/Complaint History (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Retention Recommendations Card (With Explicit WHY) */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 rounded-2xl border border-cyan-500/40 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  AI Prescribed Retention Strategy & Recommended Offer
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                Channel: {selectedCustomer.suggestedChannel}
              </span>
            </div>

            {/* Action Title & Rationale */}
            <div className="space-y-2">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Action:</span>
                <span className="text-cyan-300">{selectedCustomer.recommendedAction}</span>
              </div>

              {/* The explicit WHY it was generated */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                  Why this recommendation was generated:
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCustomer.recommendationRationale}
                </p>
              </div>
            </div>

            {/* Specific Incentive Offer Box */}
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">
                  Recommended Retention Incentive
                </span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {selectedCustomer.incentiveOffer}
                </div>
                <div className="text-[11px] text-emerald-300 mt-1 font-mono">
                  Expected Impact: {selectedCustomer.estimatedRetentionUplift}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDispatchAction(selectedCustomer, selectedCustomer.recommendedAction, selectedCustomer.incentiveOffer)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Offer</span>
                </button>

                <button
                  onClick={handleGenerateAiMessage}
                  disabled={aiGenerating}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/60 font-medium text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{aiGenerating ? 'Drafting...' : 'AI Draft Message'}</span>
                </button>
              </div>
            </div>

            {/* Generated AI Personalized Communication Draft */}
            {generatedMessage && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/50 space-y-2.5 animate-in slide-in-from-top duration-200">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Personalized {selectedCustomer.suggestedChannel} Draft</span>
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-300 font-mono text-[11px]">
                  <strong>Subject:</strong> {generatedMessage.subject}
                </div>
                <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11.5px]">
                  {generatedMessage.body}
                </div>
              </div>
            )}
          </div>

          {/* Orders & Purchases Complete History Table */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <span>Recent Purchases & Delivery Timelines</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {selectedCustomer.recentOrders.length} recent orders shown
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Date & Order #</th>
                    <th className="py-2.5 px-3">Items Purchased</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Delivery ETA</th>
                    <th className="py-2.5 px-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {selectedCustomer.recentOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono">
                        <div className="font-semibold text-white">{order.orderNumber}</div>
                        <div className="text-[10px] text-slate-400">{order.date}</div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate" title={order.itemsSummary}>
                        {order.itemsSummary}
                      </td>

                      <td className="py-2.5 px-3 font-mono tabular-nums font-semibold text-slate-100 whitespace-nowrap">
                        ${order.amount}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                        <span className={order.status === 'Delayed' ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                          {order.deliveryTimeMins} mins
                        </span>
                        {order.status === 'Delayed' && (
                          <span className="block text-[9.5px] text-red-400 font-sans">Late Delivery</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < order.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Complaints & Support Tickets */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Customer Complaints & Support Inquiries</span>
            </h4>

            {selectedCustomer.complaints.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero logged complaints. Customer maintains positive satisfaction records.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {selectedCustomer.complaints.map(comp => (
                  <div key={comp.id} className="p-3 rounded-xl bg-slate-950 border border-red-950/80 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                          {comp.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{comp.date}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-amber-400 font-medium">{comp.sentiment}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 whitespace-nowrap">
                      {comp.resolutionStatus}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
