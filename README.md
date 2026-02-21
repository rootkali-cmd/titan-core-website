# Titan Core - Esports Team Website (Arabic RTL)

Fully responsive esports team website built with:
- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Zod + React Hook Form
- Prisma + SQLite with automatic JSON fallback
- Telegram Bot API notification on every new application

## 1) Run Locally

1. Install dependencies:
```bash
npm install
```

2. Create local env file:
```bash
cp .env.example .env
```
On Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

3. Edit `.env` values:
- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

4. Prepare Prisma client + SQLite schema:
```bash
npm run prisma:generate
npx prisma db push
```

5. Start dev server:
```bash
npm run dev
```

Open: `http://localhost:3000`

## 2) Telegram Bot Setup + chat_id

1. Create bot with **@BotFather** on Telegram.
2. Run `/newbot` and copy the bot token.
3. Start a chat with your bot (or add it to a group/channel).
4. Send at least one message.
5. Get updates:
```bash
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```
6. Find `chat.id` in response JSON and use it as `TELEGRAM_CHAT_ID`.

Notes:
- App sends notifications using:
```bash
POST https://api.telegram.org/bot<TOKEN>/sendMessage
```
- If Telegram fails, submission is still saved successfully.

## 3) Storage Behavior (Prisma + JSON fallback)

- Default mode: Prisma + SQLite.
- If Prisma write fails, app automatically falls back to `data/applications.json`.
- You can force JSON mode by setting:
```env
STORAGE_MODE="json"
```

## 4) Deploy on Vercel

1. Push this project to GitHub.
2. Import repository in Vercel.
3. Add Environment Variables in Vercel project settings:
- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- Optional: `STORAGE_MODE=json`

4. Build command:
```bash
npm run build
```
Install command:
```bash
npm install
```

Important:
- SQLite/JSON on serverless environments is not persistent for real production workloads.
- For long-term production storage, migrate Prisma datasource to a managed DB.

## 5) Replace Hero Background Image

Replace this file:
```bash
public/titan-core-bg.jpg
```

Use your own image with high resolution (recommended 1920x1080 or higher).

## 6) Update Rules Content Easily

Edit:
```bash
lib/rules-content.ts
```

Each section has:
- `title`
- `points[]`

Changes appear automatically on the `/rules` page.

## 7) Main Routes

- `/` Home hero
- `/rules` Rules + agreement checkbox
- `/apply` Application form
- `/apply/success` Submission success screen
- `/api/applications` POST API endpoint for applications

## 8) Troubleshooting (Windows / OneDrive)

If `prisma db push` fails with `Schema engine error`:
- Move the project to an ASCII path (example: `C:\dev\titan-core`).
- Or keep running with JSON mode:
```env
STORAGE_MODE="json"
```
The app will continue storing submissions in `data/applications.json`.
