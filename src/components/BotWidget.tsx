import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Send, Sparkles, Minimize2, ExternalLink, RefreshCw, ChevronUp } from 'lucide-react';
import { ChatMessage, Property, ValuationResult } from '../types';

interface BotWidgetProps {
  currentProperty?: Property | null;
  currentValuation?: ValuationResult | null;
  onOpenFullAdvisor?: () => void;
}

export const BotWidget: React.FC<BotWidgetProps> = ({
  currentProperty,
  currentValuation,
  onOpenFullAdvisor
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(1);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'b-init',
      sender: 'assistant',
      text: 'Hi! I am EstatePulse AI Bot. Ask me anything about property valuations, neighborhood metrics, mortgage calculation, or market growth trends.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const presetQuestions = [
    'Is Baner, Pune a good investment locality?',
    'How is property valuation calculated?',
    'What is the typical rental yield in Mumbai?',
    'Calculate EMI for 1.2 Crore loan at 8.5%'
  ];

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (customText?: string) => {
    const queryText = customText || input;
    if (!queryText.trim() || isTyping) return;

    if (!customText) setInput('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText.trim(),
          property_context: currentValuation?.property_input || {
            locality: currentProperty?.locality || 'Baner, Pune',
            area_sqft: currentProperty?.area_sqft || 1450,
            bedrooms: currentProperty?.bedrooms || 3,
            estimated_value: currentValuation?.estimated_value || currentProperty?.price || 12400000,
            price_per_sqft: currentValuation?.price_per_sqft || currentProperty?.price_per_sqft || 8552,
            investment_score: currentValuation?.investment_score || 88
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'Analysis complete.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('API server error');
      }
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'I encountered a brief issue querying market data. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[500px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Widget Top Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-600 text-white relative">
                <Bot className="w-5 h-5" />
                <span className="w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full absolute -top-0.5 -right-0.5"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">EstatePulse AI Bot</h3>
                <span className="text-[10px] text-slate-300 font-medium">Real Estate Intelligence Assistant</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {onOpenFullAdvisor && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullAdvisor();
                  }}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  title="Expand to Full Screen Advisor"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Minimize Bot"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-[9px] opacity-70 block text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-slate-500 flex items-center gap-2 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span className="text-[11px] font-medium">EstatePulse Bot is generating response...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Preset Prompts */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-[10px] font-medium whitespace-nowrap border border-slate-200 transition-colors flex-shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI bot about properties, yield..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-inner"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative px-4 py-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white shadow-xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 border border-slate-700 hover:border-blue-500"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
          )}
        </div>
        <span className="text-xs font-bold tracking-wide pr-1">
          {isOpen ? 'Close Bot' : 'AI Assistant Bot'}
        </span>
      </button>
    </div>
  );
};
