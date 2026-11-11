# <img width="56" alt="icon" src="https://github.com/user-attachments/assets/5da6b1ef-7a30-4d55-9e41-d29519dd92d1" /> TBH Journal

> A private, self-hosted diary that turns your entries into session-prep notes.

**TBH** stands for *to be honest*, which is the whole idea: a quiet place to write down how things really are, and a way to bring the highlights to a therapy session without having to remember a whole week from scratch.

You write diary entries (text, or voice using your phone's built-in dictation). When you want to prepare for a session, you pick a date range and TBH Journal generates structured notes from what you actually wrote: an overview, mood patterns, key events, recurring themes, what helped, hard moments, and a list of things you may want to bring up.

It's a one-person app. You deploy your own copy with your own database and your own API key, and nothing is shared with anyone else.

<!-- Add your GIFs in the docs/ folder. Suggested names are used below. -->

![Writing a new entry](docs/new-entry.gif)

![Generating a report](docs/generate-report.gif)

![Exporting a report](docs/export.gif)

---

## Features

- **Diary entries** shown newest first, 10 per page
- **Distraction-free writing page** with automatic draft saving, so a reload or a closed tab never loses what you were writing
- **AI-generated reports** for any date range (up to 90 days), built from a fixed template you can edit
- **Report history** with every previous report saved
- **Export** reports by copying them as rich text (pastes with headings and bullets into Apple Notes, Word, or Docs), as a `.docx` file, or by printing to PDF
- **Full data export** to JSON from the menu, for backups
- **Single-user login** protected by a password; everything sits behind it
- **Dark-only design** with a calm navy and gold palette, a grainy gradient background, and a glass navbar
- **Mobile friendly**, so it works as a diary you can open on your phone

## How the reports work

1. You pick a date range.
2. The entries in that range are sent to the Gemini API together with strict instructions.
3. Gemini returns structured JSON, which is validated and saved.
4. The app renders the JSON on screen and in each export format.

The instructions tell the model to:

- use only what is written in the entries and never invent anything
- never diagnose, interpret, or give advice
- keep your own wording for feelings instead of making them stronger
- cite entry dates so you can check every claim
- copy quotes word for word
- include any mention of self-harm or crisis plainly, never softened or left out

> **TBH Journal is a note-taking and summarizing tool. It is not therapy and does not give medical advice.** AI summaries can be wrong, so read each report before you rely on it or share it.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org) (App Router) + TypeScript |
| Styling | CSS Modules, with design tokens in one `globals.css` |
| Database | [Neon](https://neon.com) serverless Postgres |
| ORM | [Drizzle](https://orm.drizzle.team) |
| AI | Google [Gemini API](https://ai.google.dev) (`@google/genai`) |
| Auth | One password (bcrypt hash in an env var) + signed session cookie (`jose`) |
| Word export | [`docx`](https://docx.js.org) |
| Hosting | [Vercel](https://vercel.com) |

## Privacy and security

Please read this before you put real entries in.

- **Gemini's free tier:** on the free tier, Google may use the content you send to improve its products. Terms change, so check Google's current Gemini API terms. Turning on billing for your API key changes which terms apply. Use fake entries while you're testing.
- **Your data is stored in your own Neon database.** It is encrypted in transit and at rest by the provider, but it is not end-to-end encrypted. Your database provider technically has access to it.
- **The database is never exposed to the browser.** All reads and writes happen on the server, and every page and action checks your session first.
- **Use a long passphrase** (four or five random words). The login adds a delay after wrong guesses, but there is no hard rate limit.
- **The login password is never stored**, only its bcrypt hash in an environment variable.
- **Unsent drafts** live in your browser's `localStorage` and are cleared when you save the entry or log out.

## Self-hosting

### What you need

- Node.js 20 or newer
- A free [Neon](https://neon.com) account
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com)
- A free [Vercel](https://vercel.com) account (only if you want to deploy it)

### 1. Get the code

```bash
git clone https://github.com/<your-username>/tbh-journal.git
cd tbh-journal
npm install
```

### 2. Create the database

1. Create a project in the Neon dashboard.
2. Click **Connect** and copy the **pooled** connection string. The hostname should contain `-pooler`.

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Your Neon pooled connection string |
| `GEMINI_API_KEY` | Your key from Google AI Studio |
| `GEMINI_MODEL` | The Gemini model to use, for example `gemini-3.5-flash`. Check AI Studio for which models your key can use. |
| `SESSION_SECRET` | A long random string used to sign the session cookie |
| `APP_PASSWORD_HASH` | The bcrypt hash of your password |
| `APP_TIMEZONE` | Your timezone, for example `America/Los_Angeles`. Defaults to `UTC`. |

Generate the secret and the password hash:

```bash
# SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# APP_PASSWORD_HASH (replace the passphrase with your own)
node -e "console.log(require('bcryptjs').hashSync('your-long-passphrase', 12))"
```

> **Heads up:** a bcrypt hash contains `$` characters, and Next.js treats `$` as variable expansion when it reads `.env.local`. In that file, escape every `$` as `\$`. On Vercel, paste the hash as it is, without the backslashes.

### 4. Create the tables

```bash
npm run db:push
```

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the passphrase you hashed in step 3 (not the hash itself).

### 6. Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel.
2. Add the same environment variables in **Project Settings → Environment Variables**. Use the hash without backslashes.
3. Deploy. The database is the same one you set up in step 2, so there is nothing else to migrate.

Vercel's Hobby plan is for personal, non-commercial use, which is exactly what this is.

### Free-tier limits at the time of writing

Limits change, so check each provider's current page.

- **Neon free plan:** about 1 GB of storage. That's a lot of text; years of daily entries won't come close. The compute scales to zero when idle and wakes on the next request, with a short delay.
- **Gemini free tier:** per-model rate limits shown in the AI Studio console. A few reports a week is far below any limit.
- **Vercel Hobby:** a limited function duration, which is why the reports page asks for a longer one (`maxDuration`).

## Customizing

| I want to change... | Edit |
|---|---|
| The report sections (add, remove, rename, reorder) | `src/lib/report-schema.ts` |
| The instructions the AI follows | `src/lib/gemini.ts` |
| Colors, glow, grain, spacing, fonts | `src/app/globals.css` |
| The Gemini model | `GEMINI_MODEL` env var |
| Entries per page, longest report range | `src/lib/constants.ts` |

The report template is a single list. The report screen, the copy button, the Word export, and the JSON schema sent to Gemini all read from it, so changing the list changes everything at once. Older reports still display after you change it, since sections that no longer exist are simply hidden.

## Project structure

```
src/
  app/
    (app)/            pages behind the login: entries, new entry, reports
    api/              Word export, full data export
    login/            login page and actions
  components/         small reusable pieces, each with its own CSS module
  hooks/              useDraft (draft autosave)
  lib/
    actions/          server actions (entries, reports)
    gemini.ts         the AI call and its instructions
    report-schema.ts  the report template
    report-export.ts  HTML, plain text, and Word renderers
    queries.ts        database reads
    schema.ts         Drizzle tables
    session.ts        login session helpers
```

Pages only assemble components, so most changes are small and local.

## Roadmap

- [ ] Edit entries
- [ ] Hard rate limiting on the login
- [ ] Custom fonts
- [ ] Optional filters or search across entries

## License

MIT. Add a `LICENSE` file to the repo, or change this line to the license you prefer.
