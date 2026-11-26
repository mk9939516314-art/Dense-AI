# Dense AI

Marketing site for Dense AI, built with Next.js, React, Tailwind and three.js.

## What is in here

- `app/page.tsx`: home page. The hero is a WebGL point-cloud scene (`components/scene.tsx`) that labels a street corner as a sweep plane crosses it. It respects `prefers-reduced-motion` and falls back to the plain copy if WebGL is unavailable.
- `app/*`: services, workforce, quality, solutions, about, careers, contributors, contact, privacy, terms.
- `components/assistant/*`: the "Ask Dense" chat assistant (chatbot, support tokens, executive handoff).
- `app/admin`: executive console for chats, support tokens and bot notes.
- `lib/config.ts`: all site copy and structured content.
- `.claude/skills`: design skills used to build the UI (Anthropic frontend-design, impeccable, taste-skill, ui-ux-pro-max, Vercel web-design-guidelines and React best practices, Everything Claude Code design skills).

## Run

```bash
npm install
cp .env.example .env.local   # fill in the values you need
npm run dev
```

## Environment variables

See `.env.example`. Set the same values in Vercel under Project Settings, Environment Variables. `.env.local` is never committed.

- Assistant: `CHAT_API_KEY`, `CHAT_BASE_URL`, `CHAT_MODEL`
- Support tokens: `RESEND_API_KEY`, `SUPPORT_TO`, `SUPPORT_FROM`
- Handoff storage: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- Admin: `ADMIN_USER`, `ADMIN_PASSWORD`, `ADMIN_SECRET`
- Optional: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DENSE_MEET_URL` (meeting actions appear in the assistant only when this is set)


## Design system (v2)

- Dark "Relay"-style site: all public pages live in `app/(site)/` with tokens in `app/(site)/site.css`. `/admin` stays outside the group with its own light UI.
- `components/backdrop.tsx` is the WebGL ribbon scene (three.js, bloom) that morphs with scroll. It respects `prefers-reduced-motion`.
- Fonts are local (`app/fonts/`): Bricolage Grotesque, Geist, Geist Mono, Instrument Serif italic.
- Design skills used during the build are in `.claude/skills/`.
