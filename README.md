# PromptVerse — AI Prompt Sharing & Marketplace Platform

A modern community-driven platform to create, discover, bookmark, and manage AI prompts for ChatGPT, Gemini, Claude, Midjourney, and more.

## Live URL

- **Frontend:** `https://your-frontend.vercel.app` *(update after deployment)*
- **Backend API:** `https://your-api.vercel.app` *(update after deployment)*

## Key Features

- JWT-based authentication with email/password and Google OAuth
- Role-based access control (User, Creator, Admin)
- Prompt marketplace with search, filter, sort, and pagination
- Bookmark, copy, review, and report prompts
- Stripe one-time $5 Premium payment for private prompts
- User, Creator, and Admin dashboards with analytics
- Framer Motion animations on landing page sections
- Responsive design for mobile, tablet, and desktop

## Tech Stack

| Category | Packages |
|----------|----------|
| Framework | Next.js 16, React 19 |
| Auth | better-auth, @better-auth/mongo-adapter |
| UI | @heroui/react, Tailwind CSS v4 |
| Animation | framer-motion |
| Charts | recharts |
| Forms | react-hook-form |
| Notifications | react-toastify |
| Icons | react-icons |
| Database | MongoDB (via better-auth adapter) |

## Environment Setup

1. Copy the example env file:

```bash
cp .env.example .env.local
```

2. Fill in all variables in `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Express backend URL |
| `MONGO_DB_URI` | MongoDB connection string |
| `DB_NAME` | Database name (`Prompt_Verse`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Frontend URL (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_IMGBB_API_KEY` | imgbb API key for thumbnail uploads |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## Run Locally

```bash
# Install dependencies
npm install

# Start frontend (port 3000)
npm run dev
```

Also start the backend server from `Prompt-Veres-Server`:

```bash
cd ../Prompt-Veres-Server
npm install
npm start
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── allprompts/       # Browse & prompt details
│   ├── dashboard/        # User, Creator, Admin dashboards
│   ├── payment/          # Stripe Premium checkout
│   └── api/auth/         # better-auth handler
├── components/           # Reusable UI components
└── lib/                  # Auth, API helpers
```

## Admin Credentials

*(Fill in after creating admin user)*

- **Email:** admin@example.com
- **Password:** *(your admin password)*

## Repository Links

- **Client:** `https://github.com/your-username/promptverse-client`
- **Server:** `https://github.com/your-username/promptverse-server`
