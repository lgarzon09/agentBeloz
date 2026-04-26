# Beloz Agents Demo

Interview deliverable for the **Strategy and Ops Lead** position at Beloz. This is a single-page web app where the interviewer can interact live with two AI agents that operationalize the proposed go-to-market strategy.

The app is deployed on **Vercel**. Both agents were built rapidly in **n8n** as proof-of-concept workflows, exposed as webhook endpoints that this frontend calls directly.

## Agents

**Fito (Case 1):** Post-recharge upsell agent. When a Beloz customer completes a recharge or bill payment, this agent generates a personalized "Pay with your line" (BNPL) offer in conversational Mexican Spanish. The n8n workflow enriches the payment event with the user's profile, runs eligibility rules, and produces the message.

**Discovery Interviewer (Case 2):** Adaptive discovery interview agent. Conducts product research conversations with users identified as micro-business owners. Asks one question at a time, adapts based on the answer, and closes after gathering enough signal to validate segments for the new "Beloz Business" product.

## Tech stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Agents:** n8n workflows exposed as POST webhooks
- **Deployment:** Vercel (zero-config)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Both agents work in demo mode (mock responses) without any configuration.

## Configure webhooks

```bash
cp .env.local.example .env.local
```

Fill in the n8n webhook URLs:

```
NEXT_PUBLIC_FITO_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
NEXT_PUBLIC_INTERVIEWER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/yyyyy
```

## Webhook payload formats

### Fito (POST)

```json
{
  "sessionId": "uuid",
  "user_id": "demo-user",
  "name": "Maria",
  "type": "airtime",
  "provider": "Telcel",
  "recharge_amount": 50,
  "available_line": 3500,
  "total_line": 5500,
  "cycles_completed": 4,
  "bnpl_bills_active": false,
  "phone": "demo-mode-no-send"
}
```

### Discovery Interviewer (POST)

```json
{
  "sessionId": "uuid",
  "user_id": "demo-interview",
  "name": "Carlos",
  "inferred_segment": "urban_corner_store",
  "chat_history": "Agent: Hola...\nUser: Hola...",
  "last_user_message": "The latest user message"
}
```

Both webhooks should return JSON with a `message`, `text`, or `output` string field.
