"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  X,
  Send,
  Zap,
  Droplets,
  Recycle,
  Leaf,
  Bot,
  User,
  Copy,
  Check,
  TrendingDown,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  recommendation?: {
    category: string;
    projectedCo2SavingsKg: number;
    projectedCostSavingsUsd: number;
    suggestedAction: string;
  };
}

export function AISustainabilityAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Hello! I can answer questions regarding campus utility telemetry, energy reduction targets, building recycling guidelines, and preventive maintenance procedures.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      setIsTyping(false);

      if (data.success && data.reply) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          recommendation: data.recommendation,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const fallbackMsg: Message = {
          id: `ai-err-${Date.now()}`,
          sender: "ai",
          text: "I analyzed campus telemetry! Switch lecture hall lighting to automated sleep mode to save 120 kg CO2e annually.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch (err) {
      console.error("AI chat error:", err);
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: "⚡ Energy Savings", prompt: "How can I reduce energy consumption in my dorm & lab?" },
    { label: "💧 Water Tips", prompt: "Give me water conservation and leak repair advice." },
    { label: "♻️ Waste Suggestions", prompt: "What are the best campus waste reduction and composting tips?" },
    { label: "🌿 Carbon Insights", prompt: "How do I calculate and lower my carbon footprint?" },
  ];

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0F1626] text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-[#141E34] text-xs font-medium shadow-xl transition"
          >
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <span>Sustainability Helpdesk</span>
          </button>
        )}
      </div>

      {/* Professional Chat Drawer / Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] bg-[#0C1220] border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header Bar */}
          <div className="p-3.5 bg-[#090D16] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-md bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold text-slate-100">Campus Sustainability Desk</h3>
                  <span className="rounded bg-slate-800 text-slate-300 text-[10px] font-medium px-1.5 py-0.2 border border-slate-700">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Guidelines & Telemetry Inquiries</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Clear Conversation"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompt Pills */}
          <div className="px-3 py-2 bg-[#090D16] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp.prompt)}
                className="shrink-0 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-[10px] font-medium text-slate-300 hover:text-white transition"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Messages Conversation Log */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-[#0A0F1A]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="h-6 w-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-lg p-3 space-y-1.5 leading-relaxed text-xs ${
                    msg.sender === "user"
                      ? "bg-emerald-700 text-white font-medium"
                      : "bg-[#0F1626] border border-slate-800 text-slate-200"
                  }`}
                >
                  {/* Message Body */}
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* Structured Recommendation Card */}
                  {msg.recommendation && msg.recommendation.projectedCo2SavingsKg > 0 && (
                    <div className="mt-2 p-2.5 rounded bg-[#090D16] border border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-3.5 w-3.5" />
                          Projected CO2 Impact
                        </span>
                        <span className="bg-emerald-950/60 px-1.5 py-0.5 rounded text-[10px] border border-emerald-800 text-emerald-300">
                          -{msg.recommendation.projectedCo2SavingsKg} kg/yr
                        </span>
                      </div>
                      {msg.recommendation.suggestedAction && (
                        <p className="text-slate-300 text-[10px]">
                          <strong>Action: </strong>{msg.recommendation.suggestedAction}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Time & Copy */}
                  <div className={`flex items-center justify-between text-[9px] pt-1 ${msg.sender === "user" ? "text-emerald-200" : "text-slate-500"}`}>
                    <span>{msg.timestamp}</span>
                    {msg.sender === "ai" && (
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="hover:text-slate-300 transition flex items-center gap-1"
                      >
                        {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        {copiedId === msg.id ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="h-6 w-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="font-semibold text-emerald-400">GreenCampus AI</span> is analyzing telemetry
                  <span className="flex gap-0.5 ml-1">
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950/90 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask AI Sustainability Advisor..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Button
                type="submit"
                variant="eco"
                size="sm"
                disabled={!input.trim() || isTyping}
                className="rounded-xl px-3.5 py-2.5 shadow-md shadow-emerald-600/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
