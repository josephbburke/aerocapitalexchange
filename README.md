# Aero Capital Exchange

A modern aviation financing and aircraft sales platform built with Next.js, Supabase, and deployed on Vercel.

## Overview

Aero Capital Exchange is a comprehensive web application for aviation financing and aircraft sales. The platform features:

- **Aircraft Inventory** - Browse and search premium aircraft listings
- **User Authentication** - Secure sign-up/login with role-based access
- **Admin Dashboard** - Manage aircraft listings, inquiries, and users
- **Client Dashboard** - Save favorites and track inquiries
- **Contact System** - Submit inquiries about aircraft or financing

## Tech Stack

- **Framework:** Next.js 15 (React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Custom components built with shadcn/ui patterns
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:** React Query (TanStack Query) + Zustand
- **Forms:** React Hook Form + Zod
- **Deployment:** Vercel

## Project Structure

```
aerocapitalexchange/
├── app/                      # Next.js App Router
│   ├── auth/                 # Authentication pages
│   ├── dashboard/            # Client dashboard
│   ├── admin/                # Admin dashboard
│   ├── aircraft/             # Aircraft listings
│   └── ...                   # Other pages
├── components/
│   ├── ui/                   # Base UI components
│   ├── layout/               # Header, Footer
│   ├── aircraft/             # Aircraft-specific components
│   ├── forms/                # Form components
│   ├── dashboard/            # Dashboard components
│   └── admin/                # Admin components
├── lib/
│   ├── supabase/             # Supabase client config
│   ├── utils/                # Utility functions
│   └── constants/            # Constants and enums
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript type definitions
├── schemas/                  # Zod validation schemas
└── supabase/
    └── migrations/           # Database schema files
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- A Supabase account (free tier works)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd aerocapitalexchange
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage_buckets.sql`

### 3. Configure Environment Variables

Copy the example environment file and update with your Supabase credentials:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase project details:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Aero Capital Exchange
```

Find your Supabase credentials:
- Go to your Supabase project settings
- Navigate to API section
- Copy the Project URL and anon/public key

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

- **profiles** - User profiles with roles (client, admin, super_admin)
- **aircraft** - Aircraft listings with specifications, pricing, and media
- **inquiries** - Contact forms and aircraft inquiries
- **favorites** - User-saved aircraft
- **activity_logs** - Audit trail for admin actions

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- Public access to published aircraft
- User-specific access to favorites and inquiries
- Admin-only access for management operations

### Storage Buckets

- **aircraft-images** - Public bucket for aircraft photos
- **documents** - Private bucket for aircraft documents

## Features

### Authentication

- Email/password authentication
- Protected routes with middleware
- Role-based access control (RBAC)
- User profiles with customizable information

### Aircraft Management (Admin)

- Create, edit, and delete aircraft listings
- Upload multiple images per aircraft
- Rich text descriptions
- Specifications and features management
- Draft/publish workflow

### User Dashboard

- View saved favorite aircraft
- Track inquiry history
- Manage account settings

### Admin Dashboard

- Manage all aircraft listings
- Review and respond to inquiries
- User management and role assignment
- Activity logging

## Development

### Code Quality

```bash
# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Vercel will automatically:
- Build and deploy on every push
- Provide preview deployments for PRs
- Optimize images and assets
- Enable edge caching

### Environment Variables for Production

Add these in your Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Aero Capital Exchange
```

## Key Files

### Configuration

- `next.config.ts` - Next.js configuration
- `middleware.ts` - Auth and route protection
- `app/layout.tsx` - Root layout with providers
- `lib/supabase/client.ts` - Client-side Supabase client
- `lib/supabase/server.ts` - Server-side Supabase client

### Authentication

- `hooks/useAuth.ts` - Authentication hook
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Sign up page

### Database Types

- `types/database.ts` - TypeScript types for database tables

## Customization

### Styling

The application uses an aviation-themed color palette defined in `app/globals.css`:

- Primary: Aviation Blue (#0ea5e9)
- Secondary: Aircraft Metal Gray (#64748b)
- Accent: Sky Blue (#38bdf8)

Modify CSS variables in `app/globals.css` to change the theme.

### Adding Pages

Create new pages in the `app/` directory following Next.js App Router conventions.

### Creating Components

UI components follow the shadcn/ui pattern and are located in `components/ui/`.

## Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and keys in `.env.local`
- Check that RLS policies are properly set up
- Ensure migrations have been run successfully

### Authentication Not Working

- Clear browser cookies and local storage
- Verify Supabase Auth is enabled in your project
- Check middleware configuration in `middleware.ts`

### Build Errors

- Run `npm install` to ensure all dependencies are installed
- Check TypeScript errors with `npx tsc --noEmit`
- Clear `.next` folder and rebuild

## Next Steps

1. **Add Aircraft Data** - Use the admin dashboard to add aircraft listings
2. **Customize Content** - Update pages with your company information
3. **Configure Email** - Set up email templates in Supabase for notifications
4. **Add Analytics** - Integrate Vercel Analytics or Google Analytics
5. **Custom Domain** - Configure your custom domain in Vercel

## Support

For issues and questions:
- Review the implementation plan at `.claude/plans/`
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Check Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

## License

Proprietary - Aero Capital Exchange

---

Built with Next.js, Supabase, and deployed on Vercel.
