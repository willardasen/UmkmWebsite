This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

umkm-loan-system/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/                # NextAuth routes (if using NextAuth)
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── user/                # UMKM user routes
│   │   │   │   ├── login/           # POST /api/user/login
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/        # POST /api/user/register
│   │   │   │   │   └── route.ts
│   │   │   │   └── profile/         # GET/PUT profile
│   │   │   │       └── route.ts
│   │   │   ├── admin/               # Admin routes (bank & system)
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts      # POST /api/admin/login
│   │   │   │   ├── register-bank/   # POST /api/admin/register-bank
│   │   │   │   │   └── route.ts
│   │   │   │   ├── list-admins/
│   │   │   │   │   └── route.ts      # GET /api/admins
│   │   │   │   └── umkm-list/
│   │   │   │       └── route.ts      # GET /api/admin/umkm-list
│   │   │   ├── umkm/
│   │   │   │   ├── create/          # POST /api/umkm/create
│   │   │   │   │   └── route.ts
│   │   │   │   ├── [id]/             # GET, PUT, DELETE /api/umkm/[id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── filter/          # GET /api/umkm/filter
│   │   │   │       └── route.ts
│   │   │   ├── loan/
│   │   │   │   ├── apply/           # POST /api/loan/apply
│   │   │   │   │   └── route.ts
│   │   │   │   ├── status/          # GET /api/loan/status
│   │   │   │   │   └── route.ts
│   │   │   │   ├── [id]/             # GET, PUT /api/loan/[id]
│   │   │   │   │   └── route.ts
│   │   │   │   └── user/            # GET /api/loan/user
│   │   │   │       └── route.ts
│   │   │   └── srl/                 # SRL assessment routes
│   │   │       ├── create/          # POST /api/srl/create
│   │   │       │   └── route.ts
│   │   │       └── [id]/             # GET /api/srl/[id]
│   │   │           └── route.ts
│   │   ├── (auth)/
│   │   │   ├── login/               # Auth pages grouping
│   │   │   │   └── page.tsx         # /login
│   │   │   └── register/
│   │   │       └── page.tsx         # /register
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx             # /dashboard (UMKM user)
│   │   │   └── loans/
│   │   │       └── page.tsx         # /dashboard/loans
│   │   ├── admin/
│   │   │   ├── dashboard/           # /admin/dashboard
│   │   │   │   └── page.tsx
│   │   │   └── system-dashboard/    # /admin/system-dashboard
│   │   │       └── page.tsx
│   │   ├── layout.tsx               # root layout (navbar, footer)
│   │   └── page.tsx                 # home page (UMKM list)
│   ├── components/                  # shared UI components
│   ├── lib/                         # utility code (prisma client, authOptions)
│   ├── hooks/                       # custom React hooks
│   └── types/                       # TypeScript type definitions
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── ml-service/                      # Flask ML microservice
├── .env
├── next.config.js
└── package.json
