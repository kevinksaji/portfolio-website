# Portfolio Website Maintainer Guide

This repository contains Kevin Saji's portfolio website built with Next.js App Router, React, TypeScript, and Tailwind CSS v4. It combines a public-facing portfolio, a Notion-backed blog, a recruiter-facing AI chat assistant, GitHub statistics, and a contact form backed by server-side email delivery.

This README explains:

- how the project is structured
- what each file or file group owns
- how the main user-facing flows work end to end
- where to make changes safely when a feature needs to evolve

## 1. High-Level Architecture

At a high level, the app has four layers:

1. Routing and page composition in `src/app`
2. Reusable UI building blocks in `src/components`
3. External integrations and cross-cutting helpers in `src/lib`
4. Static portfolio content in `src/data`

The application uses the Next.js App Router, so each folder under `src/app` maps directly to a route segment.

### Runtime split

- Server components are the default in `src/app` and are used for page-level data fetching, especially the blog.
- Client components are marked with `"use client"` and are used for interactivity such as chat, theme switching, and dynamic stat cards.
- API routes in `src/app/api` wrap external services so browser code does not need direct access to secrets.
- A server action in `src/app/contact/email/actions.ts` handles the contact form submission flow.

### External systems

- Notion stores blog metadata and page content.
- DeepSeek powers the recruiter chat experience.
- GitHub REST and GraphQL APIs provide repo and commit stats.
- Gmail via Nodemailer sends contact emails.

## 2. Local Development

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Open `http://localhost:3000` in the browser.

### Dependency upgrade workflow

When upgrading Next.js or other dependencies, use this process:

1. Start from a clean branch and confirm the current app already passes `npm run lint` and `npm run build`.
2. Read the release notes first, especially for `next`, `react`, `react-dom`, `eslint-config-next`, and `tailwindcss`.
3. Upgrade related packages together, not randomly. For example: `next` with `eslint-config-next`, and `react` with `react-dom`.
4. Prefer patch and minor upgrades first. Treat major upgrades as planned changes.
5. After each upgrade batch, run `npm install`, then re-run `npm run lint` and `npm run build`.
6. Manually smoke-test the critical routes: `/`, `/about`, `/blog`, `/chat`, `/contact`, and `/experience`.
7. If an audit warning only comes from a transitive dependency with no safe upstream fix, track it and wait for the parent package to release a proper fix rather than forcing a breaking downgrade.

Best practices:

- keep upgrade PRs small and focused
- do not run `npm audit fix --force` blindly
- keep `next` and `eslint-config-next` aligned
- keep `react` and `react-dom` aligned
- merge only after validation passes

## 3. Required Environment Variables

The codebase expects these environment variables for full functionality:

| Variable             | Used by                             | Purpose                                              |
| -------------------- | ----------------------------------- | ---------------------------------------------------- |
| `NOTION_API_KEY`     | `src/lib/notion.ts`                 | Authenticates with the Notion API                    |
| `NOTION_DATABASE_ID` | `src/lib/notion.ts`                 | Identifies the blog database                         |
| `DEEPSEEK_API_KEY`   | `src/lib/deepseek.ts`               | Authenticates the chat completion API                |
| `GITHUB_TOKEN`       | `src/app/api/github/stats/route.ts` | Enables commit-count lookup via GitHub GraphQL       |
| `EMAIL_USER`         | `src/lib/email.ts`                  | Gmail account used to send contact emails            |
| `EMAIL_PASS`         | `src/lib/email.ts`                  | App password or SMTP password for the sender account |

If one of these is missing:

- the blog will render empty states rather than crash
- GitHub repos can still load, but commit totals become unavailable
- the chat API route will fail when called
- the contact form server action will fail to send mail

## 4. Request and Data Flows

### Homepage flow

1. `src/app/layout.tsx` wraps every page with theme and GitHub providers and mounts the navbar.
2. `src/app/page.tsx` renders the home dashboard cards.
3. `src/components/GitHubStats.tsx` reads data from `src/lib/GitHubContext.tsx`.
4. `src/lib/GitHubContext.tsx` fetches `/api/github/stats` on the client.
5. `src/app/api/github/stats/route.ts` talks to GitHub APIs and returns a normalized response.
6. The homepage chat input redirects users to `/chat?q=...` instead of calling the model directly from the landing page.

### Chat flow

1. `src/app/chat/page.tsx` reads the `q` search param and initializes the conversation.
2. `src/components/ChatWindow.tsx` renders the transcript and input.
3. `src/components/ChatInput.tsx` captures user input and passes it up.
4. The chat page sends the accumulated message history to `/api/chat`.
5. `src/app/api/chat/route.ts` forwards the request to `src/lib/deepseek.ts`.
6. `src/lib/deepseek.ts` prepends resume context from `src/data/resumeData.ts` before calling DeepSeek.

