# StudioSpace

**Peer-to-peer creative workspace & production studio sharing platform.** Hosts list photo studios, sound stages, podcast lounges, music suites and art workshops; creators discover them, check availability and book by the hour.

**Live site:** https://your-studiospace.vercel.app ← replace with your deployed URL
**API repo:** `studiospace-server` (Express + MongoDB)

## Features

- **Home page** with a 3-slide Swiper hero, category marquee, six featured studios fetched live from MongoDB (`.limit(6)`), category cards that open Explore with the filter pre-selected, a 4-step "How Booking Works" section and a Host Guarantee section
- **Explore Studios** grid with category chips, debounced search, max-rate filter, sorting, pagination, branded skeletons and friendly empty states
- **Studio details** with a gallery carousel, specs, amenities, verified host card, reviews and a **Book Workspace Now** modal that shows confirmed slots and blocks overlapping times
- **Authentication** with BetterAuth (email/password + Google), password rules (uppercase, lowercase, 6+ characters) checked in the form and on the server, and redirect back to the page you came from
- **Private dashboard**: Add New Studio (imgbb upload or image URL), My Studio Listings with Update and confirm-before-Delete, Update Studio, My Bookings with Pending / Confirmed / Completed / Cancelled badges and Cancel Booking
- **Security challenge**: the API keeps a JWT in an **HTTPOnly cookie** and answers `401 Unauthorized` on protected mutations without it
- **Double-booking prevention**: new bookings (and host confirmations) are rejected when they overlap a Confirmed booking
- **Light / dark theme** toggle that switches the whole site, remembered between visits
- **Extras**: downloadable PDF receipt for confirmed bookings, wishlist hearts on every card, host confirm/decline flow
- Sonner toasts and custom modal dialogs everywhere — no browser `alert()`; custom 404; fully responsive

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, JavaScript, Tailwind CSS v4, **daisyUI 5** |
| Auth | BetterAuth, MongoDB adapter, JWT plugin, Google OAuth |
| UI libraries | Swiper.js, Sonner, next-themes, lucide-react, jsPDF |
| Backend | Express.js, MongoDB (see `studiospace-server`) |

## Examiner test credentials

| Role | Email | Password |
|---|---|---|
| Creator / host | `examiner@studiospace.dev` | `Examiner123` |
| Demo host (owns the seeded studios) | `host@studiospace.dev` | `HostDemo123` |

> Create these two accounts on the live site once after deploying (Register page), then run `npm run seed` in the API so the demo studios belong to `host@studiospace.dev`.

## Local setup

```bash
# 1. API
git clone <server-repo-url> studiospace-server
cd studiospace-server && npm install
cp .env.example .env          # MONGODB_URI, CLIENT_URL=http://localhost:3000
npm run seed                  # optional demo studios
npm run dev                   # http://localhost:5000

# 2. Client (new terminal)
git clone <client-repo-url> studiospace-client
cd studiospace-client && npm install
cp .env.example .env.local    # fill every value
npm run dev                   # http://localhost:3000
```

Environment variables (`.env.local`):

| Variable | What it is |
|---|---|
| `BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL` | This app's URL |
| `BETTER_AUTH_SECRET` | Long random string (`openssl rand -base64 32`) |
| `MONGODB_URI`, `DB_NAME` | Same database as the API |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth; redirect URI `<BETTER_AUTH_URL>/api/auth/callback/google` |
| `API_URL` | Express API base URL |
| `NEXT_PUBLIC_IMGBB_KEY` | imgbb API key for uploads |

## How the pieces talk

- The browser calls `/backend/*`, which `next.config.mjs` rewrites to the Express API. The API's HTTPOnly cookie is therefore first-party on this domain, so reloading any private route keeps you signed in.
- After login the client asks BetterAuth for a JWT and posts it to the API once; the API verifies it against `/api/auth/jwks` and stores it in the cookie. If the cookie is missing or expired, the client re-syncs automatically on the first `401`.
- `src/middleware.js` protects `/dashboard`, `/add-studio`, `/my-listings`, `/my-bookings` and `/studios/edit/*`.

## Deploy (Vercel)

1. Deploy the API first (Render or Vercel) and note its URL.
2. Import this repo in Vercel, add every variable above (with the live URLs) and deploy.
3. Set the API's `CLIENT_URL` to the live client URL and redeploy the API.
4. Add the live callback URL to your Google OAuth client.
