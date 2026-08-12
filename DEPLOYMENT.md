# Deployment Guide — PromptVerse

## Prerequisites

- MongoDB Atlas cluster
- Google OAuth credentials
- Stripe account (test mode for development)
- imgbb API key (for thumbnail uploads)
- Vercel account (or Render/Railway for backend)

## Frontend (Vercel)

1. Import `Promet-Veres-system` repository to Vercel
2. Set environment variables:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.vercel.app
MONGO_DB_URI=mongodb+srv://...
DB_NAME=Prompt_Verse
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_BETTER_AUTH_URL=https://your-frontend-domain.vercel.app
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXT_PUBLIC_IMGBB_API_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Deploy and note the live frontend URL

## Backend (Vercel / Render)

1. Import `Prompt-Veres-Server` repository
2. Set environment variables:

```
PORT=5000
MONGO_DB_URI=mongodb+srv://...
CLIENT_URL=https://your-frontend-domain.vercel.app
AUTH_SERVER_URL=https://your-frontend-domain.vercel.app
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Deploy and note the live API URL

## Stripe Webhook

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-api-domain/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## Post-Deploy Checklist

- [ ] Home page loads without errors
- [ ] Register and login work (email + Google)
- [ ] Reload `/dashboard` while logged in — stays on page
- [ ] Reload `/allprompts/[id]` while logged in — stays on page
- [ ] Create prompt, admin approve, appears in marketplace
- [ ] Bookmark, copy, review, report work on prompt detail
- [ ] Stripe test payment unlocks premium prompts
- [ ] No CORS errors in browser console
- [ ] Admin dashboard shows users, prompts, payments, reports

## Test Card (Stripe)

- Card: `4242 4242 4242 4242`
- Expiry: any future date
- CVC: any 3 digits
