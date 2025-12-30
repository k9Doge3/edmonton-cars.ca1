# React + Vite

## Lead Emails (SMTP)

Lead submissions are handled by the serverless endpoint at `POST /api/leads`.

Set these environment variables in your hosting provider (recommended: Gmail App Password):

- `SMTP_EMAIL` (example: `ky.group.solutions@gmail.com`)
- `SMTP_PASSWORD` (Gmail App Password; spaces are ignored)

Optional (if you also want leads forwarded into a CRM/webhook):

- `CRM_WEBHOOK_URL`
- `CRM_WEBHOOK_TOKEN`

Notes:

- The endpoint sends two emails via SMTP: an internal notification to `SMTP_EMAIL`, and an auto-reply to the lead.
- `RESEND_API_KEY` / Resend is not used.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
