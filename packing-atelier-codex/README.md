# Packing Atelier Codex

A fresh Codex-built packing concierge app. It accepts a pasted itinerary or uploaded file, creates a luxury editorial packing plan, generates AI illustration prompts, shows a polished one-page PNG-style board in the browser, and exports a print-ready PDF.

## Run Locally

```bash
export OPENAI_API_KEY="sk-your-key"
npm run dev
```

Open the printed local URL in a browser.

The app still works without an API key in demo mode, but OpenAI planning and image generation require `OPENAI_API_KEY`.

## What It Creates

- A stylized trip title based on the itinerary
- Route cards and stay rhythm
- Laundry strategy
- Outfit cells organized by destination and day
- Best looks and packing verdict
- AI-generated item or outfit illustrations through the server-side OpenAI Image API
- On-screen PNG export and browser PDF download

## Deployment Notes

This folder is ready for Vercel:

1. Import the `packing-atelier-codex` folder as the project root.
2. Add `OPENAI_API_KEY` in Vercel project environment variables.
3. Optional: set `OPENAI_TEXT_MODEL` and `OPENAI_IMAGE_MODEL`.
4. Deploy.

The included `server.js` is only for local testing. Vercel serves `public/index.html` and runs `/api/create-plan` plus `/api/create-illustration` as serverless functions.

Large uploaded PDFs may hit Vercel request-size limits. For production, route large files through Vercel Blob or OpenAI file upload storage before planning.
