# Habit Tracker

A real, working habit tracker: sign in, add habits, mark them done, watch
your streak grow, and delete what you don't need. Built with Next.js 14
(App Router), Supabase (auth + Postgres database), and Tailwind CSS.

## What's included

- **Auth** — passwordless magic-link sign-in via Supabase Auth
- **Habits list** — add a habit with a title + description
- **Streaks** — mark a habit done; streak increments if done on a
  consecutive day, resets to 1 if a day was missed
- **Habit detail page** — each habit has its own page at `/habits/[id]`
- **Delete** — remove a habit
- **Row Level Security** — every user only ever sees their own habits

This covers the full "required features" list for a habit tracker MVP,
ready to run locally and deploy to a real URL.

## 1. Create a Supabase project

1. Go to https://supabase.com and create a free project.
2. In the SQL editor, run the contents of `supabase/schema.sql`
   (creates the `habits` table + Row Level Security policies).
3. In **Authentication → Providers**, make sure **Email** is enabled.
4. In **Authentication → URL Configuration**, add your local and
   production URLs (e.g. `http://localhost:3000/auth/callback` and
   `https://your-app.vercel.app/auth/callback`) as redirect URLs.
5. In **Project Settings → API**, copy your **Project URL** and
   **anon public key**.

## 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000 — you'll be redirected to sign in. Enter
your email, click the magic link it sends you, and you're in.

## 4. Deploy to Vercel (get a real URL)

1. Push this project to a GitHub repo.
2. Go to https://vercel.com, import the repo.
3. Add the same two environment variables from `.env.local` in the
   Vercel project settings.
4. Deploy. Then go back to Supabase → Authentication → URL
   Configuration and add your `https://<your-app>.vercel.app/auth/callback`
   URL if you haven't already.

That's it — a live, shareable habit tracker with real accounts and a
real database.

## Project structure

```
app/
  layout.tsx              Root layout
  page.tsx                Redirects to /login or /dashboard
  login/page.tsx           Magic-link sign-in form
  auth/callback/route.ts  Exchanges the magic-link code for a session
  dashboard/
    page.tsx               Habit list + add-habit form
    actions.ts              Server actions: create, mark done, delete, sign out
  habits/[id]/page.tsx     Single habit detail page (dynamic route)
components/
  HabitCard.tsx            Habit card UI (mark done / delete)
lib/supabase/
  client.ts                Browser Supabase client
  server.ts                Server Supabase client (cookies-based)
middleware.ts              Protects routes, redirects signed-out users
supabase/schema.sql        Database table + Row Level Security policies
```

## Where to go from here (stretch ideas)

- **Streak precision**: current logic resets on a missed day — you
  could add a grace window, or track a full completion history table.
- **Dark mode**: add a toggle and a `dark:` Tailwind variant pass.
- **Payments**: gate "unlimited habits" behind Stripe Checkout — the
  course material this was built from has a walkthrough for that.
- **AI insights**: summarize a user's streak history with an LLM call
  in a server action.
