# 🌈 FeelingBridge

An autism-friendly emotion communication app built for toddlers (ages 2–5) who are semi-verbal or non-verbal. Designed so your child can tap a big, colorful picture to tell you exactly how they feel — and you get a parent view with their message and a helpful tip.

## Features

- **24 emotion cards** across 4 pages: Feelings, Needs, Too Much (sensory overload), and Wants
- **One tap = message sent** — no multi-step flows, no text to read
- **Reads cards aloud** using the device's built-in voice (Web Speech API)
- **Sound + vibration feedback** on every tap
- **Parent Dashboard** — shows what your child tapped + a tip on how to respond
- **Sensory overload page** — dedicated "Stop / Too Loud / My Space / Don't Touch" cards
- **Works offline** as a PWA (installable on iPhone & Android)
- **Remembers history** so you can see patterns over time
- **Accessible** — large touch targets (120px+), ARIA labels, high-color-contrast cards

---

## 🚀 Getting Started

### Prerequisites
- [Node.js 20+](https://nodejs.org)
- A free [GitHub account](https://github.com)

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:5173)
npm run dev
```

### Build for Production

```bash
npm run build
# Output goes to /dist folder
```

---

## 📱 Deploy to GitHub Pages (Free Hosting)

### Step 1 — Create a GitHub repo
1. Go to [github.com/new](https://github.com/new)
2. Name it `feelingbridge` (or anything you like)
3. Set it to Public
4. Click **Create repository**

### Step 2 — Push your code

```bash
cd feelingbridge
git init
git add .
git commit -m "Initial commit 🌈"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/feelingbridge.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

In your repo's **Settings → Pages**:
- Source: **GitHub Actions**

Then create this file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

Push this file to GitHub and your app will deploy automatically to:
`https://YOUR_USERNAME.github.io/feelingbridge/`

> **Note:** If deploying to a subfolder, add `base: '/feelingbridge/'` to `vite.config.js`

---

## 📱 Install on iPhone/Android

Once deployed, open the URL in Safari (iOS) or Chrome (Android):
- **iOS:** Tap the Share button → **Add to Home Screen**
- **Android:** Tap the menu → **Install App** or **Add to Home Screen**

The app will look and feel like a native app — full screen, works offline.

---

## How to Use

### Child Mode
1. Your child sees **4 pages** of big emoji cards
2. They tap a card → it **reads it aloud** + sends to your parent view
3. Swipe or tap the dots/arrows to switch pages
4. The "Too Much" page (🛡️) has sensory overload buttons

### Parent Mode
- Tap **Parent** in the bottom tab bar (or the child taps "Show Parent" after sending)
- You'll see **what they tapped**, with the spoken message and a **tip for responding**
- Tap ✓ to mark messages as read

---

## Customization

Edit `src/data/emotions.js` to:
- Change card labels, emoji, or colors
- Add or remove cards
- Modify the voice text or parent tips

Edit `src/utils/sounds.js` to change sound effects.

---

## Tech Stack

| Tool | Why |
|------|-----|
| React 18 | Component UI |
| Framer Motion | Smooth, bouncy animations |
| Zustand | Simple state (persisted to localStorage) |
| Vite + vite-plugin-pwa | Fast builds + offline PWA |
| Web Audio API | Sound effects (no audio files needed) |
| Web Speech API | Read cards aloud (device voice) |

---

## Privacy

All data (feelings history, settings) is stored **locally on the device only**. Nothing is sent to any server. Works 100% offline after first load.

---

Made with 💛 for families who communicate differently.
