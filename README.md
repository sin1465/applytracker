# ApplyTracker

ApplyTracker is a full-stack job application tracker built with Next.js, TypeScript, PostgreSQL, and Prisma. It allows users to securely track and manage their job applications through a responsive dashboard.

**Live Demo:** [ApplyTracker] https://applytracker-kappa.vercel.app/

## Features

- GitHub OAuth authentication
- User-specific job application tracking
- Create, edit, and delete applications
- Track application status: Saved, Applied, Interview, Offer, and Rejected
- Search, filter, and sort applications
- Dashboard statistics
- Server-side validation with Zod
- Responsive interface
- Protected API routes and per-user data ownership

## Tech Stack

**Frontend:** Next.js, React, TypeScript, Tailwind CSS  
**Backend:** Next.js Route Handlers, Auth.js, Zod  
**Database:** PostgreSQL, Neon, Prisma ORM  
**Testing:** Vitest, React Testing Library, Playwright  
**Deployment:** Vercel

## Testing

The project uses multiple levels of automated testing:

- **Vitest** — unit and API tests
- **React Testing Library** — component and user-interaction tests
- **Playwright** — end-to-end browser and API tests

Run unit/component tests:

```bash
npm run test:run
```

Run end-to-end tests:

```bash
npm run test:e2e
```

## Running Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/sin1465/applytracker
cd applytrackr
npm install
```

Create an environment file with:

```env
DATABASE_URL="your-database-url"
AUTH_SECRET="your-auth-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

Generate Prisma Client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the application:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

```text
app/
├── api/            # API route handlers
├── components/     # React components
└── page.tsx        # Dashboard

lib/
├── auth/           # Authentication helpers
├── constants/      # Shared constants
├── types/          # TypeScript types
├── validation/     # Zod schemas
└── prisma.ts       # Prisma client

prisma/             # Database schema and migrations
e2e/                # Playwright tests
```

## What I Learned

Building ApplyTracker gave me hands-on experience with the complete full-stack development lifecycle, including relational database design, API development, OAuth authentication, authorization, server-side validation, automated testing, and production deployment.

## License

This project is available for educational and portfolio purposes.