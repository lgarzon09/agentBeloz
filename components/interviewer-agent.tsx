"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ContextCard } from "@/components/context-card";
import { MessageBubble } from "@/components/message-bubble";
import { DemoBadge } from "@/components/demo-badge";
import { INTERVIEWER_MOCK_SCRIPT } from "@/lib/mock-data";

type Message = {
  role: "agent" | "user";
  content: string;
  timestamp: Date;
};

type InterviewStatus = "idle" | "active" | "closed";

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function extractMessage(data: unknown): string | null {
  if (!data) return null;
  if (Array.isArray(data)) return extractMessage(data[0]);
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === "string") return obj.message;
    if (typeof obj.text === "string") return obj.text;
    if (typeof obj.output === "string") return obj.output;
  }
  if (typeof data === "string") return data;
  return null;
}

function buildChatHistory(messages: Message[]): string {
  return messages
    .map((m) => `${m.role === "agent" ? "Agent" : "User"}: ${m.content}`)
    .join("\n");
}

function isClosingMessage(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("si te buscamos en unas semanas") ||
    lower.includes("thanks") ||
    lower.includes("thank you") ||
    lower.includes("bye") ||
    lower.includes("gracias") ||
    lower.includes("adios") ||
    lower.includes("adi\u00f3s")
  );
}

export function InterviewerAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<InterviewStatus>("idle");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slowNotice, setSlowNotice] = useState(false);
  const mockIndexRef = useRef(0);
  const sessionIdRef = useRef(crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const callWebhook = useCallback(
    async (
      userMessage: string,
      allMessages: Message[]
    ): Promise<string | null> => {
      const webhookUrl = process.env.NEXT_PUBLIC_INTERVIEWER_WEBHOOK_URL;

      if (!webhookUrl) {
        setIsMock(true);
        const idx = mockIndexRef.current;
        if (idx < INTERVIEWER_MOCK_SCRIPT.length) {
          mockIndexRef.current = idx + 1;
          return INTERVIEWER_MOCK_SCRIPT[idx];
        }
        return null;
      }

      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            user_id: "demo-interview",
            name: "Carlos",
            inferred_segment: "urban_corner_store",
            chat_history: buildChatHistory(allMessages),
            last_user_message: userMessage,
          }),
        });

        const data = await res.json();
        return extractMessage(data);
      } catch {
        setIsMock(true);
        setError(
          "Could not reach the agent. Showing a demo response instead."
        );
        const idx = mockIndexRef.current;
        if (idx < INTERVIEWER_MOCK_SCRIPT.length) {
          mockIndexRef.current = idx + 1;
          return INTERVIEWER_MOCK_SCRIPT[idx];
        }
        return null;
      }
    },
    []
  );

  async function startInterview() {
    setStatus("active");
    setTyping(true);
    setError(null);
    setSlowNotice(false);

    const slowTimer = setTimeout(() => setSlowNotice(true), 5000);

    const agentMsg = await callWebhook("", []);
    clearTimeout(slowTimer);
    setSlowNotice(false);

    if (agentMsg) {
      const msg: Message = {
        role: "agent",
        content: agentMsg,
        timestamp: new Date(),
      };
      setMessages([msg]);
    }
    setTyping(false);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || status !== "active") return;

    const userMsg: Message = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setTyping(true);
    setError(null);
    setSlowNotice(false);

    if (isClosingMessage(text)) {
      setStatus("closed");
      setTyping(false);
      return;
    }

    const slowTimer = setTimeout(() => setSlowNotice(true), 5000);

    const agentMsg = await callWebhook(text, newMessages);
    clearTimeout(slowTimer);
    setSlowNotice(false);

    if (agentMsg) {
      const msg: Message = {
        role: "agent",
        content: agentMsg,
        timestamp: new Date(),
      };
      const updatedMessages = [...newMessages, msg];
      setMessages(updatedMessages);

      if (isClosingMessage(agentMsg)) {
        setStatus("closed");
      }
    }
    setTyping(false);
  }

  function resetInterview() {
    setMessages([]);
    setStatus("idle");
    setInput("");
    setIsMock(false);
    setError(null);
    mockIndexRef.current = 0;
    sessionIdRef.current = crypto.randomUUID();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="grid md:grid-cols-[2fr_3fr] gap-6">
      <ContextCard
        title="Discovery Interviewer"
        caseNumber={2}
        description="An adaptive instant messaging agent that conducts product discovery interviews with users identified as micro-business owners. Asks one question at a time, adapts based on the answer, and closes after gathering enough signal. Used to validate segments for the new 'Beloz Business' product."
        steps={[
          "The agent opens with a warm greeting and asks for permission",
          "It asks up to 6 substantive questions, adapting each one to the previous answer",
          "It closes with a soft offer to be invited to test the new product",
        ]}
        tryItText="Have a real conversation with the agent. Pretend you are a small business owner in Mexico. The agent will adapt its questions based on what you say."
      />

      <div className="border border-border rounded-lg bg-white flex flex-col h-[500px]">
        {/* Chat header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-brand-navy">
              Discovery Interview
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs ${
                status === "active"
                  ? "text-green-600"
                  : status === "closed"
                    ? "text-gray-400"
                    : "text-brand-muted"
              }`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  status === "active"
                    ? "bg-green-500"
                    : status === "closed"
                      ? "bg-gray-400"
                      : "bg-brand-muted"
                }`}
              />
              {status === "active"
                ? "Active"
                : status === "closed"
                  ? "Closed"
                  : "Ready"}
            </span>
          </div>
          {status !== "idle" && (
            <button
              onClick={resetInterview}
              className="text-xs text-brand-muted hover:text-brand-text cursor-pointer"
            >
              Reset interview
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3" ref={scrollRef}>
          {status === "idle" ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <Button
                onClick={startInterview}
                className="bg-brand-navy text-white hover:bg-brand-navy/90 cursor-pointer"
              >
                Start Interview
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {isMock && (
                <div className="mb-2">
                  <DemoBadge />
                </div>
              )}
              {error && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-2">
                  {error}
                </p>
              )}
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  variant={msg.role}
                  timestamp={formatTime(msg.timestamp)}
                >
                  {msg.content}
                </MessageBubble>
              ))}
              {typing && (
                <MessageBubble variant="agent">
                  <span className="animate-pulse-slow">
                    {slowNotice ? "Still working..." : "Typing..."}
                  </span>
                </MessageBubble>
              )}
              {status === "closed" && (
                <p className="text-xs text-center text-brand-muted pt-2">
                  Interview complete. Reset to start over.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Input area */}
        {status === "active" && (
          <div className="border-t border-border p-3 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              className="resize-none min-h-[40px] max-h-[80px] text-sm"
              rows={1}
              disabled={typing}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || typing}
              className="bg-brand-navy text-white hover:bg-brand-navy/90 self-end cursor-pointer"
            >
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