### Blog flow

1. `src/app/blog/page.tsx` calls `getBlogPosts()` from `src/lib/notion.ts`.
2. `src/lib/notion.ts` queries the Notion database, normalizes records into `BlogPost`, filters by publish status, and sorts by date.
3. Category pages in `src/app/blog/category/[category]/page.tsx` reuse that same post list and filter by the top-level category mapping in `src/lib/blogCategories.ts`.
4. A post page in `src/app/blog/[slug]/page.tsx` resolves a slug to a post, fetches that page's Notion block tree, and passes it to `src/components/NotionRenderer.tsx`.
5. Loading and not-found route files provide route-specific fallback UI during network latency or invalid URLs.

### Contact flow

1. `src/app/contact/page.tsx` routes users to different contact channels.
2. `src/app/contact/email/page.tsx` renders the email form.
3. Form submission calls the server action in `src/app/contact/email/actions.ts`.
4. The action validates form input and delegates email delivery to `src/lib/email.ts`.
5. `src/lib/email.ts` sends an email to the configured inbox using Nodemailer.

## 5. File and Folder Structure

This section explains each currently visible file in the repository and how it fits into the system.

### Root files

| Path                 | Role                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `README.md`          | Maintainer documentation for the project.                                                                |
| `package.json`       | Dependency list and npm scripts. The `dev` script uses Turbopack.                                        |
| `tsconfig.json`      | TypeScript configuration, strict mode, and the `@/*` import alias pointing to `src/*`.                   |
| `next.config.ts`     | Next.js runtime configuration, headers, image settings, Turbopack SVG handling, and allowed dev origins. |
| `next-env.d.ts`      | Generated Next.js type declarations. Do not edit manually.                                               |
| `eslint.config.mjs`  | Flat ESLint configuration extending Next.js core web vitals and TypeScript rules.                        |
| `postcss.config.mjs` | Enables Tailwind CSS v4 through the PostCSS plugin.                                                      |
| `components.json`    | shadcn/ui configuration describing component aliases and CSS variable usage.                             |

### Public assets in `public/`

These files are served statically by Next.js.

| Path                                   | Role                                         |
| -------------------------------------- | -------------------------------------------- |
| `public/kevin-headshot.jpg`            | Primary homepage profile image.              |
| `public/kevin-big.jpeg`                | About page portrait.                         |
| `public/kevin-floorball.jpg`           | About page sports image.                     |
| `public/kevin-floorball-homepage.jpg`  | Alternate homepage portrait asset.           |
| `public/kevin-floorball-homepage.webp` | Optimized alternate homepage portrait asset. |
| `public/kevin-family.jpg`              | Alternate homepage portrait asset.           |
| `public/Kevin-Homepage.jpg`            | Additional homepage-related image asset.     |
| `public/github.png`                    | GitHub-related visual asset.                 |
| `public/kevin-saji-resume.pdf`         | Downloadable resume linked from the navbar.  |
| `public/file.svg`                      | Default static SVG asset.                    |
| `public/globe.svg`                     | Default static SVG asset.                    |
| `public/next.svg`                      | Default static SVG asset.                    |
| `public/vercel.svg`                    | Default static SVG asset.                    |
| `public/window.svg`                    | Default static SVG asset.                    |

### Application routes in `src/app/`

#### Core app shell

| Path                  | Role                                                                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/layout.tsx`  | Root HTML shell. Defines metadata, viewport settings, head hints, theme provider, GitHub provider, navbar, and the page `<main>` wrapper. This is the entry point for all routes. |
| `src/app/globals.css` | Global CSS and design tokens. Bridges CSS variables into Tailwind semantic utilities, defines light and dark theme tokens, and sets base styles.                                  |
| `src/app/page.tsx`    | Homepage route. Composes the profile, GitHub, tech stack, and LeetCode cards and redirects search-like prompts into the dedicated chat page.                                      |
| `src/app/favicon.ico` | Site favicon used by metadata and browser tabs.                                                                                                                                   |

#### Static content pages

| Path                          | Role                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `src/app/about/page.tsx`      | About route. Renders a sequence of image-and-text sections from local page data.     |
| `src/app/experience/page.tsx` | Experience route. Maps static experience data to reusable experience cards.          |
| `src/app/contact/page.tsx`    | Contact hub route with external social links and an internal link to the email form. |

#### Chat route

| Path                    | Role                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/app/chat/page.tsx` | Client-side chat controller. Reads `q` from the URL, owns conversation state, and calls the chat API. |

#### Contact email route

| Path                               | Role                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `src/app/contact/email/page.tsx`   | Client-side email form UI using `useActionState` and `useFormStatus`.      |
| `src/app/contact/email/actions.ts` | Server action that validates form data and delegates actual email sending. |

