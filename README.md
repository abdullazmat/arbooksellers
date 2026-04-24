# Quran Ecommerce (Next.js)

Production-ready Next.js ecommerce app with MongoDB and email flows, prepared for cPanel Node.js deployment.

## Requirements

- Node.js `18.18+` (recommended: `20.x` on cPanel)
- npm `9+`
- MongoDB connection string
- SMTP credentials (for contact, order, signup, and password reset emails)

## Local Production Check

Run this before deployment to confirm production build/runtime behavior:

```bash
npm install
npm run build
npm run start
```

## cPanel Deployment (Node.js App)

Use cPanel's **Setup Node.js App** flow.

1. Create Node.js app in cPanel:
- Node.js version: `20.x` (or `18.18+`)
- Application mode: `Production`
- Application root: your project directory
- Application URL: your domain/subdomain
- Application startup file: `server.js`

2. Open the app terminal in cPanel and run:

```bash
npm install
npm run build:cpanel
```

3. In cPanel Node.js app settings, set environment variables from `.env.example`.

4. Restart the Node.js app from cPanel.

## cPanel Deployment (Git Version Control)

If you deploy using cPanel Git Version Control:

1. Pull repository in cPanel.
2. Open terminal in app root.
3. Run:

```bash
npm install
npm run build:cpanel
```

4. Restart the Node.js app.

## Required Environment Variables

Copy `.env.example` values into cPanel environment settings.

Critical variables:
- `MONGODB_URI` (or `MONGO_URI`)
- `JWT_SECRET` (required in production)
- `NEXT_PUBLIC_APP_URL`
- SMTP variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`)

## Scripts

- `npm run dev` - development server
- `npm run build` - production build
- `npm run build:cpanel` - production build for cPanel
- `npm run start` - run custom server
- `npm run start:cpanel` - run custom server (cPanel startup target)

## Notes

- The app uses `server.js` as a custom Next.js server and listens on `PORT`/`HOST` from the environment.
- `JWT_SECRET` is enforced in production to prevent insecure defaults.
- `next.config.mjs` currently skips lint/type checks during build. Consider enabling them before long-term production scaling.
