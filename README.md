# Beloz Agents Demo

A single-page web application that demos two AI agents built for Beloz, a Mexican fintech credit-line company. The agents are deployed in n8n and exposed as webhook endpoints. This app provides a clean, branded interface for interacting with both agents live.

## Agents

**Fito (Case 1):** Post-recharge upsell agent. Detects when a customer completes a recharge or bill payment and generates a personalized BNPL offer in conversational Mexican Spanish.

**Discovery Interviewer (Case 2):** Adaptive interview agent that conducts product discovery conversations with micro-business owners to validate segments for a new product.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Both agents work in demo mode (mock responses) without any configuration.

## Configure webhooks

Copy the env template and fill in your n8n webhook URLs:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_FITO_WEBHOOK_URL=https://your-n8n-instance.com/webhook/xxxxx
NEXT_PUBLIC_INTERVIEWER_WEBHOOK_URL=https://your-n8n-instance.com/webhook/yyyyy
```

## Webhook payload formats

### Fito (POST)

```json
{
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

Expected response: JSON with a `message`, `text`, or `output` string field.

### Discovery Interviewer (POST)

```json
{
  "user_id": "demo-interview",
  "name": "Carlos",
  "inferred_segment": "urban_corner_store",
  "chat_history": "Agent: Hola...\nUser: Hola...",
  "last_user_message": "The latest user message"
}
```

Expected response: JSON with a `message`, `text`, or `output` string field.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add the two `NEXT_PUBLIC_*` environment variables in the Vercel dashboard
4. Deploy (zero config, default settings work)

## Tech stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
# agentBeloz