#### API routes

| Path                                | Role                                                                                                      |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/app/api/chat/route.ts`         | POST endpoint for recruiter chat requests. Accepts message history and returns a single generated answer. |
| `src/app/api/github/stats/route.ts` | GET endpoint for homepage GitHub stats. Combines REST user data and GraphQL repository history totals.    |

#### Blog routes

| Path                                             | Role                                                                                                        |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `src/app/blog/layout.tsx`                        | Blog-only metadata wrapper. Does not add extra layout structure beyond route metadata.                      |
| `src/app/blog/loading.tsx`                       | Route-level loading fallback for the blog landing page.                                                     |
| `src/app/blog/page.tsx`                          | Blog landing page. Loads Notion posts, calculates category counts, and links to top-level category buckets. |
| `src/app/blog/[slug]/page.tsx`                   | Individual blog post page. Resolves slug, fetches Notion blocks, and renders rich content.                  |
| `src/app/blog/[slug]/loading.tsx`                | Loading skeleton for individual blog posts.                                                                 |
| `src/app/blog/[slug]/not-found.tsx`              | Friendly 404 state when a blog slug is invalid or unpublished.                                              |
| `src/app/blog/category/[category]/page.tsx`      | Category listing page for `sports`, `hobbies`, and `academics`.                                             |
| `src/app/blog/category/[category]/loading.tsx`   | Loading skeleton for category pages.                                                                        |
| `src/app/blog/category/[category]/not-found.tsx` | Friendly 404 state for unknown or empty categories.                                                         |

### Reusable components in `src/components/`

| Path                                  | Role                                                                                                     |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/components/NavBar.tsx`           | Fixed site header. Handles route highlighting, blog prefetching, theme toggle, and resume download link. |
| `src/components/ThemeProvider.tsx`    | Theme context that applies `light` or `dark` classes to the document root.                               |
| `src/components/ThemeToggle.tsx`      | Button that switches the active theme using the provider above.                                          |
| `src/components/ProfilePicture.tsx`   | Homepage card showing Kevin's primary profile image and title.                                           |
| `src/components/GitHubStats.tsx`      | Homepage card consuming shared GitHub context and rendering loading, error, and success states.          |
| `src/components/LeetCodeStats.tsx`    | Homepage card showing hard-coded LeetCode counts.                                                        |
| `src/components/TechStack.tsx`        | Homepage card that rotates through a curated set of technologies with motion-aware behavior.             |
| `src/components/ChatInput.tsx`        | Shared text input for homepage search and chat message entry.                                            |
| `src/components/ChatWindow.tsx`       | Chat transcript container with auto-scroll, typing state, and sticky input bar.                          |
| `src/components/FormattedMessage.tsx` | Lightweight renderer for assistant messages, including code fences, inline code, bold, and italic text.  |
| `src/components/TypingIndicator.tsx`  | Animated bubble used while the assistant is generating a reply.                                          |
| `src/components/BlogLoading.tsx`      | Blog landing-page skeleton reused by `src/app/blog/loading.tsx`.                                         |
| `src/components/NotionRenderer.tsx`   | Recursive renderer that maps normalized Notion blocks into React elements.                               |
| `src/components/WorkExperience.tsx`   | Experience card layout used by the experience page.                                                      |

#### UI primitives in `src/components/ui/`

| Path                           | Role                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `src/components/ui/button.tsx` | shadcn-style button primitive built on Radix Slot and class-variance-authority. |
| `src/components/ui/input.tsx`  | Base input primitive shared by the contact form and chat input.                 |

### Static data in `src/data/`

| Path                      | Role                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------- |
| `src/data/experiences.ts` | Structured work experience content consumed by the experience page.                   |
| `src/data/resumeData.ts`  | Resume-derived text blocks and helper functions used to ground the AI chat assistant. |
| `src/data/techIcons.ts`   | Shared icon metadata used by experience cards to display tool logos.                  |

### Shared helpers and integrations in `src/lib/`

