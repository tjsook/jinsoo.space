## jinsoo.space

Personal website powered by [Next.js](https://nextjs.org) and ready to deploy on [Vercel](https://vercel.com).

## Local development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Start editing the site in `src/app/page.tsx`. The page auto-updates as you edit.

## Scripts

- `npm run dev` starts the local dev server
- `npm run lint` runs ESLint
- `npm run build` creates the production build
- `npm run start` serves the production build locally

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repository into Vercel.
3. Keep the framework preset as `Next.js`.
4. Deploy.

Vercel will automatically use `npm install` and `npm run build`.

## Notes

- No extra `vercel.json` is required for a standard Next.js deployment.
- Add environment variables in the Vercel project settings if you introduce a database, API keys, or auth later.
