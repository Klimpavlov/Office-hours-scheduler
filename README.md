This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Local launch and test data

1. Set `DATABASE_URL` in `.env` (PostgreSQL).
   set `OPENAI_API_KEY` in `.env.local`
2. Apply the scheme: `pnpm db:push`
3. Create mock specialists and an admin:
   ```bash
   pnpm db:seed
   ```
   Will be created:
   - **specialist@test.com** (specialist)
   - **admin@test.com** (admin)  
   - **user@test.com** (user)  
   Password for all: **password123**

4. Under your regular user, go to [/specialists](http://localhost:3000/specialists ), select a specialist and create a reservation. Slots are counted for the next 14 days according to the rules (Europe/Berlin, Mon–Thu).

If these emails are already in the database, Sid will only update the roles and add/update profiles and accessibility rules.

- **Text Editor** - Rich text editor Tiptap is used in the booking form.

### Where the Vercel AI SDK is used

- **Moderation of the booking description** - `src/lib/moderation.ts`: when creating a booking, the description text is sent to OpenAI via  `generateText` (Vercel AI SDK). If the API is unavailable (for example, 403 "Country not supported"), the reservation is still created with `moderationStatus: PENDING`, and a specialist can check manually.
- **Chat** - `src/app/api/chat/route.ts`: `streamText` for chat (does not apply to booking).

---

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
