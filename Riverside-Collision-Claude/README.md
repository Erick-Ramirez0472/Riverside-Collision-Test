# Riverside Collision Repair Website

A professional collision repair website with a quote request form that sends emails via [Resend](https://resend.com).

## Project Structure

```
riverside/
├── index.html          ← Main website
├── riversidelogo.png   ← Your logo (already included)
├── api/
│   └── send-quote.js  ← Serverless function (Vercel)
├── vercel.json         ← Vercel routing config
├── package.json
└── README.md
```

---

## 🚀 Deploy to Vercel (Recommended — free tier works)

Vercel handles both static files AND the serverless API function automatically.

### Step 1 — Push to GitHub

1. Create a new GitHub repo (e.g. `riverside-collision-website`)
2. In your project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/riverside-collision-website.git
   git push -u origin main
   ```

### Step 2 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Vercel auto-detects the config — click **Deploy**

### Step 3 — Add Environment Variables

In Vercel → your project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Your Resend API key (see below) |
| `SHOP_EMAIL` | Email where quote requests go (e.g. `info@riversidecollision.com`) |
| `FROM_EMAIL` | Verified sender address in Resend (e.g. `quotes@riversidecollision.com`) |

Then **Redeploy** (Deployments tab → ••• → Redeploy).

### Step 4 — Set up Resend

1. Sign up at [resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Go to **API Keys** → Create a key → copy it into `RESEND_API_KEY`
3. Go to **Domains** → Add your domain (e.g. `riversidecollision.com`)
4. Add the DNS records Resend shows you (takes ~10 min to verify)
5. Your `FROM_EMAIL` must use this verified domain

> **No domain yet?** During testing, use Resend's sandbox:
> set `FROM_EMAIL` to `onboarding@resend.dev` and `SHOP_EMAIL` to your personal email.

---

## 🔄 How Updates Work (GitHub → Vercel Auto-Deploy)

Once connected, every `git push` to `main` auto-deploys your site. No manual steps needed.

```bash
# Make a change, then:
git add .
git commit -m "Update phone number"
git push
# → Vercel deploys in ~30 seconds
```

---

## 🌐 Custom Domain

In Vercel → Settings → Domains → Add your domain.
Update your DNS registrar to point to Vercel (they show you exactly what to add).

---

## Customizing the Site

| What to change | Where |
|---|---|
| Phone / email / address | `index.html` — search for `(801) 555-0000` and `info@riversidecollision.com` |
| Hours | `index.html` — "Mon–Fri 8AM–6PM..." |
| Stats (years, vehicles) | `index.html` — Stats bar section |
| Services | `index.html` — `#services` section |
| Colors | `index.html` — `:root` CSS variables at the top |
| Shop notification email | `SHOP_EMAIL` env var in Vercel |
| Sender email | `FROM_EMAIL` env var in Vercel |

---

## Local Development

```bash
npm install
npx vercel dev
```

Open http://localhost:3000 — the API function runs locally too.
You'll need a `.env.local` file:
```
RESEND_API_KEY=re_xxxxxxxxxxxx
SHOP_EMAIL=your@email.com
FROM_EMAIL=onboarding@resend.dev
```