| Path                        | Role                                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/lib/utils.ts`          | Contains `cn()`, the standard Tailwind class merge helper used across the app.                         |
| `src/lib/GitHubContext.tsx` | Client context for GitHub stats, including loading, refresh, and warning state management.             |
| `src/lib/notion.ts`         | Notion integration layer. Fetches posts, resolves slugs, fetches page blocks, and normalizes API data. |
| `src/lib/deepseek.ts`       | DeepSeek integration layer. Builds the system prompt, injects resume context, and calls the model API. |
| `src/lib/email.ts`          | Nodemailer wrapper for sending contact form submissions to the configured inbox.                       |
| `src/lib/blogCategories.ts` | Normalizes raw Notion categories into the top-level categories exposed by the UI.                      |

## 6. How the Pieces Work Together

### Shared providers and layout ownership

The most important architectural decision is that `src/app/layout.tsx` owns all global wrappers. If a feature needs global context, site-wide metadata, shell-level styling, or always-on UI like the navbar, start there.

The root layout currently does three important things:

- mounts `ThemeProvider` so any client component can read or change the current theme
- mounts `GitHubProvider` so homepage cards can access shared GitHub stats without prop drilling
- renders `Navbar` above every route and offsets page content with top padding

### Why some code lives in `src/app` and some in `src/components`

Use this rule of thumb when maintaining the project:

- keep route ownership, server fetching, metadata, and route-specific fallbacks in `src/app`
- keep reusable view logic in `src/components`
- keep service integrations and normalization logic in `src/lib`
- keep static content that should not be mixed with rendering logic in `src/data`

This separation is already followed consistently in the blog, chat, GitHub stats, and contact features.

## 7. Maintenance Guide by Feature

### To change homepage cards

Start in `src/app/page.tsx`. Most visual card changes then move into one of:

- `src/components/ProfilePicture.tsx`
- `src/components/GitHubStats.tsx`
- `src/components/TechStack.tsx`
- `src/components/LeetCodeStats.tsx`

### To change navigation or global shell behavior

Update:

- `src/components/NavBar.tsx` for links and shell actions
- `src/app/layout.tsx` for providers, metadata, and page chrome
- `src/app/globals.css` for design tokens and global defaults

### To change the blog

Update:

- `src/lib/notion.ts` for data fetching or normalization changes
- `src/components/NotionRenderer.tsx` for how Notion blocks render
- `src/app/blog/page.tsx` for the landing page UX
- `src/app/blog/[slug]/page.tsx` for individual post presentation
- `src/lib/blogCategories.ts` if category vocabulary changes

### To change the recruiter chat

Update:

- `src/app/chat/page.tsx` for conversation state and UI flow
- `src/components/ChatWindow.tsx` and `src/components/ChatInput.tsx` for chat UX
- `src/app/api/chat/route.ts` for request contract changes
- `src/lib/deepseek.ts` for prompt engineering or model integration changes
- `src/data/resumeData.ts` when Kevin's background needs to be updated

### To change the contact form

Update:

- `src/app/contact/page.tsx` for contact-channel selection
- `src/app/contact/email/page.tsx` for form UX
- `src/app/contact/email/actions.ts` for validation or submission behavior
- `src/lib/email.ts` for transport details or message formatting

## 8. Important Implementation Notes

### Theme system

This project does not use hard-coded light and dark colors directly in components. Instead:

- `src/app/globals.css` defines semantic CSS variables such as `--background` and `--foreground`
- Tailwind semantic tokens like `bg-background` and `text-foreground` map to those CSS variables
- the theme provider toggles a `dark` class on the root element

When adding new UI, prefer semantic tokens over literal color classes so both themes stay consistent.

### Blog robustness

The Notion integration is defensive by design:

- missing credentials return empty results instead of crashing the page
- post slugs fall back to a slugified title if no explicit slug exists
- publish status is normalized so only live content appears
- content fetching is isolated behind `getBlogPosts`, `getBlogPostBySlug`, and `getNotionPage`

That makes `src/lib/notion.ts` the correct place to fix most blog data issues.

### GitHub stats tradeoff

The GitHub stats card works even without a token, but with reduced fidelity:

- public repo count comes from the GitHub REST API
- total commit count requires a token and GraphQL access

The UI intentionally surfaces warnings rather than hiding partial failures.

### Chat grounding strategy

The chat assistant does not retrieve narrow context per query right now. `src/lib/deepseek.ts` injects the full resume context from `src/data/resumeData.ts` into every request. That keeps behavior simple and predictable, but increases prompt size. If future maintainers want retrieval-based grounding, this file is where that refactor belongs.

## 9. Onboarding Checklist for New Maintainers

1. Read `src/app/layout.tsx`, `src/app/page.tsx`, and `src/app/globals.css` first to understand the app shell.
2. Read `src/lib/notion.ts`, `src/lib/deepseek.ts`, and `src/lib/GitHubContext.tsx` next to understand integrations.
3. Run `npm run dev` and click through `/`, `/blog`, `/chat`, `/experience`, `/contact`, and `/about`.
4. Verify which environment variables are available locally before debugging an integration.
5. When changing a feature, start at the route in `src/app` and then follow imports into `src/components`, `src/lib`, or `src/data`.

## 10. Safe Extension Points

If the site grows, these are the cleanest places to extend it:

- add new routes under `src/app`
- add reusable UI in `src/components`
- add data integrations in `src/lib`
- add static maintainable content in `src/data`

Try to preserve the current separation of concerns. It is one of the strongest aspects of the codebase and makes onboarding substantially easier.
