# Lillian Zheng — Portfolio & Study Desk

A personal portfolio and a flashcard workspace styled as a pixel-art study desk. Class folders sit on the desk with taped labels; each folder holds sets for individual topics.

[Portfolio](https://lillian-zheng.com) · [Study Desk](https://lillian-zheng.com/flashcards)

## Study features

- Create, rename, and delete folders, sets, and cards.
- Flip cards, shuffle sets, track mastered cards, and revisit missed answers.
- Import question/answer pairs, two-column tables, definitions, or JSON.
- Extract text from PDF and DOCX; also accept TXT, Markdown, CSV, and TSV.
- Export sets as JSON.
- Sync private libraries and display names across devices after signing in.
- Connect ChatGPT through the site's MCP endpoint to save cards into sets.

Imports parse explicit pairs and definitions. Scanned PDFs need text extraction elsewhere; free-form notes do not use a paid generation API.

## Development

Requires Node.js 22.13 or later and pnpm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `/` for the portfolio or `/flashcards` for the study desk.

```sh
pnpm exec tsc --noEmit
pnpm build
```

## Structure

- `app/flashcards`: workspace, study interactions, and pixel styling.
- `app/api/flashcards`: authenticated library and document endpoints.
- `app/mcp`: tools for listing, reading, and saving flashcard sets.
- `lib/flashcards.ts`: types, validation, and import parsing.
- `lib/flashcard-store.ts`: per-user persistence and revision checks.
- `drizzle`: database migrations.
- `public/flashcards-art`: desk and folder artwork.

Built with React, TypeScript, Vinext, and Cloudflare Workers, with D1 for libraries and R2 for documents. Sites hosting supplies authentication and resource bindings. A local server can display public pages; private storage and account flows require those bindings and the trusted hosting authentication layer. Authentication headers must never be trusted from arbitrary clients in a self-hosted deployment.

Library updates use revision checks to avoid overwriting newer changes from another device. This repository excludes user libraries, uploaded documents, credentials, and local databases.
