'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Sparkles, MessageCircle } from 'lucide-react';
import { ChatMessage, Role } from '@/lib/types';
import { generateAIResponse } from '@/lib/aiChat';
import { quickSuggestions, leads as allLeads, units as allUnits, agents as allAgents } from '@/lib/mockData';
import { currentUsers } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface AIChatbotProps {
  role: Role;
}

export default function AIChatbot({ role }: AIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'init', 
      role: 'assistant', 
      content: "Hi! I'm Aether AI. Ask anything about leads, inventory, performance or reports. I'm RBAC-aware." 
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const user = currentUsers[role];

  const context = {
    role,
    userName: user.name,
    leads: allLeads,   // In production this would be filtered by API per role
    units: allUnits,
    agents: allAgents,
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 40);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Focus the input field when the chatbot opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Simulate LLM latency
    await new Promise(res => setTimeout(res, 520 + Math.random() * 340));

    const response = generateAIResponse(content, context);

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.text,
      data: response.data,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsThinking(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleQuick = (q: string) => {
    sendMessage(q);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Open AI Chatbot"
          >
            <MessageCircle className="h-6 w-6" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[var(--accent)] animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[540px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl shadow-black/20 border border-[var(--border)] bg-[var(--surface)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm tracking-tight flex items-center gap-1.5">
                    Aether AI Assistant 
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 rounded font-mono">LIVE</span>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] -mt-px">RBAC • Real-time CRM data</div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-[var(--surface-2)] p-1.5"
                aria-label="Close chatbot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="chat-container flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-3 text-sm">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    "chat-message max-w-[85%] px-4 py-2.5 text-[13px] leading-snug",
                    m.role === 'user' ? "chat-bubble-user" : "chat-bubble-assistant"
                  )}>
                    {m.content}
                    
                    {m.data && Array.isArray(m.data) && (
                      <div className="mt-2 space-y-1 text-xs bg-black/5 dark:bg-white/5 p-2 rounded-lg font-mono">
                        {m.data.slice(0, 5).map((row: string, i: number) => (
                          <div key={i} className="text-[var(--text)]">{row}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="chat-bubble-assistant px-4 py-2.5 text-xs flex items-center gap-1.5 text-[var(--text-muted)]">
                    Thinking <span className="animate-pulse">•••</span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length < 3 && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
                {quickSuggestions.slice(0, 4).map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuick(sug)}
                    className="text-[10px] px-2.5 py-px bg-[var(--surface-2)] hover:bg-[var(--accent)]/5 text-[var(--text-muted)] hover:text-[var(--accent)] rounded-full border border-[var(--border)]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 pt-1 border-t border-[var(--border)] flex gap-2 shrink-0">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about leads, units, reports…"
                className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="rounded-full bg-[var(--accent)] disabled:opacity-40 text-white h-10 w-10 flex items-center justify-center active:scale-95 transition shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
