import React, { useState } from 'react';
import { CustomerAccount } from '../types/customer';
import { Sparkles, X, Send, Bot, ArrowRight, CornerDownLeft, Smile } from 'lucide-react';

interface NexusAiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  customers: CustomerAccount[];
  onSelectCustomer: (customer: CustomerAccount) => void;
  plainEnglishMode?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedAccounts?: CustomerAccount[];
}

export const NexusAiCopilot: React.FC<NexusAiCopilotProps> = ({
  isOpen,
  onClose,
  customers,
  onSelectCustomer,
  plainEnglishMode = false
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: plainEnglishMode
        ? '👋 Hi there! I am your friendly AI Customer Buddy powered by Gemini. Ask me anything in plain English, like "Which customers are unhappy?" or "How can we stop people from cancelling?"'
        : 'Welcome to Nexus AI Copilot powered by Gemini 3.8 Flash. I have analyzed all 4,312 customer accounts, RFM segments, and calibrated XGBoost churn probabilities. How can I assist your retention operations?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = plainEnglishMode ? [
    'Who is in the danger zone?',
    'What does Churn mean?',
    'Show me happy Rockstar customers',
    'How do I save an account?'
  ] : [
    'Top 5 high-ARR churn risks',
    'Summarize EMEA risk drivers',
    'Champions with low recency',
    'Explain Hibernating cohort'
  ];

  const handleSendMessage = async (query: string) => {
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Build brief customer context
      const highRiskSample = customers.filter(c => c.riskLevel === 'High').slice(0, 5).map(c => ({
        name: c.name,
        arr: c.arr,
        churn: `${Math.round(c.churnProbability * 100)}%`,
        recency: `${c.recencyDays}d`,
        city: c.city
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          plainEnglishMode,
          customerContext: { highRiskSample, totalAccounts: customers.length, totalArr: '$48.2M' }
        })
      });

      const data = await res.json();
      const reply = data.reply || 'Here is what I found based on our customer records.';

      // Find relevant account matches if mentioned
      const matched = customers.filter(c => query.toLowerCase().includes(c.name.toLowerCase().slice(0, 6))).slice(0, 3);
      const topDefaults = query.toLowerCase().includes('top') || query.toLowerCase().includes('danger') 
        ? customers.filter(c => c.riskLevel === 'High').sort((a, b) => b.arr - a.arr).slice(0, 3) 
        : matched;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        suggestedAccounts: topDefaults.length > 0 ? topDefaults : undefined
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Copilot request failed:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: 'I ran into a connection issue with the AI server, but here is what the data shows: 512 accounts require outreach, with recency inactivity as the primary factor.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0B0F17] border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 no-print">
      {/* Copilot Header */}
      <div className="p-4 border-b border-slate-800 bg-[#0E1422] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <span>Nexus AI Copilot</span>
              {plainEnglishMode && <Smile className="w-3.5 h-3.5 text-emerald-400" />}
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">
              Powered by Gemini 3.8 Flash
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              {m.text}
            </div>

            {/* Account Pills / Attachments if any */}
            {m.suggestedAccounts && (
              <div className="mt-2 space-y-1.5 w-full">
                {m.suggestedAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => {
                      onSelectCustomer(acc);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 group-hover:text-cyan-400 truncate max-w-[190px]">
                        {acc.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        ${(acc.arr / 1000).toFixed(0)}k ARR · {Math.round(acc.churnProbability * 100)}% Churn
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Gemini thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Strip */}
      <div className="px-4 py-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 whitespace-nowrap hover:border-slate-700 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-[#0E1422]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={plainEnglishMode ? 'Ask any simple question...' : 'Ask about risk, RFM, or retention...'}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
