"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContextCard } from "@/components/context-card";
import { MessageBubble } from "@/components/message-bubble";
import { DemoBadge } from "@/components/demo-badge";
import { FITO_MOCK_RESPONSE } from "@/lib/mock-data";

const PAYMENT_TYPES = ["airtime", "electricity", "water", "gas"] as const;

type FormState = {
  name: string;
  type: (typeof PAYMENT_TYPES)[number];
  provider: string;
  recharge_amount: number;
  available_line: number;
  total_line: number;
  cycles_completed: number;
  bnpl_bills_active: boolean;
};

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

export function FitoAgent() {
  const [form, setForm] = useState<FormState>({
    name: "Maria",
    type: "airtime",
    provider: "Telcel",
    recharge_amount: 50,
    available_line: 3500,
    total_line: 5500,
    cycles_completed: 4,
    bnpl_bills_active: false,
  });

  const sessionIdRef = useRef(crypto.randomUUID());
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slowNotice, setSlowNotice] = useState(false);

  async function generate() {
    setLoading(true);
    setResult(null);
    setError(null);
    setIsMock(false);
    setSlowNotice(false);

    const slowTimer = setTimeout(() => setSlowNotice(true), 5000);

    const webhookUrl = process.env.NEXT_PUBLIC_FITO_WEBHOOK_URL;

    if (!webhookUrl) {
      clearTimeout(slowTimer);
      setResult(FITO_MOCK_RESPONSE);
      setIsMock(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          user_id: "demo-user",
          name: form.name,
          type: form.type,
          provider: form.provider,
          recharge_amount: form.recharge_amount,
          available_line: form.available_line,
          total_line: form.total_line,
          cycles_completed: form.cycles_completed,
          bnpl_bills_active: form.bnpl_bills_active,
          phone: "demo-mode-no-send",
        }),
      });

      const data = await res.json();
      const msg = extractMessage(data);

      if (msg) {
        setResult(msg);
      } else {
        setError(
          "Could not reach the agent. Showing a demo response instead."
        );
        setResult(FITO_MOCK_RESPONSE);
        setIsMock(true);
      }
    } catch {
      setError("Could not reach the agent. Showing a demo response instead.");
      setResult(FITO_MOCK_RESPONSE);
      setIsMock(true);
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setSlowNotice(false);
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="grid md:grid-cols-[2fr_3fr] gap-6">
      <ContextCard
        title="Fito - Post-recharge Upsell"
        caseNumber={1}
        description="An instant messaging agent that detects when a Beloz customer completes a recharge or bill payment and offers them 'Pay with your line' (BNPL for essential bills) with a personalized message. Lives at the end of the post-payment event flow in n8n."
        steps={[
          "The customer completes a recharge or utility payment",
          "n8n enriches the event with the user's profile and runs eligibility rules",
          "The agent generates a personalized message in conversational Mexican Spanish",
        ]}
        tryItText="Fill in a sample customer scenario and click Generate. The agent will draft the instant message it would send. This is the exact same prompt running in production."
      />

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">
              Customer name
            </label>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">
              Payment type
            </label>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={form.type}
              onChange={(e) =>
                updateField(
                  "type",
                  e.target.value as FormState["type"]
                )
              }
            >
              {PAYMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">
              Provider
            </label>
            <Input
              value={form.provider}
              onChange={(e) => updateField("provider", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">
              Amount paid (MXN)
            </label>
            <Input
              type="number"
              value={form.recharge_amount}
              onChange={(e) =>
                updateField("recharge_amount", Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">
              Available line (MXN)
            </label>
            <Input
              type="number"
              value={form.available_line}
              onChange={(e) =>
                updateField("available_line", Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">
              Total line (MXN)
            </label>
            <Input
              type="number"
              value={form.total_line}
              onChange={(e) =>
                updateField("total_line", Number(e.target.value))
              }
            />
          </div>
          <div>
            <label className="text-xs font-medium text-brand-muted block mb-1">
              On-time cycles paid
            </label>
            <Input
              type="number"
              value={form.cycles_completed}
              onChange={(e) =>
                updateField("cycles_completed", Number(e.target.value))
              }
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm text-brand-text cursor-pointer">
              <input
                type="checkbox"
                checked={form.bnpl_bills_active}
                onChange={(e) =>
                  updateField("bnpl_bills_active", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 accent-brand-navy"
              />
              BNPL bills already active
            </label>
          </div>
        </div>

        <Button
          onClick={generate}
          disabled={loading}
          className="bg-brand-navy text-white hover:bg-brand-navy/90 w-full cursor-pointer"
        >
          {loading ? "Drafting message..." : "Generate Message"}
        </Button>

        {loading && (
          <div className="text-center text-sm text-brand-muted animate-pulse-slow">
            {slowNotice ? "Still working..." : "Drafting message..."}
          </div>
        )}

        {error && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        {result && (
          <div className="space-y-3">
            {isMock && <DemoBadge />}
            <MessageBubble
              variant="agent"
              label="Beloz &middot; Fito"
              timestamp="just now"
            >
              {result}
            </MessageBubble>
            <Button
              variant="outline"
              onClick={generate}
              disabled={loading}
              className="text-sm cursor-pointer"
            >
              Generate again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
