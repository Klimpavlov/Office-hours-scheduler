This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Локальный запуск и тестовые данные

1. Задайте `DATABASE_URL` в `.env` (PostgreSQL).
2. Примените схему: `pnpm db:push`
3. Создайте моковых специалистов и админа:
   ```bash
   pnpm db:seed
   ```
   Будут созданы:
   - **specialist1@test.com** и **specialist2@test.com** (специалисты с правилами доступности)
   - **admin@test.com** (админ)  
   Пароль для всех: **password123**

4. Под своим обычным user зайдите на [/specialists](http://localhost:3000/specialists), выберите специалиста и создайте бронь. Слоты считаются на ближайшие 14 дней по правилам (Europe/Berlin, пн–чт).

Если эти email уже есть в базе, сид только обновит роли и добавит/обновит профили и правила доступности.

### Где используется Vercel AI SDK

- **Модерация описания брони** — `src/lib/moderation.ts`: при создании брони текст описания отправляется в OpenAI через `generateText` (Vercel AI SDK). Если API недоступен (например, 403 «Country not supported»), бронь всё равно создаётся с `moderationStatus: PENDING`, и специалист может проверить вручную.
- **Чат** — `src/app/api/chat/route.ts`: `streamText` для чата (к бронированию не относится).

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
